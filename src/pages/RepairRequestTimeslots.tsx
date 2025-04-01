
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Sample data for locations
const locations = [
  {
    id: 1,
    name: "Community Center",
    address: "Naamsestraat 96, 3000 Leuven",
    mapLink: "https://maps.google.com/?q=Naamsestraat+96+3000+Leuven",
  },
  {
    id: 2,
    name: "Repair Café",
    address: "Diestsestraat 63, 3000 Leuven",
    mapLink: "https://maps.google.com/?q=Diestsestraat+63+3000+Leuven",
  },
];

// Sample data for timeslots
// Generate time slots for the next 14 days
const generateTimeslots = () => {
  const timeslots = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    
    // Skip if it's in the past
    if (currentDate < new Date()) continue;
    
    // Only generate slots for weekdays (Monday to Friday)
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    // Generate slots for the current day
    for (let hour = 10; hour <= 18; hour += 2) {
      const date = new Date(currentDate);
      date.setHours(hour, 0, 0, 0);
      
      // Skip if the time is in the past
      if (date < new Date()) continue;
      
      timeslots.push({
        id: `${day}-${hour}`,
        date: date,
        location_id: hour < 14 ? 1 : 2, // First location for morning, second for afternoon
        available: true,
        reserved: false,
      });
    }
  }
  
  return timeslots;
};

const timeslots = generateTimeslots();

// Group timeslots by date
const groupedTimeslots = timeslots.reduce((acc, slot) => {
  const dateStr = slot.date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  if (!acc[dateStr]) {
    acc[dateStr] = [];
  }
  
  acc[dateStr].push(slot);
  return acc;
}, {} as Record<string, typeof timeslots>);

// Schema for form validation
const formSchema = z.object({
  location: z.string({
    required_error: "Please select a location",
  }),
  timeslots: z.array(z.string()).min(1, {
    message: "Please select at least one timeslot",
  }).max(5, {
    message: "You can select up to 5 timeslots",
  }),
});

const RepairRequestTimeslots = () => {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [filteredDates, setFilteredDates] = useState<Record<string, typeof timeslots>>(groupedTimeslots);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      timeslots: [],
    },
  });

  // Filter timeslots based on selected location
  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    form.setValue("location", value);
    
    if (value) {
      const locationId = parseInt(value);
      const filtered = Object.entries(groupedTimeslots).reduce((acc, [date, slots]) => {
        const filteredSlots = slots.filter(slot => slot.location_id === locationId);
        if (filteredSlots.length > 0) {
          acc[date] = filteredSlots;
        }
        return acc;
      }, {} as Record<string, typeof timeslots>);
      
      setFilteredDates(filtered);
    } else {
      setFilteredDates(groupedTimeslots);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to save selected timeslots
      console.log("Form values:", values);
      
      // In a real app, you would save the selected timeslots
      
      setTimeout(() => {
        setIsSubmitting(false);
        toast({
          title: "Timeslots selected!",
          description: "Your repair request has been submitted successfully.",
        });
        
        // Redirect to confirmation page
        window.location.href = "/repair-request-confirmation";
      }, 1500);
      
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your timeslot selections. Please try again.",
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
              Select Available Timeslots
            </h1>
            <p className="text-lg text-repair-green-700 max-w-2xl mx-auto text-center mb-2">
              Choose when you're available to meet with a repairer. Select multiple options to increase your chances of finding a match.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="section bg-white">
          <div className="container mx-auto max-w-4xl">
            <Card className="border-repair-green-200">
              <CardContent className="p-6 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold text-repair-green-700">Select Location</FormLabel>
                          <Select 
                            onValueChange={(value) => handleLocationChange(value)} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a repair location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location.id} value={location.id.toString()}>
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          {selectedLocation && (
                            <div className="mt-4 p-3 bg-repair-green-50 rounded-md">
                              <div className="flex items-start">
                                <MapPin className="text-repair-green-600 h-5 w-5 mr-2 mt-0.5" />
                                <div>
                                  <p className="font-medium text-repair-green-700">
                                    {locations.find(l => l.id.toString() === selectedLocation)?.name}
                                  </p>
                                  <p className="text-repair-green-600 text-sm">
                                    {locations.find(l => l.id.toString() === selectedLocation)?.address}
                                  </p>
                                  <a 
                                    href={locations.find(l => l.id.toString() === selectedLocation)?.mapLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-sm text-repair-green-600 hover:text-repair-green-700 underline mt-1 inline-block"
                                  >
                                    View on Google Maps
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timeslots"
                      render={() => (
                        <FormItem>
                          <div className="space-y-3">
                            <FormLabel className="text-lg font-semibold text-repair-green-700">
                              Select Available Timeslots (Choose up to 5)
                            </FormLabel>
                            
                            {Object.keys(filteredDates).length > 0 ? (
                              <div className="space-y-6">
                                {Object.entries(filteredDates).map(([date, slots]) => (
                                  <div key={date} className="space-y-3">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="text-repair-green-600 h-5 w-5" />
                                      <h3 className="font-medium text-repair-green-700">{date}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                      {slots.map((slot) => (
                                        <FormField
                                          key={slot.id}
                                          control={form.control}
                                          name="timeslots"
                                          render={({ field }) => (
                                            <FormItem
                                              className="flex items-center space-x-3 space-y-0 border rounded-md p-3 border-repair-green-200 hover:bg-repair-green-50"
                                            >
                                              <FormControl>
                                                <Checkbox
                                                  checked={field.value?.includes(slot.id)}
                                                  onCheckedChange={(checked) => {
                                                    const updatedValue = checked
                                                      ? [...field.value, slot.id]
                                                      : field.value?.filter((id) => id !== slot.id);
                                                      
                                                    // Limit to 5 selections
                                                    if (updatedValue.length <= 5) {
                                                      field.onChange(updatedValue);
                                                    } else {
                                                      toast({
                                                        title: "Too many selections",
                                                        description: "You can select up to 5 timeslots",
                                                        variant: "destructive",
                                                      });
                                                    }
                                                  }}
                                                />
                                              </FormControl>
                                              <div className="flex items-center">
                                                <Clock className="text-repair-green-500 h-4 w-4 mr-2" />
                                                <span className="text-repair-green-700">
                                                  {slot.date.toLocaleTimeString("en-US", {
                                                    hour: "numeric",
                                                    minute: "numeric",
                                                    hour12: true,
                                                  })}
                                                </span>
                                              </div>
                                            </FormItem>
                                          )}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-12 border rounded-md border-dashed border-repair-green-300">
                                <p className="text-repair-green-600">
                                  {selectedLocation 
                                    ? "No available timeslots for this location."
                                    : "Please select a location to view available timeslots."}
                                </p>
                              </div>
                            )}
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      className="w-full bg-repair-green-500 hover:bg-repair-green-600 text-white mt-6"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Repair Request"}
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

export default RepairRequestTimeslots;
