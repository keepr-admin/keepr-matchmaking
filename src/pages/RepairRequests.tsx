
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Clock, Search, Filter } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Sample data for device types
const deviceTypes = [
  "All Types",
  "Vacuum Cleaner",
  "Coffee Machine",
  "TV",
  "Radio",
  "Lighting",
  "Fume Hood",
  "Laptop",
  "Smartphone",
  "Other",
];

// Sample repair request data
const sampleRepairRequests = [
  {
    id: 1,
    deviceType: "Coffee Machine",
    brand: "Philips",
    model: "Senseo HD7810",
    description: "My coffee machine is not heating up properly. It powers on but doesn't get hot enough to brew coffee.",
    status: "new",
    createdAt: "3 days ago",
    image: "https://images.unsplash.com/photo-1572119465079-96e042aeton?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: 2,
    deviceType: "Laptop",
    brand: "Dell",
    model: "XPS 13",
    description: "The keyboard on my laptop has several keys that aren't working. Some keys require too much pressure to register.",
    status: "in_progress",
    createdAt: "1 week ago",
    image: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: 3,
    deviceType: "Radio",
    brand: "Sony",
    model: "ICF-C1",
    description: "My vintage radio turns on but produces a loud static noise. The tuning knob doesn't seem to work properly.",
    status: "new",
    createdAt: "2 days ago",
    image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1780&q=80",
  },
  {
    id: 4,
    deviceType: "Vacuum Cleaner",
    brand: "Dyson",
    model: "V8",
    description: "My vacuum cleaner has lost suction power. It still turns on but doesn't pick up dirt effectively anymore.",
    status: "new",
    createdAt: "5 days ago",
    image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: 5,
    deviceType: "TV",
    brand: "Samsung",
    model: "QN90A",
    description: "My TV has vertical lines on the left side of the screen. They appear regardless of the input source.",
    status: "in_progress",
    createdAt: "1 week ago",
    image: "https://images.unsplash.com/photo-1593784991095-a205069533be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  },
  {
    id: 6,
    deviceType: "Smartphone",
    brand: "iPhone",
    model: "11 Pro",
    description: "The charging port on my phone is very loose. The cable falls out easily and charging is inconsistent.",
    status: "new",
    createdAt: "1 day ago",
    image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
  },
];

const RepairRequests = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("all");
  
  // Filter repair requests based on search query, device type, and status
  const filteredRequests = sampleRepairRequests.filter((request) => {
    // Filter by search query
    const matchesSearch = 
      request.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by device type
    const matchesType = selectedType === "All Types" || request.deviceType === selectedType;
    
    // Filter by status
    const matchesStatus = 
      selectedStatus === "all" ||
      (selectedStatus === "new" && request.status === "new") ||
      (selectedStatus === "in_progress" && request.status === "in_progress");
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-keepr-green-100 py-12 px-4 md:px-8">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-keepr-green-800 mb-4 text-center">
              Repair Requests
            </h1>
            <p className="text-lg text-keepr-green-700 max-w-2xl mx-auto text-center mb-8">
              Browse through repair requests in your area and choose one that matches your repair skills.
            </p>
            
            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-keepr-green-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by device, brand, or description..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select onValueChange={setSelectedType} defaultValue={selectedType}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Device Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {deviceTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select onValueChange={setSelectedStatus} defaultValue={selectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Repair Requests List */}
        <section className="section bg-white">
          <div className="container mx-auto">
            {filteredRequests.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((request) => (
                  <Link key={request.id} to={`/repair-requests/${request.id}`} className="block h-full">
                    <Card className="border-keepr-green-200 card-hover overflow-hidden h-full">
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={request.image}
                          alt={request.deviceType}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            request.status === "new" 
                              ? "bg-keepr-yellow-200 text-keepr-green-700" 
                              : "bg-keepr-green-200 text-keepr-green-700"
                          }`}>
                            {request.status === "new" ? "New" : "In Progress"}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="mb-3">
                          <h3 className="text-lg font-semibold text-keepr-green-700">{request.deviceType}</h3>
                          <p className="text-keepr-green-600 text-sm">
                            {request.brand} {request.model}
                          </p>
                        </div>
                        <p className="text-keepr-green-600 mb-4 text-sm line-clamp-3">
                          {request.description}
                        </p>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-keepr-green-500 mr-1" />
                          <span className="text-xs text-keepr-green-600">{request.createdAt}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-keepr-green-700 mb-2">No Repair Requests Found</h3>
                <p className="text-keepr-green-600 mb-4">
                  We couldn't find any repair requests matching your search criteria.
                </p>
                <Button 
                  variant="outline" 
                  className="btn-secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType("All Types");
                    setSelectedStatus("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default RepairRequests;
