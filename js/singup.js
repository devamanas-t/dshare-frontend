import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
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

const form = document.getElementById("signupForm");
const message = document.getElementById("message");

// --- Email & Password Sign Up ---
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Success Block
            console.log("Successfully created user:", userCredential.user);
            
            message.style.color = "#4ade80"; // Green text for success
            message.innerText = "Account created successfully! Redirecting to login...";
            
            // 2-second delay so the user can read the message before jumping pages
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        })
        .catch((error) => {
            // Error Block
            console.error("Firebase Auth Error:", error.code, error.message);
            
            message.style.color = "#ef4444"; // Red text for errors
            
            // Provide cleaner error messages for common issues
            if (error.code === 'auth/email-already-in-use') {
                message.innerText = "An account with this email already exists.";
            } else if (error.code === 'auth/weak-password') {
                message.innerText = "Password is too weak. It must be at least 6 characters.";
            } else {
                message.innerText = error.message; 
            }
        });
});

// --- Google Sign Up ---
const provider = new GoogleAuthProvider();
const googleBtn = document.getElementById("googleSignup");

// Using addEventListener is generally safer than onclick
googleBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Google Sign-In Success:", result.user);
            window.location.href = "home.html";
        })
        .catch((error) => {
            console.error("Google Auth Error:", error.code, error.message);
            message.style.color = "#ef4444";
            message.innerText = error.message;
        });
});