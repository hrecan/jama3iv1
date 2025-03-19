require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

async function migrateDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.MYSQLHOST || 'localhost',
        user: process.env.MYSQLUSER || 'root',
        password: process.env.MYSQLPASSWORD || '',
        database: process.env.MYSQLDATABASE || 'railway',
        port: parseInt(process.env.MYSQLPORT || '3306', 10),
        multipleStatements: true // Important pour exécuter plusieurs requêtes
    });

    try {
        console.log('Lecture des fichiers SQL...');
        
        // Lire le schéma
        const schemaPath = path.join(__dirname, '../../schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');
        
        // Lire les données
        const dataPath = path.join(__dirname, '../../data.sql');
        const data = await fs.readFile(dataPath, 'utf8');

        // Remplacer jama3iv001 par railway dans les deux fichiers
        const modifiedSchema = schema.replace(/jama3iv001/g, 'railway');
        const modifiedData = data.replace(/jama3iv001/g, 'railway');

        console.log('Création du schéma de la base de données...');
        await connection.query(modifiedSchema);
        console.log('Schéma créé avec succès');

        console.log('Importation des données...');
        await connection.query(modifiedData);
        console.log('Données importées avec succès');

        console.log('Migration terminée avec succès !');
    } catch (error) {
        console.error('Erreur lors de la migration:', error);
    } finally {
        await connection.end();
    }
}

migrateDatabase();
