"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("vsid");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("vsid", id);
  }
  return id;
}

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    const sessionId = getSessionId();

    // Initial pageview
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, path: pathname }),
    }).catch(() => {});

    // Heartbeat every 60s
    const interval = setInterval(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-heartbeat": "1" },
        body: JSON.stringify({ sessionId, path: pathname }),
      }).catch(() => {});
    }, 60_000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
