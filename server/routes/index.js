const express = require('express');
const router = express.Router();

// Importation des routes
router.use('/events', require('./events'));
router.use('/videos', require('./videos'));
router.use('/mosques', require('./mosques'));

// Route de test API
router.get('/', (req, res) => {
    res.json({ message: 'API JAMA3I v1.0' });
});

module.exports = router;