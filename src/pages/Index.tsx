
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Wrench, Users, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"repair" | "help" | "login">("repair");
  const navigate = useNavigate();
  
  const openRepairModal = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      navigate("/new-repair-request");
    } else {
      setModalType("repair");
      setIsAuthModalOpen(true);
    }
  };
  
  const openHelpModal = async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      navigate("/repair-requests");
    } else {
      setModalType("help");
      setIsAuthModalOpen(true);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-keepr-green-800 mb-6">
              Fix your broken devices with help from your community
            </h1>
            <p className="text-xl text-keepr-green-700 max-w-2xl mx-auto mb-8">
              Keepr connects people with broken devices to voluntary repairers 
              in their neighborhood. Save money, reduce waste, and build community!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary" onClick={openRepairModal}>
                Request a Repair
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary" onClick={openHelpModal}>
                Help to Repair
              </Button>
            </div>
            
            <div className="mt-12 flex justify-center">
              <img 
                src="/hero-image.jpg" 
                alt="People repairing devices" 
                className="rounded-lg shadow-md max-w-full h-auto max-h-96"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                  target.onerror = null;
                }} 
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-keepr-green-700 mb-12">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-keepr-green-200 card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-keepr-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <Wrench className="text-keepr-green-600 h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Submit Your Repair</h3>
                  <p className="text-keepr-green-600">
                    Describe your broken device and upload photos. Select available time slots for your repair.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-keepr-green-200 card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-keepr-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="text-keepr-green-600 h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Get Matched</h3>
                  <p className="text-keepr-green-600">
                    We'll connect you with voluntary repairers in your neighborhood who can help with your specific issue.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-keepr-green-200 card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-keepr-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="text-keepr-green-600 h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">Meet and Fix</h3>
                  <p className="text-keepr-green-600">
                    Meet your repairer at the agreed time and location. Learn how to fix your device together.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <a href="#for-people-needing-repairs">
                <Button variant="link" className="text-keepr-green-600 hover:text-keepr-green-500">
                  Learn more about the process <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Recent Repair Requests */}
        <section id="recent-repairs" className="section bg-keepr-green-50">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-keepr-green-700">
                Recent Repair Requests
              </h2>
              <Link to="/repair-requests">
                <Button variant="link" className="text-keepr-green-600 hover:text-keepr-green-500">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Repair Cards - These would be dynamically generated */}
              <Link to="/repair-requests/1" className="block h-full">
                <Card className="border-keepr-green-200 card-hover h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-keepr-green-700">Coffee Machine</h3>
                        <p className="text-keepr-green-600 text-sm">Brand: Philips</p>
                      </div>
                      <span className="bg-keepr-yellow-200 text-keepr-green-700 text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    </div>
                    <p className="text-keepr-green-600 mb-4 text-sm line-clamp-2">
                      My coffee machine is not heating up. It powers on but doesn't get hot enough to brew coffee.
                    </p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-keepr-green-500 mr-1" />
                      <span className="text-xs text-keepr-green-600">3 days ago</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/repair-requests/2" className="block h-full">
                <Card className="border-keepr-green-200 card-hover h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-keepr-green-700">Laptop</h3>
                        <p className="text-keepr-green-600 text-sm">Brand: Dell</p>
                      </div>
                      <span className="bg-keepr-green-200 text-keepr-green-700 text-xs px-2 py-1 rounded-full">
                        In Progress
                      </span>
                    </div>
                    <p className="text-keepr-green-600 mb-4 text-sm line-clamp-2">
                      The keyboard on my laptop has several keys that aren't working. Some keys require too much pressure.
                    </p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-keepr-green-500 mr-1" />
                      <span className="text-xs text-keepr-green-600">1 week ago</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
              
              <Link to="/repair-requests/3" className="block h-full">
                <Card className="border-keepr-green-200 card-hover h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-keepr-green-700">Radio</h3>
                        <p className="text-keepr-green-600 text-sm">Brand: Sony</p>
                      </div>
                      <span className="bg-keepr-yellow-200 text-keepr-green-700 text-xs px-2 py-1 rounded-full">
                        New
                      </span>
                    </div>
                    <p className="text-keepr-green-600 mb-4 text-sm line-clamp-2">
                      My vintage radio turns on but produces a loud static noise. The tuning knob doesn't seem to work properly.
                    </p>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-keepr-green-500 mr-1" />
                      <span className="text-xs text-keepr-green-600">2 days ago</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="section bg-gradient-to-r from-keepr-green-400 to-keepr-green-500 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Join Our Community of Repairers Today
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Help reduce electronic waste by fixing broken devices. 
              Share your skills with others in your community.
            </p>
            <Button size="lg" className="bg-white text-keepr-green-600 hover:bg-keepr-yellow-100" onClick={openHelpModal}>
              Become a Repairer
            </Button>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section id="faq" className="section bg-keepr-green-50">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-keepr-green-700 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">
                  Is this service really free?
                </h3>
                <p className="text-keepr-green-600">
                  Yes! Our platform connects you with volunteer repairers who donate their time and expertise.
                  You may need to pay for replacement parts if needed, but the repair service itself is free.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">
                  What if my device can't be fixed?
                </h3>
                <p className="text-keepr-green-600">
                  Sometimes devices are beyond repair. Our volunteers will do their best, but there's no guarantee
                  that every device can be fixed. However, you'll still learn about your device and potential alternatives.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">
                  Where do the repairs take place?
                </h3>
                <p className="text-keepr-green-600">
                  Repairs take place at designated community locations that have the necessary tools and equipment.
                  These locations are vetted for safety and accessibility.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">
                  Do I need to know anything about repairs to volunteer?
                </h3>
                <p className="text-keepr-green-600">
                  While some technical knowledge is helpful, we welcome volunteers with various skill levels.
                  You can specify which types of devices you're comfortable working with, and we provide resources to help you learn.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Us Section */}
        <section id="about" className="section bg-white">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-keepr-green-700 mb-8 text-center">
              About Us
            </h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-keepr-green-50 p-8 rounded-lg">
                <h3 className="text-xl font-semibold text-keepr-green-700 mb-4 text-center">
                  Welcome to Keepr!
                </h3>
                
                <div className="space-y-4 text-keepr-green-700">
                  <p>
                    We are Niels and Jules, two passionate entrepreneurs working to create a more sustainable society. Niels is our engineering expert who understands complex repairs. Jules is our people expert, who connects with people from around the world through empathy and clear communication.
                  </p>
                  
                  <p>
                    Our mission is to help people share repair knowledge and make the lives of repairers and repair cafés easier. We've built a simple platform that connects people, groups, and organizations with one common goal: to make repair the first choice for anyone with a broken device.
                  </p>
                  
                  <p>
                    Together, we can reduce waste, save money, and build stronger communities through the power of repair.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} type={modalType} />
    </div>
  );
};

export default Index;
