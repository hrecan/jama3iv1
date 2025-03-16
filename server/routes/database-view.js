const express = require('express');
const router = express.Router();
const { query } = require('../config/db');
const logger = require('../utils/logger');
const { authenticateToken } = require('../middleware/auth');

// Appliquer l'authentification à toutes les routes
router.use(authenticateToken);

// Route pour obtenir la liste des tables
router.get('/tables', async (req, res) => {
    try {
        const tables = await query('SHOW TABLES');
        res.json(tables.map(table => Object.values(table)[0]));
    } catch (error) {
        logger.error('Erreur lors de la récupération des tables:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des tables' });
    }
});

// Route pour obtenir la structure d'une table
router.get('/structure/:table', async (req, res) => {
    try {
        const structure = await query(`DESCRIBE ${req.params.table}`);
        res.json(structure);
    } catch (error) {
        logger.error('Erreur lors de la récupération de la structure:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération de la structure' });
    }
});

// Route pour obtenir le contenu d'une table
router.get('/content/:table', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        const [rows, [{ total }]] = await Promise.all([
            query(`SELECT * FROM ${req.params.table} LIMIT ? OFFSET ?`, [limit, offset]),
            query(`SELECT COUNT(*) as total FROM ${req.params.table}`)
        ]);
        
        res.json({
            data: rows,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        logger.error('Erreur lors de la récupération du contenu:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du contenu' });
    }
});

// Route pour ajouter un enregistrement
router.post('/content/:table', async (req, res) => {
    try {
        const { table } = req.params;
        const data = req.body;
        
        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map(() => '?').join(', ');
        
        const sql = `INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`;
        const result = await query(sql, values);
        
        res.json({
            success: true,
            id: result.insertId,
            message: 'Enregistrement ajouté avec succès'
        });
    } catch (error) {
        logger.error('Erreur lors de l\'ajout de l\'enregistrement:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'enregistrement' });
    }
});

// Route pour supprimer un enregistrement
router.delete('/content/:table/:id', async (req, res) => {
    try {
        const { table, id } = req.params;
        // On suppose que chaque table a une colonne ID qui se termine par '_id'
        const idColumn = await query(`SHOW COLUMNS FROM ${table} WHERE Field LIKE '%_id'`);
        
        if (!idColumn.length) {
            throw new Error('Colonne ID non trouvée');
        }

        const result = await query(`DELETE FROM ${table} WHERE ${idColumn[0].Field} = ?`, [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Enregistrement non trouvé' });
        }
        
        res.json({
            success: true,
            message: 'Enregistrement supprimé avec succès'
        });
    } catch (error) {
        logger.error('Erreur lors de la suppression:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});

module.exports = router;
