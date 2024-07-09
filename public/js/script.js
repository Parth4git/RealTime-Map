const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        socket.emit('send-location', { lat, long });
    }, (error) => {
        console.error(error);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    });
}

const map = L.map('map').setView([0, 0], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Parth Dwivedi Map Services '
}).addTo(map);

const markers = {};

socket.on('receive-location', (data) => {
    if (markers[data.id]) {
        markers[data.id].setLatLng([data.lat, data.long]);
    } else {
        markers[data.id] = L.marker([data.lat, data.long]).addTo(map);
        markers[data.id].bindPopup("I am here").openPopup();
    }
    map.setView([data.lat, data.long], 15);
});

socket.on('user-disconnect', () => {
    if(markers[socket.id]) {
        map.removeLayer(markers[socket.id]);
        delete markers[socket.id];
    }
});
