import React, { useState } from "react";
import {
  PenTool,
  Globe,
  Book,
  ExternalLink,
  X,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import { motion, AnimatePresence } from "framer-motion";
import { submitEbook } from "@/lib/ebookApi"; 
import { useNavigate } from "react-router-dom";

const PublishEbook: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contact: "",
    socialMedia: "",
    ebookTitle: "",
    ebookDescription: "",
    upiId: "",
    genre: "",
    ebookFile: null as File | null,
    coverImage: null as File | null,
    price: "",
    originalWork: false,
    permission: false,
    message: "",
    pages: 20,
  });

  console.log(formData);

  useDocumentTitle("Publish Ebook | Writers Ecosystem");

  const handleSubmitEbook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!formData.ebookFile || !formData.coverImage) {
      alert("Please upload both ebook file and cover image");
      setIsProcessing(false);
      return;
    }

    try {
      await submitEbook(
        {
          fullName: formData.fullName,
          email: formData.email,
          contact: formData.contact,
          socialMedia: formData.socialMedia,
          ebookTitle: formData.ebookTitle,
          ebookDescription: formData.ebookDescription,
          upiId: formData.upiId,
          genre: formData.genre,
          price: formData.price,
          originalWork: formData.originalWork,
          permission: formData.permission,
          message: formData.message,
          pages: formData.pages,
        },
        {
          ebookFile: formData.ebookFile,
          coverImage: formData.coverImage,
        }
      );

      setIsProcessing(false);
      setIsSubmitted(true);
      setIsModalOpen(false);

      setTimeout(() => {
        setFormData({
          fullName: "",
          email: "",
          contact: "",
          socialMedia: "",
          ebookTitle: "",
          ebookDescription: "",
          upiId: "",
          genre: "",
          ebookFile: null,
          coverImage: null,
          price: "",
          originalWork: false,
          permission: false,
          message: "",
          pages: 20,
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      alert("Submission failed. Please try again.");
      console.error(error);
      setIsProcessing(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setFormData((prev) => ({
        ...prev,
        [name]: files ? files[0] : null,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const benefits = [
    {
      icon: Globe,
      title: "Global Reach",
      description:
        "Share your stories with readers worldwide through our international platform.",
    },
    {
      icon: Book,
      title: "Author Support",
      description:
        "Get dedicated support with marketing guidance and author resources.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors duration-200 mb-4 sm:mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-base sm:text-lg font-medium">Back</span>
          </button>

          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full text-xs sm:text-sm font-medium text-purple-300 border border-purple-500/30 mb-4 sm:mb-6">
              <PenTool className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>For Authors</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-3 sm:mb-5 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent leading-snug sm:leading-tight">
              Become a Published Author
            </h1>

            <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed sm:leading-loose px-2 sm:px-4">
              Join our community of talented writers and share your stories with
              readers around the world.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-slate-900/70 backdrop-blur-xl border border-slate-800/50 p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-5 text-center">
                  Ready to Publish?
                </h2>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="bg-slate-800/40 rounded-lg p-3 sm:p-4 border border-slate-700/50">
                    <h3 className="text-base sm:text-lg font-semibold text-purple-300 mb-2 sm:mb-3">
                      Submission Process
                    </h3>
                    <ul className="space-y-1.5 text-slate-300 text-xs sm:text-sm">
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                        <span>Complete manuscript in PDF or DOCX format</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                        <span>
                          High-resolution cover image (1600x2400px minimum)
                        </span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0"></div>
                        <span>
                          80-20 revenue share: You keep 80% of sales,
                          WritersEcosystem keeps 20%
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 sm:px-8 sm:py-4 font-medium text-white text-base sm:text-lg transition-all duration-300 hover:from-purple-500 hover:to-blue-500 hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 hover:scale-105"
                  >
                    <div className="relative flex items-center justify-center space-x-2">
                      <span>Submit Your Ebook</span>
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </button>
                </div>

                <div className="mt-4 sm:mt-6 text-center">
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Please review our{" "}
                    <a
                      href="#"
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-200 underline underline-offset-2"
                    >
                      submission guidelines
                    </a>{" "}
                    before submitting.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-lg sm:rounded-xl bg-slate-900/40 backdrop-blur-md border border-slate-800/60 p-4 sm:p-6 transition-all duration-300 hover:bg-slate-900/60 hover:border-purple-500/40 hover:shadow-lg sm:hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1"
                >
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3 group-hover:text-purple-300 transition-colors duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <footer className="text-center py-6 sm:py-10 px-4 border-t border-slate-800/50">
          <div className="max-w-4xl mx-auto">
            <p className="text-slate-500 text-xs sm:text-sm">
              Join our community of storytellers and start your publishing
              journey today.
            </p>
          </div>
        </footer>
      </div>

      {/* Ebook Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 rounded-xl border border-slate-800 shadow-xl"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Submit Your Ebook
                </h2>

                <form onSubmit={handleSubmitEbook} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Full name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Contact/Whatsapp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Instagram/LinkedIn
                    </label>
                    <input
                      type="text"
                      name="socialMedia"
                      value={formData.socialMedia}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      E-book title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ebookTitle"
                      value={formData.ebookTitle}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Brief description of your eBook <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="ebookDescription"
                      value={formData.ebookDescription}
                      onChange={handleInputChange}
                      rows={3}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    ></textarea>
                  </div>

              
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Book Category/Genre{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="genre"
                      value={formData.genre}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Number of Pages <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="pages"
                      value={formData.pages}
                      onChange={handleInputChange}
                      min="1"
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Upload your eBook (PDF only){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="ebookFile"
                      onChange={handleInputChange}
                      accept=".pdf"
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Upload your eBook cover (JPG/PNG){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      name="coverImage"
                      onChange={handleInputChange}
                      accept=".jpg,.jpeg,.png"
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      At what price you want to sell your eBook{" "}(in INR){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      placeholder="100, 250, 500 etc."
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Your UPI ID for royalty payments  <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        name="originalWork"
                        checked={formData.originalWork}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-slate-300">
                        Do you confirm this as your original work not AI
                        generated or plagiarized{" "}
                        <span className="text-red-500">*</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        name="permission"
                        checked={formData.permission}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-purple-600 focus:ring-purple-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label className="font-medium text-slate-300">
                        Grant permission to publish and promote your eBook{" "}
                        <span className="text-red-500">*</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Any additional message or instruction for our team
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    ></textarea>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all duration-300"
                    >
                      Submit Your Ebook
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                Submission Successful!
              </h3>
              <p className="text-slate-400 mb-6">
                Your ebook has been submitted successfully. We'll review it and
                get back to you soon.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all duration-300"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading Popup */}
      <AnimatePresence>
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-white text-lg font-medium">
                Processing your submission...
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublishEbook;
