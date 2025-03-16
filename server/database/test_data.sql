-- Insérer des mosquées
INSERT INTO GHTMOSQ (ms_name, ms_addr, ms_city, ms_latitude, ms_longitude) VALUES
('Mosquée Al-Salam', '123 Rue de la Paix', 'Marseille', 43.296482, 5.369780),
('Mosquée Al-Nour', '456 Avenue de la Lumière', 'Marseille', 43.309841, 5.369589);

-- Insérer des utilisateurs
INSERT INTO GHTUSR (us_fname, us_lname, us_gender, us_bdate, us_email, us_type, us_status) VALUES
('Admin', 'System', 'M', '1990-01-01', 'admin@jama3i.fr', 'admin', 'active'),
('Mohamed', 'Imam', 'M', '1985-05-15', 'imam@mosque.fr', 'mosque_admin', 'active'),
('Sarah', 'User', 'F', '1995-03-20', 'sarah@mail.com', 'user', 'active');

-- Insérer des invocations
INSERT INTO GHTINV (in_text_ar, in_text_fr, in_text_en) VALUES
('سُبْحَانَ اللَّهِ', 'Gloire à Allah', 'Glory be to Allah'),
('الْحَمْدُ لِلَّهِ', 'Louange à Allah', 'Praise be to Allah');

-- Insérer des événements
INSERT INTO GHTEVT (mosque_id, user_id, ev_title, ev_desc, ev_type, ev_sdate, ev_edate) VALUES
(1, 2, 'Cours de Coran', 'Cours hebdomadaire', 'course', '2024-03-20 18:00:00', '2024-03-20 20:00:00'),
(1, 2, 'Collecte pour la mosquée', 'Collecte mensuelle', 'donation', '2024-03-25 09:00:00', '2024-03-25 18:00:00'); 