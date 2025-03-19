require('dotenv').config();
const mysql = require('mysql2/promise');
const dns = require('dns');

// Forcer l'utilisation d'IPv4
dns.setDefaultResultOrder('ipv4first');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Asmarh06072024*',
  database: 'jama3iv001',
  port: 3306,
  connectTimeout: 30000,
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

    // Création de la base de données si elle n'existe pas
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log(`Base de données ${dbConfig.database} créée ou déjà existante`);

    // Utilisation de la base de données
    await connection.query(`USE ${dbConfig.database}`);

    // Ici vous pouvez ajouter vos requêtes d'initialisation
    // Par exemple, créer des tables si elles n'existent pas

    await connection.end();
    console.log('Initialisation de la base de données terminée.');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    console.log('Continuation du démarrage sans base de données...');
  }
}

initializeDatabase()
  .catch(error => {
    console.error('Erreur fatale:', error);
    process.exit(1);
  });
