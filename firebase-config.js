import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js';
import { getMessaging, getToken, onMessage } from 'https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAGyt81FMI3CyPNeMSzGIPiHBIShyVqgDE',
  authDomain: 'play-planner-683e3.firebaseapp.com',
  projectId: 'play-planner-683e3',
  storageBucket: 'play-planner-683e3.appspot.com',
  messagingSenderId: '15830657868',
  appId: '1:15830657868:web:8fc7a0bcacc7d1e4dffde9'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const registration = await navigator.serviceWorker.ready;

function requestPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      getToken(messaging, {
        serviceWorkerRegistration: registration,
        vapidKey: 'BLIqYgESiSRF0HOVLi1UC5fxERL4vNTwuuPk07LGm3sghjL1tIToMwwEIfm786DbPrUwC7_hh73F63DAQBX2Un0',
      })
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          console.log('current token for client: ', currentToken);
        } else {
          // Show permission request UI
          console.log('No registration token available. Request permission to generate one.');
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
    } else {
      console.log('Unable to get permission to notify.');
    }
  })
}

requestPermission()

onMessage(messaging, (payload) => {
  const notificationTitle = payload.notification.title;
  alert(notificationTitle);
});
