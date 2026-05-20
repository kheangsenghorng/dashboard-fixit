"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useServiceBookingStore } from "../../../../app/store/useServiceBookingStore";
import { useServiceBookingProviderStore } from "../../../../app/store/booking/useServiceBookingProviderStore";
import { useProviderStore } from "../../../../app/store/provider/providerStore";
import { useRequireAuth } from "../../../../app/hooks/useRequireAuth";
import { useOwnerGuard } from "../../../../app/hooks/useOwnerGuard";
import AssignStaffModal from "../components/AssignStaffModal";
import BookingHeader from "../components/BookingHeader";
import ServiceCard from "../components/ServiceCard";
import ProfileSidebar from "../components/ProfileSidebar";
import TeamAndInstructions from "../components/TeamAndInstructions";
import ReceiptSidebar from "../components/ReceiptSidebar";
import ReviewsCard from "../components/ReviewsCard";
import ServiceBookingProviderListener from "../../../realtime/booking/ServiceBookingProviderListener";

const StaffBookingAdmin = () => {
  const params = useParams();
  const router = useRouter();

  const bookingId = params?.id;

  const { initialized } = useRequireAuth();
  const { ownerId } = useOwnerGuard();

  const {
    fetchServiceBooking,
    patchServiceBooking,
    cancelRefundBooking,
    cancelRefundLoading,
    cancelRefundBookingId,
    serviceBooking,
    loading,
    error,
    successMessage,
    clearMessages,
  } = useServiceBookingStore();

  const { fetchCheckProvidersByOwner, providers } = useProviderStore();

  const {
    serviceBookingProviders,
    getProvidersByBookingId,
    removeServiceBookingProvider,
  } = useServiceBookingProviderStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const refreshPageData = async () => {
    if (!bookingId) return;

    await fetchServiceBooking(bookingId);
    await getProvidersByBookingId(bookingId);

    if (ownerId) {
      await fetchCheckProvidersByOwner(ownerId);
    }

    router.refresh();
  };

  useEffect(() => {
    refreshPageData();
  }, [bookingId, ownerId]);

  const assignedStaff = Array.isArray(serviceBookingProviders)
    ? serviceBookingProviders
    : Array.isArray(serviceBookingProviders?.data)
    ? serviceBookingProviders.data
    : [];

  const handleRefreshAssignedStaff = async () => {
    if (!bookingId) return;

    await getProvidersByBookingId(bookingId);
  };

  const handleRemoveStaff = async (staff) => {
    const serviceBookingProviderId = staff?.id;

    if (!serviceBookingProviderId) return;

    await removeServiceBookingProvider(serviceBookingProviderId);
    await refreshPageData();
  };

  const handleUpdateStatus = async (status, reason = null) => {
    if (!serviceBooking?.id) return;

    clearMessages?.();

    await patchServiceBooking(serviceBooking.id, {
      booking_status: status,
      cancellation_reason: reason,
    });

    setIsCancelling(false);
    setCancelReason("");

    await refreshPageData();
  };

  const handleCancelRefundBooking = async (reason = "") => {
    if (!serviceBooking?.id) return;

    clearMessages?.();

    const result = await cancelRefundBooking(serviceBooking.id, reason);

    if (result.success) {
      setIsCancelling(false);
      setCancelReason("");

      await refreshPageData();

      // auto close success message after 3 seconds
      setTimeout(() => {
        clearMessages?.();
      }, 3000);
    }
  };

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 uppercase">
        Loading System...
      </div>
    );
  }

  if (!serviceBooking) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-[12px]">
      <ServiceBookingProviderListener />

      <AssignStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceBookingId={serviceBooking.id}
        assignedBy={ownerId}
        providers={providers || []}
        assignedStaff={assignedStaff}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onToggle={handleRefreshAssignedStaff}
      />

      <div className="max-w-6xl mx-auto">
        <BookingHeader
          booking={serviceBooking}
          isCancelling={isCancelling}
          setIsCancelling={setIsCancelling}
          cancelReason={cancelReason}
          setCancelReason={setCancelReason}
          onUpdateStatus={handleUpdateStatus}
          onCancelRefundBooking={handleCancelRefundBooking}
          onRetry={refreshPageData}
          cancelRefundLoading={cancelRefundLoading}
          cancelRefundBookingId={cancelRefundBookingId}
        />

        {successMessage && (
          <div className="mb-4 rounded-2xl bg-emerald-50 px-5 py-4 font-bold text-emerald-600">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-2xl bg-rose-50 px-5 py-4 font-bold text-rose-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <ServiceCard
              service={serviceBooking.service}
              booking={serviceBooking}
            />

            <TeamAndInstructions
              assignedStaff={assignedStaff}
              onAdd={() => setIsModalOpen(true)}
              onRemove={handleRemoveStaff}
              notes={serviceBooking.notes}
            />

            <ReviewsCard reviews={serviceBooking.reviews} />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <ReceiptSidebar payment={serviceBooking.payments?.[0]} />

            <ProfileSidebar
              user={serviceBooking.user}
              provider={serviceBooking.provider}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffBookingAdmin;
