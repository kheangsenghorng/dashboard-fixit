"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";
import Pusher from "pusher-js";
import { useUsersStore } from "../store/useUsersStore";
import { getToken } from "../../lib/token";

const formatDate = () =>
  new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function ToastBody({ emoji, emojiColor, title, description, time }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          background: emojiColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {emoji}
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
          {title}
        </p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>
          {description}
        </p>
        <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9ca3af" }}>
          {time}
        </p>
      </div>
    </div>
  );
}

const toastConfig = {
  autoClose: 5000,
  closeOnClick: true,
  pauseOnHover: true,
};

export default function ListenToastProvider() {
  const { incrementOwners, decrementOwners } = useUsersStore();

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const appKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!appKey || !cluster || !apiUrl) {
      console.error("Missing Pusher environment variables.");
      return;
    }

    const pusher = new Pusher(appKey, {
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

    const channel = pusher.subscribe("private-admin.notifications");

    const handleOwnerChanged = ({ action, owner, ownerId }) => {
      const time = formatDate();

      if (action === "created") {
        incrementOwners();

        toast(
          <ToastBody
            emoji="🏢"
            emojiColor="#dcfce7"
            title="New company registered"
            description={`${
              owner?.business_name ?? "A new owner"
            } joined the platform`}
            time={time}
          />,
          { ...toastConfig, type: "success" }
        );

        return;
      }

      if (action === "updated") {
        toast(
          <ToastBody
            emoji="✏️"
            emojiColor="#dbeafe"
            title="Company updated"
            description={`${
              owner?.business_name ?? "An owner"
            } profile was updated`}
            time={time}
          />,
          { ...toastConfig, type: "info" }
        );

        return;
      }

      if (action === "deleted") {
        decrementOwners();

        toast(
          <ToastBody
            emoji="🗑️"
            emojiColor="#fee2e2"
            title="Company removed"
            description={`Owner #${ownerId ?? owner?.id ?? ""} was deleted`}
            time={time}
          />,
          { ...toastConfig, type: "error" }
        );
      }
    };

    channel.bind("owner.changed", handleOwnerChanged);

    return () => {
      channel.unbind("owner.changed", handleOwnerChanged);
      pusher.unsubscribe("private-admin.notifications");
      pusher.disconnect();
    };
  }, [incrementOwners, decrementOwners]);

  return null;
}
