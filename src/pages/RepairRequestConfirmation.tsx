
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Calendar, Users, Wrench } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const RepairRequestConfirmation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Success Section */}
        <section className="section bg-repair-green-50">
          <div className="container mx-auto text-center max-w-3xl">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-repair-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="text-repair-green-600 h-12 w-12" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-repair-green-800 mb-4">
              Repair Request Submitted Successfully!
            </h1>
            <p className="text-lg text-repair-green-700 mb-8">
              Thank you for submitting your repair request. We'll work on finding a volunteer repairer who can help you fix your device.
            </p>
            
            <Card className="border-repair-green-200 mb-8">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-repair-green-700 mb-6">Next Steps</h2>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                      <Calendar className="text-repair-green-600 h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-repair-green-700">Review Process</h3>
                      <p className="text-repair-green-600">
                        We'll review your request and publish it on our platform within 24 hours.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                      <Users className="text-repair-green-600 h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-repair-green-700">Repairer Matching</h3>
                      <p className="text-repair-green-600">
                        We'll contact potential repairers in your area who have the skills to help with your device.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                      <Wrench className="text-repair-green-600 h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-repair-green-700">Confirmation</h3>
                      <p className="text-repair-green-600">
                        Once a repairer is found, you'll receive an email with details about the repair session.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="text-center space-y-4">
              <p className="text-repair-green-700">
                Check your email for a confirmation message with more details.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/repair-requests">
                  <Button className="bg-repair-green-500 hover:bg-repair-green-600 text-white">
                    Browse Repair Requests
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="outline" className="text-repair-green-600 border-repair-green-300">
                    Return to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Related Info Section */}
        <section className="section bg-white">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-repair-green-700 mb-6 text-center">
              While You Wait
            </h2>
            
            <div className="bg-repair-green-50 rounded-lg p-6 md:p-8">
              <h3 className="text-xl font-semibold text-repair-green-700 mb-4">Tips for a Successful Repair</h3>
              
              <ul className="space-y-3 text-repair-green-700 list-disc pl-5 mb-6">
                <li>Gather any relevant documentation or manuals for your device.</li>
                <li>If possible, locate the original packaging or purchase receipt.</li>
                <li>Make a list of all the symptoms and when they started to occur.</li>
                <li>Try to remember if anything happened before the device stopped working properly.</li>
                <li>Bring any accessories or peripherals that might be relevant to the repair.</li>
              </ul>
              
              <p className="text-repair-green-600 mb-4">
                Remember, our repairers are volunteers who are generously donating their time and skills.
                The goal is not just to fix your device, but also to learn how it works and how to maintain it.
              </p>
              
              <div className="text-center mt-6">
                <Link to="/how-it-works">
                  <Button variant="link" className="text-repair-green-600 hover:text-repair-green-500">
                    Learn more about the repair process <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
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
