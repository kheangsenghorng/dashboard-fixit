"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useServiceBookingStore } from "../../../../app/store/useServiceBookingStore";
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

// Internal Components

const StaffBookingAdmin = () => {
  const params = useParams();
  const bookingId = params?.id;
  const { user: authUser, initialized } = useRequireAuth();
  const { ownerId } = useOwnerGuard();

  const {
    fetchServiceBooking,
    patchServiceBooking,
    serviceBooking,
    loading,
    error,
  } = useServiceBookingStore();
  const { fetchProvidersByOwner, providers } = useProviderStore();

  const [assignedStaff, setAssignedStaff] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (bookingId) fetchServiceBooking(bookingId);
    if (ownerId) fetchProvidersByOwner(ownerId);
  }, [bookingId, ownerId]);

  const handleUpdateStatus = async (status, reason = null) => {
    await patchServiceBooking(serviceBooking.id, {
      booking_status: status,
      cancellation_reason: reason,
    });
    setIsCancelling(false);
    fetchServiceBooking(bookingId);
  };

  if (loading || !initialized)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-slate-400 uppercase">
        Loading System...
      </div>
    );
  if (!serviceBooking) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-[12px]">
      <AssignStaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        providers={providers || []}
        assignedStaff={assignedStaff}
        onToggle={(s) =>
          setAssignedStaff((prev) =>
            prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]
          )
        }
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <ServiceCard
              service={serviceBooking.service}
              booking={serviceBooking}
            />
            <TeamAndInstructions
              assignedStaff={assignedStaff}
              onAdd={() => setIsModalOpen(true)}
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
