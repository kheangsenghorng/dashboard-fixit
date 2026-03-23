"use client";

import { useEffect } from "react";
import { getEcho } from "@/lib/echo";
import { useTypeStore } from "../../app/store/useTypeStore";


export default function TypeListener() {
  const addType = useTypeStore((state) => state.addType);
  const replaceType = useTypeStore((state) => state.replaceType);
  const removeType = useTypeStore((state) => state.removeType);

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.channel("types");

    channel.listen(".type.changed", (payload) => {
      const { action, type, typeId } = payload;

      if (action === "created" && type) {
        addType(type);
      }

      if (action === "updated" && type) {
        replaceType(type);
      }

      if (action === "deleted") {
        removeType(typeId);
      }
    });

    return () => {
      echo.leave("types");
    };
  }, [addType, replaceType, removeType]);

  return null;
}
