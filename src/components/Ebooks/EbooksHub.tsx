import React, { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  Star,
  User,
  ExternalLink,
  X,
  BookOpen,
  Clock,
  FileText,
  PenTool,
  CheckCircle,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Update with your actual auth context path
import { useAuth } from "@/context/AuthContext";

// Helper functions for body scroll management
const disableBodyScroll = () => {
  document.body.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
};

const enableBodyScroll = () => {
  document.body.style.overflow = "";
  document.body.style.position = "";
  document.body.style.width = "";
};

// Interface for Ebook data
interface EbookData {
  id: string;
  title: string;
  author: string;
  author_email: string;
  cover_url: string;
  rating: number;
  price: number;
  download_url: string;
  genre: string;
  description: string;
  pages: number;
  read_time: string;
  chapters: string[];
  publish_date: string;
  language: string;
}

// Props for EbookModal component
interface EbookModalProps {
  ebook: EbookData;
  isOpen: boolean;
  onClose: () => void;
  showPaymentForm?: boolean;
}

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Trigger Make.com webhook after successful payment
const triggerMakeWebhook = async (
  paymentData: any,
  ebook: EbookData,
  userEmail: string,
  userName: string
) => {
  try {
    const response = await fetch("https://hook.eu2.make.com/4ssk5i5ndplshh9vrh6anea34krhpfpl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        razorpay_payment_id: paymentData.razorpay_payment_id,
        razorpay_order_id: paymentData.razorpay_order_id,
        razorpay_signature: paymentData.razorpay_signature,
        ebook_id: ebook.id,
        ebook_title: ebook.title,
        ebook_author: ebook.author,
        ebook_author_email: ebook.author_email,
        customer_email: userEmail,
        customer_name: userName,
        purchase_date: new Date().toISOString(),
        price: ebook.price,
        download_link: ebook.download_url,
      }),
    });

    if (response.ok) {
      console.log("Webhook triggered successfully");
    }
  } catch (error) {
    console.error("Failed to trigger webhook:", error);
  }
};

interface NormalizedUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: string;
}

export function normalizeUser(user: any): NormalizedUser {
  if (!user) {
    return { id: "", email: "", name: "Guest", provider: "unknown" };
  }

  const provider = user?.app_metadata?.provider ?? "unknown";

  const email = user.email ?? user.user_metadata?.email ?? "";

  let name = "";
  if (provider === "google") {
    // Prefer full_name, then name, fallback to email
    name =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      email.split("@")[0];
  } else if (provider === "email") {
    // For email logins, no name is stored
    name = email.split("@")[0];
  } else {
    // fallback for other providers
    name = user.user_metadata?.name || email.split("@")[0];
  }

  const avatar =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.picture ||
    undefined;

  return {
    id: user.id,
    email,
    name,
    avatar,
    provider,
  };
}


