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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to send a webhook notification for signup
function sendWebhookNotification(action, userEmail) {
    const webhookUrl = "https://webhook.site/0eaf34f7-6869-4dde-88ba-10cbfb3b6843";
    const payload = {
        action: action,
        userEmail: userEmail,
    };
    fetch(webhookUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => console.log('Webhook notification sent:', response))
    .catch(error => console.error('Error sending webhook notification:', error));
}

// Function to show popup message
function showPopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'flex';  // Display the popup
}

// Function to hide popup message
function hidePopup() {
    const popup = document.getElementById('popup');
    popup.style.display = 'none';
}

// Handle signup form submission
window.addEventListener('load', () => {
    const signupForm = document.getElementById('signupForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmpassword'); 
    const closePopup = document.getElementById('closePopup');

    // Close popup when 'Close' button is clicked
    closePopup.addEventListener('click', () => {
        hidePopup();
        window.location.href = "../index.html"; // Redirect to login page
    });

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

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('Signup successful:', user.email);

                    // Store user email in localStorage
                    localStorage.setItem('userEmail', user.email);

                    // Send webhook notification on successful signup
                    sendWebhookNotification('User signed up', user.email);

                    // Show popup and redirect after 2 seconds
                    showPopup();
                    setTimeout(() => {
                        window.location.href = "../index.html";
                    }, 2000); // Wait for 2 seconds before redirecting
                })
                .catch((error) => {
                    console.error('Signup failed:', error.code, error.message);
                    alert('Signup failed: ' + error.message);
                });
        });
    }
});
