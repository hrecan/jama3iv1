require('dotenv').config();
const mysql = require('mysql2/promise');
const dns = require('dns');

// Forcer l'utilisation d'IPv4
dns.setDefaultResultOrder('ipv4first');

const dbConfig = {
  host: process.env.MYSQLHOST || 'localhost',
  user: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'railway',
  port: parseInt(process.env.MYSQLPORT || '3306', 10),
  connectTimeout: 30000,
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
};

console.log('Variables d\'environnement disponibles:', {
  MYSQLHOST: process.env.MYSQLHOST,
  MYSQLPORT: process.env.MYSQLPORT,
  MYSQLUSER: process.env.MYSQLUSER,
  MYSQLDATABASE: process.env.MYSQLDATABASE
});

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

    // Création des tables
    console.log('Création des tables...');
    
    // Table ghtusr
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ghtusr (
        us_id INT AUTO_INCREMENT PRIMARY KEY,
        us_email VARCHAR(255) NOT NULL UNIQUE,
        us_password VARCHAR(255) NOT NULL,
        us_fname VARCHAR(100),
        us_lname VARCHAR(100),
        us_type ENUM('admin', 'user') DEFAULT 'user',
        us_status ENUM('active', 'inactive') DEFAULT 'active',
        us_bdate DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Table ghtcourses
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ghtcourses (
        cr_id INT AUTO_INCREMENT PRIMARY KEY,
        cr_title VARCHAR(255) NOT NULL,
        cr_description TEXT,
        cr_image VARCHAR(255),
        cr_status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Table ghtevents
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ghtevents (
        ev_id INT AUTO_INCREMENT PRIMARY KEY,
        ev_title VARCHAR(255) NOT NULL,
        ev_description TEXT,
        ev_date DATETIME,
        ev_location VARCHAR(255),
        ev_image VARCHAR(255),
        ev_status ENUM('active', 'inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Création de l'utilisateur admin par défaut
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('Test123*', 10);
    
    await connection.query(`
      INSERT INTO ghtusr (us_email, us_password, us_fname, us_lname, us_type, us_status, us_bdate)
      VALUES (?, ?, 'Jama3i', 'Admin', 'admin', 'active', '1990-01-01')
      ON DUPLICATE KEY UPDATE
      us_password = VALUES(us_password),
      us_type = VALUES(us_type),
      us_status = VALUES(us_status)
    `, ['harti.nacer@gmail.com', hashedPassword]);

    console.log('Tables créées et utilisateur admin configuré avec succès');
    await connection.end();
    console.log('Initialisation de la base de données terminée.');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

initializeDatabase()
  .catch(error => {
    console.error('Erreur fatale:', error);
    process.exit(1);
  });
