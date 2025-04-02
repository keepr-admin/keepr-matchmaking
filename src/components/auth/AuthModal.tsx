
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import VerificationForm from "./VerificationForm";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "repair" | "help";
}

type AuthStep = "login" | "register" | "verify";

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type }) => {
  const [step, setStep] = useState<AuthStep>("register");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleLoginClick = () => {
    setStep("login");
  };

  const handleRegisterClick = () => {
    setStep("register");
  };

  const handleRegisterSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setStep("verify");
    toast({
      title: "Registration successful",
      description: "Please verify your email to continue.",
    });
  };

  const handleLoginSuccess = async () => {
    // Get the current session
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Session error:", error);
      toast({
        title: "Authentication error",
        description: "There was a problem with your login. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (!data.session) {
      toast({
        title: "Login failed",
        description: "No session found. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Login successful",
      description: "You have been logged in successfully.",
    });
    
    onClose();
    
    // Redirect based on the type
    if (type === "repair") {
      window.location.href = "/new-repair-request";
    } else {
      window.location.href = "/repair-requests";
    }
  };

  const handleVerificationSuccess = async () => {
    // Check if the user is already verified
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Session error:", error);
      toast({
        title: "Verification error",
        description: "There was a problem verifying your account. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    if (!data.session) {
      toast({
        title: "Verification failed",
        description: "No session found. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Verification successful",
      description: "Your email has been verified. You are now logged in.",
    });
    
    onClose();
    
    // Redirect based on the type
    if (type === "repair") {
      window.location.href = "/new-repair-request";
    } else {
      window.location.href = "/repair-requests";
    }
  };

  const getTitle = () => {
    if (type === "repair") {
      return "Request a Repair";
    }
    return "Help with Repairs";
  };

  const getDescription = () => {
    if (type === "repair") {
      return "Connect with volunteer repairers in your neighborhood who can help fix your broken device.";
    }
    return "Browse repair requests in your area and help others fix their broken devices.";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-repair-green-700">{getTitle()}</DialogTitle>
        <DialogDescription className="text-repair-green-600">
          {getDescription()}
        </DialogDescription>

        {step === "register" && (
          <RegisterForm 
            onLoginClick={handleLoginClick} 
            onRegisterSuccess={handleRegisterSuccess}
            type={type}
          />
        )}

        {step === "login" && (
          <LoginForm 
            onRegisterClick={handleRegisterClick} 
            onLoginSuccess={handleLoginSuccess} 
          />
        )}

        {step === "verify" && (
          <VerificationForm 
            email={email} 
            onVerificationSuccess={handleVerificationSuccess} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
