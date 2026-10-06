"use client";

import { useEffect, useRef, useState } from "react";
import type { Branch } from "@/lib/locations";
import { branchQuery } from "@/lib/locations";

type MapsNs = {
  Map: new (
    el: HTMLElement,
    opts: Record<string, unknown>,
  ) => {
    panTo: (ll: { lat: number; lng: number }) => void;
    setZoom: (z: number) => void;
    fitBounds: (b: unknown) => void;
  };
  Marker: new (opts: Record<string, unknown>) => {
    setMap: (m: unknown) => void;
    addListener: (ev: string, fn: () => void) => void;
  };
  InfoWindow: new (opts: Record<string, unknown>) => {
    open: (opts: { map: unknown; anchor: unknown }) => void;
    close: () => void;
  };
  LatLngBounds: new () => { extend: (ll: { lat: number; lng: number }) => void };
  event: { addListenerOnce: (map: unknown, ev: string, fn: () => void) => void };
};

declare global {
  interface Window {
    google?: { maps: MapsNs };
  }
}

const MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#f6eef3" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5a3a4e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f6eef3" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "water", stylers: [{ color: "#e4d0dc" }] },
  {
    featureType: "administrative",
    elementType: "geometry.stroke",
    stylers: [{ color: "#d7bccb" }],
  },
];

function loadMaps(key: string) {
  if (window.google?.maps) return Promise.resolve();
  const existing = document.querySelector<HTMLScriptElement>("script[data-kharis-maps]");
  if (existing) {
    return new Promise<void>((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("maps")), { once: true });
    });
  }
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}`;
    script.async = true;
    script.defer = true;
    script.dataset.kharisMaps = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("maps"));
    document.head.appendChild(script);
  });
}

type Props = {
  branches: Branch[];
  active: Branch;
  onSelect: (branch: Branch) => void;
};

export function BranchMap({ branches, active, onSelect }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<InstanceType<MapsNs["Map"]> | null>(null);
  const markersRef = useRef<InstanceType<MapsNs["Marker"]>[]>([]);
  const infoRef = useRef<InstanceType<MapsNs["InfoWindow"]> | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
  const [useJs, setUseJs] = useState(Boolean(apiKey));

  useEffect(() => {
    if (!apiKey || !hostRef.current) return;
    let cancelled = false;

    loadMaps(apiKey)
      .then(() => {
        if (cancelled || !hostRef.current || !window.google?.maps) return;
        const maps = window.google.maps;
        const map = new maps.Map(hostRef.current, {
          center: { lat: active.lat, lng: active.lng },
          zoom: 6,
          styles: MAP_STYLES,
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
          gestureHandling: "cooperative",
        });
        mapRef.current = map;
        const bounds = new maps.LatLngBounds();
        const info = new maps.InfoWindow({});
        infoRef.current = info;

        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = branches.map((branch) => {
          bounds.extend({ lat: branch.lat, lng: branch.lng });
          const marker = new maps.Marker({
            map,
            position: { lat: branch.lat, lng: branch.lng },
            title: branch.name,
          });
          marker.addListener("click", () => {
            onSelect(branch);
            info.close();
            info.open({ map, anchor: marker });
          });
          return marker;
        });

        maps.event.addListenerOnce(map, "idle", () => {
          map.fitBounds(bounds);
        });
      })
      .catch(() => {
        if (!cancelled) setUseJs(false);
      });

    return () => {
      cancelled = true;
    };
    // Map is created once; panning is handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  useEffect(() => {
    const map = mapRef.current;
    const info = infoRef.current;
    if (!map) return;
    map.panTo({ lat: active.lat, lng: active.lng });
    map.setZoom(13);
    const marker = markersRef.current[branches.findIndex((b) => b.name === active.name)];
    if (info && marker) {
      info.close();
      const address = active.address
        ? `<p style="margin:4px 0 0;font-size:13px;color:#5a3a4e">${active.address}</p>`
        : "";
      (info as unknown as { setContent: (html: string) => void }).setContent(
        `<div style="font-family:inherit;padding:2px 4px"><strong>${active.name}</strong>${address}</div>`,
      );
      info.open({ map, anchor: marker });
    }
  }, [active, branches]);

  const embedSrc = `https://www.google.com/maps?q=${branchQuery(active)}&z=13&output=embed`;

  return (
    <div className="branch-map">
      {useJs ? (
        <div ref={hostRef} className="branch-map__canvas" />
      ) : (
        <iframe
          title={`Map of ${active.name}`}
          src={embedSrc}
          className="branch-map__frame"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      )}
    </div>
  );
}
