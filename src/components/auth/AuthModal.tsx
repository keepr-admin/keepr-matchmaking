
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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "repair" | "help";
}

type AuthStep = "login" | "register" | "verify";

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type }) => {
  const [step, setStep] = useState<AuthStep>("register");
  const [email, setEmail] = useState("");

  const handleLoginClick = () => {
    setStep("login");
  };

  const handleRegisterClick = () => {
    setStep("register");
  };

  const handleRegisterSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setStep("verify");
  };

  const handleLoginSuccess = () => {
    onClose();
    // Redirect based on the type
    if (type === "repair") {
      window.location.href = "/new-repair-request";
    } else {
      window.location.href = "/repair-requests";
    }
  };

  const handleVerificationSuccess = () => {
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
