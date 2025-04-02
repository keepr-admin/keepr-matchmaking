
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Timeslot = Tables<"timeslots">;
type Location = Tables<"locations">;

interface CalendarTimeslotsProps {
  onTimeslotsSelected: (selectedTimeslots: string[]) => void;
}

const CalendarTimeslots: React.FC<CalendarTimeslotsProps> = ({ onTimeslotsSelected }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedTimeslots, setSelectedTimeslots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch available dates
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        const { data, error } = await supabase
          .from('timeslots')
          .select('date_time')
          .eq('available', true)
          .order('date_time', { ascending: true });

        if (error) {
          console.error('Error fetching available dates:', error);
          return;
        }

        if (data) {
          // Convert to Date objects and remove duplicates
          const dates = [...new Set(
            data.map(slot => {
              const date = new Date(slot.date_time);
              return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            })
          )];
          setAvailableDates(dates);
        }
      } catch (error) {
        console.error('Error in fetchAvailableDates:', error);
      }
    };

    fetchAvailableDates();
  }, []);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');

        if (error) {
          console.error('Error fetching locations:', error);
          return;
        }

        if (data) {
          setLocations(data);
        }
      } catch (error) {
        console.error('Error in fetchLocations:', error);
      }
    };

    fetchLocations();
  }, []);

  // Fetch timeslots for selected date
  useEffect(() => {
    const fetchTimeslots = async () => {
      if (!selectedDate) return;
      
      setLoading(true);
      try {
        // Get start and end of the selected date
        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
          .from('timeslots')
          .select('*')
          .gte('date_time', startOfDay.toISOString())
          .lte('date_time', endOfDay.toISOString())
          .eq('available', true)
          .order('date_time', { ascending: true });

        if (error) {
          console.error('Error fetching timeslots:', error);
          return;
        }

        if (data) {
          setTimeslots(data);
        }
      } catch (error) {
        console.error('Error in fetchTimeslots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeslots();
  }, [selectedDate]);

  // Toggle timeslot selection
  const toggleTimeslot = (timeslotId: string) => {
    setSelectedTimeslots(prev => {
      if (prev.includes(timeslotId)) {
        return prev.filter(id => id !== timeslotId);
      } else {
        return [...prev, timeslotId];
      }
    });
  };

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    // Clear selected timeslots when changing date
    setSelectedTimeslots([]);
  };

  // Handle submit
  const handleSubmit = () => {
    onTimeslotsSelected(selectedTimeslots);
  };

  // Get location name by ID
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => loc.location_id === locationId);
    return location ? location.name : 'Unknown location';
  };

  // Check if a date has available timeslots (for dot indicator)
  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => isSameDay(availableDate, date));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Select Available Timeslots</CardTitle>
        <CardDescription>Choose from available dates and times for your repair</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <TooltipProvider>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                className="rounded-md border"
                modifiers={{
                  available: availableDates
                }}
                modifiersStyles={{
                  available: {
                    border: '2px solid #029600',
                    borderRadius: '100%'
                  }
                }}
                components={{
                  DayContent: (props) => {
                    const isAvailable = isDateAvailable(props.date);
                    return (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cn(
                            "relative flex h-8 w-8 items-center justify-center",
                            isAvailable && "font-medium"
                          )}>
                            {props.date.getDate()}
                            {isAvailable && (
                              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-keepr-green-500 rounded-full" />
                            )}
                          </div>
                        </TooltipTrigger>
                        {isAvailable && (
                          <TooltipContent>
                            <p>Available timeslots</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  }
                }}
              />
            </TooltipProvider>
          </div>
          <div className="md:col-span-2">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {selectedDate ? (
                  <>Available times for {format(selectedDate, 'EEEE, MMMM d, yyyy')}</>
                ) : (
                  'Select a date to see available times'
                )}
              </h3>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-keepr-green-500"></div>
                </div>
              ) : (
                <>
                  {timeslots.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      No available timeslots for this date.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {timeslots.map((slot) => {
                        const isSelected = selectedTimeslots.includes(slot.timeslot_id);
                        return (
                          <Button
                            key={slot.timeslot_id}
                            variant={isSelected ? "default" : "outline"}
                            className={cn(
                              "justify-start text-left h-auto py-3 px-4",
                              isSelected ? "bg-keepr-green-500 text-white hover:bg-keepr-green-600" : "hover:border-keepr-green-500 hover:text-keepr-green-500"
                            )}
                            onClick={() => toggleTimeslot(slot.timeslot_id)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">{format(new Date(slot.date_time), 'h:mm a')}</span>
                              <span className="text-sm">{getLocationName(slot.location_id)}</span>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="mt-4 text-sm">
                    {selectedTimeslots.length > 0 && (
                      <p className="text-keepr-green-700">
                        You've selected {selectedTimeslots.length} timeslot{selectedTimeslots.length !== 1 ? 's' : ''}.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Back</Button>
        <Button 
          className="bg-keepr-green-500 hover:bg-keepr-green-600"
          disabled={selectedTimeslots.length === 0}
          onClick={handleSubmit}
        >
          Continue with Selected Timeslots
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CalendarTimeslots;
