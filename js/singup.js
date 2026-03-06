import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
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

        // Getting only Username, Email, and Password
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if(submitBtn) submitBtn.disabled = true;
        
        message.style.color = "#cbd5e1";
        message.innerText = "Creating account...";

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Attach the username to the Firebase profile
                updateProfile(user, {
                    displayName: username
                }).then(() => {
                    console.log("Successfully created user:", user.displayName, user.email);
                    
                    message.style.color = "#4ade80"; 
                    message.innerText = "Account created! Taking you to login...";
                    
                    // Redirect to login page
                    setTimeout(() => {
                        window.location.href = "login.html";
                    }, 1500);
                });
            })
            .catch((error) => {
                console.error("Firebase Auth Error:", error.code, error.message);
                message.style.color = "#ef4444"; 
                
                if (error.code === 'auth/email-already-in-use') {
                    message.innerText = "An account with this email already exists.";
                } else if (error.code === 'auth/weak-password') {
                    message.innerText = "Password must be at least 6 characters.";
                } else {
                    message.innerText = error.message; 
                }
                
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
                console.log("Google Sign-In Success:", result.user.displayName);
                window.location.href = "login.html"; 
            })
            .catch((error) => {
                console.error("Google Auth Error:", error.code, error.message);
                message.style.color = "#ef4444";
                message.innerText = error.message;
            });
    });
}