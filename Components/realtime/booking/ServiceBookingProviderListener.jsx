"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { useServiceBookingProviderStore } from "../../../app/store/booking/useServiceBookingProviderStore";


export default function ServiceBookingProviderListener() {
  const addServiceBookingProvider = useServiceBookingProviderStore(
    (state) => state.addServiceBookingProvider
  );

  const replaceServiceBookingProvider = useServiceBookingProviderStore(
    (state) => state.replaceServiceBookingProvider
  );

  const removeServiceBookingProviderFromStore = useServiceBookingProviderStore(
    (state) => state.removeServiceBookingProviderFromStore
  );

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.channel("service-booking-providers");

    channel.listen(".service-booking-provider.changed", (payload) => {
      const action = payload?.action || payload?.data?.action;
      const item = payload?.item || payload?.data?.item;

      if (action === "created" && item) {
        addServiceBookingProvider(item);
      }

      if (action === "updated" && item) {
        replaceServiceBookingProvider(item);
      }

      if (action === "deleted" && item) {
        removeServiceBookingProviderFromStore(item.id);
      }
    });

    return () => {
      echo.leave("service-booking-providers");
    };
  }, [
    addServiceBookingProvider,
    replaceServiceBookingProvider,
    removeServiceBookingProviderFromStore,
  ]);

  return null;
}
