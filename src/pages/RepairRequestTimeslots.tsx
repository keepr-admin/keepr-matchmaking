
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CalendarTimeslots from "@/components/calendar/CalendarTimeslots";
import { useToast } from "@/components/ui/use-toast";

const RepairRequestTimeslots = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTimeslotsSelected = async (selectedTimeslots: string[]) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would save these timeslots to the database
      console.log("Selected timeslots:", selectedTimeslots);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        
        // Redirect to confirmation page
        navigate("/repair-request-confirmation");
      }, 1000);
    } catch (error) {
      console.error("Error submitting timeslots:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your timeslot selection. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-keepr-green-100 py-8 px-4 md:px-8">
          <div className="container mx-auto max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold text-keepr-green-800 mb-4 text-center">
              Choose Repair Timeslots
            </h1>
            <p className="text-lg text-keepr-green-700 max-w-2xl mx-auto text-center">
              Select one or more available timeslots that work for you. A repairer will confirm one of your chosen slots.
            </p>
          </div>
        </section>

        {/* Calendar Section */}
        <section className="py-8 px-4 md:px-8">
          <div className="container mx-auto">
            <CalendarTimeslots onTimeslotsSelected={handleTimeslotsSelected} />
            
            {isSubmitting && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepr-green-500 mb-4"></div>
                  <p className="text-keepr-green-800">Submitting your selection...</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RepairRequestTimeslots;
