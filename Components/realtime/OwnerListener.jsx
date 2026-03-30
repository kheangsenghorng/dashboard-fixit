"use client";

import { useEffect } from "react";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

import { useOwnerStore } from "../../app/store/ownerStore";
import { getToken } from "../../lib/token";

let echoInstance = null;

function getEcho() {
  if (typeof window === "undefined") return null;

  const token = getToken();
  if (!token) {
    return null;
  }

  const appKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!appKey || !cluster || !apiUrl) {
    console.error("Missing realtime environment variables", {
      appKey,
      cluster,
      apiUrl,
    });
    return null;
  }

  if (echoInstance) return echoInstance;

  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: appKey,
    cluster,
    forceTLS: true,
    authEndpoint: `${apiUrl}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  return echoInstance;
}

export default function OwnerListener() {
  const realtimeAddOwner = useOwnerStore((state) => state.realtimeAddOwner);
  const realtimeUpdateOwner = useOwnerStore(
    (state) => state.realtimeUpdateOwner
  );
  const realtimeRemoveOwner = useOwnerStore(
    (state) => state.realtimeRemoveOwner
  );

  useEffect(() => {
    const echo = getEcho();

    if (!echo) return;

    const channelName = "admin.notifications";
    const eventName = ".owner.changed";

    const channel = echo.private(channelName);
    const handler = (payload) => {
      const { action, owner, ownerId } = payload || {};
      if (action === "created" && owner) {
        realtimeAddOwner(owner);
        return;
      }

      if (action === "updated" && owner) {
        realtimeUpdateOwner(owner);
        return;
      }

      if (action === "deleted") {
        const idToRemove = ownerId ?? owner?.id;

        if (idToRemove != null) {
          realtimeRemoveOwner(idToRemove);
        }
      }
    };

    channel.listen(eventName, handler);

    return () => {
      channel.stopListening(eventName);
      echo.leave(channelName);
    };
  }, [realtimeAddOwner, realtimeUpdateOwner, realtimeRemoveOwner]);

  return null;
}
