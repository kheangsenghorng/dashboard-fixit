"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";

let echoInstance = null;

export function getEcho() {
  if (typeof window === "undefined") return null;

  if (echoInstance) return echoInstance;

  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "pusher",
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: true,
  });

  return echoInstance;
}