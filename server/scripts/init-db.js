require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const dns = require('dns');

// Forcer l'utilisation d'IPv4
dns.setDefaultResultOrder('ipv4first');

console.log("Variables d'environnement disponibles:", {
  MYSQLHOST: process.env.MYSQLHOST,
  MYSQLPORT: process.env.MYSQLPORT,
  MYSQLUSER: process.env.MYSQLUSER,
  MYSQLDATABASE: process.env.MYSQLDATABASE
});

const dbConfig = {
  host: process.env.MYSQLHOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || '3306'),
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE || 'railway',
  connectTimeout: 30000,
  // Options de connexion valides pour mysql2
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
};

console.log('Configuration DB:', {
  host: dbConfig.host,
  user: dbConfig.user,
  database: dbConfig.database,
  port: dbConfig.port
});

async function initializeDatabase() {
  try {
    console.log('Tentative de connexion à la base de données...');
    const connection = await mysql.createConnection(dbConfig);
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
    await connection.end();
    console.log('Connexion à la base de données fermée');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    // Ne pas faire échouer le démarrage de l'application
    console.log('Continuation du démarrage sans base de données...');
  }
}

// Exécuter l'initialisation
initializeDatabase()
  .catch(error => {
    console.error('Erreur fatale:', error);
    process.exit(1);
  });
