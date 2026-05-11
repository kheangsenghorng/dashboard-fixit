"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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

const createEmptyTaskGroup = (serviceId = null) => ({
  id: null,
  service_id: serviceId,
  name: "",
  description: null,
  status: "active",
  sort_order: 1,
  items: [
    {
      id: null,
      task_group_id: null,
      title: "",
      description: null,
      sort_order: 1,
      status: "active",
    },
  ],
});

const createEmptyIncludedItem = () => ({
  id: null,
  service_id: null,
  name: "",
  description: "",
  image: null,
  preview: null,
  image_preview: null,
  image_url: null,
  status: "active",
  sort_order: 1,
});

const createEmptyPackage = () => ({
  id: null,
  title: "",
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
  sort_order: 1,
  included_item_indices: [],
  task_group_indices: [],
});

const buildInitialFormData = () => ({
  id: null,
  service_id: null,

  package_id: null,
  selected_package: null,

  owner_id: "",
  category_id: "",
  type_id: "",
  title: "",
  description: "",
  status: "active",

  task_groups: [createEmptyTaskGroup()],
  included_items: [createEmptyIncludedItem()],
  packages: [createEmptyPackage()],
});

const getServiceData = (res) => {
  return res?.data?.data || res?.data || res?.service || res || null;
};

const normalizeExistingImages = (images = []) => {
  if (!Array.isArray(images)) return [];

  return images
    .map((image) => ({
      path: image.path || image.image_path || image.storage_path || "",
      url: image.url || image.image_url || "",
    }))
    .filter((image) => image.url);
};

const normalizeTaskGroups = (groups = [], serviceId = null) => {
  if (!Array.isArray(groups) || groups.length === 0) {
    return [createEmptyTaskGroup(serviceId)];
  }

  return groups.map((group, groupIndex) => ({
    id: group.id || null,
    service_id: group.service_id || serviceId,
    name: group.name || "",
    description: group.description || null,
    status: group.status || "active",
    sort_order: group.sort_order || groupIndex + 1,
    items: (group.items || group.task_items || []).map((item, itemIndex) => ({
      id: item.id || null,
      task_group_id: item.task_group_id || group.id || null,
      title: item.title || "",
      description: item.description || null,
      sort_order: item.sort_order || itemIndex + 1,
      status: item.status || "active",
    })),
  }));
};

const normalizeIncludedItems = (items = [], serviceId = null) => {
  if (!Array.isArray(items) || items.length === 0) {
    return [createEmptyIncludedItem()];
  }

  return items.map((item, index) => ({
    id: item.id || null,
    service_id: item.service_id || serviceId,
    name: item.name || "",
    description: item.description || "",
    image: null,
    preview: null,
    image_preview: item.image_url || item.url || null,
    image_url: item.image_url || item.url || null,
    status: item.status || "active",
    sort_order: item.sort_order || index + 1,
  }));
};

const getPackageIncludedItemIds = (pkg) => {
  const items =
    pkg.included_items ||
    pkg.package_included_items ||
    pkg.packageIncludedItems ||
    [];

  return items.map((item) => item.included_item_id || item.id).filter(Boolean);
};

const getPackageTaskGroupIds = (pkg) => {
  const groups =
    pkg.task_groups || pkg.package_task_groups || pkg.packageTaskGroups || [];

  return groups.map((group) => group.task_group_id || group.id).filter(Boolean);
};

