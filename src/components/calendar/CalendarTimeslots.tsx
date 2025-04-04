
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Info, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Timeslot = Tables<"timeslots"> & {
  capacity: number;
  spots_taken: number;
};

type Location = Tables<"locations"> & {
  description?: string;
};

interface CalendarTimeslotsProps {
  onTimeslotsSelected: (selectedTimeslots: string[]) => void;
  selectedLocationId?: string | null;
  locations: Location[];
  onLocationChange: (locationId: string) => void;
  loading: boolean;
}

const CalendarTimeslots: React.FC<CalendarTimeslotsProps> = ({
  onTimeslotsSelected,
  selectedLocationId,
  locations,
  onLocationChange,
  loading: locationsLoading
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [selectedTimeslots, setSelectedTimeslots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [allTimeslots, setAllTimeslots] = useState<Record<string, Timeslot>>({});

  // Fetch available dates based on selected location
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        let query = supabase.from('timeslots').select('date_time').eq('available', true).order('date_time', {
          ascending: true
        });
        if (selectedLocationId) {
          query = query.eq('location_id', selectedLocationId);
        }
        const {
          data,
          error
        } = await query;
        if (error) {
          console.error('Error fetching available dates:', error);
          return;
        }
        if (data) {
          // Convert to Date objects and remove duplicates
          const dates = [...new Set(data.map(slot => {
            const date = new Date(slot.date_time);
            return new Date(date.getFullYear(), date.getMonth(), date.getDate());
          }))];
          setAvailableDates(dates);
        }
      } catch (error) {
        console.error('Error in fetchAvailableDates:', error);
      }
    };
    fetchAvailableDates();
  }, [selectedLocationId]);

  // Update current location when selectedLocationId changes
  useEffect(() => {
    if (selectedLocationId && locations.length > 0) {
      const location = locations.find(loc => loc.location_id === selectedLocationId);
      setCurrentLocation(location || null);
    } else {
      setCurrentLocation(null);
    }
  }, [selectedLocationId, locations]);

  // Fetch all available timeslots for the selected location
  useEffect(() => {
    const fetchAllTimeslots = async () => {
      if (!selectedLocationId) return;
      
      try {
        const { data, error } = await supabase
          .from('timeslots')
          .select('*')
          .eq('available', true)
          .eq('location_id', selectedLocationId)
          .order('date_time', { ascending: true });
        
        if (error) {
          console.error('Error fetching all timeslots:', error);
          return;
        }
        
        if (data) {
          // Create a record with timeslot_id as keys
          const timeslotsMap: Record<string, Timeslot> = {};
          data.forEach(slot => {
            timeslotsMap[slot.timeslot_id] = slot as Timeslot;
          });
          setAllTimeslots(timeslotsMap);
        }
      } catch (error) {
        console.error('Error in fetchAllTimeslots:', error);
      }
    };
    
    fetchAllTimeslots();
  }, [selectedLocationId]);

  // Fetch timeslots for selected date and location
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
        let query = supabase.from('timeslots').select('*').gte('date_time', startOfDay.toISOString()).lte('date_time', endOfDay.toISOString()).eq('available', true);
        if (selectedLocationId) {
          query = query.eq('location_id', selectedLocationId);
        }
        const {
          data,
          error
        } = await query.order('date_time', {
          ascending: true
        });
        if (error) {
          console.error('Error fetching timeslots:', error);
          return;
        }
        if (data) {
          setTimeslots(data as Timeslot[]);
        }
      } catch (error) {
        console.error('Error in fetchTimeslots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeslots();
  }, [selectedDate, selectedLocationId]);

  // Set up real-time subscription to timeslots updates
  useEffect(() => {
    // Subscribe to changes in the timeslots table
    const channel = supabase
      .channel('timeslots-changes')
      .on('postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'timeslots' 
        }, 
        (payload) => {
          console.log('Timeslot updated:', payload);
          // Update the timeslot in our state
          const updatedTimeslot = payload.new as Timeslot;
          
          // Update in allTimeslots
          setAllTimeslots(prev => ({
            ...prev,
            [updatedTimeslot.timeslot_id]: updatedTimeslot
          }));
          
          // Update in timeslots if it's displayed
          setTimeslots(prev => 
            prev.map(slot => 
              slot.timeslot_id === updatedTimeslot.timeslot_id 
                ? updatedTimeslot 
                : slot
            )
          );
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
    // We no longer clear selected timeslots when changing date
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

  // Show summary of selected timeslots
  const getSelectedTimeslotsSummary = () => {
    if (selectedTimeslots.length === 0) return null;
    
    // Group by date
    const dateGroups: Record<string, { date: Date, times: string[] }> = {};
    
    selectedTimeslots.forEach(timeslotId => {
      const slot = allTimeslots[timeslotId];
      if (!slot) return;
      
      const date = new Date(slot.date_time);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = {
          date,
          times: []
        };
      }
      
      dateGroups[dateKey].times.push(format(date, 'h:mm a'));
    });
    
    return (
      <div className="mt-6 p-4 bg-keepr-green-50 rounded-lg">
        <h4 className="text-keepr-green-800 font-medium mb-2">Your selected timeslots:</h4>
        <ul className="space-y-2">
          {Object.values(dateGroups).map(group => (
            <li key={group.date.toISOString()} className="flex flex-col">
              <span className="font-medium">{format(group.date, 'EEEE, MMMM d, yyyy')}:</span>
              <span className="text-sm text-keepr-green-700">{group.times.join(', ')}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Choose Repair Timeslots</CardTitle>
        <CardDescription>Select one or more available timeslots that work for you. A repairer will confirm one of your chosen slots.</CardDescription>
        
        {/* Location Dropdown */}
        {!locationsLoading && locations.length > 0 && (
          <div className="mt-4">
            <label htmlFor="location-select" className="block text-sm font-medium text-keepr-green-700 mb-2">
              Choose a location for your repair:
            </label>
            <Select 
              value={selectedLocationId || undefined} 
              onValueChange={(value) => onLocationChange(value)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select a location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.location_id} value={location.location_id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {currentLocation && currentLocation.description && (
          <div className="p-4 bg-keepr-green-50 rounded-lg mb-6 text-sm text-keepr-green-700">
            <div className="flex items-start">
              <Info className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-keepr-green-600" />
              <div>
                <h4 className="font-medium mb-2">About {currentLocation.name}:</h4>
                <div className="whitespace-pre-line">{currentLocation.description}</div>
              </div>
            </div>
          </div>
        )}
        
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
                  DayContent: props => {
                    const isAvailable = isDateAvailable(props.date);
                    return (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={cn("relative flex h-8 w-8 items-center justify-center", isAvailable && "font-medium")}>
                            {props.date.getDate()}
                            {isAvailable && <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-keepr-green-500 rounded-full" />}
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
                {selectedDate ? <>Available times for {format(selectedDate, 'EEEE, MMMM d, yyyy')}</> : 'Select a date to see available times'}
              </h3>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-keepr-green-500"></div>
                </div>
              ) : (
                <>
                  {timeslots.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      {selectedLocationId ? "No available timeslots for this date at the selected location." : "No available timeslots for this date. Please select a location or try another date."}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {timeslots.map(slot => {
                          const isSelected = selectedTimeslots.includes(slot.timeslot_id);
                          const locationName = getLocationName(slot.location_id);
                          const availableSpots = (slot.capacity || 1) - (slot.spots_taken || 0);
                          const isFull = availableSpots <= 0;
                          const percentFull = Math.round(((slot.spots_taken || 0) / (slot.capacity || 1)) * 100);
                          
                          return (
                            <Button 
                              key={slot.timeslot_id} 
                              variant={isSelected ? "default" : "outline"} 
                              className={cn(
                                "justify-start text-left h-auto py-3 px-4", 
                                isSelected ? "bg-keepr-green-500 text-white hover:bg-keepr-green-600" : "hover:border-keepr-green-500 hover:text-keepr-green-500",
                                isFull && "opacity-50 cursor-not-allowed"
                              )} 
                              onClick={() => !isFull && toggleTimeslot(slot.timeslot_id)} 
                              disabled={isFull}
                            >
                              <div className="flex flex-col w-full">
                                <div className="flex justify-between items-center w-full">
                                  <span className="font-medium">{format(new Date(slot.date_time), 'h:mm a')}</span>
                                  <div className="flex items-center text-xs">
                                    <Users className="h-3 w-3 mr-1" />
                                    <span>{availableSpots} / {slot.capacity || 1} spots</span>
                                  </div>
                                </div>
                                <span className="text-sm">{locationName}</span>
                                <div className="mt-2 w-full">
                                  <Progress value={percentFull} className="h-1" />
                                </div>
                              </div>
                            </Button>
                          );
                        })}
                      </div>

                      {selectedTimeslots.length > 0 && (
                        <div className="mt-4 text-sm">
                          <p className="text-keepr-green-700">
                            You've selected {selectedTimeslots.length} timeslot{selectedTimeslots.length !== 1 ? 's' : ''}.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              
              {/* Show selected timeslots summary */}
              {getSelectedTimeslotsSummary()}
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
