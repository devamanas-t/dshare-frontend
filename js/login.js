import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyD9Lg1F26zRxomTIKoIbCvAx-43JQ5ZR4A",
    authDomain: "d-share-ddd8f.firebaseapp.com",
    projectId: "d-share-ddd8f",
    storageBucket: "d-share-ddd8f.appspot.com",
    messagingSenderId: "465667459636",
    appId: "1:465667459636:web:e76c759ec7aa845c74d861"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- Email & Password Sign In ---
document.getElementById("loginBtn").onclick = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Email login successful!");
            // NEW: Save the Firebase User ID to the browser
            localStorage.setItem('firebase_uid', userCredential.user.uid);
            window.location.href = "home.html"; 
        })
        .catch((error) => {
            console.error("Email Login Error:", error.code, error.message);
            alert(error.message);
        });
};

// --- Google Sign In ---
const provider = new GoogleAuthProvider();

document.getElementById("googleLogin").onclick = () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Google login successful for:", result.user.email);
            // NEW: Save the Firebase User ID to the browser
            localStorage.setItem('firebase_uid', result.user.uid);
            window.location.href = "home.html"; 
        })
        .catch((error) => {
            console.error("Google Auth Error:", error.code, error.message);
            alert(error.message);
        });
};