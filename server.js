const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = 80; // Docker container will listen on port 80

const ALLOW_CODE = process.env.ALLOW_CODE || 'ywsj'; // Fallback default code
const AUTH_COOKIE_NAME = 'm3u8_player_auth';

// Handle favicon requests to prevent 404s
app.get('/favicon.ico', (req, res) => res.status(204).send());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Login endpoint
app.post('/login', (req, res) => {
    const { code } = req.body;
    if (code === ALLOW_CODE) {
        // Set a simple cookie that expires in 1 day
        res.cookie(AUTH_COOKIE_NAME, 'true', { maxAge: 86400000, httpOnly: true });
        res.redirect('/');
    } else {
        res.redirect('/login.html?error=1');
    }
});

// Middleware to check for auth cookie
app.use((req, res, next) => {
    // Allow access to login page and its assets without auth
    if (req.path === '/login.html') {
        return next();
    }
    // Check for the auth cookie
    if (req.cookies[AUTH_COOKIE_NAME] === 'true') {
        return next(); // User is authenticated, proceed
    } else {
        // Not authenticated, redirect to login page
        res.redirect('/login.html');
    }
});

// Serve the main application (static files)
// This will only be reached if the user is authenticated
app.use(express.static(path.join(__dirname, '')));

app.listen(port, () => {
    console.log(`M3U8 player with auth gateway listening on port ${port}`);
    console.log(`Allow code is set to: ${ALLOW_CODE}`)
});