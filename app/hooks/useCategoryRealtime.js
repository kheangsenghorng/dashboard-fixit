"use client";

import { useEffect } from "react";
import { getEcho } from "../../lib/echo";
import { useCategoryStore } from "../store/useCategoryStore";

export const useCategoryRealtime = () => {
  const applyCategoryChange = useCategoryStore(
    (state) => state.applyCategoryChange
  );

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.channel("categories");

    const handleCategoryChanged = (event) => {
      applyCategoryChange(event);
    };

    channel.listen(".category.changed", handleCategoryChanged);

    return () => {
      channel.stopListening(".category.changed", handleCategoryChanged);
      echo.leaveChannel("categories");
    };
  }, [applyCategoryChange]);
};