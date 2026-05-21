"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  markdownContent: string;
}

export default function ProjectModal({ isOpen, onClose, title, markdownContent }: ProjectModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-full bg-[#111111] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#111111] shrink-0">
              <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Markdown Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
              <div className="prose prose-invert prose-purple max-w-none prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto prose-a:text-purple-400 hover:prose-a:text-purple-300">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownContent || "*No README available for this project.*"}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
