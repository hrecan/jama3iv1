require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

// Configuration de la base de données
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
};

// Middleware de base
app.use(express.json());
app.use(cors());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Route de healthcheck avec vérification de la base de données
app.get('/', async (req, res) => {
    try {
        // Tester la connexion à la base de données
        const connection = await mysql.createConnection(dbConfig);
        await connection.ping();
        await connection.end();
        
        res.status(200).json({ 
            status: 'healthy',
            database: 'connected'
        });
    } catch (error) {
        logger.error('Database connection error:', error);
        res.status(500).json({ 
            status: 'unhealthy',
            database: 'disconnected',
            error: error.message
        });
    }
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