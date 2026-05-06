import { ChevronLeft, MoveRight, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function NavigationFooter({
  currentStep,
  setCurrentStep,
  typeId,
  onSubmit,
  totalSteps,
  isLoading,
}) {
  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-6">
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="bg-slate-900 rounded-[2.5rem] p-4 flex items-center justify-between border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        <button
          type="button"
          disabled={currentStep === 1}
          onClick={() => setCurrentStep((prev) => prev - 1)}
          className={`px-8 py-4 font-black text-xs transition-all ${
            currentStep === 1 ? "text-slate-700" : "text-white"
          }`}
        >
          <ChevronLeft size={20} className="inline mr-1" /> PREVIOUS
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            disabled={currentStep === 1 && !typeId}
            onClick={() => setCurrentStep((prev) => prev + 1)}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            NEXT STEP <MoveRight size={20} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="bg-green-600 text-white px-10 py-4 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-green-500 shadow-lg shadow-green-500/20"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Sparkles size={20} />
            )}
            DEPLOY PROTOCOL
          </button>
        )}
      </motion.div>
    </div>
  );
}
