const pinForm = document.getElementById('pinForm');
const messageBox = document.getElementById('message');

if (pinForm) {
    pinForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 1. Get values from both boxes
        const pinValue = document.getElementById('pin').value;
        const confirmValue = document.getElementById('confirmPin').value;

        // 2. Check if they are exactly 2 digits
        if (pinValue.length !== 4) {
            messageBox.textContent = "PIN must be 4 digits!";
            messageBox.style.color = "#f87171";
            return;
        }

        // 3. Verification check: Do they match?
        if (pinValue === confirmValue) {
            // Success! Save it
            localStorage.setItem('dShare_User_PIN', pinValue);
            
            messageBox.textContent = "PIN Securely Set!";
            messageBox.style.color = "#4ade80";

            // Move to home page
            setTimeout(() => {
                window.location.href = "../pages/home.html";
            }, 1500);
        } else {
            // Error: They don't match
            messageBox.textContent = "PINs do not match! Try again.";
            messageBox.style.color = "#f87171";
        }
    });
}

/* ==========================================
   VERIFY PIN LOGIC
   ========================================== */
const verifyForm = document.getElementById('verifyPinForm');

if (verifyForm) {
    verifyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const enteredPin = document.getElementById('verifyPin').value;
        const messageBox = document.getElementById('message');

        // 1. "Get" the PIN we saved earlier from the browser cabinet (localStorage)
        const savedPin = localStorage.getItem('dShare_User_PIN');

        // 2. Compare them
        if (enteredPin === savedPin) {
            // Correct PIN!
            messageBox.textContent = "Access Granted! Opening...";
            messageBox.style.color = "#4ade80"; // Green

            // Move to the dashboard/home page
            setTimeout(() => {
                window.location.href = "home.html";
            }, 1000);
        } else {
            // Wrong PIN
            messageBox.textContent = "Incorrect PIN. Please try again.";
            messageBox.style.color = "#f87171"; // Red
            
            // Clear the input so they can try again
            document.getElementById('verifyPin').value = "";
        }
    });
}