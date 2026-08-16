-- CivicFix Supabase Schema
-- Run this in your Supabase SQL Editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- ENUMS
-- ============================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('CITIZEN', 'ADMIN', 'VOLUNTEER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE complaint_status AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE complaint_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- TABLES
-- ============================================

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role user_role DEFAULT 'CITIZEN' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  citizen_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  status complaint_status DEFAULT 'PENDING' NOT NULL,
  priority complaint_priority DEFAULT 'MEDIUM' NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Assignments table
CREATE TABLE IF NOT EXISTS assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE NOT NULL,
  volunteer_id UUID REFERENCES profiles(id) ON DELETE RESTRICT NOT NULL,
  assigned_by UUID REFERENCES profiles(id) ON DELETE RESTRICT NOT NULL,
  assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
  completed_at TIMESTAMPTZ
);

-- Complaint updates table
CREATE TABLE IF NOT EXISTS complaint_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status complaint_status NOT NULL,
  message TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- AI predictions table
CREATE TABLE IF NOT EXISTS ai_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE NOT NULL,
  issue_type VARCHAR(100) NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  model_version VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_location ON complaints(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_assignments_complaint ON assignments(complaint_id);
CREATE INDEX IF NOT EXISTS idx_assignments_volunteer ON assignments(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_complaint_updates_complaint ON complaint_updates(complaint_id);
CREATE INDEX IF NOT EXISTS idx_ai_predictions_complaint ON ai_predictions(complaint_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Complaints policies
DROP POLICY IF EXISTS "Citizens can create own complaints" ON complaints;
CREATE POLICY "Citizens can create own complaints" ON complaints
  FOR INSERT WITH CHECK (
    auth.uid() = citizen_id OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "Citizens can view own complaints" ON complaints;
CREATE POLICY "Citizens can view own complaints" ON complaints
  FOR SELECT USING (citizen_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all complaints" ON complaints;
CREATE POLICY "Admins can view all complaints" ON complaints
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

DROP POLICY IF EXISTS "Volunteers can view assigned complaints" ON complaints;
CREATE POLICY "Volunteers can view assigned complaints" ON complaints
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM assignments 
      WHERE complaint_id = complaints.id AND volunteer_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can update complaints" ON complaints;
CREATE POLICY "Admins can update complaints" ON complaints
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Assignments policies
DROP POLICY IF EXISTS "Admins can create assignments" ON assignments;
CREATE POLICY "Admins can create assignments" ON assignments
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

DROP POLICY IF EXISTS "Users can view relevant assignments" ON assignments;
CREATE POLICY "Users can view relevant assignments" ON assignments
  FOR SELECT USING (
    volunteer_id = auth.uid() OR 
    assigned_by = auth.uid() OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- Complaint updates policies
DROP POLICY IF EXISTS "Authenticated users can create updates" ON complaint_updates;
CREATE POLICY "Authenticated users can create updates" ON complaint_updates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view updates for their complaints" ON complaint_updates;
CREATE POLICY "Users can view updates for their complaints" ON complaint_updates
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM complaints WHERE id = complaint_updates.complaint_id AND citizen_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM assignments WHERE complaint_id = complaint_updates.complaint_id AND volunteer_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

-- AI predictions policies
DROP POLICY IF EXISTS "Admins can view AI predictions" ON ai_predictions;
CREATE POLICY "Admins can view AI predictions" ON ai_predictions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')
  );

DROP POLICY IF EXISTS "Users can view predictions for their complaints" ON ai_predictions;
CREATE POLICY "Users can view predictions for their complaints" ON ai_predictions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM complaints WHERE id = ai_predictions.complaint_id AND citizen_id = auth.uid())
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for complaints
DROP TRIGGER IF EXISTS update_complaints_updated_at ON complaints;
CREATE TRIGGER update_complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'CITIZEN')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- STORAGE BUCKET (for images)
-- ============================================

-- Create storage bucket for complaint images
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-images', 'complaint-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
CREATE POLICY "Anyone can upload images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'complaint-images');

DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
CREATE POLICY "Anyone can view images" ON storage.objects
  FOR SELECT USING (bucket_id = 'complaint-images');
