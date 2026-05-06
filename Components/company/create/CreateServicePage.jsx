"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ContentLoader from "../../ContentLoader";

// Stores
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useServiceStoreCompany } from "../../../app/store/owner/useServiceStore";
import { useTypeStoreCompany } from "../../../app/store/owner/useTypeStore";

// Components
import StepIndicator from "./service/StepIndicator";
import Step1Classification from "./service/Step1Classification";
import Step2Identity from "./service/Step2Identity";
import Step3Checklist from "./service/Step3Checklist";
import Step4Inventory from "./service/Step4Inventory";
import Step5Pricing from "./service/Step5Pricing";
import NavigationFooter from "./service/NavigationFooter";

export default function CreateServicePage() {
  const router = useRouter();
  const { user: authUser } = useAuthGuard();
  const { createService, owners = [], fetchOwners } = useServiceStoreCompany();
  const {
    activeTypes = [],
    categories = [],
    fetchActiveCategories,
    fetchActiveTypes,
  } = useTypeStoreCompany();

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Updated Initial State to match Table Requirements
  const [formData, setFormData] = useState({
    owner_id: "",
    category_id: "",
    type_id: "",
    title: "",
    description: "",
    status: "draft",
    // Step 3
    task_groups: [{ name: "General Area", items: [{ title: "" }] }],
    // Step 4: Inventory
    included_items: [{ name: "", description: "", status: "active" }],
    // Step 5: Pricing Tiers (Now with all keys for the table)
    packages: [
      {
        title: "Standard",
        description: "",
        price: "",
        billing_type: "one_time",
        min_area_m2: "",
        max_area_m2: "",
        floor_number: "",
        bedrooms: "",
        duration_hours: "",
        workers_count: "",
        status: "active",
        included_item_indices: [],
      },
    ],
  });

  useEffect(() => {
    fetchActiveCategories();
    if (authUser?.role === "admin") fetchOwners();
  }, []);

  useEffect(() => {
    if (formData.category_id) fetchActiveTypes(formData.category_id);
  }, [formData.category_id]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      // Append basic fields and stringified objects
      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key]) || typeof formData[key] === "object") {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      // Append images
      imageFiles.forEach((file) => data.append("images[]", file));

      const res = await createService(data);
      if (res.success) {
        toast.success("Service deployed successfully!");
        router.push(
          authUser?.role === "admin" ? "/admin/services" : "/owner/services"
        );
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to sync service protocol");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ContentLoader
        title="Syncing Protocol"
        subtitle="Deploying assets to cloud..."
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40">
      {/* Increased max-width to 7xl to accommodate tables comfortably */}
      <main className="max-w-7xl mx-auto px-6 pt-10">
        <div className="mb-10">
          <StepIndicator
            currentStep={currentStep}
            setCurrentStep={setCurrentStep}
            categoryId={formData.category_id}
          />
        </div>

        <div className="min-h-[60vh]">
          {currentStep === 1 && (
            <Step1Classification
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              activeTypes={activeTypes}
            />
          )}

          {currentStep === 2 && (
            <Step2Identity
              formData={formData}
              setFormData={setFormData}
              authUser={authUser}
              owners={owners}
              previews={previews}
              setPreviews={setPreviews}
              setImageFiles={setImageFiles}
            />
          )}

          {currentStep === 3 && (
            <Step3Checklist formData={formData} setFormData={setFormData} />
          )}

          {currentStep === 4 && (
            <Step4Inventory formData={formData} setFormData={setFormData} />
          )}

          {currentStep === 5 && (
            <Step5Pricing formData={formData} setFormData={setFormData} />
          )}
        </div>

        <NavigationFooter
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          typeId={formData.type_id}
          // Pass handleSubmit to the footer if the last step needs a "Finish" button
          onSubmit={handleSubmit}
          totalSteps={5}
        />
      </main>
    </div>
  );
}
