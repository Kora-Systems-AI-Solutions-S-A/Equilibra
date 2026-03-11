import { Database } from './src/core/supabase/database.types';

type T1 = Database['public']['Tables']['monthly_records'];
type T2 = keyof Database['public']['Tables'];

const x: T2 = 'monthly_records'; // should compile if it's a key
const y: T1['Insert'] = {
    user_id: '123',
    type: 'Receita',
    description: 'test',
    occurred_at: 'now',
    reference_month: '10/2023',
    amount: 10,
    status: 'Pendente'
};
