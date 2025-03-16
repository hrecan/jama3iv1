const mysql = require('mysql2/promise');
const dbConfig = require('./database');
const logger = require('../utils/logger');

// Création du pool de connexions
const pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Fonction pour exécuter une requête
async function query(sql, params = []) {
    try {
        const [results] = await pool.query(sql, params);
        return results;
    } catch (error) {
        logger.error('Erreur lors de l\'exécution de la requête SQL:', error);
        throw error;
    }
}

// Fonction pour obtenir une seule ligne
async function getOne(sql, params = []) {
    try {
        const results = await query(sql, params);
        return results[0];
    } catch (error) {
        logger.error('Erreur lors de l\'exécution de getOne:', error);
        throw error;
    }
}

// Test de connexion initial
pool.getConnection()
    .then(connection => {
        logger.info('Connecté à la base de données MySQL');
        connection.release();
    })
    .catch(error => {
        logger.error('Erreur de connexion à la base de données:', error);
        process.exit(1);
    });

module.exports = {
    pool,
    query,
    getOne
};
