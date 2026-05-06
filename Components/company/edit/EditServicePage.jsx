"use client";

import React, { useState, useEffect } from "react";
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
        name: "",
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
        image_url: null,
        status: "active",
      },
    ],

    packages: [
      {
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
        included_item_indices: [],
      },
    ],
  });

  const getServiceData = (res) => {
    return res?.data?.data || res?.data || res?.service || res || null;
  };

  const normalizeTaskGroups = (groups = []) => {
    if (!Array.isArray(groups) || groups.length === 0) {
      return [
        {
          name: "",
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
      ];
    }

    return groups.map((group) => ({
      id: group.id,
      name: group.name || "",
      description: group.description || null,
      status: group.status || "active",
      items: Array.isArray(group.items)
        ? group.items.map((item, index) => ({
            id: item.id,
            title: item.title || "",
            description: item.description || null,
            sort_order: item.sort_order || index + 1,
            status: item.status || "active",
          }))
        : [],
    }));
  };

  const normalizeIncludedItems = (items = []) => {
    if (!Array.isArray(items) || items.length === 0) {
      return [
        {
          name: "",
          description: "",
          image: null,
          image_preview: null,
          image_url: null,
          status: "active",
        },
      ];
    }

    return items.map((item) => ({
      id: item.id,
      name: item.name || "",
      description: item.description || "",
      image: null,
      image_preview: item.image_url || item.url || null,
      image_url: item.image_url || item.url || null,
      status: item.status || "active",
    }));
  };

  const normalizePackages = (packages = [], includedItems = []) => {
    if (!Array.isArray(packages) || packages.length === 0) {
      return [
        {
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
          included_item_indices: [],
        },
      ];
    }

    return packages.map((pkg) => {
      const packageIncludedItems =
        pkg.included_items || pkg.package_included_items || pkg.items || [];

      const includedItemIds = packageIncludedItems
        .map((item) => item.included_item_id || item.id)
        .filter(Boolean);

      const includedItemIndices = includedItemIds
        .map((includedItemId) =>
          includedItems.findIndex((item) => item.id === includedItemId)
        )
        .filter((index) => index !== -1);

      return {
        id: pkg.id,
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
        included_item_indices: includedItemIndices,
      };
    });
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
          service.task_groups || service.taskGroups || []
        );

        const normalizedIncludedItems = normalizeIncludedItems(
          service.included_items || service.includedItems || []
        );

        const normalizedPackages = normalizePackages(
          service.packages || service.service_packages || [],
          normalizedIncludedItems
        );

        setFormData({
          id: service.id,
          service_id: service.id,

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

        const normalizedImages = normalizeExistingImages(service.images || []);


        setExistingImages(normalizedImages);
      } catch (error) {
        console.error("Fetch service error:", error);
        toast.error("Failed to load service data.");
      } finally {
        setLoading(false);
      }
    };

    initEdit();
  }, [id]);

  useEffect(() => {
    if (formData.category_id) {
      fetchActiveTypes(formData.category_id);
    }
  }, [formData.category_id]);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setSubmitLoading(true);

    try {
      const data = new FormData();

      data.append("_method", "PUT");
      data.append("owner_id", formData.owner_id || "");
      data.append("category_id", formData.category_id || "");
      data.append("type_id", formData.type_id || "");
      data.append("title", formData.title || "");
      data.append("description", formData.description || "");
      data.append("status", formData.status || "active");

      data.append("task_groups", JSON.stringify(formData.task_groups || []));

      data.append(
        "included_items",
        JSON.stringify(
          (formData.included_items || []).map((item) => ({
            id: item.id || null,
            name: item.name || "",
            description: item.description || "",
            image_url: item.image_url || null,
            status: item.status || "active",
          }))
        )
      );

      data.append("packages", JSON.stringify(formData.packages || []));

      newImageFiles.forEach((file) => {
        data.append("images[]", file);
      });

      (formData.included_items || []).forEach((item, index) => {
        if (item.image) {
          data.append(`included_item_images[${index}]`, item.image);
        }
      });

      const res = await updateService(id, data);

      if (res?.success || res?.data || res?.id) {
        toast.success("Service updated successfully!");
        router.push(isAdmin ? "/admin/services" : "/owner/services");
        return;
      }

      toast.error("Failed to update service.");
    } catch (error) {
      console.error("Update service error:", error);
      toast.error(error.message || "Failed to update service.");
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
          loading={submitLoading}
          isLoading={submitLoading}
        />
      </main>
    </div>
  );
}
