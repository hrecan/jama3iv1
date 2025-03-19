const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

// Données statiques pour les événements
const events = [
    {
        ev_id: 1,
        mosque_id: 1,
        ev_title: "Cours de Tajwid",
        ev_description: "Cours de récitation du Coran",
        ev_type: "course",
        ev_date: "2025-02-24T19:00:00",
        mosque_name: "Mosquée de la Paix",
        mosque_address: "123 Rue de la Paix"
    },
    {
        ev_id: 2,
        mosque_id: 2,
        ev_title: "Collecte de dons pour Ramadan",
        ev_description: "Collecte de dons pour aider les familles dans le besoin pendant le Ramadan",
        ev_type: "donation",
        ev_date: "2025-02-25T14:30:00",
        mosque_name: "Grande Mosquée",
        mosque_address: "456 Avenue Principale"
    },
    {
        ev_id: 3,
        mosque_id: 1,
        ev_title: "Nettoyage de la mosquée",
        ev_description: "Journée de nettoyage et d'entretien de la mosquée",
        ev_type: "community_work",
        ev_date: "2025-02-26T09:00:00",
        mosque_name: "Mosquée de la Paix",
        mosque_address: "123 Rue de la Paix"
    }
];

// Obtenir tous les événements
router.get('/', async (req, res) => {
    try {
        // Filtrer les événements futurs
        const currentDate = new Date();
        const futureEvents = events.filter(event => new Date(event.ev_date) >= currentDate);
        
        // Trier par date
        futureEvents.sort((a, b) => new Date(a.ev_date) - new Date(b.ev_date));
        
        res.json(futureEvents);
    } catch (error) {
        logger.error('Erreur lors de la récupération des événements:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la récupération des événements',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Obtenir un événement par ID
router.get('/:id', async (req, res) => {
    try {
        const event = events.find(e => e.ev_id === parseInt(req.params.id));
        
        if (!event) {
            return res.status(404).json({ 
                status: 'error',
                message: 'Événement non trouvé'
            });
        }

        res.json({
            status: 'success',
            data: event
        });
    } catch (error) {
        logger.error('Erreur lors de la récupération de l\'événement:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la récupération de l\'événement',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Créer un événement
router.post('/', async (req, res) => {
    try {
        const { mosque_id, ev_title, ev_description, ev_type, ev_date } = req.body;
        
        // Validation des données
        if (!mosque_id || !ev_title || !ev_date) {
            return res.status(400).json({
                status: 'error',
                message: 'Mosquée, titre et date sont requis'
            });
        }

        // Créer un nouvel événement
        const newEvent = {
            ev_id: events.length + 1,
            mosque_id,
            ev_title,
            ev_description,
            ev_type,
            ev_date,
            mosque_name: "À déterminer", // À remplacer par la vraie valeur de la mosquée
            mosque_address: "À déterminer"
        };

        events.push(newEvent);

        res.status(201).json({
            status: 'success',
            data: newEvent
        });
    } catch (error) {
        logger.error('Erreur lors de la création de l\'événement:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la création de l\'événement',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Mettre à jour un événement
router.put('/:id', async (req, res) => {
    try {
        const eventIndex = events.findIndex(e => e.ev_id === parseInt(req.params.id));
        
        if (eventIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Événement non trouvé'
            });
        }

        // Mettre à jour l'événement
        events[eventIndex] = {
            ...events[eventIndex],
            ...req.body,
            ev_id: parseInt(req.params.id) // Garder l'ID original
        };

        res.json({
            status: 'success',
            message: 'Événement mis à jour avec succès',
            data: events[eventIndex]
        });
    } catch (error) {
        logger.error('Erreur lors de la mise à jour de l\'événement:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la mise à jour de l\'événement',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Supprimer un événement
router.delete('/:id', async (req, res) => {
    try {
        const eventIndex = events.findIndex(e => e.ev_id === parseInt(req.params.id));
        
        if (eventIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Événement non trouvé'
            });
        }

        events.splice(eventIndex, 1);

        res.json({
            status: 'success',
            message: 'Événement supprimé avec succès'
        });
    } catch (error) {
        logger.error('Erreur lors de la suppression de l\'événement:', error);
        res.status(500).json({ 
            status: 'error',
            message: 'Erreur lors de la suppression de l\'événement',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;