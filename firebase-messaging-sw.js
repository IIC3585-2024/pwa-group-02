importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js")
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js")
// Reference to import: https://stackoverflow.com/questions/72249364/getmessaging-failing-uncaught-syntaxerror-cannot-use-import-statement-outside

const firebaseConfig = {
    apiKey: 'AIzaSyAGyt81FMI3CyPNeMSzGIPiHBIShyVqgDE',
    authDomain: 'play-planner-683e3.firebaseapp.com',
    projectId: 'play-planner-683e3',
    storageBucket: 'play-planner-683e3.appspot.com',
    messagingSenderId: '15830657868',
    appId: '1:15830657868:web:8fc7a0bcacc7d1e4dffde9'
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
// Comment below to disable possible double notification
  // const notificationTitle = payload.notification.title;
  // const notificationOptions = {
  //   body: payload.notification.body,
  //   icon: payload.notification.icon,
  // };
  // self.registration.showNotification(notificationTitle,
  //   notificationOptions);
});