"use client";

import {
  Layers,
  FileText,
  ListChecks,
  Box,
  Package,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function StepIndicator({
  currentStep,
  setCurrentStep,
  categoryId,
  typeId,
}) {
  const router = useRouter();

  const steps = [
    { id: 1, name: "Type", icon: <Layers size={16} /> },
    { id: 2, name: "Details", icon: <FileText size={16} /> },
    { id: 3, name: "Checklist", icon: <ListChecks size={16} /> },
    { id: 4, name: "Inventory", icon: <Box size={16} /> },
    { id: 5, name: "Pricing", icon: <Package size={16} /> },
  ];

  const canGoToStep = (stepId) => {
    if (stepId === 1) return true;

    // Need category and type before going to step 2+
    return Boolean(categoryId && typeId);
  };

  const handleStepClick = (stepId) => {
    if (!canGoToStep(stepId)) return;
    setCurrentStep(stepId);
  };

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm transition-colors"
      >
        <ArrowLeft size={18} />
        Back
      </motion.button>

      <div className="flex items-center bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isDisabled = !canGoToStep(step.id);

          return (
            <button
              key={step.id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleStepClick(step.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg"
                  : isDisabled
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              {step.icon}

              <span className="text-xs font-bold uppercase">{step.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
