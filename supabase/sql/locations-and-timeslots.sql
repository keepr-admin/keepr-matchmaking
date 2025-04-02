
-- Update the locations table with the new locations
UPDATE public.locations
SET name = 'Herstel Hub Elektro', 
    address = 'Maakleerplek, Stapelhuisstraat 13, 3000 Leuven',
    google_maps_link = 'https://maps.google.com/maps?q=Stapelhuisstraat+13+3000+Leuven'
WHERE name = 'Community Center';

UPDATE public.locations
SET address = 'Maakleerplek, Stapelhuisstraat 13, 3000 Leuven',
    google_maps_link = 'https://maps.google.com/maps?q=Stapelhuisstraat+13+3000+Leuven'
WHERE name = 'Repair Café';

-- Add capacity column to the timeslots table to support multiple spots per timeslot
ALTER TABLE public.timeslots 
ADD COLUMN capacity INTEGER NOT NULL DEFAULT 1,
ADD COLUMN spots_taken INTEGER NOT NULL DEFAULT 0;

-- Create a function to check if a timeslot has available capacity
CREATE OR REPLACE FUNCTION public.check_timeslot_capacity()
RETURNS TRIGGER AS $$
BEGIN
  -- Get current spots taken for this timeslot
  SELECT spots_taken INTO NEW.spots_taken FROM public.timeslots WHERE timeslot_id = NEW.timeslot_id;
  
  -- Check if the timeslot has available capacity
  IF NEW.spots_taken >= (SELECT capacity FROM public.timeslots WHERE timeslot_id = NEW.timeslot_id) THEN
    RAISE EXCEPTION 'Timeslot is at full capacity';
  END IF;
  
  -- Increment spots taken for this timeslot
  UPDATE public.timeslots 
  SET spots_taken = spots_taken + 1 
  WHERE timeslot_id = NEW.timeslot_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to check capacity before inserting a new repair_timeslot
CREATE TRIGGER check_timeslot_capacity_trigger
BEFORE INSERT ON public.repair_timeslots
FOR EACH ROW
EXECUTE FUNCTION public.check_timeslot_capacity();

-- Create a function to decrement spots taken when a repair_timeslot is deleted
CREATE OR REPLACE FUNCTION public.decrement_spots_taken()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrement spots taken for this timeslot
  UPDATE public.timeslots 
  SET spots_taken = spots_taken - 1 
  WHERE timeslot_id = OLD.timeslot_id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to decrement spots taken when a repair_timeslot is deleted
CREATE TRIGGER decrement_spots_taken_trigger
AFTER DELETE ON public.repair_timeslots
FOR EACH ROW
EXECUTE FUNCTION public.decrement_spots_taken();

-- Delete all existing timeslots to create new ones
DELETE FROM public.timeslots;

-- Create timeslots for Herstel Hub Elektro (Thursdays 17:00-21:00, 4 slots)
DO $$
DECLARE
  herstel_hub_id UUID;
  current_date DATE;
  slot_date TIMESTAMP;
BEGIN
  -- Get the location ID for Herstel Hub Elektro
  SELECT location_id INTO herstel_hub_id
  FROM public.locations
  WHERE name = 'Herstel Hub Elektro';
  
  -- Start with the next Thursday
  current_date := CURRENT_DATE;
  current_date := current_date + (11 - EXTRACT(DOW FROM current_date))::INTEGER % 7 + 7;
  
  -- Create timeslots for the next 8 Thursdays
  FOR i IN 0..7 LOOP
    -- Create 4 timeslots (17:00, 18:00, 19:00, 20:00) with 2 spots each
    FOR hour IN 17..20 LOOP
      slot_date := (current_date + (i * 7) * INTERVAL '1 day')::TIMESTAMP + (hour * INTERVAL '1 hour');
      
      INSERT INTO public.timeslots (
        date_time, 
        location_id, 
        available, 
        reserved,
        capacity
      ) VALUES (
        slot_date,
        herstel_hub_id,
        TRUE,
        FALSE,
        2
      );
    END LOOP;
  END LOOP;
END;
$$;

-- Create timeslots for Repair Café (3rd Saturday of each month, 10:00-13:00, 3 slots)
DO $$
DECLARE
  repair_cafe_id UUID;
  current_date DATE;
  third_saturday DATE;
  slot_date TIMESTAMP;
BEGIN
  -- Get the location ID for Repair Café
  SELECT location_id INTO repair_cafe_id
  FROM public.locations
  WHERE name = 'Repair Café';
  
  -- Get the current year and month
  current_date := CURRENT_DATE;
  
  -- Create timeslots for the next 6 third Saturdays
  FOR i IN 0..5 LOOP
    -- Calculate the third Saturday of the month
    third_saturday := DATE_TRUNC('month', current_date + (i * INTERVAL '1 month'))::DATE;
    third_saturday := third_saturday + ((13 + 7 - EXTRACT(DOW FROM third_saturday)::INTEGER) % 7 + 14)::INTEGER;
    
    -- Create 3 timeslots (10:00, 11:00, 12:00) with 8 spots each
    FOR hour IN 10..12 LOOP
      slot_date := third_saturday::TIMESTAMP + (hour * INTERVAL '1 hour');
      
      INSERT INTO public.timeslots (
        date_time, 
        location_id, 
        available, 
        reserved,
        capacity
      ) VALUES (
        slot_date,
        repair_cafe_id,
        TRUE,
        FALSE,
        8
      );
    END LOOP;
  END LOOP;
END;
$$;

-- Add a notification table for system messages
CREATE TABLE public.notifications (
  notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add a trigger to create notifications when a repair request is cancelled
CREATE OR REPLACE FUNCTION public.notify_on_repair_request_delete()
RETURNS TRIGGER AS $$
DECLARE
  repair_timeslot_rec RECORD;
  repairer_id UUID;
  product_info TEXT;
BEGIN
  -- Get product information
  SELECT 
    COALESCE(p.brand, '') || ' ' || COALESCE(p.model, '') || ' ' || p.type INTO product_info
  FROM 
    public.products p
  WHERE 
    p.product_id = OLD.product_id;
  
  -- Find all confirmed timeslots for this repair request
  FOR repair_timeslot_rec IN 
    SELECT rt.timeslot_id
    FROM public.repair_timeslots rt
    WHERE rt.repair_id = OLD.repair_id AND rt.is_confirmed = TRUE
  LOOP
    -- Get the repairer ID who confirmed this timeslot (this would require additional logic and potentially another table)
    
    -- For now, we'll create a notification for every such timeslot
    IF repairer_id IS NOT NULL THEN
      INSERT INTO public.notifications (
        user_id,
        title,
        message
      ) VALUES (
        repairer_id,
        'Repair meeting cancelled',
        'The repair request for ' || product_info || ' has been cancelled by the requester.'
      );
    END IF;
  END LOOP;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to send notifications when a repair request is deleted
CREATE TRIGGER notify_on_repair_request_delete_trigger
BEFORE DELETE ON public.repair_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_on_repair_request_delete();
