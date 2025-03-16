require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');

const app = express();
const port = process.env.PORT || 3000;

// Middleware de base
app.use(express.json());
app.use(cors());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Route de healthcheck simple
app.get('/', (req, res) => {
    res.status(200).send('OK');
});

// Gestion des erreurs
app.use((err, req, res, next) => {
    logger.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Démarrage du serveur
const server = app.listen(port, '0.0.0.0', () => {
    logger.info(`Server is running on port ${port}`);
});