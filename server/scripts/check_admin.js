const mysql = require('mysql2/promise');

async function checkAdmin() {
    // Configuration de la base de données
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Asmarh06072024*',
        database: 'jama3iv001'
    });

    try {
        // Vérifier que l'utilisateur existe
        const [rows] = await connection.execute(
            'SELECT us_id, us_email, us_type, us_status, us_password FROM ghtusr WHERE us_email = ?',
            ['admin@jama3i.com']
        );
        
        if (rows.length > 0) {
            console.log('Utilisateur trouvé:', {
                ...rows[0],
                us_password: rows[0].us_password ? rows[0].us_password.toString('hex') : null
            });
        } else {
            console.log('Utilisateur non trouvé');
        }

    } catch (error) {
        console.error('Erreur:', error);
    } finally {
        await connection.end();
    }
}

checkAdmin();
