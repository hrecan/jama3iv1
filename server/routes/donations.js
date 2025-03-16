const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtenir tous les dons
router.get('/', async (req, res) => {
    try {
        const [donations] = await db.query(`
            SELECT d.*, u.us_fname, u.us_lname, e.ev_title 
            FROM GHTDON d
            JOIN GHTUSR u ON d.user_id = u.us_id
            JOIN GHTEVT e ON d.event_id = e.ev_id
        `);
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Créer un nouveau don
router.post('/', async (req, res) => {
    try {
        const { event_id, user_id, dn_amount } = req.body;
        
        // Générer un numéro de reçu unique
        const receipt_num = `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        const [result] = await db.query(
            'INSERT INTO GHTDON (event_id, user_id, dn_amount, dn_receipt_num) VALUES (?, ?, ?, ?)',
            [event_id, user_id, dn_amount, receipt_num]
        );

        // Mettre à jour le montant total de l'événement
        await db.query(
            'UPDATE GHTEVT SET ev_taramount = ev_taramount + ? WHERE ev_id = ?',
            [dn_amount, event_id]
        );

        res.status(201).json({ 
            id: result.insertId,
            receipt_num: receipt_num
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtenir un reçu de don
router.get('/receipt/:id', async (req, res) => {
    try {
        const [donation] = await db.query(`
            SELECT d.*, u.us_fname, u.us_lname, e.ev_title, m.ms_name
            FROM GHTDON d
            JOIN GHTUSR u ON d.user_id = u.us_id
            JOIN GHTEVT e ON d.event_id = e.ev_id
            JOIN GHTMOSQ m ON e.mosque_id = m.ms_id
            WHERE d.dn_id = ?
        `, [req.params.id]);

        if (donation.length === 0) {
            return res.status(404).json({ message: 'Reçu non trouvé' });
        }

        res.json(donation[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router; 