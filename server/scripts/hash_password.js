const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');

async function hashAndUpdatePassword() {
    try {
        // Créer le hash du mot de passe
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Connexion à la base de données
        const connection = await mysql.createConnection(dbConfig);
        
        // Mettre à jour le mot de passe
        await connection.execute(
            'UPDATE ghtusr SET us_password = ? WHERE us_email = ?',
            [hashedPassword, 'admin@jama3i.com']
        );
        
        console.log('Mot de passe mis à jour avec succès !');
        console.log('Email: admin@jama3i.com');
        console.log('Mot de passe (non hashé): admin123');
        console.log('Hash bcrypt:', hashedPassword);
        
        // Fermer la connexion
        await connection.end();
        
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Exécuter le script
hashAndUpdatePassword();
