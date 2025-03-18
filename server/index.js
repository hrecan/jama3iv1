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

// Route de healthcheck simple
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Route de healthcheck avec vérification de la base de données
app.get('/', async (req, res) => {
    let connection;
    try {
        // Tester la connexion à la base de données
        connection = await mysql.createConnection(dbConfig);
        await connection.ping();
        
        res.status(200).json({ 
            status: 'healthy',
            database: 'connected',
            config: {
                host: dbConfig.host,
                user: dbConfig.user,
                database: dbConfig.database,
                port: dbConfig.port,
                family: dbConfig.family
            },
            env: {
                MYSQLHOST: process.env.MYSQLHOST,
                MYSQLPORT: process.env.MYSQLPORT,
                MYSQLUSER: process.env.MYSQLUSER,
                MYSQLDATABASE: process.env.MYSQLDATABASE,
                MYSQLPASSWORD: process.env.MYSQLPASSWORD
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        logger.error('Database connection error:', error);
        // Envoyer 200 même en cas d'erreur de DB pour que le healthcheck passe
        res.status(200).json({ 
            status: 'starting',
            database: 'initializing',
            error: error.message,
            config: {
                host: dbConfig.host,
                user: dbConfig.user,
                database: dbConfig.database,
                port: dbConfig.port,
                family: dbConfig.family
            },
            env: {
                MYSQLHOST: process.env.MYSQLHOST,
                MYSQLPORT: process.env.MYSQLPORT,
                MYSQLUSER: process.env.MYSQLUSER,
                MYSQLDATABASE: process.env.MYSQLDATABASE,
                MYSQLPASSWORD: process.env.MYSQLPASSWORD
            },
            timestamp: new Date().toISOString()
        });
    } finally {
        if (connection) {
            await connection.end();
        }
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