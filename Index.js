// Import Firebase app and authentication modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

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

document.addEventListener('mousemove', (e) => {
    const { clientX: x, clientY: y } = e; // Get cursor x, y
    const { innerWidth: width, innerHeight: height } = window; // Get screen width, height

    // Calculate background position as a percentage relative to the cursor
    const xPercent = (x / width) * 100;
    const yPercent = (y / height) * 100;

    // Set the background position dynamically
    document.body.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
});

// Function to send login data to the server
function sendLoginDataToServer(email) {
    const serverUrl = "http://localhost:3000/send-login-data"; // Change this to your server's URL
    const payload = {
        email: email,
        timestamp: new Date().toISOString(),
        message: "User logged in"
    };

    fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Login data sent to server:', response);
    })
    .catch(error => console.error('Error sending login data to server:', error));
}

// Handle login form submission
window.addEventListener('load', () => {
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    // Toggle password visibility
    togglePassword.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.textContent = type === 'password' ? '👁️' : '👁️‍🗨️'; 
    });

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('username').value;
            const password = passwordInput.value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log('Login successful:', user.email);

                    // Store user email in localStorage
                    localStorage.setItem('userEmail', user.email);

                    // Send login data to the server
                    sendLoginDataToServer(user.email);

                    // Show the success popup after signup
                    const popup = document.getElementById('popup');
                    popup.style.display = 'flex'; // Show the popup

                    // Close the popup when the "Close" button is clicked
                    const closePopup = document.getElementById('closePopup');
                    closePopup.addEventListener('click', () => {
                        popup.style.display = 'none'; // Hide the popup
                        // Optionally, redirect after closing popup
                        window.location.href = "Html/Main.html"; 
                    });
                })
                .catch((error) => {
                    console.error('Login failed:', error.code, error.message);

                    // Show error popup
                    const errorPopup = document.getElementById('errorPopup');
                    const closeErrorPopup = document.getElementById('closeErrorPopup');
                    errorPopup.style.display = 'flex'; // Show the error popup

                    // Close the error popup when the "Close" button is clicked
                    closeErrorPopup.addEventListener('click', () => {
                        errorPopup.style.display = 'none'; // Hide the error popup
                    });
                });
        });
    }
});