const EbookModal: React.FC<EbookModalProps> = React.memo(
  ({ ebook, isOpen, onClose }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    
    const { user } = useAuth();
    const navigate = useNavigate();

    // Auto-populate user data if authenticated
    const { name: userName, email: userEmail } = normalizeUser(user);
    const handleRazorpayPayment = async () => {
      // Check if user is authenticated
      if (!user) {
        setShowLoginPrompt(true);
        return;
      }

      setIsProcessing(true);

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
        amount: Math.round(ebook.price * 100),
        currency: "INR",
        name: "Writers Ecosystem",
        description: `Purchase of ${ebook.title}`,
        handler: async function (response: any) {
          // Payment successful
          setIsProcessing(false);
          setIsSubmitted(true);

          // Trigger Make.com webhook
          await triggerMakeWebhook(response, ebook, userEmail, userName);

          // Close modal after 3 seconds
          setTimeout(() => {
            setIsSubmitted(false);
            onClose();
          }, 3000);
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#6366F1",
        },
        modal: {
          ondismiss: function () {
            // User closed the modal
            setIsProcessing(false);
            navigate("/payment-failed?reason=cancelled");
          },
        },
      };

      try {
        const rzp = new (window as any).Razorpay(options);

        rzp.on("payment.failed", function (response: any) {
          // Payment failed
          setIsProcessing(false);
          navigate(
            `/payment-failed?reason=failed&error=${response.error.description}`
          );
        });

        rzp.open();
      } catch (error) {
        console.error("Error initializing Razorpay:", error);
        setIsProcessing(false);
        alert("Failed to initialize payment. Please try again.");
      }
    };

    const handleLoginRedirect = () => {
      onClose();
      navigate("/login");
    };

    // Close modal on Escape key press
    useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
      <>
        {/* Show ebook details modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 pt-4 pb-16 sm:pt-8 sm:pb-20 overscroll-none">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="relative w-full max-w-4xl max-h-[calc(70vh-2rem)] sm:max-h-[calc(83vh-4rem)] overflow-y-auto bg-slate-900/95 backdrop-blur-xl border border-slate-800/60 rounded-xl sm:rounded-2xl shadow-2xl">
            {/* Close Button */}
            <div className="sticky top-0 z-20 flex justify-end p-3 sm:p-4 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/30 rounded-t-xl sm:rounded-t-2xl">
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/80 hover:bg-slate-700/80 transition-colors duration-200"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
              </button>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
                {/* Left Column */}
                <div className="md:col-span-1">
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600/20 rounded-full text-sm font-medium text-purple-300 border border-purple-500/30">
                        {ebook.genre}
                      </div>
                    </div>

                    <div className="relative mb-4 mx-auto w-36 h-48 sm:w-48 sm:h-64 rounded-xl overflow-hidden shadow-2xl">
                      <img
                        src={ebook.cover_url}
                        alt={`Cover of ${ebook.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex items-center justify-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 sm:w-5 sm:h-5 ${
                            i < Math.floor(ebook.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-slate-600"
                          }`}
                        />
                      ))}
                      <span className="text-slate-400 text-base sm:text-lg ml-2 font-medium">
                        {ebook.rating}
                      </span>
                    </div>

                    <div className="text-center mb-4">
                      <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-3">
                        ₹{ebook.price.toFixed(2)}
                      </div>

                      <button
                        onClick={handleRazorpayPayment}
                        disabled={isProcessing}
                        className="w-full group/btn relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="relative flex items-center justify-center space-x-2">
                          {isProcessing ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                          <span className="text-sm sm:text-base">
                            {isProcessing ? "Processing..." : "Buy Now"}
                          </span>
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                        </div>
                      </button>
                    </div>

                    <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                      <div className="flex items-center space-x-2 text-slate-400">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{ebook.pages} pages</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{ebook.read_time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-400">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{ebook.language}</span>
                      </div>
                      <div className="text-slate-400">
                        <span>Published: {ebook.publish_date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="md:col-span-2 space-y-4 sm:space-y-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                      {ebook.title}
                    </h2>
                    <div className="flex items-center space-x-2 text-slate-400 text-base sm:text-lg">
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-medium">by {ebook.author}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-purple-300 mb-2 sm:mb-3">
                      About This Book
                    </h3>
                    <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
                      {ebook.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-purple-300 mb-3 sm:mb-4">
                      Table of Contents
                    </h3>
                    <div className="space-y-2">
                      {ebook.chapters.map((chapter, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800/60 transition-colors duration-200"
                        >
                          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-purple-600/20 to-blue-600/20 flex items-center justify-center text-purple-300 text-xs sm:text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                            {chapter}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Popup */}
        <AnimatePresence>
          {isSubmitted && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-8 max-w-md text-center"
              >
                <div className="mb-6">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                    }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Payment Successful!
                </h3>
                <p className="text-slate-400 mb-6">
                  Thank you for your purchase. Your ebook will be delivered to
                  your email shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    onClose();
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all duration-300"
                >
                  Close
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Login Prompt Popup */}
        <AnimatePresence>
          {showLoginPrompt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative bg-slate-900 rounded-xl border border-slate-800 shadow-xl p-8 max-w-md text-center"
              >
                <div className="mb-6">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                    }}
                  >
                    <User className="w-16 h-16 text-purple-500 mx-auto" />
                  </motion.div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Login Required
                </h3>
                <p className="text-slate-400 mb-6">
                  Please login to continue with your purchase.
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLoginRedirect}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all duration-300"
                  >
                    Login
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Loading  */}
        <AnimatePresence>
          {isProcessing && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-white text-lg font-medium">
                  Processing your payment...
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }
);

// Props for EbookCard component
interface EbookCardProps {
  ebook: EbookData;
  onCardClick: (showPaymentForm: boolean) => void;
}

const EbookCard: React.FC<EbookCardProps> = React.memo(
  ({ ebook, onCardClick }) => {
    const handleCardClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        // Open details view
        onCardClick(false);
      },
      [onCardClick]
    );

    return (
      <div
        className="group relative cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onCardClick(false)}
        aria-label={`View details for ${ebook.title}`}
      >
        <div className="relative overflow-hidden rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-3 sm:p-4 transition-all duration-300 hover:bg-slate-900/60 hover:border-purple-500/40 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1">
          <div className="flex justify-end mb-2">
            <div className="px-2 py-0.5 bg-gradient-to-r from-purple-600/15 to-blue-600/15 rounded-md text-xs font-medium text-purple-300 border border-purple-500/20">
              {ebook.genre}
            </div>
          </div>

          <div className="relative mb-3 mx-auto w-16 h-24 sm:w-20 sm:h-28 rounded-md overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
            <img
              src={ebook.cover_url}
              alt={`Cover of ${ebook.title}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="text-center space-y-1.5 sm:space-y-2">
            <h3 className="font-semibold text-xs sm:text-sm text-slate-100 group-hover:text-purple-300 transition-colors duration-300 line-clamp-2 leading-tight">
              {ebook.title}
            </h3>

            <div className="flex items-center justify-center space-x-1 text-slate-500">
              <User className="w-3 h-3" />
              <span className="text-xs">{ebook.author}</span>
            </div>

            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                    i < Math.floor(ebook.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-slate-700"
                  }`}
                />
              ))}
              <span className="text-slate-500 text-xs ml-1">
                {ebook.rating}
              </span>
            </div>

            <div className="text-md sm:text-xl font-bold text-purple-400 mb-3">
              ₹{ebook.price.toFixed(2)}
            </div>

            <button
              onClick={handleCardClick}
              className="w-full mt-2 sm:mt-3 group/btn relative overflow-hidden rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-2 py-1.5 sm:px-3 sm:py-2 font-medium text-white text-xs sm:text-sm transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:shadow-md hover:shadow-purple-500/25"
              aria-label={`View details for ${ebook.title}`}
            >
              <div className="relative flex items-center justify-center space-x-1">
                <ShoppingCart className="w-3 h-3" />
                <span>View Details</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

