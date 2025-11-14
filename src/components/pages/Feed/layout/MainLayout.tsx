import LatestCompetitionPopup from "@/components/Competitions/CompetitonPopup";
import { Container } from "@/components/layout/container";
import BottomNav from "@/components/sections/BottomNav";
import Header from "@/components/sections/Header";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function MainLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header handleLogout={handleLogout} />
      <div className="pb-24">
        <Container className="">
          <LatestCompetitionPopup
            isVisible={showPopup}
            onDismiss={() => setShowPopup(false)}
          />
          <Outlet />
        </Container>
      </div>
      <BottomNav />
    </div>
  );
}
