// Import des scripts Firebase Messaging compatibles Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Configuration Firebase (utilisez exactement les mêmes identifiants que dans votre fichier HTML principal)
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  databaseURL: "VOTRE_DATABASE_URL",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_Voici le code standard et complet à placer dans votre fichier **`firebase-messaging-sw.js`**. 

Ce fichier doit impérativement être placé à la **racine de votre serveur web** (par exemple : `https://votre-site.com/firebase-messaging-sw.js`).

```javascript
// Importation des bibliothèques Firebase nécessaires pour le Service Worker (v10.8.0 pour correspondre à votre HTML)
importScripts('[https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js](https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js)');
importScripts('[https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js](https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js)');

// Configuration Firebase (Remplacez les valeurs par vos clés Firebase réelles)
const firebaseConfig = {
  apiKey: "VOTRE_API_KEY",
  authDomain: "VOTRE_AUTH_DOMAIN",
  projectId: "VOTRE_PROJECT_ID",
  storageBucket: "VOTRE_STORAGE_BUCKET",
  messagingSenderId: "VOTRE_MESSAGING_SENDER_ID",
  appId: "VOTRE_APP_ID"
};

// Initialisation de Firebase dans le Service Worker
firebase.initializeApp(firebaseConfig);

// Initialisation du service de messagerie
const messaging = firebase.messaging();

// Gestion de la réception des notifications lorsque l'application est en arrière-plan ou fermée
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Message reçu en arrière-plan :', payload);

  const notificationTitle = payload.notification?.title || 'Nouvelle notification EHES';
  const notificationOptions = {
    body: payload.notification?.body || 'Vous avez reçu un nouveau message.',
    icon: payload.notification?.icon || '/icon.png', // Optionnel : chemin vers le logo de votre école/application
    badge: '/badge.png' // Optionnel : icône de notification pour Android
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

