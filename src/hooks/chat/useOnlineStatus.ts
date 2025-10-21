import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";

export function useOnlineStatus(currentUserId: string) {
  const { socket, isConnected } = useSocket();
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    if (!socket || !isConnected || !currentUserId) {
      setIsOnline(false);
      return;
    }

    console.log("🔍 Setting up online status tracking for:", currentUserId);

    const handleUserOnline = ({ userId }: { userId: string }) => {
      console.log("🟢 User online event received:", userId);
      if (userId === currentUserId) {
        setIsOnline(true);
        setLastSeen(new Date());
      }
    };

    const handleUserOffline = ({ userId }: { userId: string }) => {
      console.log("🔴 User offline event received:", userId);
      if (userId === currentUserId) {
        setIsOnline(false);
        setLastSeen(new Date());
      }
    };

    // Set up event listeners
    socket.on("user_online", handleUserOnline);
    socket.on("user_offline", handleUserOffline);

    // Initial status check with retry
    const checkOnlineStatus = () => {
      console.log("📡 Checking initial online status for:", currentUserId);
      socket.emit("check_online_status", { userId: currentUserId }, (response: { isOnline: boolean }) => {
        if (response) {
          console.log("✅ Online status response:", response);
          setIsOnline(response.isOnline);
        } else {
          console.log("❌ No response for online status, assuming offline");
          setIsOnline(false);
        }
      });
    };

    // Check status immediately
    checkOnlineStatus();

    // Set up periodic status checks (optional, for reliability)
    const statusInterval = setInterval(checkOnlineStatus, 30000); // Every 30 seconds

    return () => {
      console.log("🧹 Cleaning up online status listeners for:", currentUserId);
      socket.off("user_online", handleUserOnline);
      socket.off("user_offline", handleUserOffline);
      clearInterval(statusInterval);
    };
  }, [socket, isConnected, currentUserId]);

  return {isOnline,lastSeen};
}