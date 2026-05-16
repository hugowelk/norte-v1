import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { RequirePayment } from "./components/post-paywall/RequirePayment";
import { Q1Name } from "./components/post-paywall/Q1Name";
import { Q2Chapter } from "./components/post-paywall/Q2Chapter";
import { Q3Blocker } from "./components/post-paywall/Q3Blocker";
import { Q4WontGiveUp } from "./components/post-paywall/Q4WontGiveUp";
import { LoadingPlaceholder } from "./components/post-paywall/LoadingPlaceholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/post-paywall/q1" element={<RequirePayment><Q1Name /></RequirePayment>} />
          <Route path="/post-paywall/q2" element={<RequirePayment><Q2Chapter /></RequirePayment>} />
          <Route path="/post-paywall/q3" element={<RequirePayment><Q3Blocker /></RequirePayment>} />
          <Route path="/post-paywall/q4" element={<RequirePayment><Q4WontGiveUp /></RequirePayment>} />
          <Route path="/post-paywall/loading" element={<RequirePayment><LoadingPlaceholder /></RequirePayment>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
