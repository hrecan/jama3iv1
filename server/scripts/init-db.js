require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Forcer l'utilisation d'IPv4
process.env.NODE_OPTIONS = '--dns-result-order=ipv4first';

async function initializeDatabase() {
    // Récupérer l'hôte depuis les variables d'environnement
    const privateHost = process.env.RAILWAY_PRIVATE_DOMAIN;
    const proxyHost = process.env.RAILWAY_TCP_PROXY_DOMAIN;
    const mysqlHost = process.env.MYSQL_HOST;

    // Construire l'hôte complet avec le port
    const host = mysqlHost || (privateHost ? `${privateHost}:${process.env.MYSQL_PORT || '3306'}` : proxyHost);
    
    if (!host) {
        throw new Error('Aucune variable d\'environnement d\'hôte MySQL trouvée');
    }

    console.log('Variables d\'environnement disponibles:', {
        RAILWAY_PRIVATE_DOMAIN: process.env.RAILWAY_PRIVATE_DOMAIN,
        RAILWAY_TCP_PROXY_DOMAIN: process.env.RAILWAY_TCP_PROXY_DOMAIN,
        MYSQL_HOST: process.env.MYSQL_HOST,
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE,
        MYSQL_PORT: process.env.MYSQL_PORT,
        MYSQL_URL: process.env.MYSQL_URL
    });

    const dbConfig = {
        host: host.split(':')[0],  // Extraire l'hôte sans le port
        port: parseInt(host.split(':')[1] || process.env.MYSQL_PORT || '3306'),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE || 'railway',
        connectTimeout: 30000,
        // Forcer IPv4
        family: 4,
        // Add retry configuration
        acquireTimeout: 60000,
        waitForConnections: true,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    };

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
