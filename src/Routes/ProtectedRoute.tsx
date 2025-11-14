import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "react-router-dom";
import { LoginRequiredModal } from "@/components/modals/LoginRequiredModal";
import { LoadingSpinner } from "@/components/common/loading-spinner";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading, setIntendedRoute } = useAuth();
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      setIntendedRoute(location.pathname);
      setShowModal(true);
    }
  }, [user, loading, location.pathname]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return showModal ? (
      <LoginRequiredModal
        onClose={() => {
          setShowModal(false);
          window.location.href = "/login";
        }}
      />
    ) : null;
  }

  return children;
};
