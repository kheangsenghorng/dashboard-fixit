"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { useServiceStore } from "../../app/store/useServiceStore";


export default function ServiceListener() {
  const addService = useServiceStore((state) => state.addService);
  const updateService = useServiceStore((state) => state.updateService);
  const removeService = useServiceStore((state) => state.removeService);

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.channel("services");

    channel.listen(".service.changed", (payload) => {
      const { action, service, serviceId } = payload;

      if (action === "created") {
        if (service?.status === "active") {
          addService(service);
        }
      }

      if (action === "updated") {
        if (!service) return;

        if (service.status !== "active") {
          removeService(service.id);
        } else {
          updateService(service);
        }
      }

      if (action === "deleted") {
        removeService(serviceId);
      }
    });

    return () => {
      echo.leave("services");
    };
  }, [addService, updateService, removeService]);

  return null;
}