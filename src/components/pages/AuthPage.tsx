import { useNavigate } from "react-router-dom";
import AuthCard from "../auth.tsx/AuthCard";

interface AuthPageProps {
  onNavigateHome?: () => void;
  initialMode?: "login" | "signup";
}

const AuthPage = ({ onNavigateHome, initialMode = "login" }: AuthPageProps) => {
  const navigate = useNavigate();
  const handleNavigate = onNavigateHome || (() => navigate('/feed'));
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <AuthCard onNavigateHome={handleNavigate} initialMode={initialMode} />
    </div>
  );
};

export default AuthPage;