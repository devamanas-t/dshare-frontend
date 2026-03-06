import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// --- FIREBASE CONFIG ---
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

// --- DOM ELEMENTS ---
const form = document.getElementById("signupForm");
const message = document.getElementById("message");
const googleBtn = document.getElementById("googleSignup");

// --- EMAIL & PASSWORD SIGN UP ---
if (form) {
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        // Disable button to prevent multiple clicks
        const submitBtn = form.querySelector('button[type="submit"]');
        if(submitBtn) submitBtn.disabled = true;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Successfully created user:", userCredential.user);
                message.style.color = "#4ade80"; // Green
                message.innerText = "Account created! Taking you to login...";
                
                // Redirect immediately after 1.5 seconds
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);
            })
            .catch((error) => {
                console.error("Firebase Auth Error:", error.code, error.message);
                message.style.color = "#ef4444"; // Red
                
                // Friendly error messages
                if (error.code === 'auth/email-already-in-use') {
                    message.innerText = "An account with this email already exists.";
                } else if (error.code === 'auth/weak-password') {
                    message.innerText = "Password must be at least 6 characters.";
                } else {
                    message.innerText = error.message; 
                }
                
                // Re-enable button
                if(submitBtn) submitBtn.disabled = false;
            });
    });
}

// --- GOOGLE SIGN UP ---
if (googleBtn) {
    const provider = new GoogleAuthProvider();
    googleBtn.addEventListener("click", () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Google Sign-In Success:", result.user);
                // Redirecting to login after Google sign up, just like email
                window.location.href = "login.html"; 
            })
            .catch((error) => {
                console.error("Google Auth Error:", error.code, error.message);
                message.style.color = "#ef4444";
                message.innerText = error.message;
            });
    });
}