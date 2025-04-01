
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Logo from "@/components/common/Logo";
import AuthModal from "@/components/auth/AuthModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"repair" | "help">("repair");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const openRepairModal = () => {
    setModalType("repair");
    setIsAuthModalOpen(true);
  };
  
  const openHelpModal = () => {
    setModalType("help");
    setIsAuthModalOpen(true);
  };

  return (
    <nav className="bg-white shadow-sm py-3 px-4 md:px-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold text-xl text-repair-green-600 hidden sm:inline">RepairBuddies</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/how-it-works" className="text-repair-green-700 hover:text-repair-green-500 font-medium">
            How It Works
          </Link>
          <Link to="/repair-requests" className="text-repair-green-700 hover:text-repair-green-500 font-medium">
            Browse Repairs
          </Link>
          <Link to="/about" className="text-repair-green-700 hover:text-repair-green-500 font-medium">
            About Us
          </Link>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="bg-white text-repair-green-600 border-repair-green-400 hover:bg-repair-green-50"
              onClick={openRepairModal}
            >
              Request a Repair
            </Button>
            <Button 
              className="bg-repair-green-500 hover:bg-repair-green-600 text-white"
              onClick={openHelpModal}
            >
              Help to Repair
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-repair-green-700 p-2"
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
              className="text-repair-green-700 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/repair-requests" 
              className="text-repair-green-700 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Repairs
            </Link>
            <Link 
              to="/about" 
              className="text-repair-green-700 font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Button 
              variant="outline" 
              className="w-full justify-center bg-white text-repair-green-600 border-repair-green-400 hover:bg-repair-green-50"
              onClick={() => {
                openRepairModal();
                setIsMenuOpen(false);
              }}
            >
              Request a Repair
            </Button>
            <Button 
              className="w-full justify-center bg-repair-green-500 hover:bg-repair-green-600 text-white"
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
