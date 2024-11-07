// Function to send a webhook notification
function sendWebhookNotification(action, userEmail) {
    const webhookUrl = "http://localhost:3000/send-login-data"; // URL to send login data to server
    const payload = {
        action: action,
        userEmail: userEmail,
        timestamp: new Date().toISOString(),
    };

    fetch(webhookUrl, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (response.ok) {
            console.log('Webhook notification sent:', response);
        } else {
            console.error('Error sending webhook notification:', response.statusText);
        }
    })
    .catch(error => console.error('Error sending webhook notification:', error));
}

// Function to fetch login notifications from the server
function fetchLoginNotifications() {
    const serverUrl = "http://localhost:3000/logs/login";

    fetch(serverUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched login notifications:', data);

            const notifications = data.data || [];
            const sortedNotifications = notifications.sort((a, b) => {
                const timeA = JSON.parse(a.content).timestamp;
                const timeB = JSON.parse(b.content).timestamp;
                return timeB - timeA;  // Newest first
            });

            const loginNotificationList = document.getElementById('loginNotificationList');
            loginNotificationList.innerHTML = '';  // Clear previous notifications

            sortedNotifications.forEach(entry => {
                const parsedContent = JSON.parse(entry.content);
                const notification = document.createElement('div');
                notification.textContent = `User: ${parsedContent.email} logged in at ${new Date(parsedContent.timestamp).toLocaleString()}`;

                // Prepend the newest notifications to the top
                loginNotificationList.prepend(notification);
            });
        })
        .catch(error => {
            console.error('Error fetching login notifications:', error);
        });
}


// Function to fetch searched maps notifications from the server
function fetchSearchNotifications() {
    const serverUrl = "http://localhost:3000/logs/search";

    fetch(serverUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Fetched search notifications:', data);

            const notifications = data.data || [];
            const sortedNotifications = notifications.sort((a, b) => {
                const timeA = JSON.parse(a.content).timestamp;
                const timeB = JSON.parse(b.content).timestamp;
                return timeB - timeA;  // Newest first
            });

            const searchNotificationList = document.getElementById('searchNotificationList');
            searchNotificationList.innerHTML = '';  // Clear previous notifications

            sortedNotifications.forEach(entry => {
                const parsedContent = JSON.parse(entry.content);
                const notification = document.createElement('div');
                notification.textContent = `Searched Map: ${parsedContent.mapName}, Timestamp: ${new Date(parsedContent.timestamp).toLocaleString()}`;

                // Prepend the newest notifications to the top
                searchNotificationList.prepend(notification);
            });
        })
        .catch(error => {
            console.error('Error fetching search notifications:', error);
        });
}

// Example usage on page load
window.addEventListener('load', () => {
    fetchLoginNotifications();  // Fetch login notifications
    fetchSearchNotifications(); // Fetch search notifications
});
