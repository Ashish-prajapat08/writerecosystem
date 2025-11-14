import { BrowserRouter, useLocation } from "react-router-dom";
import { SmoothScroll } from "@/components/ui/smooth-scroll";
import { ErrorBoundary } from "@/components/common/error-boundary";
import AppRoutes from "./Routes/router";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { NotificationProvider } from "./context/NotificationsContext";
import { trackPageView } from "./components/utils/analytics";
import { useEffect } from "react";
import { ScrollProvider } from "./context/ScrollContext";

function TrackPageViews() {
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null; // This is just for tracking
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollProvider>
        <ErrorBoundary>
          <SmoothScroll>
            <AuthProvider>
              <NotificationProvider>
                <Toaster />
                <TrackPageViews />
                <main className="min-h-screen bg-black text-white">
                  <AppRoutes />
                </main>
              </NotificationProvider>
            </AuthProvider>
          </SmoothScroll>
        </ErrorBoundary>
      </ScrollProvider>
    </BrowserRouter>
  );
}
