require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');
const mysql = require('mysql2/promise');
const dns = require('dns');

// Forcer l'utilisation d'IPv4
dns.setDefaultResultOrder('ipv4first');

const app = express();
const port = process.env.PORT || 3000;

// Configuration de la base de données
const dbConfig = {
    host: process.env.MYSQLHOST || 'localhost',
    port: parseInt(process.env.MYSQLPORT || '3306'),
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE || 'railway',
    connectTimeout: 30000,
    // Configuration IPv4
    family: 4,
    // Options de connexion valides pour mysql2
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
};

// Middleware de base
app.use(express.json());
app.use(cors());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint de santé qui ne dépend pas de la base de données
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Route principale
app.get('/', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT 1 as value');
        await connection.end();
        res.json({ message: 'API is running with database connection', data: rows });
    } catch (error) {
        logger.error('Database error:', error);
        res.json({ 
            message: 'API is running without database connection', 
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
    logger.info('Database config:', {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database,
        port: dbConfig.port,
        family: dbConfig.family
    });
});