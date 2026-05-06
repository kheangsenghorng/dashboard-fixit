import { ChevronLeft, MoveRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NavigationFooter({
  currentStep,
  setCurrentStep,
  typeId,
  onNext,
  onSubmit,
  totalSteps = 5,
  loading = false,
}) {
  const isLastStep = currentStep === totalSteps;
  const progress = (currentStep / totalSteps) * 100;

  // Internal Skeleton Component for the footer
  const NavSkeleton = ({ className }) => (
    <div className={`animate-pulse bg-white/10 rounded-xl ${className}`} />
  );

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="relative bg-slate-900/95 backdrop-blur-xl rounded-[2rem] p-3 flex items-center justify-between border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
      >
        {/* Progress Bar */}
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-white/5 overflow-hidden rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${progress}%`,
              opacity: loading ? [0.4, 1, 0.4] : 1, // Pulses the progress bar if loading
            }}
            transition={loading ? { repeat: Infinity, duration: 1.5 } : {}}
            className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          />
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            /* --- SKELETON LOADING STATE --- */
            <motion.div
              key="loading-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between w-full px-2"
            >
              <NavSkeleton className="w-20 h-10 ml-2" />
              <div className="hidden sm:flex flex-col items-center gap-1">
                <NavSkeleton className="w-8 h-2" />
                <NavSkeleton className="w-12 h-4" />
              </div>
              <NavSkeleton className="w-36 h-12 bg-indigo-500/20 mr-1" />
            </motion.div>
          ) : (
            /* --- INTERACTIVE STATE --- */
            <motion.div
              key="active-footer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between w-full"
            >
              {/* Previous Button */}
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
                className={`group flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs transition-all ${
                  currentStep === 1
                    ? "text-slate-600 cursor-not-allowed"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <ChevronLeft
                  size={18}
                  className="transition-transform group-hover:-translate-x-1"
                />
                BACK
              </button>

              {/* Step Indicator */}
              <div className="hidden sm:flex flex-col items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Step
                </span>
                <span className="text-white font-bold text-sm leading-none">
                  0{currentStep}{" "}
                  <span className="text-slate-600">/ 0{totalSteps}</span>
                </span>
              </div>

              {/* Action Button */}
              {!isLastStep ? (
                <button
                  type="button"
                  disabled={currentStep === 1 && !typeId}
                  onClick={onNext}
                  className="bg-indigo-600 text-white px-8 py-3.5 rounded-[1.25rem] font-bold text-xs flex items-center gap-2 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/20"
                >
                  CONTINUE
                  <MoveRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubmit}
                  className="bg-emerald-500 text-white px-8 py-3.5 rounded-[1.25rem] font-bold text-xs flex items-center gap-2 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Sparkles size={18} />
                  PUBLISH SERVICE
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Decorative Glow */}
      <div className="absolute -z-10 inset-x-10 bottom-0 h-10 bg-indigo-500/10 blur-[50px] rounded-full" />
    </div>
  );
}
