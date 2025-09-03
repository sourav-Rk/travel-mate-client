import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import toast from "react-hot-toast";
import { NotificationToast } from "@/components/toaster/NotificationToaster";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const messaging = getMessaging(app);

export const requestForToken = async (): Promise<string | null> => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Notification permission not granted");
      return null;
    }

    const currentToken = await getToken(messaging, {
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
  serviceWorkerRegistration: await navigator.serviceWorker.ready,
});

    if (currentToken) {
      console.log("FCM TOKEN:", currentToken);
      return currentToken;
    } else {
      console.warn(
        "No registration token available. Request permission to generate one."
      );
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token.", error);
    return null;
  }
};

export const listenForForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    const title = payload.notification?.title || "New Notification";
    const body = payload.notification?.body || "You have a new message";

    toast.custom((t) => <NotificationToast t={t} title={title} body={body} />, {
      duration: 7000,
    });
  });
};
