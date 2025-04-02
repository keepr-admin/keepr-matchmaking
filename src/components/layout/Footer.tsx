
import { Link } from "react-router-dom";
import Logo from "@/components/common/Logo";

const Footer = () => {
  return (
    <footer className="bg-keepr-green-100 py-12 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <Logo size={32} />
              <span className="font-semibold text-xl text-keepr-green-700">Keepr</span>
            </Link>
            <p className="text-keepr-green-800 max-w-md">
              Connecting people with broken devices to voluntary repairers in their neighborhood.
              Together we can reduce waste and build stronger communities.
            </p>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold text-lg text-keepr-green-800 mb-2">Quick Links</h3>
            <Link to="/how-it-works" className="text-keepr-green-700 hover:text-keepr-green-500">
              How It Works
            </Link>
            <Link to="/repair-requests" className="text-keepr-green-700 hover:text-keepr-green-500">
              Browse Repairs
            </Link>
            <Link to="/how-it-works" className="text-keepr-green-700 hover:text-keepr-green-500">
              About Us
            </Link>
            <Link to="/how-it-works#contact" className="text-keepr-green-700 hover:text-keepr-green-500">
              Contact
            </Link>
          </div>

          <div className="flex flex-col space-y-3">
            <h3 className="font-semibold text-lg text-keepr-green-800 mb-2">Legal</h3>
            <Link to="/how-it-works#privacy" className="text-keepr-green-700 hover:text-keepr-green-500">
              Privacy Policy
            </Link>
            <Link to="/how-it-works#terms" className="text-keepr-green-700 hover:text-keepr-green-500">
              Terms of Service
            </Link>
            <Link to="/how-it-works#cookies" className="text-keepr-green-700 hover:text-keepr-green-500">
              Cookie Policy
            </Link>
          </div>
        </div>

        <div className="border-t border-keepr-green-200 mt-8 pt-8 text-center text-keepr-green-700">
          <p>&copy; {new Date().getFullYear()} Keepr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
