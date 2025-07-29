/**
 * @file server.js
 * @description Main Express server for the Four-in-a-Row game application.
 */

const express = require('express');
const app = express();
const PORT = 3000;

const gameRoutes = require('./routes/gameRoutes');

app.use(express.json());            
app.use(express.static('public')); 
app.use('/api', gameRoutes);        

// Start the server
app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server running on http://localhost:${PORT}`);
    } else {
        console.error("Server error:", error);
    }
});