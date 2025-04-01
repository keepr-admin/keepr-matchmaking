
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Image, Upload } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Sample data for device types
const deviceTypes = [
  "Vacuum Cleaner",
  "Coffee Machine",
  "TV",
  "Radio",
  "Lighting",
  "Fume Hood",
  "Laptop",
  "Smartphone",
  "Other",
];

const formSchema = z.object({
  deviceType: z.string({
    required_error: "Please select a device type",
  }),
  brand: z.string().optional(),
  model: z.string().optional(),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters",
  }).max(500, {
    message: "Description cannot be longer than 500 characters",
  }),
});

const NewRepairRequest = () => {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deviceType: "",
      brand: "",
      model: "",
      description: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    const files = e.target.files;
    if (!files) return;
    
    const newImages: File[] = [...images];
    const newImagePreviewUrls: string[] = [...imagePreviewUrls];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please upload only image files",
          variant: "destructive",
        });
        continue;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload images smaller than 5MB",
          variant: "destructive",
        });
        continue;
      }
      
      newImages.push(file);
      newImagePreviewUrls.push(URL.createObjectURL(file));
    }
    
    setImages(newImages);
    setImagePreviewUrls(newImagePreviewUrls);
    
    // Reset input value to allow uploading the same file again
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    const newImagePreviewUrls = [...imagePreviewUrls];
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newImagePreviewUrls[index]);
    
    newImages.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);
    
    setImages(newImages);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to create repair request
      console.log("Form values:", values);
      console.log("Images:", images);
      
      // In a real app, you would upload images and create the repair request
      
      setTimeout(() => {
        setIsSubmitting(false);
        toast({
          title: "Repair request submitted!",
          description: "We'll notify you when a repairer is available.",
        });
        
        // Redirect to success page or calendar selection
        window.location.href = "/repair-request-timeslots";
      }, 1500);
      
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your repair request. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-repair-green-100 py-12 px-4 md:px-8">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-repair-green-800 mb-4 text-center">
              Submit a Repair Request
            </h1>
            <p className="text-lg text-repair-green-700 max-w-2xl mx-auto text-center mb-2">
              Tell us about your broken device so we can match you with the right repairer.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="section bg-white">
          <div className="container mx-auto max-w-3xl">
            <Card className="border-repair-green-200">
              <CardContent className="p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="deviceType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Device Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a device type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {deviceTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Samsung, Apple, Philips" {...field} />
                            </FormControl>
                            <FormDescription>
                              The manufacturer of your device
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="model"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Model (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Galaxy S21, MacBook Pro" {...field} />
                            </FormControl>
                            <FormDescription>
                              The specific model of your device
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description of Malfunction</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Please describe the problem in detail: When did it start? What happens when you try to use the device? Any unusual sounds, smells, or behaviors?" 
                              className="min-h-32"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            The more details you provide, the better we can match you with the right repairer
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormLabel>Photos</FormLabel>
                      <div className="mt-2 mb-4">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-repair-green-300 bg-repair-green-50 hover:bg-repair-green-100">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-repair-green-500" />
                              <p className="mb-2 text-sm text-repair-green-600">
                                <span className="font-semibold">Click to upload</span> or drag and drop
                              </p>
                              <p className="text-xs text-repair-green-500">
                                Upload photos of your device and the malfunction
                              </p>
                            </div>
                            <input 
                              type="file" 
                              accept="image/*" 
                              multiple 
                              className="hidden" 
                              onChange={handleImageChange}
                            />
                          </label>
                        </div>
                      </div>
                      
                      {imagePreviewUrls.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={url} 
                                alt={`Upload preview ${index + 1}`} 
                                className="h-24 w-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(index)}
                              >
                                <span className="sr-only">Remove image</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full bg-repair-green-500 hover:bg-repair-green-600 text-white mt-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Continue to Schedule"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default NewRepairRequest;
