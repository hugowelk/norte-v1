import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
import { SiteFooter } from "./components/SiteFooter";

const queryClient = new QueryClient();

// Mid-quiz routes hide the footer to avoid distraction.
const QUIZ_PATH_PREFIXES = ["/post-paywall"];

function HtmlLangSync() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = i18n.language?.startsWith("pt") ? "pt-BR" : "en";
    document.documentElement.lang = lang;
    // Replace any existing alternate links
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((n) => n.remove());
    const base = "https://findmyvalues.app" + window.location.pathname;
    (["en", "pt-BR", "x-default"] as const).forEach((code) => {
      const link = document.createElement("link");
      link.setAttribute("rel", "alternate");
      link.setAttribute("hreflang", code);
      const href = code === "x-default" ? base : `${base}?lang=${code}`;
      link.setAttribute("href", href);
      document.head.appendChild(link);
    });
  }, [i18n.language]);
  return null;
}

function FooterGate() {
  const location = useLocation();
  const hide = QUIZ_PATH_PREFIXES.some((p) => location.pathname.startsWith(p));
  if (hide) return null;
  return <SiteFooter />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <SessionRecovery />
        <HtmlLangSync />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
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
          </div>
          <FooterGate />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
