-- Migration: Investments and Contributions
-- Description: Creates tables for investments and their respective contributions (history).

-- Create investments table
CREATE TABLE IF NOT EXISTS public.investments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    target_amount NUMERIC DEFAULT 0,
    initial_amount NUMERIC NOT NULL DEFAULT 0,
    institution TEXT,
    status TEXT NOT NULL DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Pausado', 'Concluido')),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    icon TEXT NOT NULL DEFAULT 'Globe',
    color TEXT NOT NULL DEFAULT 'bg-blue-100 text-blue-600',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Register for Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.investments;

-- Enable RLS
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Policies for investments
CREATE POLICY "Users can view their own investments"
    ON public.investments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own investments"
    ON public.investments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investments"
    ON public.investments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investments"
    ON public.investments FOR DELETE
    USING (auth.uid() = user_id);

-- Create investment_contributions table
CREATE TABLE IF NOT EXISTS public.investment_contributions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    investment_id UUID NOT NULL REFERENCES public.investments(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    occurred_at DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Register for Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.investment_contributions;

-- Enable RLS
ALTER TABLE public.investment_contributions ENABLE ROW LEVEL SECURITY;

-- Policies for investment_contributions
-- Note: Contributions check user_id through the investment relationship
CREATE POLICY "Users can view contributions of their own investments"
    ON public.investment_contributions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.investments
            WHERE public.investments.id = public.investment_contributions.investment_id
            AND public.investments.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert contributions to their own investments"
    ON public.investment_contributions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.investments
            WHERE public.investments.id = public.investment_contributions.investment_id
            AND public.investments.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update contributions of their own investments"
    ON public.investment_contributions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.investments
            WHERE public.investments.id = public.investment_contributions.investment_id
            AND public.investments.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete contributions of their own investments"
    ON public.investment_contributions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.investments
            WHERE public.investments.id = public.investment_contributions.investment_id
            AND public.investments.user_id = auth.uid()
        )
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_investments_user_id ON public.investments(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_contributions_investment_id ON public.investment_contributions(investment_id);
CREATE INDEX IF NOT EXISTS idx_investment_contributions_occurred_at ON public.investment_contributions(occurred_at);
