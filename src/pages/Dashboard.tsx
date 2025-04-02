import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Settings, 
  Package, 
  Wrench, 
  MessageSquare, 
  ChevronRight, 
  Clock, 
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [repairRequests, setRepairRequests] = useState<any[]>([]);
  const [helpedRepairs, setHelpedRepairs] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          window.location.href = "/auth";
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
        }

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (productsError) {
          console.error('Error fetching products:', productsError);
        } else {
          setProducts(productsData || []);
        }

        const { data: repairsData, error: repairsError } = await supabase
          .from('repair_requests')
          .select(`
            *,
            products:product_id (*)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (repairsError) {
          console.error('Error fetching repair requests:', repairsError);
        } else {
          setRepairRequests(repairsData || []);
        }

        if (profileData?.receive_requests) {
          const { data: helpedData, error: helpedError } = await supabase
            .from('repair_requests')
            .select(`
              *,
              products:product_id (*),
              profiles:user_id (*)
            `)
            .neq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (helpedError) {
            console.error('Error fetching helped repairs:', helpedError);
          } else {
            setHelpedRepairs(helpedData || []);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepr-green-500"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4 md:px-8 bg-gray-50">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-keepr-green-800">
                Dashboard
              </h1>
              <p className="text-keepr-green-600">
                Manage your repairs, products and profile
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="bg-keepr-green-500 hover:bg-keepr-green-600 text-white">
                New Repair Request
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="data-[state=active]:bg-keepr-green-500 data-[state=active]:text-white">
                <Settings className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="products" className="data-[state=active]:bg-keepr-green-500 data-[state=active]:text-white">
                <Package className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger value="repairs" className="data-[state=active]:bg-keepr-green-500 data-[state=active]:text-white">
                <Wrench className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Repair Requests</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="data-[state=active]:bg-keepr-green-500 data-[state=active]:text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-keepr-green-800">First Name</label>
                          <div className="mt-1 p-2 border rounded-md">
                            {profile?.first_name || "-"}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-keepr-green-800">Last Name</label>
                          <div className="mt-1 p-2 border rounded-md">
                            {profile?.last_name || "-"}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-keepr-green-800">Email Address</label>
                        <div className="mt-1 p-2 border rounded-md">
                          {/* Will be added once auth is implemented */}
                          example@email.com
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-keepr-green-800">Phone Number</label>
                        <div className="mt-1 p-2 border rounded-md">
                          {profile?.phone_number || "-"}
                        </div>
                      </div>
                      
                      <div className="pt-4 flex justify-end">
                        <Button className="bg-keepr-green-500 hover:bg-keepr-green-600 text-white">
                          Edit Profile
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-keepr-green-800">Street</label>
                        <div className="mt-1 p-2 border rounded-md">
                          {profile?.street || "-"}
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-keepr-green-800">Number</label>
                        <div className="mt-1 p-2 border rounded-md">
                          {profile?.number || "-"}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-keepr-green-800">Postal Code</label>
                          <div className="mt-1 p-2 border rounded-md">
                            {profile?.postal_code || "-"}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-keepr-green-800">City</label>
                          <div className="mt-1 p-2 border rounded-md">
                            {profile?.city || "-"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="receive_requests"
                            className="rounded border-gray-300 text-keepr-green-500 focus:ring-keepr-green-500"
                            checked={profile?.receive_requests}
                            readOnly
                          />
                          <label htmlFor="receive_requests" className="ml-2 block text-sm text-gray-700">
                            I want to help repair items (become a repairer)
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          By checking this box, you will receive repair requests from others in your area
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="products">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {products.length === 0 ? (
                      <div className="text-center py-8">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No products yet</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          You haven't added any products yet. Products are automatically added when you create a repair request.
                        </p>
                        <div className="mt-6">
                          <Button className="bg-keepr-green-500 hover:bg-keepr-green-600 text-white">
                            Create Repair Request
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {products.map((product) => (
                          <div key={product.product_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg text-keepr-green-800">
                                  {product.brand ? `${product.brand} ${product.model || ''}` : `${product.type}`}
                                </h3>
                                <p className="text-sm text-gray-500">Type: {product.type}</p>
                                {product.serial_number && (
                                  <p className="text-sm text-gray-500">Serial: {product.serial_number}</p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  product.status === 'live' ? 'bg-green-100 text-green-800' :
                                  product.status === 'broken' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {product.status}
                                </span>
                                <Link to={`/products/${product.product_id}`}>
                                  <Button variant="ghost" size="sm" className="text-keepr-green-600 hover:text-keepr-green-800 p-1">
                                    <ChevronRight className="h-5 w-5" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="text-center pt-4">
                          <Button className="bg-keepr-green-500 hover:bg-keepr-green-600 text-white">
                            Create Repair Request
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="repairs">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Repair Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {repairRequests.length === 0 ? (
                      <div className="text-center py-8">
                        <Wrench className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No repair requests</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          You haven't created any repair requests yet.
                        </p>
                        <div className="mt-6">
                          <Button className="bg-keepr-green-500 hover:bg-keepr-green-600 text-white">
                            Create Repair Request
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {repairRequests.map((repair) => (
                          <div key={repair.repair_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-lg text-keepr-green-800">
                                  {repair.products?.brand 
                                    ? `${repair.products.brand} ${repair.products.model || ''}` 
                                    : repair.products?.type || 'Device'}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{repair.description}</p>
                                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Calendar className="mr-1 h-4 w-4" />
                                    {formatDate(repair.created_at)}
                                  </span>
                                  <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(repair.status)}`}>
                                    {repair.status}
                                  </span>
                                </div>
                              </div>
                              <Link to={`/repair-requests/${repair.repair_id}`}>
                                <Button variant="ghost" size="sm" className="text-keepr-green-600 hover:text-keepr-green-800 p-1">
                                  <ChevronRight className="h-5 w-5" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {profile?.receive_requests && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Repairs You've Helped With</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {helpedRepairs.length === 0 ? (
                        <div className="text-center py-8">
                          <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-lg font-medium text-gray-900">No repairs helped</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            You haven't helped with any repairs yet. Browse available repair requests to start helping.
                          </p>
                          <div className="mt-6">
                            <Button className="bg-keepr-green-500 hover:bg-keepr-green-600 text-white">
                              Browse Repair Requests
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {helpedRepairs.map((repair) => (
                            <div key={repair.repair_id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium text-lg text-keepr-green-800">
                                    {repair.products?.brand 
                                      ? `${repair.products.brand} ${repair.products.model || ''}` 
                                      : repair.products?.type || 'Device'}
                                  </h3>
                                  <p className="text-sm text-gray-600 line-clamp-2">{repair.description}</p>
                                  <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                    <span className="flex items-center">
                                      <Calendar className="mr-1 h-4 w-4" />
                                      {formatDate(repair.created_at)}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(repair.status)}`}>
                                      {repair.status}
                                    </span>
                                  </div>
                                </div>
                                <Link to={`/repair-requests/${repair.repair_id}`}>
                                  <Button variant="ghost" size="sm" className="text-keepr-green-600 hover:text-keepr-green-800 p-1">
                                    <ChevronRight className="h-5 w-5" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No messages yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Messages related to your repair requests will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
