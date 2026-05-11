import {
  Layers,
  FileText,
  ListChecks,
  Box,
  Package,
  ArrowLeft,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function StepIndicator({
  currentStep,
  setCurrentStep,
  categoryId,
  typeId,
  serviceId,
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
    // Step 1 is always open
    if (stepId === 1) return true;

    // Step 2 needs category and type selected
    if (stepId === 2) return categoryId && typeId;

    // Step 3, 4, 5 need service created first
    return Boolean(serviceId);
  };

  const handleStepClick = (stepId) => {
    if (canGoToStep(stepId)) {
      setCurrentStep(stepId);
      return;
    }

    if (stepId === 2) {
      toast.error("Please select service type first.");
      return;
    }

    toast.error("Please create the service details first.");
  };

  return (
    <nav className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
      <motion.button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-400 font-bold text-sm"
      >
        <ArrowLeft size={18} />
        Back
      </motion.button>

      <div className="flex items-center bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto max-w-full">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isAllowed = canGoToStep(step.id);

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => handleStepClick(step.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-lg"
                  : isAllowed
                  ? "text-slate-500 hover:bg-slate-100"
                  : "text-slate-300 cursor-not-allowed"
              }`}
            >
              {isAllowed ? step.icon : <Lock size={16} />}

              <span className="text-xs font-bold uppercase">{step.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
