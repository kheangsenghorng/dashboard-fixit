"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  const bookingId = params?.id;

  const { initialized } = useRequireAuth();
  const { ownerId } = useOwnerGuard();

  const {
    fetchServiceBooking,
    patchServiceBooking,
    serviceBooking,
    loading,
    error,
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

  useEffect(() => {
    if (bookingId) {
      fetchServiceBooking(bookingId);
      getProvidersByBookingId(bookingId);
    }

    if (ownerId) {
      fetchCheckProvidersByOwner(ownerId);
    }
  }, [
    bookingId,
    ownerId,
    fetchServiceBooking,
    getProvidersByBookingId,
    fetchCheckProvidersByOwner,
  ]);

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
    await handleRefreshAssignedStaff();
    await fetchCheckProvidersByOwner(ownerId);
  };

  const handleUpdateStatus = async (status, reason = null) => {
    if (!serviceBooking?.id) return;

    await patchServiceBooking(serviceBooking.id, {
      booking_status: status,
      cancellation_reason: reason,
    });

    setIsCancelling(false);
    await fetchServiceBooking(bookingId);
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
          onRetry={() => fetchServiceBooking(bookingId)}
        />

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
            <ReceiptSidebar payment={serviceBooking.payment?.[0]} />

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
