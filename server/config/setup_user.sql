-- Créer l'utilisateur s'il n'existe pas
CREATE USER IF NOT EXISTS 'Admin'@'localhost' IDENTIFIED BY 'Asmarh06072024*';

-- Accorder tous les privilèges sur la base de données
GRANT ALL PRIVILEGES ON jama3iv001.* TO 'Admin'@'localhost';

-- Recharger les privilèges
FLUSH PRIVILEGES;

-- Vérifier que l'utilisateur admin existe dans la table ghtusr
SELECT us_id, us_email, us_type, us_status 
FROM jama3iv001.ghtusr 
WHERE us_email = 'admin@jama3i.com';
