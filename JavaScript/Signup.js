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
    const webhookUrl = "https://webhook.site/0eaf34f7-6869-4dde-88ba-10cbfb3b6843";  // Replace with your actual webhook URL
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

// Handle signup form submission
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

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('Signup successful:', user.email);

                    // Store user email in localStorage
                    localStorage.setItem('userEmail', user.email);

                    // Send webhook notification on successful signup
                    sendWebhookNotification('User signed up', user.email);

                    // Redirect to Main.html after signup
                    window.location.href = "../index.html"; 
                })
                .catch((error) => {
                    console.error('Signup failed:', error.code, error.message);
                    alert('Signup failed: ' + error.message);
                });
        });
    }
});
