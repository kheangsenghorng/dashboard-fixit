"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import ContentLoader from "../../ContentLoader";

// Stores
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useServiceStoreCompany } from "../../../app/store/owner/useServiceStore";
import { useTypeStoreCompany } from "../../../app/store/owner/useTypeStore";
import StepIndicator from "../create/service/StepIndicator";
import Step1Classification from "./service/Step1Classification";
import Step2Identity from "./service/Step2Identity";

import Step4Checklist from "./service/Step4Checklist";
import Step5Inventory from "./service/Step5Inventory";
import Step6Pricing from "./service/Step6Pricing";
import NavigationFooter from "./service/NavigationFooter";

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const { user: authUser } = useAuthGuard();
  const isAdmin = authUser?.role === "admin";

  const {
    updateService,
    fetchOneService,
    owners = [],
    fetchOwners,
    deleteServiceImage,
  } = useServiceStoreCompany();

  const {
    activeTypes = [],
    categories = [],
    fetchActiveCategories,
    fetchActiveTypes,
  } = useTypeStoreCompany();

  // --- UI STATE ---
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // --- MEDIA STATE ---
  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    owner_id: "",
    category_id: "",
    type_id: "",
    title: "",
    description: "",
    status: "active",
    task_groups: [],
    included_items: [],
    packages: [],
  });

  // 1. Initial Data Fetch & Hydration
  useEffect(() => {
    const initEdit = async () => {
      if (!id) return;
      setLoading(true);
      try {
        await fetchActiveCategories();
        if (isAdmin) await fetchOwners();

        const service = await fetchOneService(id);
        if (service) {
          if (service.category?.id) {
            await fetchActiveTypes(service.category.id);
          }

          setFormData({
            owner_id: service.owner_id?.toString() || "",
            category_id: service.category?.id?.toString() || "",
            type_id: service.type?.id?.toString() || "",
            title: service.title || "",
            description: service.description || "",
            status: service.status || "active",
            task_groups: service.task_groups || [],
            included_items: service.included_items || [],
            packages: service.packages || [],
          });
          setExistingImages(service.images || []);
        }
      } catch (err) {
        toast.error("Security Protocol: Failed to decrypt service data.");
      } finally {
        setLoading(false);
      }
    };
    initEdit();
  }, [id]);

  // 2. Sync Category/Types
  useEffect(() => {
    if (formData.category_id) {
      fetchActiveTypes(formData.category_id);
    }
  }, [formData.category_id]);

  // 3. Update Submission Handler
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitLoading(true);

    try {
      const data = new FormData();
      data.append("_method", "PUT"); // Method Spoofing for Laravel

      Object.keys(formData).forEach((key) => {
        if (Array.isArray(formData[key]) || typeof formData[key] === "object") {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      newImageFiles.forEach((file) => data.append("images[]", file));

      const res = await updateService(id, data);
      if (res.success) {
        toast.success("Protocol Synced Successfully");
        router.push(isAdmin ? "/admin/services" : "/owner/services");
      }
    } catch (error) {
      toast.error("Failed to update service protocol");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading)
    return (
      <ContentLoader
        title="Decrypting Protocol"
        subtitle="Accessing secure layers..."
      />
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
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
            />
          )}
          {currentStep === 3 && (
            <Step4Checklist formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 4 && (
            <Step5Inventory formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 5 && (
            <Step6Pricing formData={formData} setFormData={setFormData} />
          )}
        </div>

        <NavigationFooter
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          typeId={formData.type_id}
          onSubmit={handleSubmit}
          totalSteps={6}
          isLoading={submitLoading}
        />
      </main>

      <style jsx global>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
