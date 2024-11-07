// Import Firebase app and authentication modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBs36HCXOfI20AnKIFiUjpK5jBNXIo_lwo",
    authDomain: "sia101-activity2-libarbas.firebaseapp.com",
    projectId: "sia101-activity2-libarbas",
    storageBucket: "sia101-activity2-libarbas.appspot.com",
    messagingSenderId: "568123358046",
    appId: "1:568123358046:web:ca9b6bd8894160e3c0adcf",
    measurementId: "G-0JYEL97PJB"
};

document.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e; // Get cursor x, y
    const { innerWidth: width, innerHeight: height } = window; // Get screen width, height

    // Calculate background position as a percentage relative to the cursor
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    // Set the background position dynamically
    document.body.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to send a webhook notification for signup
function sendWebhookNotification(action, userEmail) {
    const webhookUrl = "https://webhook.site/55735d4c-4dd8-447a-9758-b50e87a3c96a";  // Replace with your actual webhook URL
    const payload = {
        action: action,
        userEmail: userEmail,
    };
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors', // Explicitly specify CORS mode
        body: JSON.stringify(payload),
    })
    .then(response => {
        console.log('Webhook notification response status:', response.status);
        return response.json();
    })
    .then(data => console.log('Webhook notification data:', data))
    .catch(error => console.error('Error sending webhook notification:', error));    
}

window.addEventListener('load', () => {
    const signupForm = document.getElementById('signupForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmpassword'); 

    // Toggle password visibility
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });

    // Toggle password visibility for the confirm password field
    toggleConfirmPassword.addEventListener('click', function () {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
    });
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('username').value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            // Check if passwords match
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return; // Prevent form submission if passwords don't match
            }

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('Signup successful:', user.email);

                    // Store user email in localStorage
                    localStorage.setItem('userEmail', user.email);

                    // Send webhook notification on successful signup
                    sendWebhookNotification('User signed up', user.email);

                    // Show the success popup after signup
                    const popup = document.getElementById('popup');
                    popup.style.display = 'flex'; // Show the popup

                    // Close the popup when the "Close" button is clicked
                    const closePopup = document.getElementById('closePopup');
                    closePopup.addEventListener('click', () => {
                        popup.style.display = 'none'; // Hide the popup
                        // Optionally, redirect after closing popup
                        window.location.href = "../index.html"; 
                    });
                })
                .catch((error) => {
                    console.error('Signup failed:', error.code, error.message);
                    alert('Signup failed: ' + error.message);
                });
        });
    }
});

// Add this to your signup.js

document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting before validation

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmpassword').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        // Show the password mismatch popup
        document.getElementById('passwordMismatchPopup').style.display = 'flex';
    } else {
        // If passwords match, you can proceed with the form submission
        document.getElementById('signupForm').submit();
    }
});

// Close the popup when the user clicks "Close"
document.getElementById('closePasswordMismatchPopup').addEventListener('click', function() {
    document.getElementById('passwordMismatchPopup').style.display = 'none';
});
