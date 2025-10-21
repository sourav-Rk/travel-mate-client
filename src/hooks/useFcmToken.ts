import { useEffect } from "react";
import {
  requestForToken,
  listenForForegroundMessages,
} from "@/config/firebaseConfig";
import { travelMateBackend } from "@/api/instance";
import type { IClient, IVendor } from "@/types/User";

export const useFcmToken = (
  user: IClient | IVendor | null,
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
       

        if (!token) {
          
          return;
        }

        // Save token to backend
        console.log("Saving token to backend...");
        if (userType === "client") {
          const res = await travelMateBackend.post("/client/fcm/save", {
            token,
          });
        
        } else if (userType === "vendor") {
          const res = await travelMateBackend.post("/vendor/fcm/save", {
            token,
          });
        
        }
      } catch (error: any) {
        console.error("❌ Failed to save FCM token:", error);
      }
    };

    saveFcmToken();
    listenForForegroundMessages();
  }, [user]);
};
