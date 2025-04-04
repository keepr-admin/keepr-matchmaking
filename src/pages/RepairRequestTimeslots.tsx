
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CalendarTimeslots from "@/components/calendar/CalendarTimeslots";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
type Location = Tables<"locations">;

const RepairRequestTimeslots = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for repair request ID on mount
  useEffect(() => {
    const repairId = sessionStorage.getItem('repairRequestId');
    if (!repairId) {
      toast({
        title: "Error",
        description: "No repair request found. Please start the repair request process again.",
        variant: "destructive"
      });
      navigate('/new-repair-request');
      return;
    }
  }, [navigate, toast]);

  // Fetch locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase.from('locations').select('*');
        if (error) {
          console.error('Error fetching locations:', error);
          return;
        }
        if (data) {
          setLocations(data);
          // If there are locations, select the first one by default
          if (data.length > 0 && !selectedLocation) {
            setSelectedLocation(data[0].location_id);
          }
        }
      } catch (error) {
        console.error('Error in fetchLocations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [selectedLocation]);

  const handleTimeslotsSelected = async (selectedTimeslots: string[]) => {
    if (selectedTimeslots.length === 0) {
      toast({
        title: "No timeslots selected",
        description: "Please select at least one timeslot for your repair request.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get repair request ID from session storage
      const repairId = sessionStorage.getItem('repairRequestId');
      
      if (!repairId) {
        throw new Error("No repair request ID found. Please start the repair request process again.");
      }
      
      // Create repair_timeslots entries for each selected timeslot
      const timeslotPromises = selectedTimeslots.map(async (timeslotId) => {
        const { data, error } = await supabase
          .from('repair_timeslots')
          .insert({
            repair_id: repairId,
            timeslot_id: timeslotId,
            is_confirmed: false
          });
          
        if (error) {
          console.error('Error creating repair timeslot:', error);
          throw error;
        }
        
        return data;
      });
      
      await Promise.all(timeslotPromises);
      
      // Update repair request status to "timeslots_selected"
      const { error: updateError } = await supabase
        .from('repair_requests')
        .update({ status: 'timeslots_selected' })
        .eq('repair_id', repairId);
        
      if (updateError) {
        console.error('Error updating repair request status:', updateError);
        throw updateError;
      }

      // Update spots_taken for each selected timeslot
      const updateTimeslotPromises = selectedTimeslots.map(async (timeslotId) => {
        // First get the current spots_taken
        const { data: timeslotData, error: fetchError } = await supabase
          .from('timeslots')
          .select('spots_taken')
          .eq('timeslot_id', timeslotId)
          .single();
          
        if (fetchError) {
          console.error('Error fetching timeslot data:', fetchError);
          return;
        }
        
        // Then increment spots_taken
        const { error: updateError } = await supabase
          .from('timeslots')
          .update({ 
            spots_taken: (timeslotData.spots_taken || 0) + 1 
          })
          .eq('timeslot_id', timeslotId);
          
        if (updateError) {
          console.error('Error updating timeslot spots:', updateError);
        }
      });
      
      await Promise.all(updateTimeslotPromises);

      toast({
        title: "Timeslots submitted",
        description: "Your timeslots have been successfully submitted.",
        variant: "default"
      });

      // Clear the repair request ID from session storage
      // We'll set a flag to indicate the process is complete
      sessionStorage.removeItem('repairRequestId');
      sessionStorage.setItem('repairRequestCompleted', 'true');

      // Redirect to confirmation page
      navigate("/repair-request-confirmation");
    } catch (error) {
      console.error("Error submitting timeslots:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your timeslot selection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-keepr-green-100 py-12 px-4 md:px-8">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-keepr-green-800 mb-4 text-center">
              Submit a Repair Request
            </h1>
            <p className="text-lg text-keepr-green-700 max-w-2xl mx-auto text-center mb-2">
              Choose from available dates and times for your repair
            </p>
          </div>
        </section>
        
        {/* Calendar Section */}
        <section className="py-8 px-4 md:px-8">
          <div className="container mx-auto">
            <CalendarTimeslots 
              onTimeslotsSelected={handleTimeslotsSelected} 
              selectedLocationId={selectedLocation} 
              locations={locations} 
              onLocationChange={setSelectedLocation} 
              loading={loading} 
            />
            
            {isSubmitting && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepr-green-500 mb-4"></div>
                  <p className="text-keepr-green-800">Submitting your selection...</p>
                </div>
              </div>}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};

export default RepairRequestTimeslots;
