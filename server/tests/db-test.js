const { db, userHelpers, courseHelpers, eventHelpers } = require('../models/database');
const logger = require('../utils/logger');

async function testDatabase() {
    try {
        logger.info('Début des tests de la base de données...');

        // Test 1: Création d'un utilisateur
        logger.info('Test 1: Création d\'un utilisateur');
        const username = 'testuser_' + Date.now();
        const email = `test_${Date.now()}@example.com`;
        const password = 'Test123!';

        try {
            const userId = await userHelpers.createUser(username, email, password);
            logger.info('✓ Utilisateur créé avec succès, ID:', userId);
        } catch (error) {
            logger.error('✗ Erreur lors de la création de l\'utilisateur:', error.message);
            throw error;
        }

        // Test 2: Vérification de l'utilisateur
        logger.info('Test 2: Vérification de l\'utilisateur');
        try {
            const user = await userHelpers.verifyUser(email, password);
            if (user) {
                logger.info('✓ Utilisateur vérifié avec succès');
            } else {
                throw new Error('Échec de la vérification de l\'utilisateur');
            }
        } catch (error) {
            logger.error('✗ Erreur lors de la vérification de l\'utilisateur:', error.message);
            throw error;
        }

        // Test 3: Création d'un cours
        logger.info('Test 3: Création d\'un cours');
        try {
            const courseId = await courseHelpers.createCourse(
                'Cours de test',
                'Description du cours de test',
                'https://example.com/course',
                'islam',
                1
            );
            logger.info('✓ Cours créé avec succès, ID:', courseId);
        } catch (error) {
            logger.error('✗ Erreur lors de la création du cours:', error.message);
            throw error;
        }

        // Test 4: Création d'un événement
        logger.info('Test 4: Création d\'un événement');
        try {
            const eventId = await eventHelpers.createEvent(
                'Événement test',
                'Description de l\'événement test',
                new Date(Date.now() + 86400000), // demain
                'Lieu test',
                1
            );
            logger.info('✓ Événement créé avec succès, ID:', eventId);
        } catch (error) {
            logger.error('✗ Erreur lors de la création de l\'événement:', error.message);
            throw error;
        }

        // Test 5: Récupération des cours
        logger.info('Test 5: Récupération des cours');
        try {
            const courses = await courseHelpers.getAllCourses();
            logger.info(`✓ ${courses.length} cours récupérés avec succès`);
        } catch (error) {
            logger.error('✗ Erreur lors de la récupération des cours:', error.message);
            throw error;
        }

        // Test 6: Récupération des événements à venir
        logger.info('Test 6: Récupération des événements à venir');
        try {
            const events = await eventHelpers.getUpcomingEvents();
            logger.info(`✓ ${events.length} événements à venir récupérés avec succès`);
        } catch (error) {
            logger.error('✗ Erreur lors de la récupération des événements:', error.message);
            throw error;
        }

        logger.info('Tous les tests ont été exécutés avec succès !');
    } catch (error) {
        logger.error('Une erreur est survenue pendant les tests:', error);
    } finally {
        // Fermer la connexion à la base de données
        db.close((err) => {
            if (err) {
                logger.error('Erreur lors de la fermeture de la base de données:', err.message);
            } else {
                logger.info('Connexion à la base de données fermée');
            }
        });
    }
}

// Exécuter les tests
testDatabase();
