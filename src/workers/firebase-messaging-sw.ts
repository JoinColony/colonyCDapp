/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag
import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';
import { precacheAndRoute } from 'workbox-precaching';

export type {};
declare const self: ServiceWorkerGlobalScope;

// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);

const firebaseConfig = process.env.FIREBASE_CONFIG
  ? JSON.parse(process.env.FIREBASE_CONFIG)
  : {};

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging();
onBackgroundMessage(messaging, (payload) => {
  // Customize notification here
  const notificationTitle = payload?.data?.title || 'Colony Notification';
  const notificationOptions = {
    body: payload?.data?.body,
    icon: 'favicon.png',
    // We can pass in many more options here
    // https://developer.mozilla.org/en-US/docs/Web/API/notification
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  // All notification options can be reached via event.notification
  const targetBase = 'http://localhost:9091';
  const openToRoute = 'landing';

  event.notification.close();

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a tab open with any route under targetBase
        for (const client of clientList) {
          if (client.url.startsWith(targetBase) && 'focus' in client) {
            return client.focus(); // Focus the existing tab
          }
        }

        // If no tab is found, open a new tab with the default route (change to any desired route)
        if (self.clients.openWindow) {
          return self.clients.openWindow(`${targetBase}/${openToRoute}`);
        }

        return undefined;
      }),
  );
});
