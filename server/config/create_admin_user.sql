INSERT INTO ghtusr (us_email, us_password, us_fname, us_lname, us_type, us_status)
VALUES ('admin@jama3i.com', '$2b$10$YourHashedPasswordHere', 'Admin', 'User', 'admin', 'active')
ON DUPLICATE KEY UPDATE
us_password = VALUES(us_password),
us_type = VALUES(us_type),
us_status = VALUES(us_status);