const EbookHub: React.FC = () => {
  const [selectedEbook, setSelectedEbook] = useState<EbookData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ebooks, setEbooks] = useState<EbookData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useDocumentTitle("EbookHub | Writers Ecosystem");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("ebooks")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEbooks(data || []);
      } catch (err) {
        setError("Failed to load ebooks. Please try again later.");
        console.error("Error fetching ebooks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  console.log("Fetched Ebooks:", ebooks); // --- IGNORE ---

  const handleCardClick = useCallback((ebook: EbookData) => {
    setSelectedEbook(ebook);
    setIsModalOpen(true);
    disableBodyScroll();
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEbook(null);
    enableBodyScroll();
  }, []);

  const navigate = useNavigate();

  const handlePublishClick = useCallback(() => {
    navigate("/publish-ebook");
  }, []);

  useEffect(() => {
    return () => {
      if (isModalOpen) {
        enableBodyScroll();
      }
    };
  }, [isModalOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading ebooks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-slate-950 ${
        !isMobile
          ? "bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950"
          : ""
      }`}
    >
      {/* Background Gradients */}
      {!isMobile && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">
        {/* Call-to-Action Section */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 mb-4 sm:mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-base sm:text-lg font-medium">Back</span>
          </button>
          <div className="relative overflow-hidden rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-800/50 p-8 sm:p-10 lg:p-12 shadow-2xl">
            {/* Background Decorative Elements */}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full text-sm font-medium text-purple-300 border border-purple-500/30 mb-6">
                <PenTool className="w-4 h-4" />
                <span>For Authors</span>
              </div>

              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Have an ebook to publish?
              </h2>

              {/* Description */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 sm:mb-10 max-w-2xl mx-auto">
                Join our community of authors and share your stories worldwide.
                Get published, earn royalties, and grow your audience.
              </p>

              {/* CTA Button */}
              <button
                onClick={handlePublishClick}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-4 font-medium text-white text-lg transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/30 hover:scale-105 touch-manipulation"
              >
                <div className="relative flex items-center justify-center space-x-2">
                  <span>Publish Your Ebook</span>
                  <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </button>
            </div>
          </div>
        </div>
        {/* Header */}
        <div className="backdrop-blur-xl">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Ebook Library
              </h1>
              <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
                Support your favorite authors and discover original works from
                our vibrant writing community
              </p>
            </div>
          </div>
        </div>

        {/* Ebooks Grid */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {ebooks.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              No ebooks available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {ebooks.map((ebook) => (
                <EbookCard
                  key={ebook.id}
                  ebook={ebook}
                  onCardClick={() => handleCardClick(ebook)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center py-6 sm:py-8 px-4 border-t border-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-500 text-xs sm:text-sm">
              Empowering writers, inspiring readers. Join our community of
              storytellers.
            </p>
          </div>
        </footer>
      </div>

      {/* Modal */}
      {selectedEbook && (
        <EbookModal
          ebook={selectedEbook}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default EbookHub;
