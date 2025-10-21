import { useEffect, useState, useRef } from "react";
import {
  connectSocket,
  disconnectSocket,
  onConnectionChange,
} from "@/services/socket";
import { useClientAuth } from "../auth/useAuth";

export function useSocketConnection() {
  const user = useClientAuth();
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const userRef = useRef<string | null>(null);

  useEffect(() => {
    const currentUserId = user?.clientInfo?.id || user.clientInfo?.role || null;

    console.log("🔄 Socket connection hook triggered, user ID:", currentUserId);

    if (currentUserId === userRef.current) {
      return;
    }

    userRef.current = currentUserId;

    if (currentUserId) {
      console.log(" User detected, connecting socket...");
      connectSocket();

      const unsubscribe = onConnectionChange((connected) => {
        setIsSocketConnected(connected);
      });

      return () => {
        console.log("🧹 Cleaning up socket connection in hook...");
        unsubscribe();
        // Don't disconnect immediately - let the socket service handle reconnection
        // disconnectSocket();
      };
    } else {
      console.log("No user, disconnecting socket from hook");
      disconnectSocket();
      setIsSocketConnected(false);
    }
  }, [user?.clientInfo?.id, user.clientInfo?.role]);
  return { isSocketConnected };
}
