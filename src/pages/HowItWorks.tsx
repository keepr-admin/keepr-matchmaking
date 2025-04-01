
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  Wrench, 
  Users, 
  Calendar, 
  Clock, 
  CheckCheck, 
  UserCog,
  FileText,
  Image,
  Send
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-repair-green-100 py-16 px-4 md:px-8">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-repair-green-800 mb-6 text-center">
              How RepairBuddies Works
            </h1>
            <p className="text-lg text-repair-green-700 max-w-3xl mx-auto text-center mb-8">
              Our platform makes it easy to connect with volunteer repairers in your neighborhood.
              Learn how the process works for both people seeking repairs and volunteer repairers.
            </p>
          </div>
        </section>

        {/* For People Needing Repairs */}
        <section className="section bg-white">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-repair-green-700 mb-8 text-center">
              For People Needing Repairs
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" 
                  alt="Person with broken device" 
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                    <FileText className="text-repair-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Register Your Device</h3>
                    <p className="text-repair-green-600">
                      Create an account and submit details about your broken device including the type, brand,
                      model, and a detailed description of the problem.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                    <Image className="text-repair-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Add Photos</h3>
                    <p className="text-repair-green-600">
                      Upload clear photos of your device and the specific issue. This helps repairers
                      understand the problem better before they offer to help.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="text-repair-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Select Time Slots</h3>
                    <p className="text-repair-green-600">
                      Choose several time slots when you're available to meet with a repairer at
                      one of our repair locations.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="text-repair-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Wait for a Match</h3>
                    <p className="text-repair-green-600">
                      We'll publish your repair request on our platform and notify repairers in your area.
                      You'll receive an email when someone offers to help.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                    <CheckCheck className="text-repair-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Meet and Fix</h3>
                    <p className="text-repair-green-600">
                      Meet your matched repairer at the agreed time and location. Work together
                      to fix your device and learn about the repair process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/new-repair-request">
                <Button className="bg-repair-green-500 hover:bg-repair-green-600 text-white">
                  Request a Repair
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* For Volunteer Repairers */}
        <section className="section bg-repair-green-50">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-repair-green-700 mb-8 text-center">
              For Volunteer Repairers
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="order-2 md:order-1 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                    <UserCog className="text-repair-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Create a Repairer Profile</h3>
                    <p className="text-repair-green-600">
                      Sign up as a repairer and share your skills, experience, and the types of
                      devices you're comfortable repairing.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                    <Wrench className="text-repair-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Browse Repair Requests</h3>
                    <p className="text-repair-green-600">
                      Look through repair requests in your area and find devices that match your
                      repair skills and interests.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="text-repair-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Select a Time Slot</h3>
                    <p className="text-repair-green-600">
                      Choose from the available time slots that the person with the broken device
                      has specified. Select a time that works with your schedule.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                    <Users className="text-repair-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Meet and Repair Together</h3>
                    <p className="text-repair-green-600">
                      Meet at the arranged time and location. Work together with the person to fix
                      their device, sharing your knowledge and skills.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-repair-yellow-100 rounded-full flex items-center justify-center">
                    <Send className="text-repair-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Share Your Experience</h3>
                    <p className="text-repair-green-600">
                      After the repair, share your experience and any tips for others who might
                      encounter similar problems in the future.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <img 
                  src="https://images.unsplash.com/photo-1562157873-818bc0726f68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=654&q=80" 
                  alt="Person repairing a device" 
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/repair-requests">
                <Button className="bg-repair-green-500 hover:bg-repair-green-600 text-white">
                  Browse Repair Requests
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-repair-green-700 mb-8">
              Benefits of RepairBuddies
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-repair-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-repair-green-600 h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Reduce Waste</h3>
                <p className="text-repair-green-600">
                  Extend the life of your devices and keep electronics out of landfills.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-repair-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-repair-green-600 h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Save Money</h3>
                <p className="text-repair-green-600">
                  Avoid costly replacements and repairs through our volunteer network.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-repair-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-repair-green-600 h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Build Community</h3>
                <p className="text-repair-green-600">
                  Connect with neighbors and share skills that benefit your local community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section bg-repair-green-50">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-repair-green-700 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-repair-green-700 mb-2">
                  Is this service really free?
                </h3>
                <p className="text-repair-green-600">
                  Yes! Our platform connects you with volunteer repairers who donate their time and expertise.
                  You may need to pay for replacement parts if needed, but the repair service itself is free.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-repair-green-700 mb-2">
                  What if my device can't be fixed?
                </h3>
                <p className="text-repair-green-600">
                  Sometimes devices are beyond repair. Our volunteers will do their best, but there's no guarantee
                  that every device can be fixed. However, you'll still learn about your device and potential alternatives.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-repair-green-700 mb-2">
                  Where do the repairs take place?
                </h3>
                <p className="text-repair-green-600">
                  Repairs take place at designated community locations that have the necessary tools and equipment.
                  These locations are vetted for safety and accessibility.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-repair-green-700 mb-2">
                  Do I need to know anything about repairs to volunteer?
                </h3>
                <p className="text-repair-green-600">
                  While some technical knowledge is helpful, we welcome volunteers with various skill levels.
                  You can specify which types of devices you're comfortable working with, and we provide resources to help you learn.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
