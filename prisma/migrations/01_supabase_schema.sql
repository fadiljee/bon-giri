-- ============================================================================
-- BON GIRI SUPABASE POSTGRESQL DDL & MIGRATION SCRIPT
-- ============================================================================

-- 1. Create Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ADMIN', 'STAFF');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role DEFAULT 'STAFF',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Add cost_price column to public.products if it doesn't exist
DO $$ BEGIN
    ALTER TABLE public.products ADD COLUMN cost_price NUMERIC(12, 2) DEFAULT 0;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- 4. Sales Transactions Table (POS Transactions)
CREATE TABLE IF NOT EXISTS public.sales_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT UNIQUE NOT NULL,
  customer_name TEXT DEFAULT 'Pembeli Umum',
  customer_phone TEXT,
  total_amount NUMERIC(12, 2) NOT NULL,
  total_cost NUMERIC(12, 2) DEFAULT 0,
  gross_profit NUMERIC(12, 2) DEFAULT 0,
  payment_method TEXT DEFAULT 'CASH', -- CASH, TRANSFER_BANK, QRIS, WHATSAPP_ORDER
  status TEXT DEFAULT 'COMPLETED',
  created_by UUID REFERENCES public.profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Sales Transaction Items
CREATE TABLE IF NOT EXISTS public.sales_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES public.sales_transactions(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  cost_price NUMERIC(12, 2) NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  subtotal NUMERIC(12, 2) NOT NULL
);

-- 6. Financial Expenses & Records
CREATE TABLE IF NOT EXISTS public.financial_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- INCOME | EXPENSE
  category TEXT NOT NULL, -- BAHAN_BAKU | OPERASIONAL | GAJI | LKM_UBB | LAINNYA
  title TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  notes TEXT,
  receipt_image_url TEXT,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Row Level Security (RLS) Configuration
ALTER TABLE public.sales_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_records ENABLE ROW LEVEL SECURITY;

-- Allow authenticated mobile app users (ADMIN & STAFF) to read & insert transactions
CREATE POLICY "Authenticated users can read transactions"
  ON public.sales_transactions FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert transactions"
  ON public.sales_transactions FOR INSERT
  TO authenticated WITH CHECK (true);

-- Allow authenticated mobile app users to read & insert sales items
CREATE POLICY "Authenticated users can manage sales items"
  ON public.sales_items FOR ALL
  TO authenticated USING (true);

-- Allow authenticated mobile app users to manage financial records
CREATE POLICY "Authenticated users can manage financial records"
  ON public.financial_records FOR ALL
  TO authenticated USING (true);
