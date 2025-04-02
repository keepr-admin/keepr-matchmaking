
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface VerificationFormProps {
  email: string;
  onVerificationSuccess: () => void;
}

const VerificationForm: React.FC<VerificationFormProps> = ({
  email,
  onVerificationSuccess,
}) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call to verify the code
      // For now, we'll simulate the process
      console.log("Verification code:", verificationCode);
      
      // For demo purposes, any code with 6 digits will work
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        setTimeout(() => {
          setIsSubmitting(false);
          onVerificationSuccess();
        }, 1000);
      } else {
        toast({
          title: "Invalid verification code",
          description: "Please enter the 6-digit code sent to your email.",
          variant: "destructive",
        });
        setIsSubmitting(false);
      }
      
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification failed",
        description: "There was a problem verifying your code. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleResendCode = () => {
    toast({
      title: "Verification code resent",
      description: `A new verification code has been sent to ${email}.`,
    });
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="text-center mb-4">
        <p className="text-keepr-green-600">
          We've sent a verification code to <strong>{email}</strong>. 
          Please enter the code below to verify your email.
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="123456"
            className="text-center text-lg"
            maxLength={6}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-keepr-green-500 hover:bg-keepr-green-600 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Verifying..." : "Verify Email"}
        </Button>
      </form>

      <div className="text-center mt-4">
        <span className="text-keepr-green-700">Didn't receive the code?</span>{" "}
        <button
          type="button"
          onClick={handleResendCode}
          className="text-keepr-green-600 font-semibold hover:underline"
        >
          Resend Code
        </button>
      </div>
    </div>
  );
};

export default VerificationForm;
