 
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyABq0t5s9nASS8tRV0qGEiGHifqP1zCou0",
  authDomain: "travelmate-4ff6a.firebaseapp.com",
  projectId: "travelmate-4ff6a",
  storageBucket: "travelmate-4ff6a.firebasestorage.app",
  messagingSenderId: "657378895750",
  appId: "1:657378895750:web:d9fea8d57eb5409ee32e07",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
