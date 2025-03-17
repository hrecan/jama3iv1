require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
    const dbConfig = {
        host: process.env.MYSQL_HOST || process.env.RAILWAY_PRIVATE_DOMAIN,
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE || 'railway',
        port: parseInt(process.env.MYSQL_PORT || '3306')
    };

    console.log('Configuration DB:', {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database,
        port: dbConfig.port
    });

    let connection;
    try {
        // Tester la connexion
        console.log('Tentative de connexion à la base de données...');
        connection = await mysql.createConnection(dbConfig);
        console.log('Connexion établie avec succès');

        // Lire le fichier SQL
        console.log('Lecture du fichier SQL...');
        const sqlFile = await fs.readFile(
            path.join(__dirname, '../database/database.sql'),
            'utf8'
        );

        // Diviser le fichier en instructions SQL individuelles
        const sqlStatements = sqlFile
            .split(';')
            .filter(stmt => stmt.trim());

        // Exécuter chaque instruction SQL
        console.log('Exécution des requêtes SQL...');
        for (const statement of sqlStatements) {
            if (statement.trim()) {
                try {
                    await connection.query(statement);
                    console.log('Requête exécutée avec succès');
                } catch (error) {
                    if (error.code === 'ER_TABLE_EXISTS_ERROR') {
                        console.log('Table déjà existante, continuation...');
                    } else {
                        console.error('Erreur SQL:', error.message);
                    }
                }
            }
        }

        console.log('Initialisation de la base de données terminée avec succès');

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        console.log('Continuation malgré l\'erreur...');
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connexion à la base de données fermée');
        }
    }
}

// Exécuter et continuer même en cas d'erreur
initializeDatabase()
    .catch(console.error)
    .finally(() => {
        console.log('Script d\'initialisation terminé');
    });
