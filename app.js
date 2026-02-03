require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const usersRouter = require('./routes/users');
const catwayRouter = require('./routes/catway');
const authRouter = require('./routes/auth');
const mongodb = require('./db/mongo');

mongodb.initClientDbConnection();

const app = express();

// Configuration EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(cors({
    exposedHeaders: ["Authorization"],
    origin: '*'
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes API
app.use('/api', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/catways', catwayRouter);

// Routes des pages EJS
app.get('/', (req, res) => {
    res.render('index', { title: 'Connexion - Port de Plaisance Russell' });
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { title: 'Tableau de bord' });
});

app.get('/catways', (req, res) => {
    res.render('catways', { title: 'Gestion des Catways' });
});

app.get('/reservations', (req, res) => {
    res.render('reservations', { title: 'Gestion des Réservations' });
});

app.get('/users-page', (req, res) => {
    res.render('users-page', { title: 'Gestion des Utilisateurs' });
});

app.get('/documentation', (req, res) => {
    res.render('documentation', { title: 'Documentation API' });
});

// 404
app.use(function(req, res) {
    res.status(404).json({ name: "API Russell Marina", version: "1.0.0", message: "Endpoint not found" });
});

module.exports = app;