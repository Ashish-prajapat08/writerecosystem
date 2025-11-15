// components/modals/LoginRequiredModal.tsx
import { motion } from "framer-motion";

export const LoginRequiredModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gray-900 p-6 rounded-xl border border-gray-700 w-full max-w-sm text-center space-y-4"
    >
      <h2 className="text-xl font-semibold text-white">Login Required</h2>
      <p className="text-gray-400">You need to log in to access this page.</p>
      <button
        onClick={onClose}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Okay
      </button>
    </motion.div>
  </div> 
); 
