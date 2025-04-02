
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
        <section className="bg-keepr-green-100 py-16 px-4 md:px-8">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-keepr-green-800 mb-6 text-center">
              How Keepr Works
            </h1>
            <p className="text-lg text-keepr-green-700 max-w-3xl mx-auto text-center mb-8">
              Our platform makes it easy to connect with volunteer repairers in your neighborhood.
              Learn how the process works for both people seeking repairs and volunteer repairers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <a href="#for-people-needing-repairs">
                <Button className="btn-primary">
                  For People Needing Repairs
                </Button>
              </a>
              <a href="#for-volunteer-repairers">
                <Button variant="outline" className="btn-secondary">
                  For Volunteer Repairers
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* For People Needing Repairs */}
        <section id="for-people-needing-repairs" className="section bg-white">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-keepr-green-700 mb-8 text-center">
              For People Needing Repairs
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div>
                <img 
                  src="/elderly-with-device.jpg" 
                  alt="Elderly person with broken device" 
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-keepr-yellow-100 rounded-full flex items-center justify-center">
                    <FileText className="text-keepr-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Register Your Device</h3>
                    <p className="text-keepr-green-600">
                      Create an account and submit details about your broken device including the type, brand,
                      model, and a detailed description of the problem.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-keepr-yellow-100 rounded-full flex items-center justify-center">
                    <Image className="text-keepr-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Add Photos</h3>
                    <p className="text-keepr-green-600">
                      Upload clear photos of your device and the specific issue. This helps repairers
                      understand the problem better before they offer to help.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-keepr-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="text-keepr-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Select Time Slots</h3>
                    <p className="text-keepr-green-600">
                      Choose several time slots when you're available to meet with a repairer at
                      one of our repair locations.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-keepr-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="text-keepr-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Wait for a Match</h3>
                    <p className="text-keepr-green-600">
                      We'll publish your repair request on our platform and notify repairers in your area.
                      You'll receive an email when someone offers to help.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-keepr-yellow-100 rounded-full flex items-center justify-center">
                    <CheckCheck className="text-keepr-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Meet and Fix</h3>
                    <p className="text-keepr-green-600">
                      Meet your matched repairer at the agreed time and location. Work together
                      to fix your device and learn about the repair process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/new-repair-request">
                <Button className="btn-primary">
                  Request a Repair
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* For Volunteer Repairers */}
        <section id="for-volunteer-repairers" className="section bg-keepr-green-50">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-keepr-green-700 mb-8 text-center">
              For Volunteer Repairers
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
              <div className="order-2 md:order-1 space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-keepr-yellow-100 rounded-full flex items-center justify-center">
                    <UserCog className="text-keepr-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Create a Repairer Profile</h3>
                    <p className="text-keepr-green-600">
                      Sign up as a repairer and share your skills, experience, and the types of
                      devices you're comfortable repairing.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-keepr-yellow-100 rounded-full flex items-center justify-center">
                    <Wrench className="text-keepr-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Browse Repair Requests</h3>
                    <p className="text-keepr-green-600">
                      Look through repair requests in your area and find devices that match your
                      repair skills and interests.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-keepr-yellow-100 rounded-full flex items-center justify-center">
                    <Calendar className="text-keepr-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Select a Time Slot</h3>
                    <p className="text-keepr-green-600">
                      Choose from the available time slots that the person with the broken device
                      has specified. Select a time that works with your schedule.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-keepr-yellow-100 rounded-full flex items-center justify-center">
                    <Users className="text-keepr-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Meet and Repair Together</h3>
                    <p className="text-keepr-green-600">
                      Meet at the arranged time and location. Work together with the person to fix
                      their device, sharing your knowledge and skills.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-keepr-yellow-100 rounded-full flex items-center justify-center">
                    <Send className="text-keepr-green-600 h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Share Your Experience</h3>
                    <p className="text-keepr-green-600">
                      After the repair, share your experience and any tips for others who might
                      encounter similar problems in the future.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <img 
                  src="/repair-cafe.jpg" 
                  alt="Person repairing a device in a repair café" 
                  className="rounded-lg shadow-md w-full h-auto"
                />
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/repair-requests">
                <Button className="btn-primary">
                  Browse Repair Requests
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="section bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-keepr-green-700 mb-8">
              Benefits of Keepr
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-keepr-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-keepr-green-600 h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Reduce Waste</h3>
                <p className="text-keepr-green-600">
                  Extend the life of your devices and keep electronics out of landfills.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-keepr-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-keepr-green-600 h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Save Money</h3>
                <p className="text-keepr-green-600">
                  Avoid costly replacements and repairs through our volunteer network.
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-keepr-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-keepr-green-600 h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Build Community</h3>
                <p className="text-keepr-green-600">
                  Connect with neighbors and share skills that benefit your local community.
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
