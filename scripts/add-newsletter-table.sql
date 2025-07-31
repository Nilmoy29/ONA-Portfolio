-- Add newsletter_subscribers table for newsletter functionality
-- This table stores email subscribers for the newsletter

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  is_active BOOLEAN DEFAULT true,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_is_active_idx ON newsletter_subscribers(is_active);
CREATE INDEX IF NOT EXISTS newsletter_subscribers_subscribed_at_idx ON newsletter_subscribers(subscribed_at);

-- Enable RLS for the newsletter_subscribers table
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for newsletter_subscribers table
-- Allow public inserts for newsletter signup
CREATE POLICY "Newsletter subscribers can be created by anyone"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow service role to view all subscribers (for admin access)
CREATE POLICY "Newsletter subscribers are viewable by service role"
  ON newsletter_subscribers
  FOR SELECT
  TO service_role
  USING (true);

-- Allow service role to update subscribers (for admin management)
CREATE POLICY "Newsletter subscribers are editable by service role"
  ON newsletter_subscribers
  FOR UPDATE
  TO service_role
  USING (true);

-- Allow service role to delete subscribers (for admin management)
CREATE POLICY "Newsletter subscribers are deletable by service role"
  ON newsletter_subscribers
  FOR DELETE
  TO service_role
  USING (true);

-- Create updated_at trigger for newsletter_subscribers
CREATE OR REPLACE FUNCTION update_newsletter_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER newsletter_subscribers_updated_at_trigger
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_subscribers_updated_at();

-- Insert some sample newsletter subscribers (optional)
INSERT INTO newsletter_subscribers (email, name, is_active, subscribed_at) VALUES
  ('subscriber1@example.com', 'John Doe', true, now() - interval '30 days'),
  ('subscriber2@example.com', 'Jane Smith', true, now() - interval '15 days'),
  ('subscriber3@example.com', 'Mike Johnson', true, now() - interval '7 days'),
  ('subscriber4@example.com', 'Sarah Wilson', false, now() - interval '60 days')
ON CONFLICT (email) DO NOTHING;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON newsletter_subscribers TO service_role;
GRANT INSERT ON newsletter_subscribers TO anon;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO service_role;