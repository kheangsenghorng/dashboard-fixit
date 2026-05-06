"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ContentLoader from "../../ContentLoader";

// Stores
import { useAuthGuard } from "../../../app/hooks/useAuthGuard";
import { useServiceStoreCompany } from "../../../app/store/owner/useServiceStore";
import { useTypeStoreCompany } from "../../../app/store/owner/useTypeStore";
import { useTaskGroupStore } from "../../../app/store/services/useTaskGroupStore";
import { useTaskItemStore } from "../../../app/store/services/useTaskItemStore";
import { useIncludedItemStore } from "../../../app/store/services/useIncludedItemStore";
import { usePackageIncludedItemStore } from "../../../app/store/services/usePackageIncludedItemStore";
import { usePackageTaskGroupStore } from "../../../app/store/services/usePackageTaskGroupStore";
import { useServicePackageStore } from "../../../app/store/services/useServicePackageStore";

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

  const { create: createTaskGroup } = useTaskGroupStore();
  const { create: createTaskItem } = useTaskItemStore();
  const { create: createIncludedItem } = useIncludedItemStore();
  const { create: createServicePackage } = useServicePackageStore();
  const { create: createPackageIncludedItem } = usePackageIncludedItemStore();
  const { create: createPackageTaskGroup } = usePackageTaskGroupStore();

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

  const [formData, setFormData] = useState({
    id: null,
    service_id: null,

    owner_id: "",
    category_id: "",
    type_id: "",
    title: "",
    description: "",
    status: "active",

    task_groups: [
      {
        name: "General Area",
        description: null,
        status: "active",
        items: [
          {
            title: "",
            description: null,
            sort_order: 1,
            status: "active",
          },
        ],
      },
    ],

    included_items: [
      {
        name: "",
        description: "",
        image: null,
        image_preview: null,
        status: "active",
      },
    ],

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

    if (authUser?.role === "admin") {
      fetchOwners();
    }
  }, []);

  useEffect(() => {
    if (formData.category_id) {
      fetchActiveTypes(formData.category_id);
    }
  }, [formData.category_id]);

  const getCreatedService = (res) => {
    return res?.data?.data || res?.data || res?.service || res || null;
  };

  const getCreatedRecord = (res, key = null) => {
    if (!res) return null;

    return res?.data?.data || res?.data || (key ? res?.[key] : null) || res;
  };

  const emptyToNull = (value) => {
    return value === "" || value === undefined ? null : value;
  };

  const createBaseService = async () => {
    setLoading(true);

    try {
      const data = new FormData();

      data.append("owner_id", formData.owner_id || "");
      data.append("category_id", formData.category_id || "");
      data.append("type_id", formData.type_id || "");
      data.append("title", formData.title || "");
      data.append("description", formData.description || "");
      data.append("status", formData.status || "active");

      imageFiles.forEach((file) => data.append("images[]", file));

      const res = await createService(data);
      const createdService = getCreatedService(res);

      if (createdService?.id) {
        setFormData((prev) => ({
          ...prev,
          id: createdService.id,
          service_id: createdService.id,
        }));

        toast.success("Service created successfully!");
        return createdService.id;
      }

      toast.error("Failed to create service");
      return null;
    } catch (error) {
      console.error("Create service error:", error);
      toast.error("Failed to create service");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 1) {
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2 && !formData.service_id) {
      const serviceId = await createBaseService();

      if (!serviceId) return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const autoCreateChecklist = async () => {
    const serviceId = formData.service_id;

    if (!serviceId) {
      toast.error("Please create the service first.");
      return [];
    }

    const createdTaskGroups = [];

    for (const group of formData.task_groups || []) {
      if (!group.name) continue;

      const groupPayload = {
        service_id: serviceId,
        name: group.name,
        description: group.description || null,
        status: group.status || "active",
      };

      const groupRes = await createTaskGroup(groupPayload);
      const savedGroup = getCreatedRecord(groupRes, "task_group");

      if (!savedGroup?.id) {
        throw new Error("Failed to create task group");
      }

      createdTaskGroups.push(savedGroup);

      for (let index = 0; index < (group.items || []).length; index++) {
        const item = group.items[index];

        if (!item.title) continue;

        const itemPayload = {
          task_group_id: savedGroup.id,
          title: item.title,
          description: item.description || null,
          sort_order: item.sort_order || index + 1,
          status: item.status || "active",
        };

        const itemRes = await createTaskItem(itemPayload);

        if (!itemRes) {
          const storeError = useTaskItemStore.getState().error;
          throw new Error(storeError || "Failed to create task item");
        }
      }
    }

    return createdTaskGroups;
  };

  const autoCreateIncludedItems = async () => {
    const serviceId = formData.service_id;

    if (!serviceId) {
      toast.error("Please create the service first.");
      return [];
    }

    const createdIncludedItems = [];

    for (const item of formData.included_items || []) {
      if (!item.name) continue;

      const data = new FormData();

      data.append("service_id", serviceId);
      data.append("name", item.name);
      data.append("description", item.description || "");
      data.append("status", item.status || "active");

      if (item.image) {
        data.append("image", item.image);
      }

      const res = await createIncludedItem(data);
      const savedItem = getCreatedRecord(res, "included_item");

      if (!savedItem?.id) {
        const storeError = useIncludedItemStore.getState().error;
        throw new Error(storeError || "Failed to create included item");
      }

      createdIncludedItems.push(savedItem);
    }

    return createdIncludedItems;
  };

  const autoCreatePackages = async (
    createdIncludedItems = [],
    createdTaskGroups = []
  ) => {
    createdIncludedItems = Array.isArray(createdIncludedItems)
      ? createdIncludedItems
      : [];

    createdTaskGroups = Array.isArray(createdTaskGroups)
      ? createdTaskGroups
      : [];

    const serviceId = formData.service_id;

    if (!serviceId) {
      toast.error("Please create the service first.");
      return false;
    }

    for (const pkg of formData.packages || []) {
      if (!pkg.title) continue;

      const packagePayload = {
        service_id: serviceId,
        title: pkg.title,
        description: pkg.description || null,
        price: pkg.price === "" || pkg.price === undefined ? 0 : pkg.price,
        billing_type: pkg.billing_type || "one_time",
        min_area_m2: emptyToNull(pkg.min_area_m2),
        max_area_m2: emptyToNull(pkg.max_area_m2),
        floor_number: emptyToNull(pkg.floor_number),
        bedrooms: emptyToNull(pkg.bedrooms),
        duration_hours: emptyToNull(pkg.duration_hours),
        workers_count: emptyToNull(pkg.workers_count),
        status: pkg.status || "active",
      };

      const packageRes = await createServicePackage(packagePayload);

      if (!packageRes) {
        const storeError = useServicePackageStore.getState().error;
        throw new Error(storeError || "Failed to create service package");
      }

      const savedPackage = getCreatedRecord(packageRes, "package");

      if (!savedPackage?.id) {
        console.error("Invalid service package response:", packageRes);
        throw new Error("Service package created but response has no id");
      }

      for (
        let order = 0;
        order < (pkg.included_item_indices || []).length;
        order++
      ) {
        const itemIndex = pkg.included_item_indices[order];
        const savedIncludedItem = createdIncludedItems[itemIndex];

        if (!savedIncludedItem?.id) continue;

        const pivotRes = await createPackageIncludedItem({
          package_id: savedPackage.id,
          included_item_id: savedIncludedItem.id,
          sort_order: order + 1,
        });

        if (!pivotRes) {
          const storeError = usePackageIncludedItemStore.getState().error;
          throw new Error(storeError || "Failed to attach included item");
        }
      }

      for (const savedTaskGroup of createdTaskGroups) {
        if (!savedTaskGroup?.id) continue;

        const groupPivotRes = await createPackageTaskGroup({
          package_id: savedPackage.id,
          task_group_id: savedTaskGroup.id,
        });

        if (!groupPivotRes) {
          const storeError = usePackageTaskGroupStore.getState().error;
          throw new Error(storeError || "Failed to attach task group");
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setLoading(true);

    try {
      const createdTaskGroups = await autoCreateChecklist();
      const createdIncludedItems = await autoCreateIncludedItems();

      const packageSuccess = await autoCreatePackages(
        createdIncludedItems,
        createdTaskGroups
      );

      if (!packageSuccess) return;

      toast.success("Service deployed successfully!");

      router.push(
        authUser?.role === "admin" ? "/admin/services" : "/owner/services"
      );
    } catch (error) {
      console.error("Deploy service error:", error);
      toast.error(error.message || "Failed to deploy service");
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
          onNext={handleNextStep}
          onSubmit={handleSubmit}
          totalSteps={5}
          loading={loading}
        />
      </main>
    </div>
  );
}
