require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const logger = require('./utils/logger');
const eventsRouter = require('./routes/events');
const authRouter = require('./routes/auth');
const mosquesRouter = require('./routes/mosques');
const userContentRouter = require('./routes/user_content');
const databaseViewRouter = require('./routes/database-view');
const quranRouter = require('./routes/quran');

// Vérifier les variables d'environnement requises
const requiredEnvVars = ['NODE_ENV', 'PORT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    logger.error(`Variables d'environnement manquantes: ${missingEnvVars.join(', ')}`);
    process.exit(1);
}

const app = express();
const port = process.env.PORT || 3002;

// Middleware pour parser le JSON - doit être avant les routes
app.use(express.json({
    strict: false,
    reviver: (key, value) => {
        console.log(`Clé: ${key}, Valeur: ${value}`);
        return value;
    }
}));

// Middleware CORS
app.use(cors());

// Middleware pour le logging des requêtes
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get('user-agent'),
        body: req.method === 'POST' ? JSON.stringify(req.body) : undefined
    });
    next();
});

// Route de healthcheck
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Log des routes disponibles
logger.info('Routes API configurées:');
logger.info('- POST /api/auth/register');
logger.info('- POST /api/auth/login');
logger.info('- GET /api/events');
logger.info('- GET /api/mosques');
logger.info('- GET /api/user_content');
logger.info('- GET /api/database');

// Routes API - avant les fichiers statiques
app.use('/api/events', eventsRouter);
app.use('/api/auth', authRouter);
app.use('/api/mosques', mosquesRouter);
app.use('/api/user-content', userContentRouter);
app.use('/api/database', databaseViewRouter);
app.use('/api/quran', quranRouter);

// Log toutes les requêtes API non trouvées
app.use('/api/*', (req, res) => {
    logger.warn(`Route API non trouvée: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route API non trouvée' });
});

// Servir les fichiers statiques depuis le dossier public
app.use(express.static(path.join(__dirname, '../public')));

// Route principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

// Routes pour les pages principales
app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/register.html'));
});

app.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/courses.html'));
});

app.get('/events', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/events.html'));
});

app.get('/quran', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/quran.html'));
});

// Route pour toutes les autres requêtes - renvoie vers index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

// Middleware de gestion des erreurs pour les autres routes
app.use((req, res) => {
    logger.warn(`Route non trouvée: ${req.method} ${req.url}`);
    res.status(404).sendFile(path.join(__dirname, '../public/views/components/404.html'));
});

// Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
    logger.error('Erreur serveur:', err);
    res.status(500).sendFile(path.join(__dirname, '../public/views/components/500.html'));
});

// Démarrage du serveur
app.listen(port, () => {
    logger.info(`Serveur démarré sur le port ${port}`);
    logger.info(`Mode: ${process.env.NODE_ENV}`);
});