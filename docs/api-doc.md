# MobiRent Cameroon - Technical Documentation

## Database Schema Overview

### Core Tables

#### Users Table
\`\`\`sql
users (
  id: UUID PRIMARY KEY,
  email: TEXT UNIQUE,
  full_name: TEXT,
  phone_number: TEXT,
  location: TEXT,
  role: TEXT CHECK (role IN ('customer', 'admin')),
  language: TEXT CHECK (language IN ('en', 'fr')) DEFAULT 'en',
  rental_service_id: UUID REFERENCES rental_services(id),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
\`\`\`

#### Cars Table
\`\`\`sql
cars (
  id: UUID PRIMARY KEY,
  brand: TEXT,
  model: TEXT,
  price_per_day: DECIMAL,
  status: TEXT CHECK (status IN ('available', 'booked', 'maintenance')),
  image_url: TEXT,
  location_id: UUID REFERENCES locations(id),
  rental_service_id: UUID REFERENCES rental_services(id),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
\`\`\`

#### Bookings Table
\`\`\`sql
bookings (
  id: UUID PRIMARY KEY,
  user_id: UUID REFERENCES users(id),
  car_id: UUID REFERENCES cars(id),
  start_date: DATE,
  end_date: DATE,
  total_price: DECIMAL,
  booking_status: TEXT CHECK (booking_status IN ('confirmed', 'completed', 'cancelled')),
  payment_status: TEXT CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
\`\`\`

#### Payments Table
\`\`\`sql
payments (
  id: UUID PRIMARY KEY,
  booking_id: UUID REFERENCES bookings(id),
  amount: DECIMAL,
  method: TEXT,
  status: TEXT CHECK (status IN ('initiated', 'success', 'failed')),
  transaction_reference: TEXT,
  paid_at: TIMESTAMP,
  created_at: TIMESTAMP
)
\`\`\`

#### Rental Services Table
\`\`\`sql
rental_services (
  id: UUID PRIMARY KEY,
  company_name: TEXT,
  email: TEXT,
  phone_number: TEXT,
  city: TEXT,
  branch_name: TEXT,
  address: TEXT,
  website: TEXT,
  description: TEXT,
  logo_url: TEXT,
  status: TEXT CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
\`\`\`

### Authentication Flow

#### Supabase Auth Integration
\`\`\`typescript
// Auth Context provides:
- user: Supabase User object
- userProfile: Extended user data from users table
- signIn(email, password): Promise<void>
- signUp(email, password, metadata): Promise<void>
- signOut(): Promise<void>
- loading: boolean
\`\`\`

#### Session Persistence
- JWT tokens stored in localStorage via Supabase
- Automatic token refresh
- Session validation on app initialization
- Proper redirect handling for protected routes

### Caching Strategy

#### Memory + localStorage Caching
\`\`\`typescript
// Cache implementation:
cachedFetch(key: string, fetchFn: Function, ttl: number)

// Cache locations:
- Memory: Fast access for current session
- localStorage: Persistence across sessions
- TTL: Time-to-live for cache invalidation
\`\`\`

#### Cache Keys & TTL
- `homepage_cars`: 2 minutes
- `locations`: 10 minutes  
- `user_bookings`: 1 minute
- `admin_stats`: 5 minutes

### API Endpoints (Supabase)

#### Public Endpoints
\`\`\`typescript
// Cars
GET /cars - List available cars
GET /cars/:id - Get car details

// Locations  
GET /locations - List all locations

// Rental Services
GET /rental_services - List approved services
\`\`\`

#### Protected Endpoints (Customer)
\`\`\`typescript
// Bookings
GET /bookings - User's bookings
POST /bookings - Create booking
PATCH /bookings/:id - Update booking

// Payments
GET /payments - User's payments
POST /payments - Create payment

// Profile
GET /users/:id - User profile
PATCH /users/:id - Update profile
\`\`\`

#### Protected Endpoints (Admin)
\`\`\`typescript
// Fleet Management
GET /cars - Admin's cars
POST /cars - Add new car
PATCH /cars/:id - Update car
DELETE /cars/:id - Remove car

// Booking Management
GET /bookings - Service bookings
PATCH /bookings/:id - Update booking status

// Payment Tracking
GET /payments - Service payments
GET /payments/export - Export payment data

// Service Management
PATCH /rental_services/:id - Update service info
\`\`\`

### Security Implementation

#### Row Level Security (RLS)
\`\`\`sql
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Admins can only manage their own cars
CREATE POLICY "Admins manage own cars" ON cars
  FOR ALL USING (
    rental_service_id IN (
      SELECT rental_service_id FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Customers can only view available cars
CREATE POLICY "Customers view available cars" ON cars
  FOR SELECT USING (status = 'available');
\`\`\`

#### Authentication Guards
\`\`\`typescript
// Route protection
useEffect(() => {
  if (!user || !userProfile) {
    router.push('/auth');
    return;
  }
  
  if (userProfile.role !== expectedRole) {
    router.push('/unauthorized');
    return;
  }
}, [user, userProfile]);
\`\`\`

### Performance Optimizations

#### Database Optimizations
- Indexed columns: email, car status, booking dates
- Efficient joins with select specific fields
- Pagination for large datasets
- Connection pooling via Supabase

#### Frontend Optimizations
- Component lazy loading
- Image optimization with Next.js
- Cached API responses
- Debounced search inputs
- Virtual scrolling for large lists

#### Caching Strategy
- Static data cached longer (locations: 10min)
- Dynamic data cached shorter (cars: 2min)
- User-specific data minimal caching (1min)
- Cache invalidation on mutations

### Internationalization (i18n)

#### Language Support
\`\`\`typescript
// Language Context provides:
- language: 'en' | 'fr'
- setLanguage: (lang) => void
- t: (key: string) => string
- translations: Record<string, Record<string, string>>
\`\`\`

#### Translation Structure
\`\`\`typescript
const translations = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.bookings': 'My Bookings',
    'car.book_now': 'Book Now',
    // ...
  },
  fr: {
    'nav.dashboard': 'Tableau de bord',
    'nav.bookings': 'Mes Réservations', 
    'car.book_now': 'Réserver maintenant',
    // ...
  }
};
\`\`\`

### Error Handling

#### Global Error Boundaries
\`\`\`typescript
// Toast notifications for user feedback
const { toast } = useToast();

// Standardized error handling
try {
  await apiCall();
  toast({ title: "Success", description: "Operation completed" });
} catch (error) {
  toast({ 
    title: "Error", 
    description: error.message,
    variant: "destructive" 
  });
}
\`\`\`

#### Network Error Recovery
- Automatic retry for failed requests
- Offline detection and queuing
- Graceful degradation for poor connections
- User feedback for network issues

### Deployment Configuration

#### Environment Variables
\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Custom domain
NEXT_PUBLIC_SITE_URL=https://mobirent.cm
\`\`\`

#### Build Optimization
\`\`\`javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ['supabase.co', 'your-storage-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
};
\`\`\`

### Monitoring & Analytics

#### Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- Error rate tracking
- User session analytics

#### Business Metrics
- Booking conversion rates
- Revenue per rental service
- Customer retention rates
- Popular car models/locations

---

*This technical documentation provides an overview of the MobiRent Cameroon platform architecture, database design, and implementation details.*
