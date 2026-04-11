"use client";

import { useEffect } from "react";

import useCouponStore from "../../app/store/useCouponStore";
import useCouponUsageStore from "../../app/store/useCouponUsageStore";
import { getEcho } from "../../lib/echo";

export default function CouponUsageListener() {
  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channelName = "coupon-usages";

    echo.channel(channelName).listen(".coupon.usage.updated", async (event) => {
      console.log("Realtime coupon usage event:", event);

      const couponStore = useCouponStore.getState();
      const couponUsageStore = useCouponUsageStore.getState();

      couponStore.applyRealtimeCouponUsage(event);

      await Promise.all([
        couponStore.refreshCoupons(),
        couponStore.fetchCouponsStats(),
        couponUsageStore.fetchTopPerformingCoupons(),
      ]);
    });

    return () => {
      echo.leave(channelName);
    };
  }, []);

  return null;
}