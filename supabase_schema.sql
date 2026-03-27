-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define Roles
CREATE TYPE user_role AS ENUM ('child', 'admin', 'psychologist');
CREATE TYPE chat_status AS ENUM ('active', 'closed');
CREATE TYPE alert_status AS ENUM ('active', 'resolved');

-- Table: users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role user_role NOT NULL DEFAULT 'child',
    camouflaged_pin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: chats
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status chat_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id),
    text TEXT NOT NULL,
    is_system_alert BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: trusted_contacts
CREATE TABLE trusted_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone_number TEXT NOT NULL
);

-- Table: emergency_alerts
CREATE TABLE emergency_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    status alert_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: support_locations
CREATE TABLE support_locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- e.g., 'delegacia', 'conselho_tutelar'
    name TEXT NOT NULL,
    phone TEXT,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL
);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_locations ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin or psychologist
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'psychologist')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users Table Policies
CREATE POLICY "Users can view their own profile or admins can view all"
    ON users FOR SELECT
    USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update their own profile OR admins can update all"
    ON users FOR UPDATE
    USING (auth.uid() = id OR is_admin());

-- Chats Table Policies
CREATE POLICY "Children can see their chats, admins can see all"
    ON chats FOR SELECT
    USING (auth.uid() = child_id OR is_admin());

CREATE POLICY "Children can insert chats, admins can insert for children"
    ON chats FOR INSERT
    WITH CHECK (auth.uid() = child_id OR is_admin());

CREATE POLICY "Children can update their chats, admins can update all"
    ON chats FOR UPDATE
    USING (auth.uid() = child_id OR is_admin());

-- Messages Table Policies
CREATE POLICY "Users can view messages in their chats or admins can view all"
    ON messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM chats WHERE id = messages.chat_id AND (child_id = auth.uid() OR is_admin())
        )
    );

CREATE POLICY "Users can insert messages in their chats"
    ON messages FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM chats WHERE id = messages.chat_id AND (child_id = auth.uid() OR admin_id = auth.uid() OR is_admin())
        )
    );

-- Trusted Contacts Table Policies
CREATE POLICY "Children can manage their own trusted contacts or admins can manage all"
    ON trusted_contacts FOR ALL
    USING (auth.uid() = child_id OR is_admin())
    WITH CHECK (auth.uid() = child_id OR is_admin());

-- Emergency Alerts Table Policies
CREATE POLICY "Children can manage their own alerts, admins can manage all"
    ON emergency_alerts FOR ALL
    USING (auth.uid() = child_id OR is_admin())
    WITH CHECK (auth.uid() = child_id OR is_admin());

-- Support Locations Table Policies
CREATE POLICY "Anyone can view support locations"
    ON support_locations FOR SELECT
    USING (true);

CREATE POLICY "Only admins can manage support locations"
    ON support_locations FOR ALL
    USING (is_admin())
    WITH CHECK (is_admin());

-- ==========================================
-- REALTIME
-- ==========================================
-- Enable replication for specific tables that need real-time updates
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE emergency_alerts;
ALTER TABLE emergency_alerts ADD COLUMN IF NOT EXISTS admin_id UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE TABLE IF NOT EXISTS diagnostic_data (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, game_type TEXT NOT NULL, interaction_data JSONB NOT NULL, ai_flag_level INTEGER DEFAULT 0, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()); ALTER TABLE diagnostic_data ENABLE ROW LEVEL SECURITY; CREATE POLICY "Children can insert diagnostic data, admins can view all" ON diagnostic_data FOR ALL USING (auth.uid() = child_id OR is_admin()) WITH CHECK (auth.uid() = child_id OR is_admin());
CREATE TABLE IF NOT EXISTS evidence_logs (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, file_path TEXT NOT NULL, file_hash TEXT NOT NULL, latitude FLOAT, longitude FLOAT, type TEXT NOT NULL, created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()); ALTER TABLE evidence_logs ENABLE ROW LEVEL SECURITY; CREATE POLICY "Children can insert evidence, admins can view all" ON evidence_logs FOR ALL USING (auth.uid() = child_id OR is_admin()) WITH CHECK (auth.uid() = child_id OR is_admin());
INSERT INTO storage.buckets (id, name, public) VALUES ('evidence_storage', 'evidence_storage', false) ON CONFLICT (id) DO NOTHING;

-- Table: consent_logs (LGPD Compliance)
CREATE TABLE IF NOT EXISTS consent_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    terms_version TEXT DEFAULT '1.0',
    accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE consent_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Devices can insert logs, admins can view all" ON consent_logs FOR ALL USING (true) WITH CHECK (true);

-- Table: access_audit_logs (Judicial Audit)
CREATE TABLE IF NOT EXISTS access_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES users(id) NOT NULL,
    resource_id UUID NOT NULL, -- link to evidence_logs or users
    action_type TEXT NOT NULL, -- 'view', 'download', 'export_dossie'
    reason TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE access_audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins can manage audit logs" ON access_audit_logs FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ==========================================
-- STRICT ARCHIVAL POLICY (No Deletion Permitted)
-- ==========================================
-- Rules to prevent deletion of critical forensic data
DO $$ BEGIN
    CREATE RULE no_delete_evidence AS ON DELETE TO evidence_logs DO INSTEAD NOTHING;
    CREATE RULE no_delete_audit AS ON DELETE TO access_audit_logs DO INSTEAD NOTHING;
    CREATE RULE no_delete_diagnostic AS ON DELETE TO diagnostic_data DO INSTEAD NOTHING;
    CREATE RULE no_delete_messages AS ON DELETE TO messages DO INSTEAD NOTHING;
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Grant permissions for storage
DO $$ BEGIN
    INSERT INTO storage.buckets (id, name, public) VALUES ('evidence_storage', 'evidence_storage', false) ON CONFLICT (id) DO NOTHING;
    CREATE POLICY "Allow authenticated uploads to evidence_storage" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'evidence_storage');
    CREATE POLICY "Allow admins to view evidence_storage" ON storage.objects FOR SELECT USING (bucket_id = 'evidence_storage' AND is_admin());
EXCEPTION WHEN OTHERS THEN NULL; END $$;

-- Table: diary_entries (Private Journal)
CREATE TABLE IF NOT EXISTS diary_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    mood TEXT, -- 'happy', 'sad', 'scared', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Children can handle their diary, admins can view all" ON diary_entries FOR ALL USING (auth.uid() = child_id OR is_admin()) WITH CHECK (auth.uid() = child_id OR is_admin());

-- Table: app_access_logs (PIN and App Activity)
CREATE TABLE IF NOT EXISTS app_access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    child_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'pin_entry_success', 'pin_entry_fail', 'app_open'
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE app_access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Only admins and owner child can view access logs" ON app_access_logs FOR ALL USING (auth.uid() = child_id OR is_admin()) WITH CHECK (auth.uid() = child_id OR is_admin());

-- Rules to prevent deletion for total archival
DO $$ BEGIN
    CREATE RULE no_delete_diary AS ON DELETE TO diary_entries DO INSTEAD NOTHING;
    CREATE RULE no_delete_access_logs AS ON DELETE TO app_access_logs DO INSTEAD NOTHING;
EXCEPTION WHEN OTHERS THEN NULL; END $$;
