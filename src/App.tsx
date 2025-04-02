
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import RepairRequests from "./pages/RepairRequests";
import NewRepairRequest from "./pages/NewRepairRequest";
import RepairRequestTimeslots from "./pages/RepairRequestTimeslots";
import RepairRequestConfirmation from "./pages/RepairRequestConfirmation";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/repair-requests" element={<RepairRequests />} />
          <Route path="/new-repair-request" element={<NewRepairRequest />} />
          <Route path="/repair-request-timeslots" element={<RepairRequestTimeslots />} />
          <Route path="/repair-request-confirmation" element={<RepairRequestConfirmation />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
