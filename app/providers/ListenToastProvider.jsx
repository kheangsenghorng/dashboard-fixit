"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import Pusher from "pusher-js";
import { useUsersStore } from "../store/useUsersStore";
import { getToken } from "../../lib/token";

export default function ListenToastProvider() {
  const { incrementOwners } = useUsersStore();

  useEffect(() => {
    const token = getToken();

    if (!token) {
      console.warn("No auth token found, skipping Pusher subscription.");
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      forceTLS: true,
      authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    });
 
    const channel = pusher.subscribe("private-admin.notifications");

    channel.bind("pusher:subscription_error", (err) => {
      console.error("Pusher subscription error:", err);
    });

    channel.bind("owner.created", (data) => {
      const owner = data.owner;

      const createdAt = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      incrementOwners();

      toast(
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "#dcfce7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            🏢
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 13,
                color: "#111827",
              }}
            >
              New company registered
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
              {owner?.business_name ?? "A new owner"} joined the platform
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9ca3af" }}>
              {createdAt}
            </p>
          </div>
        </div>,
        {
          type: "success",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
        }
      );
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe("private-admin.notifications");
      pusher.disconnect();
    };
  }, [incrementOwners]);

  return null;
}
