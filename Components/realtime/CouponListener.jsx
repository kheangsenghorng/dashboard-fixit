"use client";

import { useEffect } from "react";

import useCouponStore from "../../app/store/useCouponStore";
import { getEcho } from "../../lib/echo";

export default function SingleCouponListener({ couponId }) {
  const applyRealtimeCouponUsage = useCouponStore(
    (state) => state.applyRealtimeCouponUsage
  );

  useEffect(() => {
    if (!couponId) return;

    const echo = getEcho();
    if (!echo) return;

    const channelName = `coupon.${couponId}`;
    const channel = echo.channel(channelName);

    channel.listen(".coupon.usage.updated", (event) => {
      console.log("Single coupon realtime:", event);
      applyRealtimeCouponUsage(event);
    });

    return () => {
      echo.leave(channelName);
    };
  }, [couponId, applyRealtimeCouponUsage]);

  return null;
}