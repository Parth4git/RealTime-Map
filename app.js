const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('send-location', (data) => {
        console.log(`Location received: ${data.lat}, ${data.long}`);
        io.emit('receive-location', { id: socket.id, lat: data.lat, long: data.long });
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('disconnect', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
