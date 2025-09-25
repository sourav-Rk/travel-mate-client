import { useEffect } from "react";
import {
  requestForToken,
  listenForForegroundMessages,
} from "@/config/firebaseConfig";
import type { Client } from "@/store/slices/clientSlice";
import type { Vendor } from "@/store/slices/vendor.slice";
import { travelMateBackend } from "@/api/instance";

export const useFcmToken = (
  user: Client | Vendor | null,
  userType: "vendor" | "client"
) => {
  useEffect(() => {
    if (!user) {
      console.log("No user, skipping FCM token save");
      return;
    }

    const saveFcmToken = async () => {
      try {
        // Register service worker
        navigator.serviceWorker
          .register("/firebase-messaging-sw.js")
          .then((registration) => {
            console.log("Service Worker registered:", registration);
          })
          .catch((err) => {
            console.error("Service Worker registration failed:", err);
          });

        // Get FCM token
        const token = await requestForToken();
        console.log("FCM Token:", token);

        if (!token) {
          console.warn("No FCM token generated");
          return;
        }

        // Save token to backend
        console.log("Saving token to backend...");
        if (userType === "client") {
          const res = await travelMateBackend.post("/_cl/client/fcm/save", {
            token,
          });
          console.log("✅ FCM token saved:", res.data);
        } else if (userType === "vendor") {
          const res = await travelMateBackend.post("/_ve/vendor/fcm/save", {
            token,
          });
          console.log("✅ FCM token saved:", res.data);
        }
      } catch (error: any) {
        console.error("❌ Failed to save FCM token:", error);
      }
    };

    saveFcmToken();
    listenForForegroundMessages();
  }, [user]);
};
