let map = L.map('map').setView([12.8797, 121.7740], 5); // Set initial view to the Philippines
let marker; // Declare marker variable to store the search result marker

// Add the OpenStreetMap tile layer
const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

// Add the Satellite tile layer (using Esri World Imagery)
const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.esri.com/en-us/home">Esri</a> contributors'
});

// Create layer groups for different types of layers
let markerLayer = L.layerGroup().addTo(map); // Layer for markers

// Define base maps
let baseMaps = {
    "OpenStreetMap": tileLayer,      // OpenStreetMap layer
    "Satellite": satelliteLayer,      // Esri World Imagery layer for satellite view
};

// Add the default layer (OpenStreetMap) to the map
tileLayer.addTo(map);

// Add layer control to the map
L.control.layers(baseMaps, {}).addTo(map);

// Initialize notification count in local storage
if (localStorage.getItem('notificationCount') === null) {
    localStorage.setItem('notificationCount', 0);
}

// Function to save searched maps to localStorage
function saveSearchedMap(mapName) {
    let searchedMaps = JSON.parse(localStorage.getItem('searchedMaps')) || [];
    // Add current timestamp
    const timestamp = new Date().toISOString();
    searchedMaps.push({ mapName, timestamp });
    localStorage.setItem('searchedMaps', JSON.stringify(searchedMaps));
}

// Function to search and locate a place on the map
function searchLocation() {
    const searchQuery = document.getElementById('location-search').value;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const { lat, lon, display_name } = data[0];

                map.setView([lat, lon], 10);

                if (marker) {
                    map.removeLayer(marker);
                }

                marker = L.marker([lat, lon]).addTo(markerLayer)
                    .bindPopup(`<b>${display_name}</b>`)
                    .openPopup();

                saveSearchedMap(display_name); // Save the display name for notifications
                displaySearchedMapsNotifications(); // Show the notifications

                // Increment the notification count
                let currentCount = parseInt(localStorage.getItem('notificationCount'));
                currentCount++;
                localStorage.setItem('notificationCount', currentCount);
                updateNotificationCount(); // Update the UI with new count

                // Send webhook notification with mapName, lat, and lon
                sendSearchNotification(display_name, lat, lon); // Pass lat and lon to the function

            } else {
                alert('Location not found');
            }
        })
        .catch(error => {
            console.error('Error fetching location:', error);
        });
}

// Function to send a webhook notification for search
function sendSearchNotification(mapName) {
    const webhookUrl = "http://localhost:3000/send-search-data";
    const payload = {
        action: "Map Search",
        mapName: mapName,
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
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log('Search notification sent:', response);
    })
    .catch(error => console.error('Error sending search notification:', error));
}



// Function to update the notification count in the UI
function updateNotificationCount() {
    const count = localStorage.getItem('notificationCount');
    const notificationCountElement = document.getElementById('notificationCount');
    notificationCountElement.textContent = count; // Update the text
    notificationCountElement.style.display = count > 0 ? 'inline' : 'none'; // Show or hide based on count
}

// Call displaySearchedMapsNotifications() and updateNotificationCount on page load
window.addEventListener('load', () => {
    displaySearchedMapsNotifications();
    updateNotificationCount(); // Ensure it shows the correct count on load
});

// Function to display searched maps notifications
function displaySearchedMapsNotifications() {
    const searchedMaps = JSON.parse(localStorage.getItem('searchedMaps')) || [];
    const notificationList = document.getElementById('notification-list');

    // Clear previous notifications
    notificationList.innerHTML = ''; 

    searchedMaps.forEach(entry => {
        const searchNotification = document.createElement('div');
        searchNotification.textContent = `Searched Map: ${entry.mapName} at ${new Date(entry.timestamp).toLocaleString()}`; 
        notificationList.appendChild(searchNotification);
    });
}

// Add an event listener for the notification link
document.getElementById('notificationLink').addEventListener('click', function() {
    // Show the notifications
    displaySearchedMapsNotifications();

    // Reset notification count
    let currentCount = 0; // Reset the count
    localStorage.setItem('notificationCount', currentCount); // Update local storage
    updateNotificationCount(); // Update the UI
});
