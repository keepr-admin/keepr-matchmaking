
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

const RepairRequestConfirmation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <section className="py-16 px-4 md:px-8">
          <div className="container mx-auto max-w-2xl">
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="flex justify-center mb-6">
                <CheckCircle size={64} className="text-keepr-green-500" />
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-keepr-green-800 mb-4">
                Your Request is Confirmed!
              </h1>
              
              <p className="text-lg text-keepr-green-700 mb-6">
                We've received your repair request and your selected timeslots. A repairer will confirm one of your chosen slots soon.
              </p>
              
              <div className="bg-keepr-green-50 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold text-keepr-green-800 mb-2">What's Next?</h2>
                <ul className="text-left text-keepr-green-700 space-y-3">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">1.</span>
                    <span>A local repairer will review your request and confirm a timeslot that works for both of you.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">2.</span>
                    <span>You'll receive an email notification once a repairer has selected a slot.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">3.</span>
                    <span>Bring your device to the selected location at the confirmed time.</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button 
                  className="bg-keepr-green-500 hover:bg-keepr-green-600 text-white"
                  asChild
                >
                  <Link to="/repair-requests">View Your Repair Requests</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="border-keepr-green-400 text-keepr-green-600 hover:bg-keepr-green-50"
                  asChild
                >
                  <Link to="/">Return to Home</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RepairRequestConfirmation;
