"use client";

import { motion, AnimatePresence } from "framer-motion";
import { RiAlertLine, RiCloseLine } from "react-icons/ri";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  productName,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <RiAlertLine className="text-3xl text-red-600" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-charcoal-900 text-center mb-2">
                Delete Product?
              </h3>
              <p className="text-taupe-600 text-center mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-charcoal-900">
                  &quot;{productName}&quot;
                </span>
                ? This action cannot be undone.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 border border-cream-300 text-charcoal-900 rounded-xl hover:bg-cream-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
