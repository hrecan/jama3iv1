const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Données statiques pour les mosquées
const mosques = [
    {
        ms_id: 1,
        ms_name: "Mosquée de la Paix",
        ms_address: "123 Rue de la Paix",
        ms_city: "Paris",
        ms_phone: "+33123456789",
        ms_email: "contact@mosqueepaix.fr",
        ms_lat: 48.8566,
        ms_lng: 2.3522,
        events_count: 2
    },
    {
        ms_id: 2,
        ms_name: "Grande Mosquée",
        ms_address: "456 Avenue Principale",
        ms_city: "Lyon",
        ms_phone: "+33987654321",
        ms_email: "contact@grandemosquee.fr",
        ms_lat: 45.7640,
        ms_lng: 4.8357,
        events_count: 3
    }
];

// Obtenir toutes les mosquées
router.get('/', async (req, res) => {
    try {
        // Trier les mosquées par nom
        const sortedMosques = [...mosques].sort((a, b) => 
            a.ms_name.localeCompare(b.ms_name)
        );
        
        res.json(sortedMosques);
    } catch (error) {
        logger.error('Erreur lors de la récupération des mosquées:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la récupération des mosquées',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Obtenir une mosquée par ID
router.get('/:id', async (req, res) => {
    try {
        const mosque = mosques.find(m => m.ms_id === parseInt(req.params.id));
        
        if (!mosque) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Mosquée non trouvée'
            });
        }

        res.json({
            status: 'success',
            data: mosque
        });
    } catch (error) {
        logger.error('Erreur lors de la récupération de la mosquée:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la récupération de la mosquée',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Créer une mosquée
router.post('/', async (req, res) => {
    try {
        const { ms_name, ms_address, ms_city, ms_phone, ms_email, ms_lat, ms_lng } = req.body;
        
        // Validation des données
        if (!ms_name || !ms_address || !ms_city) {
            return res.status(400).json({
                status: 'error',
                message: 'Nom, adresse et ville sont requis'
            });
        }

        // Créer une nouvelle mosquée
        const newMosque = {
            ms_id: mosques.length + 1,
            ms_name,
            ms_address,
            ms_city,
            ms_phone,
            ms_email,
            ms_lat,
            ms_lng,
            events_count: 0
        };

        // Ajouter à la liste
        mosques.push(newMosque);

        res.status(201).json({
            status: 'success',
            message: 'Mosquée créée avec succès',
            data: newMosque
        });
    } catch (error) {
        logger.error('Erreur lors de la création de la mosquée:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la création de la mosquée',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Mettre à jour une mosquée
router.put('/:id', async (req, res) => {
    try {
        const mosqueIndex = mosques.findIndex(m => m.ms_id === parseInt(req.params.id));
        
        if (mosqueIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Mosquée non trouvée'
            });
        }

        // Mettre à jour la mosquée
        mosques[mosqueIndex] = {
            ...mosques[mosqueIndex],
            ...req.body,
            ms_id: parseInt(req.params.id) // Garder l'ID original
        };

        res.json({
            status: 'success',
            message: 'Mosquée mise à jour avec succès',
            data: mosques[mosqueIndex]
        });
    } catch (error) {
        logger.error('Erreur lors de la mise à jour de la mosquée:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la mise à jour de la mosquée',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Supprimer une mosquée
router.delete('/:id', async (req, res) => {
    try {
        const mosqueIndex = mosques.findIndex(m => m.ms_id === parseInt(req.params.id));
        
        if (mosqueIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Mosquée non trouvée'
            });
        }

        // Supprimer la mosquée
        mosques.splice(mosqueIndex, 1);

        res.json({
            status: 'success',
            message: 'Mosquée supprimée avec succès'
        });
    } catch (error) {
        logger.error('Erreur lors de la suppression de la mosquée:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la suppression de la mosquée',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;