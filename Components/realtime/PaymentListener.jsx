"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { useServiceBookingStore } from "../../app/store/useServiceBookingStore";
import { usePaymentStore } from "../../app/store/payment/usePaymentStore";

export default function PaymentListener() {
  const addPayment = usePaymentStore((state) => state.addPayment);
  const replacePayment = usePaymentStore((state) => state.replacePayment);
  const removePayment = usePaymentStore((state) => state.removePayment);

  const fetchServiceBookings = useServiceBookingStore(
    (state) => state.fetchServiceBookings
  );

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.channel("payments");

    channel.listen(".payment.changed", async (payload) => {
      const { action, data, id } = payload;

      if (action === "created" && data) {
        addPayment(data);
      }

      if (action === "updated" && data) {
        replacePayment(data);
      }

      if (action === "deleted" && id) {
        removePayment(id);
      }

      await fetchServiceBookings();
    });

    return () => {
      echo.leaveChannel("payments");
    };
  }, [addPayment, replacePayment, removePayment, fetchServiceBookings]);

  return null;
}