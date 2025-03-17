require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Forcer l'utilisation d'IPv4
process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';

async function initializeDatabase() {
    // Récupérer l'hôte depuis les variables d'environnement
    const host = process.env.MYSQL_HOST || process.env.RAILWAY_TCP_PROXY_DOMAIN || process.env.RAILWAY_PRIVATE_DOMAIN;
    if (!host) {
        throw new Error('Aucune variable d\'environnement d\'hôte MySQL trouvée');
    }

    const dbConfig = {
        host: host,
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE || 'railway',
        port: parseInt(process.env.MYSQL_PORT || '3306'),
        connectTimeout: 30000,
        // Forcer IPv4
        family: 4
    };

    console.log('Variables d\'environnement disponibles:', {
        RAILWAY_PRIVATE_DOMAIN: process.env.RAILWAY_PRIVATE_DOMAIN,
        RAILWAY_TCP_PROXY_DOMAIN: process.env.RAILWAY_TCP_PROXY_DOMAIN,
        MYSQL_HOST: process.env.MYSQL_HOST,
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE,
        MYSQL_PORT: process.env.MYSQL_PORT
    });

    console.log('Configuration DB:', {
        host: dbConfig.host,
        user: dbConfig.user,
        database: dbConfig.database,
        port: dbConfig.port,
        family: dbConfig.family
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
                        throw error;
                    }
                }
            }
        }

        console.log('Initialisation de la base de données terminée avec succès');

    } catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connexion à la base de données fermée');
        }
    }
}

// Exécuter l'initialisation
initializeDatabase()
    .catch(error => {
        console.error('Erreur fatale:', error);
        process.exit(1);
    });
