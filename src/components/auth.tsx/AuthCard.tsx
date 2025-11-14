import { useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import DotMap from "./DotMap";
import AuthForm from "./AuthForm";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

type AuthMode = "login" | "signup" | "forgot";

interface AuthCardProps {
  onNavigateHome?: () => void;
  initialMode?: AuthMode;
}

const AuthCard = ({ onNavigateHome, initialMode = "login" }: AuthCardProps) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp,resetPassword } = useAuth();
  const navigate = useNavigate();
  
  const toggleMode = (newMode: AuthMode) => {
    setMode(newMode);
  };
  
  const handleSubmit = async (data: { email: string; password: string; name?: string }) => {
  setIsLoading(true);
  try {
    if (mode === "login") {
      const isSuccess = await signIn(data.email, data.password);
      if (isSuccess) {
        navigate("/feed"); 
      }
    } else if (mode === "signup") {
      if (!data.name) throw new Error("Full name is required");
      await signUp(data.email, data.password, data.name);
      navigate("/feed"); 
    }
  } catch (error: any) {
    toast({
      title: mode === "login" ? "Login failed" : "Signup failed",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  const handleForgotPassword = async (email: string) => {
  setIsLoading(true);
  try {
    const { exists } = await resetPassword(email);
    
    toast({
      title: exists ? "Email sent" : "Account not found",
      description: exists 
        ? "Check your email for a password reset link"
        : "No account exists with this email address",
      variant: exists ? "default" : "destructive",
    });

    if (exists) setMode("login");
  } catch (error: any) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex w-full h-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl overflow-hidden rounded-2xl flex bg-white shadow-xl"
      >
        {/* Left side - Map */}
        <div className="hidden md:block w-1/2 h-[600px] relative overflow-hidden border-r border-gray-100">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100">
            <DotMap />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mb-6"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-200">
                  <ArrowRight className="text-white h-6 w-6" />
                </div>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="text-3xl font-bold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                Writers Ecosystem
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-sm text-center text-gray-600 max-w-xs"
              >
                {mode === "login" 
                  ? "Sign in to access your writing dashboard" 
                  : mode === "signup"
                  ? "Join our community of writers and thinkers"
                  : "Reset your password"}
              </motion.p>
            </div>
          </div>
        </div>
        
        {/* Right side - Auth Form */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white">
          {onNavigateHome && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateHome}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Feed</span>
            </motion.button>
          )}
          
          <h1 className="text-2xl md:text-3xl font-bold mb-1 text-gray-800">
            {mode === "login" 
              ? "Welcome back" 
              : mode === "signup"
              ? "Create your account"
              : "Reset Password"}
          </h1>
          <p className="text-gray-500 mb-8">
            {mode === "login" 
              ? "Sign in to your account" 
              : mode === "signup"
              ? "Get started with your writing journey"
              : "Enter your email to receive a reset link"}
          </p>
          
          <AuthForm 
            mode={mode}
            onSubmit={handleSubmit}
            onForgotPassword={handleForgotPassword}
            onToggleMode={toggleMode}
            isLoading={isLoading}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default AuthCard;