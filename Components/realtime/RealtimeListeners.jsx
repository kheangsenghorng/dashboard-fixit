"use client";

import TypeListener from "./TypeListener";
import ServiceListener from "./ServiceListener";
import OwnerListener from "./OwnerListener";
import PublicOwnerCreatedListener from "./PublicOwnerCreatedListener";

export default function RealtimeListeners() {
  return (
    <>
      <TypeListener />
      <ServiceListener />
      <OwnerListener />
      <PublicOwnerCreatedListener />
    </>
  );
}
