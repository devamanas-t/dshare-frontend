// ================= LOGIN =================

const loginForm = document.getElementById('loginForm');

if (loginForm) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageBox = document.getElementById('message');

    loginForm.addEventListener('submit', function(event) {

        event.preventDefault();

        const emailValue = emailInput.value;
        const passwordValue = passwordInput.value;

        if (emailValue === "admin@example.com" && passwordValue === "123456") {

            messageBox.textContent = "Login Successful! Redirecting...";
            messageBox.style.color = "#4ade80";
             // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = "../pages/verify-pin.html";
            }, 2000);

        } else {

            messageBox.textContent =
                "Invalid email or password. Try admin@example.com / 123456";
            messageBox.style.color = "#f87171";
        }

        console.log("Form Submitted!", {
            email: emailValue,
            password: passwordValue
        });
    });
}



/* ==========================================
   SIGNUP LOGIC
   ========================================== */
const signupForm = document.getElementById('signupForm');

// This 'if' check is important! It prevents errors when you are on the login page.
if (signupForm) {
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop page from refreshing

        // 1. Capture all the user input values
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('password').value;
        const messageBox = document.getElementById('message');

        // 2. Simple logic: For now, we just check if password is long enough
        if (password.length < 6) {
            messageBox.textContent = "Password must be at least 6 characters!";
            messageBox.style.color = "#f87171"; // Red error
        } else {
            // Success! 
            messageBox.textContent = "Account created successfully! Welcome, " + username;
            messageBox.style.color = "#4ade80"; // Green success

            console.log("New User Registered:", {
                user: username,
                gmail: email,
                mobile: phone,
                pass: password
            });

            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = "../pages/set-pin.html";
            }, 2000);
        }

    });
}
