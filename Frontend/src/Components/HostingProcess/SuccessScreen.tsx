import { motion } from "framer-motion";
import { CheckCircle, Home, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SuccessScreenProps {
  listingId?: string;
  onClose: () => void;
}

const SuccessScreen = ({ listingId, onClose }: SuccessScreenProps) => {
  const navigate = useNavigate();

  const handleViewListing = () => {
    if (listingId) {
      navigate(`/room/${listingId}`);
    }
    onClose();
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl text-center"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
          className="mb-6"
        >
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <CheckCircle size={40} className="text-green-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            🎉 Congratulations!
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Your listing has been created successfully!
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Your property is now live and ready to welcome guests.
          </p>
        </motion.div>

        {/* Celebration Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex justify-center space-x-4 text-4xl">
            {["🏠", "✨", "🎊"].map((emoji, index) => (
              <motion.span
                key={index}
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: index * 0.2 
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-3"
        >
          {listingId && (
            <button
              onClick={handleViewListing}
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Eye size={18} />
              <span>View Your Listing</span>
            </button>
          )}
          
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Home size={18} />
            <span>Go to Dashboard</span>
          </button>
          
          <button
            onClick={onClose}
            className="w-full text-gray-600 py-2 px-6 rounded-lg font-medium hover:text-gray-800 transition-colors duration-200"
          >
            Close
          </button>
        </motion.div>

        {/* Floating Particles Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                y: 100, 
                x: Math.random() * 400 - 200 
              }}
              animate={{ 
                opacity: [0, 1, 0], 
                y: -100, 
                x: Math.random() * 400 - 200 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: i * 0.5,
                ease: "easeOut"
              }}
              className="absolute bottom-0 w-2 h-2 bg-green-400 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessScreen;