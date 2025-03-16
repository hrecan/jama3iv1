require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
    const dbConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    };

    try {
        // Lire le fichier SQL
        const sqlFile = await fs.readFile(
            path.join(__dirname, '../database/database.sql'),
            'utf8'
        );

        // Diviser le fichier en instructions SQL individuelles
        const sqlStatements = sqlFile
            .split(';')
            .filter(stmt => stmt.trim());

        // Créer la connexion
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database');

        // Exécuter chaque instruction SQL
        for (const statement of sqlStatements) {
            if (statement.trim()) {
                try {
                    await connection.query(statement);
                    console.log('Successfully executed:', statement.substring(0, 50) + '...');
                } catch (error) {
                    console.error('Error executing:', statement.substring(0, 50) + '...');
                    console.error('Error details:', error.message);
                }
            }
        }

        console.log('Database initialization completed');
        await connection.end();

    } catch (error) {
        console.error('Database initialization failed:', error);
        process.exit(1);
    }
}

initializeDatabase();
