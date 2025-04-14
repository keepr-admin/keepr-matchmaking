
-- Update the check_timeslot_capacity function to not increment spots_taken
-- because we only want to increment spots_taken when a repairer confirms
CREATE OR REPLACE FUNCTION public.check_timeslot_capacity()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the timeslot has available capacity (only matters for confirmed slots)
  IF NEW.is_confirmed = TRUE AND (SELECT spots_taken FROM public.timeslots WHERE timeslot_id = NEW.timeslot_id) >= (SELECT capacity FROM public.timeslots WHERE timeslot_id = NEW.timeslot_id) THEN
    RAISE EXCEPTION 'Timeslot is at full capacity';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a function to handle when a timeslot is confirmed by a repairer
CREATE OR REPLACE FUNCTION public.handle_timeslot_confirmation()
RETURNS TRIGGER AS $$
BEGIN
  -- Only increment spots_taken when a timeslot is being confirmed
  IF NEW.is_confirmed = TRUE AND OLD.is_confirmed = FALSE THEN
    -- Increment spots taken for this timeslot
    UPDATE public.timeslots 
    SET spots_taken = spots_taken + 1 
    WHERE timeslot_id = NEW.timeslot_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to increment spots_taken when a timeslot is confirmed
DROP TRIGGER IF EXISTS handle_timeslot_confirmation_trigger ON public.repair_timeslots;
CREATE TRIGGER handle_timeslot_confirmation_trigger
AFTER UPDATE ON public.repair_timeslots
FOR EACH ROW
WHEN (NEW.is_confirmed = TRUE AND OLD.is_confirmed = FALSE)
EXECUTE FUNCTION public.handle_timeslot_confirmation();

-- Create a function for repairers to view available timeslots
CREATE OR REPLACE FUNCTION public.get_available_repair_timeslots(repair_id UUID)
RETURNS TABLE (
  timeslot_id UUID,
  date_time TIMESTAMP WITH TIME ZONE,
  location_id UUID,
  location_name TEXT,
  is_available BOOLEAN,
  capacity INTEGER,
  spots_taken INTEGER,
  spots_available INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.timeslot_id,
    t.date_time,
    t.location_id,
    l.name AS location_name,
    (t.capacity > t.spots_taken) AS is_available,
    t.capacity,
    t.spots_taken,
    (t.capacity - t.spots_taken) AS spots_available
  FROM 
    repair_timeslots rt
  JOIN 
    timeslots t ON rt.timeslot_id = t.timeslot_id
  JOIN
    locations l ON t.location_id = l.location_id
  WHERE 
    rt.repair_id = $1
    AND rt.is_confirmed = FALSE
    AND t.capacity > t.spots_taken;
END;
$$ LANGUAGE plpgsql;
