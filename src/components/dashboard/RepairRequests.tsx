
import { useState, useEffect } from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  Wrench,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type RepairRequestWithDetails = Tables<"repair_requests"> & {
  products: Tables<"products"> | null;
  profiles: {
    first_name: string | null;
    last_name: string | null;
  } | null;
};

const RepairRequestsList = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [repairRequests, setRepairRequests] = useState<RepairRequestWithDetails[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRepairRequests = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No authenticated user');
          navigate('/');
          return;
        }
        
        const { data, error } = await supabase
          .from('repair_requests')
          .select(`
            *,
            products (*),
            profiles:user_id (
              first_name,
              last_name
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching repair requests:', error);
          return;
        }
        
        if (data) {
          setRepairRequests(data as RepairRequestWithDetails[]);
        }
      } catch (error) {
        console.error('Error in fetchRepairRequests:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRepairRequests();
  }, [navigate]);
  
  // Filter repair requests based on search query and active tab
  const filteredRequests = repairRequests.filter(request => {
    // First filter by tab
    if (activeTab !== "all" && request.status !== activeTab) {
      return false;
    }
    
    // Then filter by search query
    if (!searchQuery) return true;
    
    const productInfo = request.products 
      ? `${request.products.brand || ''} ${request.products.model || ''} ${request.products.type || ''}`.trim()
      : '';
      
    return (
      productInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Get status display name and badge color
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: 'bg-keepr-yellow-200 text-keepr-green-700' };
      case 'accepted':
        return { label: 'Accepted', color: 'bg-keepr-green-200 text-keepr-green-700' };
      case 'scheduled':
        return { label: 'Scheduled', color: 'bg-blue-200 text-blue-700' };
      case 'completed':
        return { label: 'Completed', color: 'bg-green-200 text-green-700' };
      case 'cancelled':
        return { label: 'Cancelled', color: 'bg-red-200 text-red-700' };
      default:
        return { label: status, color: 'bg-gray-200 text-gray-700' };
    }
  };
  
  // Format date to display relative time (e.g., "2 days ago")
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepr-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-keepr-green-800">Your Repair Requests</h2>
          <p className="text-keepr-green-600">
            Manage and track the status of your device repair requests.
          </p>
        </div>
        
        <Link to="/new-repair-request">
          <Button className="btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            New Repair Request
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            className="pl-9"
            placeholder="Search repair requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs 
          defaultValue="all" 
          className="w-full md:w-auto"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 md:grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-white">
          <AlertCircle className="h-12 w-12 text-keepr-green-300 mb-4" />
          <h3 className="text-lg font-medium text-keepr-green-700">No repair requests found</h3>
          <p className="text-sm text-keepr-green-600 mt-1 max-w-md">
            {searchQuery 
              ? "No requests match your search criteria. Try using different keywords."
              : activeTab !== "all" 
                ? `You don't have any ${activeTab} repair requests.`
                : "You haven't created any repair requests yet. Click 'New Repair Request' to get started."}
          </p>
          
          {!searchQuery && activeTab === "all" && (
            <Link to="/new-repair-request" className="mt-6">
              <Button className="btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Request
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRequests.map((request) => {
            const { label, color } = getStatusDetails(request.status);
            return (
              <Link to={`/dashboard/repair-requests/${request.repair_id}`} key={request.repair_id}>
                <Card className="card-hover h-full">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-keepr-green-700">
                          {request.products?.type}
                        </h3>
                        <p className="text-keepr-green-600 text-sm">
                          Brand: {request.products?.brand || "N/A"} | Model: {request.products?.model || "N/A"}
                        </p>
                      </div>
                      <Badge className={color}>{label}</Badge>
                    </div>
                    
                    <p className="text-keepr-green-600 mb-4 line-clamp-2">
                      {request.description}
                    </p>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-keepr-green-500 mr-1" />
                      <span className="text-xs text-keepr-green-600">
                        {formatRelativeTime(request.created_at)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RepairRequestDetail = () => {
  return (
    <div>
      <h2>Repair Request Detail</h2>
      <p>This is a placeholder for the repair request detail view.</p>
    </div>
  );
};

const RepairRequests = () => {
  return (
    <Routes>
      <Route path="/" element={<RepairRequestsList />} />
      <Route path="/:repairId" element={<RepairRequestDetail />} />
    </Routes>
  );
};

export default RepairRequests;
