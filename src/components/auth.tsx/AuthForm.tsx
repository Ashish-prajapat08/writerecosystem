import React, { useState } from "react";
import { Eye, EyeOff, UserPlus, LogIn, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

interface AuthFormProps {
  mode: "login" | "signup" | "forgot";
  onSubmit: (data: { email: string; password: string; name?: string }) => Promise<void>;
  onForgotPassword: (email: string) => Promise<void>;
  onToggleMode: (mode: "login" | "signup" | "forgot") => void;
  isLoading: boolean;
}

const AuthForm = ({
  mode,
  onSubmit,
  onForgotPassword,
  onToggleMode,
  isLoading,
}: AuthFormProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { signInWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "forgot") {
      await onForgotPassword(formData.email);
      return;
    }
    await onSubmit({
      email: formData.email,
      password: formData.password,
      ...(mode === "signup" && { name: formData.name }),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {mode === "forgot" && (
        <button
          onClick={() => onToggleMode("login")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to login</span>
        </button>
      )}

      {mode !== "forgot" && (
        <>
          <div className="mb-6">
            <button
              className="w-full flex items-center justify-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-all duration-300 text-gray-700 shadow-sm"
              onClick={async () => {
                try {
                  await signInWithGoogle();
                  toast({
                    title: "Redirecting...",
                    description: "Signing in with Google",
                  });
                } catch (error: any) {
                  toast({
                    title: "Google sign-in failed",
                    description: error.message || "Something went wrong",
                    variant: "destructive",
                  });
                }
              }}
            > 
              <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fillOpacity=".54"
            />
            <path
              fill="#4285F4"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#34A853"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#FBBC05"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
            <path fill="#EA4335" d="M1 1h22v22H1z" fillOpacity="0" />
          </svg>
              <span>
                {mode === "login" ? "Login with Google" : "Sign up with Google"}
              </span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>
        </>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        {mode === "signup" && (
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name <span className="text-blue-500">*</span>
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email <span className="text-blue-500">*</span>
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {mode !== "forgot" && (
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password <span className="text-blue-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                minLength={mode === "signup" ? 6 : 1}
                className="bg-gray-50 border-gray-200 placeholder:text-gray-400 text-gray-800 w-full pr-10 focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                {isPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {mode === "signup" && (
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters
              </p>
            )}
          </div>
        )}

        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="pt-2"
        >
          <Button
            className={cn(
              "w-full bg-gradient-to-r relative overflow-hidden from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-2 rounded-lg transition-all duration-300",
              isHovered ? "shadow-lg shadow-blue-200" : "",
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            )}
            disabled={isLoading}
          >
            <span className="flex items-center justify-center">
              {isLoading ? (
                "Processing..."
              ) : mode === "forgot" ? (
                "Send Reset Link"
              ) : mode === "login" ? (
                <>
                  Sign in <LogIn className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Sign up <UserPlus className="ml-2 h-4 w-4" />
                </>
              )}
            </span>
            {isHovered && !isLoading && (
              <motion.span
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ filter: "blur(8px)" }}
              />
            )}
          </Button>
        </motion.div>

        {mode !== "forgot" && (
          <div className="text-center text-sm text-gray-600">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => onToggleMode("signup")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => onToggleMode("login")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        )}

        {mode === "login" && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => onToggleMode("forgot")}
              className="text-blue-600 hover:text-blue-700 text-sm transition-colors"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
};

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default AuthForm;