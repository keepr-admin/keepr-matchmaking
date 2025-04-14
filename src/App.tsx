
import Index from "@/pages/Index";
import HowItWorks from "@/pages/HowItWorks";
import Contact from "@/pages/Contact";
import NewRepairRequest from "@/pages/NewRepairRequest";
import RepairRequestConfirmation from "@/pages/RepairRequestConfirmation";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import RepairRequests from "@/pages/RepairRequests";
import RepairRequestTimeslots from "@/pages/RepairRequestTimeslots";
import RepairerTimeslots from "@/pages/RepairerTimeslots";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/how-it-works",
    element: <HowItWorks />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/repair-requests",
    element: <RepairRequests />,
  },
  {
    path: "/:repairId",
    element: <RepairRequests />, // Show repair details
  },
  {
    path: "/new-repair-request",
    element: <NewRepairRequest />,
  },
  {
    path: "/repair-request-timeslots",
    element: <RepairRequestTimeslots />,
  },
  {
    path: "/repair-request-confirmation",
    element: <RepairRequestConfirmation />,
  },
  {
    path: "/repairer/timeslots/:repairId",
    element: <RepairerTimeslots />,
  },
  {
    path: "/dashboard/*",
    element: <Dashboard />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
