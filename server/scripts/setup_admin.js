require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function setupAdmin() {
    // Configuration de la base de données
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Asmarh06072024*',
        database: 'jama3iv001'
    });

    try {
        // Hash du mot de passe
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Date par défaut pour l'admin
        const defaultDate = '1990-01-01';

        // Requête SQL pour créer/mettre à jour l'admin
        const query = `
            INSERT INTO ghtusr (us_email, us_password, us_fname, us_lname, us_type, us_status, us_bdate)
            VALUES (?, ?, 'Admin', 'User', 'admin', 'active', ?)
            ON DUPLICATE KEY UPDATE
            us_password = VALUES(us_password),
            us_type = VALUES(us_type),
            us_status = VALUES(us_status)
        `;

        await connection.execute(query, ['admin@jama3i.com', hashedPassword, defaultDate]);
        console.log('Utilisateur admin créé/mis à jour avec succès');

        // Vérifier que l'utilisateur existe
        const [rows] = await connection.execute(
            'SELECT us_id, us_email, us_type, us_status FROM ghtusr WHERE us_email = ?',
            ['admin@jama3i.com']
        );
        console.log('Utilisateur admin:', rows[0]);

    } catch (error) {
        console.error('Erreur lors de la configuration de l\'admin:', error);
    } finally {
        await connection.end();
    }
}

setupAdmin();
