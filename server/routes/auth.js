const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../models/database');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token manquant' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token invalide' });
        }
        req.user = user;
        next();
    });
};

// Inscription
router.post('/register', async (req, res) => {
    logger.info('Tentative d\'inscription reçue');
    logger.debug('Corps de la requête:', req.body);

    try {
        const { 
            us_fname, 
            us_lname, 
            us_gender, 
            us_bdate, 
            us_email, 
            us_phone, 
            us_city, 
            us_password,
            us_type,
            us_status,
            mosque_id
        } = req.body;

        // Validation des champs requis
        if (!us_fname || !us_lname || !us_gender || !us_bdate || !us_email || !us_password) {
            logger.warn('Champs manquants dans la requête d\'inscription');
            return res.status(400).json({ error: 'Tous les champs obligatoires sont requis' });
        }

        // Validation du format de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(us_email)) {
            logger.warn('Format d\'email invalide:', us_email);
            return res.status(400).json({ error: 'Format d\'email invalide' });
        }

        // Vérification si l'email existe déjà
        const checkEmailQuery = 'SELECT us_email FROM ghtusr WHERE us_email = ?';
        const existingUser = await db.getOne(checkEmailQuery, [us_email]);

        if (existingUser) {
            logger.warn('Email déjà utilisé:', us_email);
            return res.status(409).json({
                success: false,
                message: "Cette adresse email est déjà utilisée. Veuillez utiliser une autre adresse email ou vous connecter si vous avez déjà un compte."
            });
        }

        // Hashage du mot de passe
        const hashedPassword = await bcrypt.hash(us_password, 10);

        logger.info('Validation des données réussie, création de l\'utilisateur...');

        // Création de l'utilisateur
        const query = `
            INSERT INTO ghtusr (
                us_fname, us_lname, us_gender, us_bdate, us_email, 
                us_phone, us_city, us_password, us_type, us_status, 
                mosque_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            us_fname, us_lname, us_gender, us_bdate, us_email,
            us_phone, us_city, hashedPassword, us_type || 'user',
            us_status || 'active', mosque_id
        ];

        await db.query(query, values);
        
        // Récupérer l'utilisateur nouvellement créé
        const newUser = await db.getOne('SELECT * FROM ghtusr WHERE us_email = ?', [us_email]);
        
        logger.info('Utilisateur créé avec succès, ID:', newUser.us_id);

        // Génération du token
        const token = jwt.sign(
            { 
                id: newUser.us_id,
                email: newUser.us_email,
                type: newUser.us_type
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Envoyer la réponse avec le token
        res.status(201).json({
            success: true,
            message: "Inscription réussie",
            token: token,
            user: {
                id: newUser.us_id,
                email: newUser.us_email,
                type: newUser.us_type
            }
        });

        logger.info('Inscription réussie pour l\'utilisateur:', us_email);
    } catch (error) {
        logger.error('Erreur lors de l\'inscription:', error);
        
        // Gestion des erreurs spécifiques
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Cet email est déjà utilisé' });
        }
        
        res.status(500).json({ error: 'Erreur lors de l\'inscription' });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    try {
        logger.info('=== Début de la tentative de connexion ===');
        logger.info('Headers:', req.headers);
        
        const { email, password } = req.body;
        logger.info('Body reçu:', { email, password });
        logger.info('Données extraites:', { email, password: password ? '[PRÉSENT]' : '[ABSENT]' });

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email et mot de passe requis'
            });
        }

        logger.info('Recherche utilisateur avec email:', email);
        
        // D'abord, vérifions si l'utilisateur existe
        const userQuery = 'SELECT * FROM ghtusr WHERE us_email = ?';
        const user = await db.getOne(userQuery, [email]);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Vérifier le statut de l'utilisateur
        if (user.us_status !== 'active') {
            return res.status(401).json({
                success: false,
                message: 'Votre compte n\'est pas encore activé. Veuillez attendre l\'activation par un administrateur.'
            });
        }

        // Vérifier le mot de passe
        const validPassword = await bcrypt.compare(password, user.us_password);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Email ou mot de passe incorrect'
            });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { 
                id: user.us_id,
                email: user.us_email,
                type: user.us_type
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user.us_id,
                us_fname: user.us_fname,
                us_lname: user.us_lname,
                email: user.us_email,
                type: user.us_type
            }
        });

    } catch (error) {
        logger.error('Erreur lors de la connexion:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la connexion'
        });
    }
});

// Vérifier le token
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        const user = await db.getOne('SELECT * FROM ghtusr WHERE us_id = ?', [req.user.id]);
        res.json({ user });
    } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        res.status(500).json({ error: 'Erreur lors de la vérification' });
    }
});

module.exports = router;
module.exports.authenticateToken = authenticateToken;
