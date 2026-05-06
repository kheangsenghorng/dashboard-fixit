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
}) {
  const router = useRouter();
  const steps = [
    { id: 1, name: "Type", icon: <Layers size={16} /> },
    { id: 2, name: "Details", icon: <FileText size={16} /> },
    { id: 3, name: "Checklist", icon: <ListChecks size={16} /> },
    { id: 4, name: "Inventory", icon: <Box size={16} /> },
    { id: 5, name: "Pricing", icon: <Package size={16} /> },
  ];

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
      <motion.button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 font-bold text-sm"
      >
        <ArrowLeft size={18} /> Back
      </motion.button>

      <div className="flex items-center bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
        {steps.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => categoryId && setCurrentStep(step.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
              currentStep === step.id
                ? "bg-slate-900 text-white shadow-lg"
                : "text-slate-400"
            }`}
          >
            {step.icon}{" "}
            <span className="text-xs font-bold uppercase">{step.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
