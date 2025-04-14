
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, Calendar } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

type RepairWithDetails = Tables<"repair_requests"> & {
  products: Tables<"products"> | null;
};

const RepairsList = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [repairs, setRepairs] = useState<RepairWithDetails[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No authenticated user');
          navigate('/');
          return;
        }
        
        // In a real app, this would fetch repairs that the user has helped with
        // For now, we'll just show all repairs for demo purposes
        const { data, error } = await supabase
          .from('repair_requests')
          .select(`
            *,
            products (*)
          `)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching repairs:', error);
          return;
        }
        
        if (data) {
          setRepairs(data as RepairWithDetails[]);
        }
      } catch (error) {
        console.error('Error in fetchRepairs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRepairs();
  }, [navigate]);
  
  // Filter repairs based on search query
  const filteredRepairs = repairs.filter(repair => {
    if (!searchQuery) return true;
    
    const productInfo = repair.products 
      ? `${repair.products.brand || ''} ${repair.products.model || ''} ${repair.products.type || ''}`.trim().toLowerCase()
      : '';
      
    return (
      productInfo.includes(searchQuery.toLowerCase()) ||
      repair.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Get status display name and badge color
  const getStatusDetails = (status: string) => {
    switch (status) {
      case 'pending':
        return { label: 'Pending', color: 'bg-keepr-yellow-200 text-keepr-green-700' };
      case 'timeslots_selected':
        return { label: 'Awaiting Confirmation', color: 'bg-blue-200 text-blue-700' };
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepr-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-keepr-green-800">Repairs</h2>
        <p className="text-keepr-green-600">
          View and manage repairs you can help with.
        </p>
      </div>
      
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          className="pl-9"
          placeholder="Search repairs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredRepairs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-white">
          <AlertCircle className="h-12 w-12 text-keepr-green-300 mb-4" />
          <h3 className="text-lg font-medium text-keepr-green-700">No repairs found</h3>
          <p className="text-sm text-keepr-green-600 mt-1 max-w-md">
            {searchQuery 
              ? "No repairs match your search criteria. Try using different keywords."
              : "You haven't helped with any repairs yet. Browse the repair requests to find ones you can help with."}
          </p>
          
          {!searchQuery && (
            <Button 
              className="btn-primary mt-6"
              onClick={() => navigate('/repair-requests')}
            >
              Browse Repair Requests
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
          {filteredRepairs.map((repair) => {
            const { label, color } = getStatusDetails(repair.status);
            const isAwaitingConfirmation = repair.status === 'timeslots_selected';
            
            return (
              <Card className="card-hover h-full" key={repair.repair_id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-keepr-green-700">
                        {repair.products?.type}
                      </h3>
                      <p className="text-keepr-green-600 text-sm">
                        {repair.products?.brand} {repair.products?.model}
                      </p>
                    </div>
                    <Badge className={color}>{label}</Badge>
                  </div>
                  
                  <p className="text-keepr-green-600 mb-4 line-clamp-3">
                    {repair.description}
                  </p>
                  
                  <div className="text-keepr-green-600 text-xs mb-4">
                    Added on {format(new Date(repair.created_at), 'MMM d, yyyy')}
                  </div>
                  
                  {isAwaitingConfirmation && (
                    <Link to={`/repairer/timeslots/${repair.repair_id}`}>
                      <Button className="w-full bg-keepr-green-600 hover:bg-keepr-green-700 text-white">
                        <Calendar className="mr-2 h-4 w-4" />
                        Confirm Timeslot
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

const RepairDetail = () => {
  return (
    <div>
      <h2>Repair Detail</h2>
      <p>This is a placeholder for the repair detail view.</p>
    </div>
  );
};

const Repairs = () => {
  return (
    <Routes>
      <Route path="/" element={<RepairsList />} />
      <Route path="/:repairId" element={<RepairDetail />} />
    </Routes>
  );
};

export default Repairs;
