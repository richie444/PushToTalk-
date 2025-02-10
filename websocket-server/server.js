const WebSocket = require('ws');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8080;

// Create HTTP server for WebSocket
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

let activeUsers = new Set();

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            if (data.type === 'handshake') {
                ws.userId = data.userId; // Attach userId to WebSocket
                console.log(`User ${ws.userId} connected`);
            } 
            else if (data.type === 'start_talking') {
                activeUsers.add(data.userId);
                broadcast({ type: 'start_talking', userId: data.userId });
            } 
            else if (data.type === 'stop_talking') {
                activeUsers.delete(data.userId);
                broadcast({ type: 'stop_talking', userId: data.userId });
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });

    ws.on('close', () => {
        if (ws.userId) {
            activeUsers.delete(ws.userId);
            broadcast({ type: 'stop_talking', userId: ws.userId });
        }
        console.log('Client disconnected');
    });
});

// Broadcast function to all connected clients
function broadcast(data) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

server.listen(PORT, () => {
    console.log(`WebSocket server running on ws://localhost:${PORT}`);
});
