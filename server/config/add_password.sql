-- Ajouter la colonne mot de passe
ALTER TABLE ghtusr ADD COLUMN us_password VARCHAR(255);

-- Mettre à jour le mot de passe de l'admin (le hash de 'admin123')
UPDATE ghtusr 
SET us_password = '$2b$10$8nMJR0zk3s5vp8Qtv.3E8.Yx6TBGfB8GbWBt1RRCvnJc9MSGHZqpq'
WHERE us_email = 'admin@jama3i.com';
