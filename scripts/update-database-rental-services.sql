-- Create rental_services table
CREATE TABLE IF NOT EXISTS rental_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT NOT NULL,
    city TEXT NOT NULL,
    branch_name TEXT NOT NULL,
    address TEXT NOT NULL,
    website TEXT,
    description TEXT,
    logo_url TEXT,
    status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create rental_service_payments table for payment setup
CREATE TABLE IF NOT EXISTS rental_service_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_service_id UUID REFERENCES rental_services(id) ON DELETE CASCADE,
    payment_method TEXT CHECK (payment_method IN ('mtn_momo', 'orange_money')) NOT NULL,
    phone_number TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add rental_service_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS rental_service_id UUID REFERENCES rental_services(id) ON DELETE SET NULL;

-- Add rental_service_id to cars table
ALTER TABLE cars ADD COLUMN IF NOT EXISTS rental_service_id UUID REFERENCES rental_services(id) ON DELETE CASCADE;

-- Enable Row Level Security for new tables
ALTER TABLE rental_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_service_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for rental_services table
CREATE POLICY "Rental services can view own data" ON rental_services FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.rental_service_id = rental_services.id
    )
);

CREATE POLICY "Rental services can update own data" ON rental_services FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.rental_service_id = rental_services.id
    )
);

CREATE POLICY "Enable insert for authenticated users" ON rental_services FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policies for rental_service_payments table
CREATE POLICY "Rental services can manage own payments" ON rental_service_payments FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND users.rental_service_id = rental_service_payments.rental_service_id
    )
);

-- Update cars table policies to include rental service admins
DROP POLICY IF EXISTS "Admins can manage cars" ON cars;
CREATE POLICY "Admins can manage cars" ON cars FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE users.id = auth.uid() 
        AND (
            users.role = 'admin' 
            OR (users.role = 'admin' AND users.rental_service_id = cars.rental_service_id)
        )
    )
);

-- Update bookings policies to allow rental service admins to view their bookings
CREATE POLICY "Rental service admins can view bookings for their cars" ON bookings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users u
        JOIN cars c ON c.id = bookings.car_id
        WHERE u.id = auth.uid() 
        AND u.role = 'admin'
        AND u.rental_service_id = c.rental_service_id
    )
);

-- Update payments policies to allow rental service admins to view payments for their bookings
CREATE POLICY "Rental service admins can view payments for their bookings" ON payments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users u
        JOIN bookings b ON b.id = payments.booking_id
        JOIN cars c ON c.id = b.car_id
        WHERE u.id = auth.uid() 
        AND u.role = 'admin'
        AND u.rental_service_id = c.rental_service_id
    )
);
