"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { UserPlus, Briefcase, FileSpreadsheet } from "lucide-react";
import { toast } from "react-toastify";

import { useOwnerGuard } from "../../../../app/hooks/useOwnerGuard";
import { useUserStore } from "../../../../app/store/owner/useUserStore";

import TabButton from "./ManagementPage/components/TabButton";
import SelectionModal from "./ManagementPage/components/SelectionModal";
import UserForm from "./ManagementPage/components/UserForm";

import BulkImport from "./ManagementPage/components/BulkImport";
import ProviderForm from "./ManagementPage/components/ProviderForm";
import { useOwnerCategoryStore } from "../../../../app/store/owner/useOwnerCategoryStore";
import { useProviderStore } from "../../../../app/store/provider/providerStore";

const ManagementPage = () => {
  const { ownerId, authUser, initialized } = useOwnerGuard();
  const { createUserByOwner, fetchUsersByOwner, users } = useUserStore();
  const {
    activeCategories,
    fetchActiveCategoriesByOwner,
    loading: categoryLoading,
  } = useOwnerCategoryStore();
  const { createProvider, loading: providerLoading } = useProviderStore();

  const [activeTab, setActiveTab] = useState("user");
  const [loading, setLoading] = useState(false);

  // Modal States
  const [userModal, setUserModal] = useState(false);
  const [catModal, setCatModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  useEffect(() => {
    fetchUsersByOwner();
    fetchActiveCategoriesByOwner();
  }, [fetchUsersByOwner, fetchActiveCategoriesByOwner]);

  // Form States
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "provider",
    phone: "",
    is_active: true,
  });
  const [providerData, setProviderData] = useState({
    user_id: "",
    owner_id: "",
    category_id: "",
    status: "active",
    provider_type: "staff",
    rating: 0,
    total_jobs: 0,
    comment: "",
  });

  const handleProviderChange = (e) => {
    const { name, value } = e.target;

    setProviderData((prev) => ({
      ...prev,
      [name]:
        name.includes("_id") || name === "rating" || name === "total_jobs"
          ? Number(value)
          : value,
    }));
  };
  const [excelData, setExcelData] = useState([]);
  const [fileName, setFileName] = useState("");

  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: "binary" });
      setExcelData(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();

    if (loading) {
      toast.warning("Please wait. Request is still processing.");
      return;
    }

    setLoading(true);

    try {
      if (type === "User") {
        if (!userData.name.trim()) {
          toast.warning("User name is required.");
          return;
        }

        if (!userData.email.trim()) {
          toast.warning("User email is required.");
          return;
        }

        await createUserByOwner(userData);

        toast.success("User created successfully!");

        setUserData({
          name: "",
          email: "",
          role: "provider",
          phone: "",
          is_active: true,
        });
      }

      if (type === "Provider") {
        if (!providerData.user_id) {
          toast.warning("Please select a user.");
          return;
        }

        if (!providerData.category_id) {
          toast.warning("Please select a category.");
          return;
        }

        const payload = {
          ...providerData,
          owner_id: ownerId,
        };

        await createProvider(payload);

        toast.success("Provider created successfully!");

        setProviderData({
          user_id: "",
          owner_id: "",
          category_id: "",
          status: "active",
          provider_type: "staff",
          rating: 0,
          total_jobs: 0,
          comment: "",
        });

        setSelectedUser(null);
        setSelectedCategory(null);
      }

      if (type === "Bulk") {
        if (!excelData.length) {
          toast.warning("Please upload a file first.");
          return;
        }

        console.log("Submitting Bulk:", excelData);

        setExcelData([]);
        setFileName("");

        toast.success("Bulk records processed successfully!");
      }
    } catch (error) {
      const validationErrors = error?.response?.data?.errors;

      const errorMessage = validationErrors
        ? Object.values(validationErrors).flat().join(" ")
        : error?.response?.data?.message ||
          "Something went wrong. Please try again.";

      toast.error(errorMessage);

      console.log("Submit error:", error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  if (!initialized || !authUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 md:p-10">
      {/* Pop-up Modals */}
      <SelectionModal
        isOpen={userModal}
        onClose={() => setUserModal(false)}
        title="Select User"
        items={users}
        displayKey="name"
        loading={loading}
        onSelect={(u) => {
          setSelectedUser(u);

          setProviderData((prev) => ({
            ...prev,
            user_id: u.id,
          }));
        }}
      />
      <SelectionModal
        isOpen={catModal}
        onClose={() => setCatModal(false)}
        title="Select Category"
        items={activeCategories}
        displayKey="name"
        loading={categoryLoading}
        onSelect={(c) => {
          setSelectedCategory(c);

          setProviderData((prev) => ({
            ...prev,
            category_id: c.id,
          }));
        }}
      />

      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-slate-800">Control Panel</h1>
          <p className="text-slate-500 font-medium">
            Manage organization records
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-72 flex flex-col gap-2">
            <TabButton
              active={activeTab === "user"}
              onClick={() => setActiveTab("user")}
              icon={<UserPlus size={20} />}
              label="New User"
              desc="Manual Entry"
            />
            <TabButton
              active={activeTab === "provider"}
              onClick={() => setActiveTab("provider")}
              icon={<Briefcase size={20} />}
              label="New Provider"
              desc="Service Setup"
            />
            <TabButton
              active={activeTab === "bulk"}
              onClick={() => setActiveTab("bulk")}
              icon={<FileSpreadsheet size={20} />}
              label="Bulk Import"
              desc="Excel Upload"
            />
          </div>

          <div className="flex-1 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-12 overflow-hidden">
            {activeTab === "user" && (
              <UserForm
                data={userData}
                loading={loading}
                onChange={(e) =>
                  setUserData({ ...userData, [e.target.name]: e.target.value })
                }
                onSubmit={handleSubmit}
              />
            )}

            {activeTab === "provider" && (
              <ProviderForm
                data={providerData}
                selectedUser={selectedUser}
                selectedCategory={selectedCategory}
                onChange={handleProviderChange}
                onOpenUser={() => setUserModal(true)}
                onOpenCat={() => setCatModal(true)}
                onSubmit={handleSubmit}
                loading={loading || providerLoading}
              />
            )}

            {activeTab === "bulk" && (
              <BulkImport
                excelData={excelData}
                fileName={fileName}
                loading={loading}
                onUpload={handleExcelUpload}
                onClear={() => {
                  setExcelData([]);
                  setFileName("");
                }}
                onSubmit={(e) => handleSubmit(e, "Bulk")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementPage;
