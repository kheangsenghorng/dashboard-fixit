"use client";

import { useEffect } from "react";
import echo from "../../lib/echo";
import { useCategoryStore } from "../store/useCategoryStore";

export const useCategoryRealtime = () => {
  const applyCategoryChange = useCategoryStore(
    (state) => state.applyCategoryChange
  );

  useEffect(() => {
    if (!echo) return;

    const channel = echo.channel("categories");

    channel.listen(".category.changed", (event) => {
      applyCategoryChange(event);
    });

    return () => {
      echo.leave("categories");
    };
  }, [applyCategoryChange]);
};