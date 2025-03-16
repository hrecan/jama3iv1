const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtenir toutes les invocations actives
router.get('/', async (req, res) => {
    try {
        const [invocations] = await db.query(
            'SELECT * FROM GHTINV WHERE in_active = true'
        );
        res.json(invocations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ajouter une invocation (admin seulement)
router.post('/', async (req, res) => {
    try {
        const { in_text_ar, in_text_fr, in_text_en } = req.body;
        const [result] = await db.query(
            'INSERT INTO GHTINV (in_text_ar, in_text_fr, in_text_en) VALUES (?, ?, ?)',
            [in_text_ar, in_text_fr, in_text_en]
        );
        res.status(201).json({ id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mettre à jour une invocation
router.put('/:id', async (req, res) => {
    try {
        const { in_text_ar, in_text_fr, in_text_en, in_active } = req.body;
        await db.query(
            `UPDATE GHTINV SET 
                in_text_ar = ?, 
                in_text_fr = ?, 
                in_text_en = ?,
                in_active = ?
            WHERE in_id = ?`,
            [in_text_ar, in_text_fr, in_text_en, in_active, req.params.id]
        );
        res.json({ message: 'Invocation mise à jour' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 