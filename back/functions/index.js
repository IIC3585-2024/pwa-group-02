const functions = require('firebase-functions');
const express = require('express');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let api = express();
api.get('/', async (req, res) => {
  const snapshot = await getDocs(collection(db, "songLists"));
  res.send(snapshot.docs.map(doc => doc.data()))
});

api.post('/create', async (req, res) => {
  try {
    const body = req.body;
    const listName = body.name;
    const docRef = doc(db, "songLists", listName)
    await setDoc(docRef, body);
    res.status(201);
    res.send("OK");
  } catch (e) {
    res.status(500);
    res.send("Error adding document: " + e);
  }
});

api.put('/update', async (req, res) => {
  try {
    const body = req.body;
    const listName = body.name;
    const docRef = doc(db, "songLists", listName)
    await updateDoc(docRef, body);
    res.status(201);
    res.send("OK");
  } catch (e) {
    res.status(500);
    res.send("Error updating document: " + e);
  }
});

api.delete('/delete', async (req, res) => {
  try {
    const body = req.body;
    const listName = body.name;
    const docRef = doc(db, "songLists", listName)
    await deleteDoc(docRef);
    res.status(201);
    res.send("OK");
  } catch (e) {
    res.status(500);
    res.send("Error deleting document: " + e);
  }
});

exports.api = functions.https.onRequest(api);
