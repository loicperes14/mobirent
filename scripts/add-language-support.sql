-- Add language support to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS language TEXT
CHECK (language IN ('en', 'fr'))
DEFAULT 'en';

-- Update existing users to have default language
UPDATE users 
SET language = 'en' 
WHERE language IS NULL;
