-- Vérifier la structure de la table
SHOW COLUMNS FROM ghtusr;

-- Insérer l'utilisateur admin
INSERT INTO ghtusr (
    us_fname,
    us_lname,
    us_email,
    us_type,
    us_status,
    created_at
) VALUES (
    'Admin',
    'System',
    'admin@jama3i.com',
    'admin',
    'active',
    NOW()
);
