-- Migration: 003_debt_plans
-- Description: Criação da tabela de planejamento de quitação de dívidas

CREATE TABLE public.debt_plans (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    name text NOT NULL,
    total_amount numeric(12, 2) NOT NULL,
    remaining_amount numeric(12, 2) NOT NULL,
    monthly_payment numeric(12, 2) NOT NULL,
    interest_rate numeric(5, 2) DEFAULT 0.00,
    priority varchar(20) DEFAULT 'Média', -- Baixa, Média, Alta
    start_date timestamptz NOT NULL,
    end_date timestamptz,
    total_installments integer NOT NULL DEFAULT 1,
    paid_installments integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz
);

-- Index para performance nas buscas por utilizador
CREATE INDEX idx_debt_plans_user_id ON public.debt_plans(user_id);

-- Ativar RLS
ALTER TABLE public.debt_plans ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Users can view their own debt plans" 
    ON public.debt_plans FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own debt plans" 
    ON public.debt_plans FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debt plans" 
    ON public.debt_plans FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debt plans" 
    ON public.debt_plans FOR DELETE 
    USING (auth.uid() = user_id);