const normalizePackages = (
  packages = [],
  includedItems = [],
  taskGroups = []
) => {
  if (!Array.isArray(packages) || packages.length === 0) {
    return [createEmptyPackage()];
  }

  return packages.map((pkg, packageIndex) => {
    const includedItemIds = getPackageIncludedItemIds(pkg);
    const taskGroupIds = getPackageTaskGroupIds(pkg);

    const includedItemIndices = includedItemIds
      .map((includedItemId) =>
        includedItems.findIndex(
          (item) => Number(item.id) === Number(includedItemId)
        )
      )
      .filter((index) => index !== -1);

    const taskGroupIndices = taskGroupIds
      .map((taskGroupId) =>
        taskGroups.findIndex(
          (group) => Number(group.id) === Number(taskGroupId)
        )
      )
      .filter((index) => index !== -1);

    return {
      id: pkg.id || null,
      title: pkg.title || "",
      description: pkg.description || "",
      price: pkg.price || "",
      billing_type: pkg.billing_type || "one_time",
      min_area_m2: pkg.min_area_m2 || "",
      max_area_m2: pkg.max_area_m2 || "",
      floor_number: pkg.floor_number || "",
      bedrooms: pkg.bedrooms || "",
      duration_hours: pkg.duration_hours || "",
      workers_count: pkg.workers_count || "",
      status: pkg.status || "active",
      sort_order: pkg.sort_order || packageIndex + 1,
      included_item_indices: includedItemIndices,
      task_group_indices: taskGroupIndices,
    };
  });
};

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

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [existingImages, setExistingImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const [formData, setFormData] = useState(buildInitialFormData);

  const redirectPath = useMemo(() => {
    return isAdmin ? "/admin/services" : "/owner/services";
  }, [isAdmin]);

  useEffect(() => {
    const initEdit = async () => {
      if (!id) return;

      setLoading(true);

      try {
        await fetchActiveCategories();

        if (isAdmin) {
          await fetchOwners();
        }

        const res = await fetchOneService(id);
        const service = getServiceData(res);

        if (!service?.id) {
          toast.error("Service not found.");
          return;
        }

        const categoryId = service.category_id || service.category?.id || "";

        if (categoryId) {
          await fetchActiveTypes(categoryId);
        }

        const normalizedTaskGroups = normalizeTaskGroups(
          service.task_groups || service.taskGroups || [],
          service.id
        );

        const normalizedIncludedItems = normalizeIncludedItems(
          service.included_items || service.includedItems || [],
          service.id
        );

        const normalizedPackages = normalizePackages(
          service.packages || service.service_packages || [],
          normalizedIncludedItems,
          normalizedTaskGroups
        );

        const firstPackageWithId =
          normalizedPackages.find((pkg) => pkg.id) || normalizedPackages[0];

        setFormData({
          id: service.id,
          service_id: service.id,

          package_id: firstPackageWithId?.id || null,
          selected_package: firstPackageWithId || null,

          owner_id: service.owner_id?.toString() || "",
          category_id: categoryId?.toString() || "",
          type_id: (service.type_id || service.type?.id || "").toString(),
          title: service.title || "",
          description: service.description || "",
          status: service.status || "active",

          task_groups: normalizedTaskGroups,
          included_items: normalizedIncludedItems,
          packages: normalizedPackages,
        });

        setExistingImages(normalizeExistingImages(service.images || []));
      } catch (error) {
        console.error("Fetch service error:", error);
        toast.error("Failed to load service data.");
      } finally {
        setLoading(false);
      }
    };

    initEdit();
  }, [
    id,
    isAdmin,
    fetchOneService,
    fetchOwners,
    fetchActiveCategories,
    fetchActiveTypes,
  ]);

  useEffect(() => {
    if (formData.category_id) {
      fetchActiveTypes(formData.category_id);
    }
  }, [formData.category_id, fetchActiveTypes]);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const buildCategoryTypeFormData = () => {
    const data = new FormData();

    data.append("_method", "PUT");
    data.append("category_id", formData.category_id || "");
    data.append("type_id", formData.type_id || "");

    return data;
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();

    if (!formData.category_id) {
      toast.error("Please select category");
      return;
    }

    if (!formData.type_id) {
      toast.error("Please select type");
      return;
    }

    setSubmitLoading(true);

    try {
      const data = buildCategoryTypeFormData();

      const res = await updateService(id, data);

      if (res?.success || res?.data || res?.id) {
        toast.success("Category and type updated successfully!");
        router.push(redirectPath);
        return;
      }

      toast.error(res?.message || "Failed to update category/type.");
    } catch (error) {
      console.error("Update category/type error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update category/type."
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <ContentLoader
        title="Loading Service"
        subtitle="Preparing service edit data..."
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
            typeId={formData.type_id}
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
              id={id}
              formData={formData}
              setFormData={setFormData}
              authUser={authUser}
              owners={owners}
              existingImages={existingImages}
              setExistingImages={setExistingImages}
              newPreviews={newPreviews}
              setNewPreviews={setNewPreviews}
              setNewImageFiles={setNewImageFiles}
              deleteServiceImage={deleteServiceImage}
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
          isLoading={submitLoading}
        />
      </main>
    </div>
  );
}
