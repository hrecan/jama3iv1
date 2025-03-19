const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token d\'authentification requis'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'votre_clé_secrète', (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Token invalide ou expiré'
            });
        }

        req.user = user;
        next();
    });
};

module.exports = {
    authenticateToken
};
