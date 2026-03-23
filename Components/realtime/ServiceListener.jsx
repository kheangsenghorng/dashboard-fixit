"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { useServiceStore } from "../../app/store/useServiceStore";

export default function ServiceListener() {
  const addService = useServiceStore((state) => state.addService);
  const replaceService = useServiceStore((state) => state.replaceService);
  const removeService = useServiceStore((state) => state.removeService);

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.channel("services");

    channel.listen(".service.changed", (payload) => {
      const { action, service, serviceId } = payload;

      if (action === "created" && service) {
        addService(service);
      }

      if (action === "updated" && service) {
        replaceService(service);
      }

      if (action === "deleted" && serviceId) {
        removeService(serviceId);
      }
    });

    return () => {
      echo.leaveChannel("services");
    };
  }, [addService, replaceService, removeService]);

  return null;
}