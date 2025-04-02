
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, User } from "lucide-react";
import Logo from "@/components/common/Logo";
import AuthModal from "@/components/auth/AuthModal";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"repair" | "help">("repair");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    
    getUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        setUser(session?.user || null);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const openRepairModal = () => {
    if (user) {
      navigate("/new-repair-request");
    } else {
      setModalType("repair");
      setIsAuthModalOpen(true);
    }
  };
  
  const openHelpModal = () => {
    if (user) {
      navigate("/repair-requests");
    } else {
      setModalType("help");
      setIsAuthModalOpen(true);
    }
  };
  
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

  return (
    <nav className="bg-white shadow-sm py-3 px-4 md:px-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/how-it-works" className="text-keepr-green-700 hover:text-keepr-green-500 font-medium">
            How It Works
          </Link>
          <Link to="/repair-requests" className="text-keepr-green-700 hover:text-keepr-green-500 font-medium">
            Browse Repairs
          </Link>
          <a href="/#about" className="text-keepr-green-700 hover:text-keepr-green-500 font-medium">
            About Us
          </a>
          <div className="flex gap-3">
            <Button 
              className="btn-primary"
              onClick={openRepairModal}
            >
              Request a Repair
            </Button>
            <Button 
              variant="outline" 
              className="btn-secondary"
              onClick={openHelpModal}
            >
              Help to Repair
            </Button>
          </div>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full bg-keepr-green-100">
                  <User className="h-5 w-5 text-keepr-green-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 text-sm font-medium text-keepr-green-700">
                  {user?.email}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile" className="cursor-pointer">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/repair-requests" className="cursor-pointer">
                    My Repair Requests
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/products" className="cursor-pointer">
                    My Products
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant="ghost" 
              className="flex items-center gap-1 text-keepr-green-700"
              onClick={() => setIsAuthModalOpen(true)}
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-keepr-green-700 p-2"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white py-4 px-6 shadow-md animate-fade-in absolute w-full left-0">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/how-it-works" 
              className="text-keepr-green-700 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/repair-requests" 
              className="text-keepr-green-700 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Repairs
            </Link>
            <a 
              href="/#about" 
              className="text-keepr-green-700 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </a>
            
            {user ? (
              <>
                <Link 
                  to="/dashboard/profile" 
                  className="text-keepr-green-700 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link 
                  to="/dashboard/repair-requests" 
                  className="text-keepr-green-700 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Repair Requests
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-center text-red-500 border-red-500"
                  onClick={() => {
                    handleSignOut();
                    setIsMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Button 
                variant="ghost" 
                className="w-full justify-center text-keepr-green-700"
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <LogIn className="h-4 w-4 mr-2" />
                <span>Login</span>
              </Button>
            )}
            
            <Button 
              className="w-full justify-center btn-primary"
              onClick={() => {
                openRepairModal();
                setIsMenuOpen(false);
              }}
            >
              Request a Repair
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-center btn-secondary"
              onClick={() => {
                openHelpModal();
                setIsMenuOpen(false);
              }}
            >
              Help to Repair
            </Button>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        type={modalType}
      />
    </nav>
  );
};

export default Navbar;
