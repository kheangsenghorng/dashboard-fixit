"use client";

import { ChevronLeft, MoveRight, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function NavigationFooter({
  currentStep,
  setCurrentStep,
  typeId,
  onNext,
  onSubmit,
  totalSteps = 5,
  isLoading = false,
}) {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const canGoNext = currentStep !== 1 || Boolean(typeId);

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    if (!canGoNext) return;

    if (onNext) {
      onNext();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6">
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-slate-900 rounded-[2.5rem] p-4 flex items-center justify-between border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        <button
          type="button"
          disabled={isFirstStep || isLoading}
          onClick={handlePrevious}
          className={`px-8 py-4 font-black text-xs transition-all ${
            isFirstStep || isLoading
              ? "text-slate-700 cursor-not-allowed"
              : "text-white hover:text-indigo-300"
          }`}
        >
          <ChevronLeft size={20} className="inline mr-1" />
          PREVIOUS
        </button>

        {!isLastStep ? (
          <button
            type="button"
            disabled={!canGoNext || isLoading}
            onClick={handleNext}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            NEXT STEP
            <MoveRight size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-green-500 shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Sparkles size={20} />
            )}
            {isLoading ? "SAVING..." : "DEPLOY PROTOCOL"}
          </button>
        )}
      </motion.div>
    </div>
  );
}
