import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";

import Methodology from "./pages/Methodology";
import NotFound from "./pages/NotFound";
import { RequirePayment } from "./components/post-paywall/RequirePayment";
import { Q2Chapter } from "./components/post-paywall/Q2Chapter";
import { Q3Blocker } from "./components/post-paywall/Q3Blocker";
import { Q4WontGiveUp } from "./components/post-paywall/Q4WontGiveUp";
import { LoadingPlaceholder } from "./components/post-paywall/LoadingPlaceholder";
import ReportPage from "./pages/ReportPage";
import AdminPage from "./pages/Admin";
import { SessionRecovery } from "./components/SessionRecovery";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <SessionRecovery />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/app" element={<Navigate to="/" replace />} />
          <Route path="/waitlist" element={<Navigate to="/" replace />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/post-paywall/q1" element={<Navigate to="/post-paywall/q2" replace />} />
          <Route path="/post-paywall/q2" element={<RequirePayment><Q2Chapter /></RequirePayment>} />
          <Route path="/post-paywall/q3" element={<RequirePayment><Q3Blocker /></RequirePayment>} />
          <Route path="/post-paywall/q4" element={<RequirePayment><Q4WontGiveUp /></RequirePayment>} />
          <Route path="/post-paywall/loading" element={<RequirePayment><LoadingPlaceholder /></RequirePayment>} />
          <Route path="/r/:reportId" element={<ReportPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
