// js/firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyD9Lg1F26zRxomTIKoIbCvAx-43JQ5ZR4A",
  authDomain: "d-share-ddd8f.firebaseapp.com",
  projectId: "d-share-ddd8f",
  storageBucket: "d-share-ddd8f.firebasestorage.app",
  messagingSenderId: "465667459636",
  appId: "1:465667459636:web:e76c759ec7aa845c74d861"
};

const app = initializeApp(firebaseConfig);

export { app };