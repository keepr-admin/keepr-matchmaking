
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Info, MapPin, Calendar, Clock, Users } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Timeslot = {
  timeslot_id: string;
  date_time: string;
  location_id: string;
  location_name: string;
  is_available: boolean;
  capacity: number;
  spots_taken: number;
  spots_available: number;
};

type Location = Tables<"locations"> & {
  description?: string | null;
  google_maps_link?: string | null;
};

const RepairerTimeslots = () => {
  const { repairId } = useParams<{ repairId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [timeslots, setTimeslots] = useState<Timeslot[]>([]);
  const [location, setLocation] = useState<Location | null>(null);
  const [repairDetails, setRepairDetails] = useState<any>(null);
  const [confirmingTimeslot, setConfirmingTimeslot] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeslots = async () => {
      if (!repairId) return;
      
      try {
        setLoading(true);
        
        // Fetch repair details including the product info
        const { data: repairData, error: repairError } = await supabase
          .from('repair_requests')
          .select(`
            *,
            products (*)
          `)
          .eq('repair_id', repairId)
          .single();
          
        if (repairError) {
          console.error('Error fetching repair details:', repairError);
          toast({
            title: "Error",
            description: "Could not load repair details.",
            variant: "destructive"
          });
          return;
        }
        
        // Set repair details
        setRepairDetails(repairData);
        
        // Get available timeslots for this repair using our custom function
        const { data: timeslotsData, error: timeslotsError } = await supabase
          .rpc('get_available_repair_timeslots', { repair_id: repairId });
          
        if (timeslotsError) {
          console.error('Error fetching available timeslots:', timeslotsError);
          toast({
            title: "Error",
            description: "Could not load available timeslots.",
            variant: "destructive"
          });
          return;
        }
        
        if (timeslotsData && timeslotsData.length > 0) {
          setTimeslots(timeslotsData);
          
          // Fetch location details for the first timeslot
          const locationId = timeslotsData[0].location_id;
          const { data: locationData, error: locationError } = await supabase
            .from('locations')
            .select('*')
            .eq('location_id', locationId)
            .single();
            
          if (locationError) {
            console.error('Error fetching location details:', locationError);
          } else {
            setLocation(locationData);
          }
        }
      } catch (error) {
        console.error('Error in fetchTimeslots:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeslots();
  }, [repairId, toast]);
  
  const confirmTimeslot = async (timeslotId: string) => {
    if (!repairId) return;
    
    try {
      setConfirmingTimeslot(timeslotId);
      
      // Update the repair_timeslots entry to mark it as confirmed
      const { error } = await supabase
        .from('repair_timeslots')
        .update({ is_confirmed: true })
        .eq('repair_id', repairId)
        .eq('timeslot_id', timeslotId);
        
      if (error) {
        console.error('Error confirming timeslot:', error);
        toast({
          title: "Error",
          description: error.message || "Could not confirm timeslot. It may already be at full capacity.",
          variant: "destructive"
        });
        return;
      }
      
      // Update repair request status
      const { error: statusError } = await supabase
        .from('repair_requests')
        .update({ status: 'scheduled' })
        .eq('repair_id', repairId);
        
      if (statusError) {
        console.error('Error updating repair status:', statusError);
      }
      
      toast({
        title: "Success",
        description: "Timeslot confirmed successfully! You are now scheduled for this repair.",
        variant: "default"
      });
      
      // Redirect to dashboard or another appropriate page
      setTimeout(() => {
        navigate('/dashboard/repairs');
      }, 2000);
      
    } catch (error) {
      console.error('Error in confirmTimeslot:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setConfirmingTimeslot(null);
    }
  };

  const formatTimeslotDate = (dateTimeStr: string) => {
    const dateTime = new Date(dateTimeStr);
    return format(dateTime, 'EEEE, MMMM d, yyyy');
  };
  
  const formatTimeslotTime = (dateTimeStr: string) => {
    const dateTime = new Date(dateTimeStr);
    return format(dateTime, 'h:mm a');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <section className="bg-keepr-green-100 py-12 px-4 md:px-8">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-keepr-green-800 mb-4 text-center">
              Confirm Repair Timeslot
            </h1>
            <p className="text-lg text-keepr-green-700 max-w-2xl mx-auto text-center">
              Choose a timeslot to confirm for this repair request
            </p>
          </div>
        </section>
        
        {/* Content */}
        <section className="py-8 px-4 md:px-8">
          <div className="container mx-auto max-w-4xl">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepr-green-500"></div>
              </div>
            ) : (
              <>
                {/* Repair Details */}
                {repairDetails && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Repair Request Details</CardTitle>
                      <CardDescription>Review the repair details before confirming a timeslot</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-keepr-green-800">Device Information</h3>
                          <p className="text-keepr-green-700">
                            {repairDetails.products?.type} - {repairDetails.products?.brand} {repairDetails.products?.model}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-keepr-green-800">Issue Description</h3>
                          <p className="text-keepr-green-700">{repairDetails.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* Location Details */}
                {location && (
                  <Card className="mb-8">
                    <CardHeader>
                      <CardTitle>Repair Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-start gap-4">
                        <MapPin className="h-5 w-5 text-keepr-green-600 mt-1" />
                        <div>
                          <h3 className="font-medium text-keepr-green-800">{location.name}</h3>
                          <p className="text-keepr-green-700">{location.address}</p>
                          {location.google_maps_link && (
                            <a 
                              href={location.google_maps_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-keepr-green-600 hover:text-keepr-green-800 text-sm underline mt-2 inline-block"
                            >
                              View on Google Maps
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {location.description && (
                        <div className="mt-4 p-4 bg-keepr-green-50 rounded-lg">
                          <div className="flex gap-2">
                            <Info className="h-5 w-5 text-keepr-green-600 flex-shrink-0 mt-1" />
                            <div className="text-sm text-keepr-green-700 whitespace-pre-line">
                              {location.description}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
                
                {/* Available Timeslots */}
                <Card>
                  <CardHeader>
                    <CardTitle>Available Timeslots</CardTitle>
                    <CardDescription>
                      Select one of the available timeslots to confirm for this repair
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {timeslots.length === 0 ? (
                      <div className="text-center py-6 text-keepr-green-600">
                        No available timeslots for this repair request.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {timeslots.map((slot) => {
                          const percentFull = Math.round((slot.spots_taken / slot.capacity) * 100);
                          
                          return (
                            <div 
                              key={slot.timeslot_id} 
                              className="border rounded-lg p-4 hover:border-keepr-green-500 transition-colors"
                            >
                              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-keepr-green-600" />
                                    <span className="font-medium">
                                      {formatTimeslotDate(slot.date_time)}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-keepr-green-600" />
                                    <span>{formatTimeslotTime(slot.date_time)}</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-keepr-green-600" />
                                    <span className="text-sm">
                                      {slot.spots_available} of {slot.capacity} spots available
                                    </span>
                                  </div>
                                  
                                  <div className="w-full mt-1">
                                    <Progress value={percentFull} className="h-1" />
                                  </div>
                                </div>
                                
                                <Button
                                  onClick={() => confirmTimeslot(slot.timeslot_id)}
                                  disabled={confirmingTimeslot === slot.timeslot_id}
                                  className="bg-keepr-green-600 hover:bg-keepr-green-700 text-white min-w-[120px]"
                                >
                                  {confirmingTimeslot === slot.timeslot_id ? (
                                    <span className="flex items-center">
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                      Confirming...
                                    </span>
                                  ) : (
                                    "Confirm Slot"
                                  )}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/dashboard/repairs')}
                    >
                      Back to Repairs
                    </Button>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RepairerTimeslots;
