-- Migration: 002_monthly_records
-- Description: Criação da tabela de registros mensais (receitas e despesas)

CREATE TABLE public.monthly_records (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    type varchar(50) NOT NULL CHECK (type IN ('Receita', 'Despesa')),
    description text NOT NULL,
    origin text,
    category text,
    amount numeric(12, 2) NOT NULL DEFAULT 0.00,
    status varchar(50) NOT NULL DEFAULT 'Pendente' CHECK (status IN ('Recebido', 'Pago', 'Pendente', 'Cancelado')),
    occurred_at timestamptz NOT NULL,
    reference_month varchar(7) NOT NULL, -- Format: MM/YYYY
    observations text,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz
);

-- Indexes for common filters
CREATE INDEX idx_monthly_records_user_id ON public.monthly_records(user_id);
CREATE INDEX idx_monthly_records_reference_month ON public.monthly_records(reference_month);

-- Enable RLS
ALTER TABLE public.monthly_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own monthly records" 
    ON public.monthly_records FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own monthly records" 
    ON public.monthly_records FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own monthly records" 
    ON public.monthly_records FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own monthly records" 
    ON public.monthly_records FOR DELETE 
    USING (auth.uid() = user_id);
