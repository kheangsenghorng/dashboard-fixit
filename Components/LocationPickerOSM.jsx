"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

// react-leaflet (client only)
const MapContainer = dynamic(() => import("react-leaflet").then((m) => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((m) => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), { ssr: false });
const useMapEvents = dynamic(() => import("react-leaflet").then((m) => m.useMapEvents), { ssr: false });

function ClickHandler({ onPick }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerOSM({
  value,
  onChange,
  defaultCenter = { lat: 11.5564, lng: 104.9282 }, // Phnom Penh
  height = 420,
}) {
  const [pos, setPos] = useState(value?.lat ? { lat: value.lat, lng: value.lng } : null);
  const [address, setAddress] = useState(value?.address || "");
  const [loadingAddr, setLoadingAddr] = useState(false);

  // ✅ Leaflet marker icon (client-only)
  const [markerIcon, setMarkerIcon] = useState(null);

  useEffect(() => {
    let mounted = true;

    // load leaflet only on client
    import("leaflet").then((L) => {
      if (!mounted) return;

      const icon = new L.Icon({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      });

      setMarkerIcon(icon);
    });

    return () => {
      mounted = false;
    };
  }, []);

  const center = useMemo(() => pos ?? defaultCenter, [pos, defaultCenter]);
  const debounceRef = useRef(null);

  // ✅ Reverse geocode using YOUR LARAVEL BACKEND
  const reverseGeocode = useCallback(
    async (lat, lng) => {
      setLoadingAddr(true);

      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

        // ✅ IMPORTANT: api.php routes are prefixed with /api
        const url = `${base}/api/geocode/reverse?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`;

        const res = await fetch(url, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Reverse geocode failed: ${res.status} ${txt}`);
        }

        const json = await res.json();
        const display = json?.data?.display_name || "";

        setAddress(display);
        onChange?.({ lat, lng, address: display });
      } catch (err) {
        console.error(err);
        setAddress("");
        onChange?.({ lat, lng, address: "" });
      } finally {
        setLoadingAddr(false);
      }
    },
    [onChange]
  );

  const pick = useCallback(
    (lat, lng) => {
      setPos({ lat, lng });

      // debounce reverse geocode (drag events)
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        reverseGeocode(lat, lng);
      }, 350);
    },
    [reverseGeocode]
  );

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (p) => pick(p.coords.latitude, p.coords.longitude),
      (err) => {
        console.error(err);
        alert("Permission denied or location unavailable");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [pick]);

  useEffect(() => {
    if (value?.lat && value?.lng) {
      setPos({ lat: value.lat, lng: value.lng });
      setAddress(value.address || "");
    }
  }, [value?.lat, value?.lng, value?.address]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={useMyLocation}
          className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm"
        >
          Use my location
        </button>
        <div className="text-sm text-slate-600">Click map to pin. Drag pin to adjust.</div>
      </div>

      <div className="rounded-2xl overflow-hidden border border-slate-200">
        <MapContainer
          center={center}
          zoom={pos ? 16 : 12}
          style={{ height, width: "100%" }}
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <ClickHandler onPick={pick} />

          {pos && markerIcon && (
            <Marker
              position={pos}
              icon={markerIcon}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const latlng = e.target.getLatLng();
                  pick(latlng.lat, latlng.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="text-xs text-slate-500">Address</div>
        <div className="font-medium break-words">
          {loadingAddr ? "Getting address…" : address || "-"}
        </div>
      </div>

      {/* optional manual edit */}
      <input
        value={address}
        onChange={(e) => {
          const newAddr = e.target.value;
          setAddress(newAddr);
          onChange?.({ lat: pos?.lat ?? null, lng: pos?.lng ?? null, address: newAddr });
        }}
        placeholder="Address (auto from map, you can edit)"
        className="w-full px-4 py-3 rounded-2xl border border-slate-200"
      />
    </div>
  );
}