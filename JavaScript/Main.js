window.addEventListener('load', () => {
    const userEmail = localStorage.getItem('userEmail');

    if (userEmail) {
        alert(`Login successful! Welcome, ${userEmail}`);
        localStorage.removeItem('userEmail'); // Optionally remove after login

        // Add a login notification and increment the notification count
        addLoginNotification(userEmail); // Increment count and add login notification
    }

    // Initialize the notification count if it doesn't exist
    if (localStorage.getItem('notificationCount') === null) {
        localStorage.setItem('notificationCount', '0');
    }

    // Update notification count and display on page load
    updateNotificationCount();

    // Initialize and update the bell icon with the current unread count
    const currentCount = parseInt(localStorage.getItem('notificationCount')) || 0;
    updateBellIcon(currentCount);
    console.log("User logged in, current count: ", currentCount);
});

// Function to add a login notification and update count
function addLoginNotification(email) {
    const loginTimestamp = new Date().toISOString();
    const loginNotification = { email, timestamp: loginTimestamp };

    // Save login notification to local storage
    let loginNotifications = JSON.parse(localStorage.getItem('loginNotifications')) || [];
    loginNotifications.push(loginNotification);
    localStorage.setItem('loginNotifications', JSON.stringify(loginNotifications));

    // Increment and update the unread count
    incrementNotificationCount();
}

// Increment notification count
function incrementNotificationCount() {
    let unreadCount = parseInt(localStorage.getItem('notificationCount')) || 0;
    unreadCount++; // Increment count
    localStorage.setItem('notificationCount', unreadCount); // Update local storage
    updateNotificationCount(); // Update UI
}

// Function to update the notification count in the UI
function updateNotificationCount() {
    const count = parseInt(localStorage.getItem('notificationCount')) || 0;
    const notificationCountElement = document.getElementById('notificationCount');
    if (notificationCountElement) {
        notificationCountElement.textContent = count;
        notificationCountElement.style.display = count > 0 ? 'inline' : 'none';
    } else {
        console.error("Notification count element not found! Please check the HTML.");
    }
}

// Function to update the bell icon with the current unread count
function updateBellIcon(count) {
    const bellIcon = document.getElementById('bellIcon');
    const countDisplay = document.getElementById('notificationCount');

    if (bellIcon && countDisplay) {
        countDisplay.innerText = count > 0 ? count : '';
        bellIcon.classList.toggle('has-notifications', count > 0);
    }
}

// Function to display both login and search notifications
function displayAllNotifications() {
    const notificationList = document.getElementById('notification-list');
    notificationList.innerHTML = ''; // Clear previous notifications

    // Get search and login notifications
    const searchedMaps = JSON.parse(localStorage.getItem('searchedMaps')) || [];
    const loginNotifications = JSON.parse(localStorage.getItem('loginNotifications')) || [];

    // Display search notifications
    searchedMaps.forEach(entry => {
        const searchNotification = document.createElement('div');
        searchNotification.textContent = `Searched Map: ${entry.mapName} at ${new Date(entry.timestamp).toLocaleString()}`;
        notificationList.prepend(searchNotification);
    });

    // Display login notifications
    loginNotifications.forEach(entry => {
        const loginNotification = document.createElement('div');
        loginNotification.textContent = `User: ${entry.email} logged in at ${new Date(entry.timestamp).toLocaleString()}`;
        notificationList.prepend(loginNotification);
    });
}

// Add an event listener for the notification link
document.getElementById('notificationLink').addEventListener('click', function() {
    // Show the notifications
    displayAllNotifications();

    // Reset notification count to 0 after viewing
    localStorage.setItem('notificationCount', '0');
    updateNotificationCount(); // Update the UI to reflect reset count
});
