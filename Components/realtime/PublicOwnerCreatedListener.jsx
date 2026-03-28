"use client";

import { useEffect } from "react";
import { useOwnerStore } from "../../app/store/ownerStore";
import { getEcho } from "../../lib/echo";

export default function PublicOwnerCreatedListener() {
  const realtimeAddOwner = useOwnerStore((state) => state.realtimeAddOwner);

  useEffect(() => {
    const echo = getEcho();
    if (!echo) return;

    const channelName = "owners";
    const eventName = ".owner.created";

    const channel = echo.channel(channelName);

    const handler = (payload) => {
      if (payload?.owner) {
        realtimeAddOwner(payload.owner);
      }
    };

    channel.listen(eventName, handler);
    return () => {
      channel.stopListening(eventName);
      echo.leave(channelName);
    };
  }, [realtimeAddOwner]);

  return null;
}
