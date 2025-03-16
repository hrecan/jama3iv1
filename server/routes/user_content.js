const express = require('express');
const router = express.Router();
const { videoHelpers, courseHelpers, eventHelpers } = require('../models/database');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');
const db = require('../config/db');

// Obtenir les vidéos d'un utilisateur
router.get('/videos/utilisateur/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        logger.info(`Récupération des vidéos de l'utilisateur: ${userId}`);
        
        // Vérifier si l'utilisateur demande ses propres vidéos
        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        const videos = await videoHelpers.getUserVideos(userId);
        res.json(videos);
    } catch (error) {
        logger.error('Erreur lors de la récupération des vidéos:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des vidéos' });
    }
});

// Obtenir les cours d'un utilisateur
router.get('/courses/utilisateur/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        logger.info(`Récupération des cours de l'utilisateur: ${userId}`);
        
        // Vérifier si l'utilisateur demande ses propres cours
        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        const courses = await courseHelpers.getUserCourses(userId);
        res.json(courses);
    } catch (error) {
        logger.error('Erreur lors de la récupération des cours:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des cours' });
    }
});

// Obtenir les événements d'un utilisateur
router.get('/events/utilisateur/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        logger.info(`Récupération des événements de l'utilisateur: ${userId}`);
        
        // Vérifier si l'utilisateur demande ses propres événements
        if (req.user.id !== parseInt(userId)) {
            return res.status(403).json({ error: 'Accès non autorisé' });
        }

        const events = await eventHelpers.getUserEvents(userId);
        res.json(events);
    } catch (error) {
        logger.error('Erreur lors de la récupération des événements:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des événements' });
    }
});

// Route pour obtenir tout le contenu de l'utilisateur
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        logger.info(`Récupération de tout le contenu de l'utilisateur: ${userId}`);
        
        // Récupérer tous les types de contenu
        const [videos, courses, events] = await Promise.all([
            videoHelpers.getUserVideos(userId),
            courseHelpers.getUserCourses(userId),
            eventHelpers.getUserEvents(userId)
        ]);

        res.json({
            videos,
            courses,
            events
        });
    } catch (error) {
        logger.error('Erreur lors de la récupération du contenu:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du contenu' });
    }
});

module.exports = router;
