import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Index from "./pages/Index";
import HomeV2 from "./pages/HomeV2";
import Methodology from "./pages/Methodology";
import NotFound from "./pages/NotFound";
import { RequirePayment } from "./components/post-paywall/RequirePayment";

import { Q3Blocker } from "./components/post-paywall/Q3Blocker";
import { Q4WontGiveUp } from "./components/post-paywall/Q4WontGiveUp";
import { LoadingPlaceholder } from "./components/post-paywall/LoadingPlaceholder";
import ReportPage from "./pages/ReportPage";
import AdminPage from "./pages/Admin";
import AdminTranslationsPage from "./pages/AdminTranslations";
import { SessionRecovery } from "./components/SessionRecovery";
import ScrollToTop from "./components/ScrollToTop";
import { SiteFooter } from "./components/SiteFooter";
import { AVAILABLE_LANGS } from "./i18n";

const queryClient = new QueryClient();

// Mid-quiz routes hide the footer to avoid distraction.
const QUIZ_PATH_PREFIXES = ["/post-paywall"];

function HtmlLangSync() {
  const { i18n } = useTranslation();
  useEffect(() => {
    const current = i18n.language ?? "en";
    const exact = AVAILABLE_LANGS.find((l) => l.toLowerCase() === current.toLowerCase());
    const prefix = current.toLowerCase().split("-")[0];
    const prefixMatch = AVAILABLE_LANGS.find((l) => l.toLowerCase().split("-")[0] === prefix);
    const resolved = exact ?? prefixMatch ?? "en";
    document.documentElement.lang = resolved;

    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((n) => n.remove());
    const base = "https://findmyvalues.app" + window.location.pathname;
    [...AVAILABLE_LANGS, "x-default"].forEach((code) => {
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
              <Route path="/home-v2" element={<HomeV2 />} />
              <Route path="/app" element={<Navigate to="/" replace />} />
              <Route path="/waitlist" element={<Navigate to="/" replace />} />
              <Route path="/methodology" element={<Methodology />} />
              <Route path="/post-paywall/q1" element={<Navigate to="/post-paywall/q3" replace />} />
              <Route path="/post-paywall/q2" element={<Navigate to="/post-paywall/q3" replace />} />
              <Route path="/post-paywall/q3" element={<RequirePayment><Q3Blocker /></RequirePayment>} />
              <Route path="/post-paywall/q4" element={<RequirePayment><Q4WontGiveUp /></RequirePayment>} />
              <Route path="/post-paywall/loading" element={<RequirePayment><LoadingPlaceholder /></RequirePayment>} />
              <Route path="/r/:reportId" element={<ReportPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/translations" element={<AdminTranslationsPage />} />
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
