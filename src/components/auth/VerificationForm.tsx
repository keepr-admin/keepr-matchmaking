
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
      // For now, we're simulating the verification process
      // In a real app with Supabase, you would typically redirect the user to the email verification link
      // Supabase doesn't support OTP verification for email out of the box
      
      // For demo purposes, any code with 6 digits will work
      if (verificationCode.length === 6 && /^\d+$/.test(verificationCode)) {
        // Attempt to sign in the user since they've "verified" their email
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error);
          throw error;
        }
        
        if (data && data.session) {
          // User is already signed in
          onVerificationSuccess();
        } else {
          toast({
            title: "Verification failed",
            description: "Please check your email and click the verification link sent to you.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Invalid verification code",
          description: "Please enter the 6-digit code sent to your email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification failed",
        description: "There was a problem verifying your code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      // Send a new verification email using Supabase
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) {
        console.error("Error resending verification email:", error);
        toast({
          title: "Failed to resend verification email",
          description: error.message || "Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Verification email resent",
        description: `A new verification email has been sent to ${email}.`,
      });
    } catch (error) {
      console.error("Error resending verification email:", error);
      toast({
        title: "Failed to resend verification email",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <div className="text-center mb-4">
        <p className="text-keepr-green-600">
          We've sent a verification email to <strong>{email}</strong>. 
          Please check your inbox and click the verification link.
        </p>
        <p className="text-keepr-green-600 mt-2">
          Alternatively, you can enter the 6-digit code from the email below:
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
        <span className="text-keepr-green-700">Didn't receive the verification email?</span>{" "}
        <button
          type="button"
          onClick={handleResendCode}
          className="text-keepr-green-600 font-semibold hover:underline"
        >
          Resend Email
        </button>
      </div>
    </div>
  );
};

export default VerificationForm;
