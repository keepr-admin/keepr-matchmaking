import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Wrench, Users, Calendar, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"repair" | "help">("repair");
  const openRepairModal = () => {
    setModalType("repair");
    setIsAuthModalOpen(true);
  };
  const openHelpModal = () => {
    setModalType("help");
    setIsAuthModalOpen(true);
  };
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-repair-green-800 mb-6">
              Fix your broken devices with help from your community
            </h1>
            <p className="text-xl text-repair-green-700 max-w-2xl mx-auto mb-8">
              RepairBuddies connects people with broken devices to voluntary repairers 
              in their neighborhood. Save money, reduce waste, and build community!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-repair-green-500 hover:bg-repair-green-600 text-white" onClick={openRepairModal}>
                Request a Repair
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-repair-green-600 border-repair-green-400 hover:bg-repair-green-50" onClick={openHelpModal}>
                Help to Repair
              </Button>
            </div>
            
            <div className="mt-12 flex justify-center">
              <img src="https://images.unsplash.com/photo-1581092921461-7d14b811c3d3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80" alt="People repairing devices" className="rounded-lg shadow-md max-w-full h-auto max-h-96" />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="section bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center text-repair-green-700 mb-12">How It Works?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-repair-green-200 card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-repair-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <Wrench className="text-repair-green-600 h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Submit Your Repair</h3>
                  <p className="text-repair-green-600">
                    Describe your broken device and upload photos. Select available time slots for your repair.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-repair-green-200 card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-repair-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <Users className="text-repair-green-600 h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Get Matched</h3>
                  <p className="text-repair-green-600">
                    We'll connect you with voluntary repairers in your neighborhood who can help with your specific issue.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-repair-green-200 card-hover">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-repair-yellow-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="text-repair-green-600 h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-repair-green-700 mb-2">Meet and Fix</h3>
                  <p className="text-repair-green-600">
                    Meet your repairer at the agreed time and location. Learn how to fix your device together.
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/how-it-works">
                <Button variant="link" className="text-repair-green-600 hover:text-repair-green-500">
                  Learn more about the process <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Repair Requests */}
        <section className="section bg-repair-green-50">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-repair-green-700">
                Recent Repair Requests
              </h2>
              <Link to="/repair-requests">
                <Button variant="link" className="text-repair-green-600 hover:text-repair-green-500">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Sample Repair Cards - These would be dynamically generated */}
              <Card className="border-repair-green-200 card-hover">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-repair-green-700">Coffee Machine</h3>
                      <p className="text-repair-green-600 text-sm">Brand: Philips</p>
                    </div>
                    <span className="bg-repair-yellow-200 text-repair-green-700 text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  </div>
                  <p className="text-repair-green-600 mb-4 text-sm line-clamp-2">
                    My coffee machine is not heating up. It powers on but doesn't get hot enough to brew coffee.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-repair-green-500 mr-1" />
                      <span className="text-xs text-repair-green-600">3 days ago</span>
                    </div>
                    <Link to="/repair-requests/1">
                      <Button size="sm" variant="outline" className="text-repair-green-600 border-repair-green-300">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-repair-green-200 card-hover">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-repair-green-700">Laptop</h3>
                      <p className="text-repair-green-600 text-sm">Brand: Dell</p>
                    </div>
                    <span className="bg-repair-green-200 text-repair-green-700 text-xs px-2 py-1 rounded-full">
                      In Progress
                    </span>
                  </div>
                  <p className="text-repair-green-600 mb-4 text-sm line-clamp-2">
                    The keyboard on my laptop has several keys that aren't working. Some keys require too much pressure.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-repair-green-500 mr-1" />
                      <span className="text-xs text-repair-green-600">1 week ago</span>
                    </div>
                    <Link to="/repair-requests/2">
                      <Button size="sm" variant="outline" className="text-repair-green-600 border-repair-green-300">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-repair-green-200 card-hover">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-repair-green-700">Radio</h3>
                      <p className="text-repair-green-600 text-sm">Brand: Sony</p>
                    </div>
                    <span className="bg-repair-yellow-200 text-repair-green-700 text-xs px-2 py-1 rounded-full">
                      New
                    </span>
                  </div>
                  <p className="text-repair-green-600 mb-4 text-sm line-clamp-2">
                    My vintage radio turns on but produces a loud static noise. The tuning knob doesn't seem to work properly.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-repair-green-500 mr-1" />
                      <span className="text-xs text-repair-green-600">2 days ago</span>
                    </div>
                    <Link to="/repair-requests/3">
                      <Button size="sm" variant="outline" className="text-repair-green-600 border-repair-green-300">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="section bg-gradient-to-r from-repair-green-400 to-repair-green-500 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Join Our Community of Repairers Today
            </h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Help reduce electronic waste by fixing broken devices. 
              Share your skills with others in your community.
            </p>
            <Button size="lg" className="bg-white text-repair-green-600 hover:bg-repair-yellow-100" onClick={openHelpModal}>
              Become a Repairer
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} type={modalType} />
    </div>;
};
export default Index;