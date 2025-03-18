require('dotenv').config();
const mysql = require('mysql2/promise');
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
  user: process.env.MYSQLUSER || 'root',
  database: process.env.MYSQLDATABASE || 'railway',
  port: parseInt(process.env.MYSQLPORT || '3306'),
  password: process.env.MYSQLPASSWORD,
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

    // Ici vous pouvez ajouter vos requêtes d'initialisation
    // Par exemple, créer des tables si elles n'existent pas

    await connection.end();
    console.log('Initialisation de la base de données terminée.');
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
