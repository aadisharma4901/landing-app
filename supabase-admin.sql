-- Admin Panel Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the admin functionality

-- 1. Add role column to users table for admin access
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- 2. Create index for faster role queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 3. Update RLS policies to allow admin access to all data
-- First, enable RLS on users table if not already
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Create admin-specific policy for users table
DROP POLICY IF EXISTS "Admins can manage all users" ON users;
CREATE POLICY "Admins can manage all users" ON users
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 5. Allow users to read their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON users;
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT
  TO public
  USING (auth.uid() = id);

-- 6. Allow public to read users (for product reviews, etc.)
DROP POLICY IF EXISTS "Allow public read users" ON users;
CREATE POLICY "Allow public read users" ON users
  FOR SELECT
  TO public
  USING (true);

-- 7. Admin policy for orders - view all orders
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 8. Admin policy for cart_items - view all carts
DROP POLICY IF EXISTS "Admins can view all cart items" ON cart_items;
CREATE POLICY "Admins can view all cart items" ON cart_items
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 9. Admin policy for products - full access
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 10. Create analytics table for tracking daily metrics
CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  total_orders INTEGER DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on analytics
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Admin can manage analytics
CREATE POLICY "Admins can manage analytics" ON analytics
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 11. Create product inventory log for tracking stock changes
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  change_reason TEXT,
  changed_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on inventory_logs
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;

-- Admin can manage inventory logs
CREATE POLICY "Admins can manage inventory logs" ON inventory_logs
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- 12. Function to set user as admin (run this manually in SQL editor)
-- UPDATE users SET role = 'admin' WHERE id = 'YOUR_USER_ID';

-- 13. Function to get admin status
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;