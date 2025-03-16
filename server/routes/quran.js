const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { query } = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// Configuration de la base de données
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: 'jama3iv001',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Route pour enregistrer l'historique d'écoute
router.post('/ghtushi', authenticateToken, async (req, res) => {
    try {
        const { id_sourat, temps_ecoute, finich } = req.body;
        const id_user = req.user.id;

        console.log('Données reçues:', { id_user, id_sourat, temps_ecoute, finich });

        const sql = `
            INSERT INTO GHTUSHI (id_user, id_sourat, temps_ecoute, finich)
            VALUES (?, ?, ?, ?)
        `;

        const result = await query(sql, [id_user, id_sourat, temps_ecoute, finich]);

        res.json({
            success: true,
            message: 'Historique enregistré avec succès',
            id: result.insertId
        });
    } catch (error) {
        console.error('Erreur SQL:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'enregistrement de l\'historique',
            error: error.message
        });
    }
});

// Route pour obtenir les statistiques d'écoute
router.get('/ghtushi', authenticateToken, async (req, res) => {
    try {
        const id_user = req.user.id;

        const sql = `
            SELECT 
                COUNT(DISTINCT CASE WHEN finich = 1 THEN id_sourat END) as completed_surahs,
                COUNT(DISTINCT id_sourat) as total_unique_surahs,
                SEC_TO_TIME(SUM(TIME_TO_SEC(temps_ecoute))) as total_listening_time,
                (
                    SELECT GROUP_CONCAT(DISTINCT id_sourat)
                    FROM GHTUSHI 
                    WHERE id_user = ? AND finich = 1
                ) as completed_surah_ids,
                EXISTS (
                    SELECT 1 
                    FROM GHTUSHI 
                    WHERE id_user = ? AND finich = 1
                ) as has_completed_surahs
            FROM GHTUSHI
            WHERE id_user = ?
        `;

        const rows = await query(sql, [id_user, id_user, id_user]);
        const stats = rows[0] || {
            completed_surahs: 0,
            total_unique_surahs: 0,
            total_listening_time: '00:00:00',
            completed_surah_ids: null,
            has_completed_surahs: false
        };
        
        // Convertir la liste des sourates complétées en tableau
        stats.completed_surah_ids = stats.completed_surah_ids ? 
            stats.completed_surah_ids.split(',').map(Number) : [];

        console.log('Statistiques récupérées:', stats);

        res.json({
            success: true,
            stats: stats
        });
    } catch (error) {
        console.error('Erreur SQL complète:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques',
            error: error.message
        });
    }
});

module.exports = router;
