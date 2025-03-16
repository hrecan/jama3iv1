const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');
const logger = require('../utils/logger');

async function viewDatabase() {
    try {
        // Créer la connexion
        const connection = await mysql.createConnection(dbConfig);
        logger.info('Connecté à la base de données MySQL');

        // Obtenir la liste des tables
        const [tables] = await connection.query('SHOW TABLES');
        logger.info('Tables dans la base de données:');
        
        // Pour chaque table
        for (const tableRow of tables) {
            const tableName = tableRow[Object.keys(tableRow)[0]];
            logger.info(`\n=== Table: ${tableName} ===`);

            // Afficher la structure de la table
            const [columns] = await connection.query(`DESCRIBE ${tableName}`);
            logger.info('\nStructure:');
            console.table(columns);

            // Afficher le contenu de la table
            const [rows] = await connection.query(`SELECT * FROM ${tableName} LIMIT 5`);
            logger.info('\nContenu (5 premières lignes):');
            console.table(rows);
        }

        await connection.end();
        logger.info('Connexion fermée');

    } catch (error) {
        logger.error('Erreur:', error);
        process.exit(1);
    }
}

// Exécuter la fonction
viewDatabase();
