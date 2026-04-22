"use client";

import TypeListener from "./TypeListener";
import ServiceListener from "./ServiceListener";
import OwnerListener from "./OwnerListener";
import PublicOwnerCreatedListener from "./PublicOwnerCreatedListener";
import CouponUsageListener from "./CouponUsageListener";
import ServiceBookingListener from "./ServiceBookingListener";

export default function RealtimeListeners() {
  return (
    <>
      <TypeListener />
      <ServiceListener />
      <OwnerListener />
      <PublicOwnerCreatedListener />
      <CouponUsageListener />
      <ServiceBookingListener/>
    </>
  );
}
