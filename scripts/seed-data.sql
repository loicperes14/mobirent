-- Insert sample locations
INSERT INTO locations (city, branch_name, address) VALUES
('Yaoundé', 'Centre-Ville', 'Avenue Kennedy, Yaoundé'),
('Douala', 'Akwa', 'Boulevard de la Liberté, Douala'),
('Bamenda', 'Commercial Avenue', 'Commercial Avenue, Bamenda'),
('Bafoussam', 'Marché Central', 'Rue du Marché, Bafoussam'),
('Garoua', 'Centre Commercial', 'Avenue Ahmadou Ahidjo, Garoua');

-- Insert sample cars
INSERT INTO cars (brand, model, image_url, price_per_day, location_id, status) VALUES
('Toyota', 'Camry', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 25000, (SELECT id FROM locations WHERE city = 'Yaoundé' LIMIT 1), 'available'),
('Honda', 'CR-V', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 35000, (SELECT id FROM locations WHERE city = 'Yaoundé' LIMIT 1), 'available'),
('Nissan', 'Altima', 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 28000, (SELECT id FROM locations WHERE city = 'Douala' LIMIT 1), 'available'),
('Hyundai', 'Tucson', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 32000, (SELECT id FROM locations WHERE city = 'Douala' LIMIT 1), 'available'),
('Kia', 'Sportage', 'https://images.unsplash.com/photo-1494976688153-ca3ce29cd5b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 30000, (SELECT id FROM locations WHERE city = 'Bamenda' LIMIT 1), 'available'),
('Toyota', 'RAV4', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 38000, (SELECT id FROM locations WHERE city = 'Bafoussam' LIMIT 1), 'available'),
('Honda', 'Accord', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 27000, (SELECT id FROM locations WHERE city = 'Garoua' LIMIT 1), 'available'),
('Nissan', 'Sentra', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 22000, (SELECT id FROM locations WHERE city = 'Yaoundé' LIMIT 1), 'available'),
('Hyundai', 'Elantra', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 24000, (SELECT id FROM locations WHERE city = 'Douala' LIMIT 1), 'available'),
('Kia', 'Sorento', 'https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 40000, (SELECT id FROM locations WHERE city = 'Bamenda' LIMIT 1), 'available'),
('BMW', 'X3', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 45000, (SELECT id FROM locations WHERE city = 'Yaoundé' LIMIT 1), 'available'),
('Mercedes-Benz', 'C-Class', 'https://images.unsplash.com/photo-1618843479619-f3d0d81e4d10?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 50000, (SELECT id FROM locations WHERE city = 'Douala' LIMIT 1), 'available'),
('Audi', 'Q5', 'https://images.unsplash.com/photo-1606016159991-8b5d2e5e4d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 48000, (SELECT id FROM locations WHERE city = 'Yaoundé' LIMIT 1), 'available'),
('Volkswagen', 'Tiguan', 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 33000, (SELECT id FROM locations WHERE city = 'Bamenda' LIMIT 1), 'available'),
('Ford', 'Explorer', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 36000, (SELECT id FROM locations WHERE city = 'Bafoussam' LIMIT 1), 'available');

-- Create an admin user (you'll need to sign up first, then update the role)
-- This is just a placeholder - you'll need to update this after creating your first user
-- UPDATE users SET role = 'admin' WHERE email = 'admin@mobirent.cm';
