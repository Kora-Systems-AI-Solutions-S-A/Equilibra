-- Setup Inicial da tabela Profiles atrelada à Auth nativa
-- Necessário rodar este script cru na query tool do painel do Supabase.

-- Tabelas Core
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users on delete cascade not null primary key,
  first_name text,
  full_name text,
  avatar_url text,
  base_currency text DEFAULT 'EUR'::text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Ativar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Politicas de Proteção
CREATE POLICY "Public profiles are viewable by owner." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- TRIGGER para Criação Automática via Supabase Auth
-- Assim que o Auth.signUp termina, disparamos a criação na Profiles via DB Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
