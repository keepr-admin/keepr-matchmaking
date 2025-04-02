
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  postalCode: z.string().min(4, {
    message: "Please enter a valid postal code.",
  }),
});

interface RegisterFormProps {
  onLoginClick: () => void;
  onRegisterSuccess: (email: string) => void;
  type: "repair" | "help";
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onLoginClick,
  onRegisterSuccess,
  type,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      postalCode: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call to create the user
      // For now, we'll simulate the process
      console.log("Registration values:", values);
      
      // Check if postal code is in Leuven (3000-3012)
      const postalCode = parseInt(values.postalCode);
      const isLeuven = postalCode >= 3000 && postalCode <= 3012;
      
      if (!isLeuven) {
        toast({
          title: "Location not yet supported",
          description: `We'll keep you informed when we have more requests in your city. Your information has been stored.`,
          variant: "default",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Simulate sending verification email
      setTimeout(() => {
        setIsSubmitting(false);
        onRegisterSuccess(values.email);
      }, 1000);
      
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "There was a problem with your registration. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 py-2 pb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="3000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-keepr-green-500 hover:bg-keepr-green-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </form>
      </Form>

      <div className="text-center mt-4">
        <span className="text-keepr-green-700">Already have an account?</span>{" "}
        <button
          type="button"
          onClick={onLoginClick}
          className="text-keepr-green-600 font-semibold hover:underline"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
