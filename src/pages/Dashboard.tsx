
import { useState, useEffect } from "react";
import { Navigate, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { 
  User, 
  MessageSquare, 
  Wrench, 
  Package, 
  Settings, 
  CircleUserRound,
  LogOut, 
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "@/components/layout/Navbar";
import Logo from "@/components/common/Logo";
import { supabase } from "@/integrations/supabase/client";
import Profile from "@/components/dashboard/Profile";
import Chats from "@/components/dashboard/Chats";
import RepairRequests from "@/components/dashboard/RepairRequests";
import Products from "@/components/dashboard/Products";
import Repairs from "@/components/dashboard/Repairs";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Set up auth state listener first
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });
    
    // Then check for existing session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out");
    }
  };
  
  // If user is not authenticated and finished loading, redirect to home
  if (!loading && !user) {
    return <Navigate to="/" replace />;
  }
  
  // Navigate to /dashboard/profile by default if no subroute is specified
  if (location.pathname === "/dashboard") {
    return <Navigate to="/dashboard/profile" replace />;
  }
  
  const sidebarItems = [
    {
      name: "Profile",
      icon: <User className="h-5 w-5" />,
      path: "/dashboard/profile",
    },
    {
      name: "Chats",
      icon: <MessageSquare className="h-5 w-5" />,
      path: "/dashboard/chats",
    },
    {
      name: "Repair Requests",
      icon: <Wrench className="h-5 w-5" />,
      path: "/dashboard/repair-requests",
    },
    {
      name: "Products",
      icon: <Package className="h-5 w-5" />,
      path: "/dashboard/products",
    },
    {
      name: "Repairs",
      icon: <Settings className="h-5 w-5" />,
      path: "/dashboard/repairs",
    },
  ];
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 z-50 rounded-full bg-keepr-green-500 text-white shadow-lg md:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
        
        {/* Sidebar */}
        <aside className={cn(
          "w-64 flex-shrink-0 bg-keepr-green-50 border-r transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "fixed md:static inset-y-0 z-40 md:translate-x-0 h-full"
        )}>
          <div className="flex h-full flex-col">
            <div className="flex h-16 items-center border-b px-4">
              <Logo size={32} />
              <span className="ml-3 text-lg font-medium text-keepr-green-800">Dashboard</span>
            </div>
            
            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="flex flex-col gap-1">
                {sidebarItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className={cn(
                      "justify-start",
                      isActive(item.path) 
                        ? "bg-keepr-green-500 text-white hover:bg-keepr-green-600" 
                        : "text-keepr-green-700 hover:bg-keepr-green-100 hover:text-keepr-green-800"
                    )}
                    onClick={() => {
                      navigate(item.path);
                      if (window.innerWidth < 768) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                ))}
              </nav>
            </ScrollArea>
            
            <div className="border-t p-4">
              <div className="flex items-center gap-3 mb-4">
                <CircleUserRound className="h-8 w-8 text-keepr-green-600" />
                <div>
                  <div className="text-sm font-medium text-keepr-green-800">
                    {user?.email}
                  </div>
                  <div className="text-xs text-keepr-green-600">
                    {user?.user_metadata?.first_name || "User"}
                  </div>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className={cn(
          "flex-1 overflow-auto transition-all duration-300 ease-in-out",
          !sidebarOpen && "md:ml-0"
        )}>
          <div className="container mx-auto p-4 md:p-6 max-w-6xl">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepr-green-500"></div>
              </div>
            ) : (
              <Routes>
                <Route path="/profile" element={<Profile />} />
                <Route path="/chats" element={<Chats />} />
                <Route path="/repair-requests/*" element={<RepairRequests />} />
                <Route path="/products/*" element={<Products />} />
                <Route path="/repairs/*" element={<Repairs />} />
              </Routes>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
