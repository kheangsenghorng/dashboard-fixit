"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { useServiceBookingStore } from "../../app/store/useServiceBookingStore";

export default function ServiceBookingListener() {
  const addServiceBooking = useServiceBookingStore((state) => state.addServiceBooking);
  const replaceServiceBooking = useServiceBookingStore((state) => state.replaceServiceBooking);
  const removeServiceBooking = useServiceBookingStore((state) => state.removeServiceBooking);

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.channel("service-bookings");

    channel.listen(".service-booking.changed", (payload) => {
        const { action, serviceBooking } = payload;
      
        if (action === "created") {
          addServiceBooking(serviceBooking);
        }
      
        if (action === "updated") {
          replaceServiceBooking(serviceBooking);
        }
      
        if (action === "deleted") {
          removeServiceBooking(serviceBooking.id);
        }
      });

    return () => {
      echo.leaveChannel("service-bookings");
    };
  }, [addServiceBooking, replaceServiceBooking, removeServiceBooking]);

  return null;
}