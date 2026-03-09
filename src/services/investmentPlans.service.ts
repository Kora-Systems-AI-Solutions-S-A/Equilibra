import { InvestmentPlan } from '@/models/investmentPlan.model';
import { CreateInvestmentPlanRequest, UpdateInvestmentPlanRequest } from '@/mappers/investmentPlans.dto';
import { authService } from '@/services/auth.service';

// TEMP MOCK - remover quando integração com Supabase/API real estiver pronta
const mockInvestments: InvestmentPlan[] = [
  { id: '1', userId: '1', nome: 'ETF Global (IVVB11)', valorAtual: 15420.00, icone: 'Globe', cor: 'bg-blue-100 text-blue-600', tipo: 'ETF', dataInicio: '2023-01-10', status: 'Ativo' },
  { id: '2', userId: '1', nome: 'Reserva de Emergência', valorAtual: 8000.00, icone: 'Landmark', cor: 'bg-orange-100 text-orange-600', tipo: 'Poupança', dataInicio: '2022-05-15', status: 'Ativo' },
  { id: '3', userId: '1', nome: 'Fundos Imobiliários', valorAtual: 5120.50, icone: 'Building2', cor: 'bg-purple-100 text-purple-600', tipo: 'FII', dataInicio: '2023-03-20', status: 'Ativo' },
];

export const listInvestmentPlans = async (): Promise<InvestmentPlan[]> => {
  const userId = authService.getCurrentUserId();
  if (!userId) return [];
  return mockInvestments.filter(inv => inv.userId === userId);
};

export const getInvestmentPlanById = async (id: string): Promise<InvestmentPlan | undefined> => {
  const userId = authService.getCurrentUserId();
  return mockInvestments.find(inv => inv.id === id && inv.userId === userId);
};

export const createInvestmentPlan = async (payload: CreateInvestmentPlanRequest): Promise<InvestmentPlan> => {
  const userId = authService.getCurrentUserId();
  if (!userId) throw new Error('Utilizador não autenticado');

  const icons = ['Globe', 'Landmark', 'Building2'];
  const colors = [
    'bg-blue-100 text-blue-600',
    'bg-orange-100 text-orange-600',
    'bg-purple-100 text-purple-600',
    'bg-emerald-100 text-emerald-600'
  ];
  
  const newInvestment: InvestmentPlan = {
    id: Math.random().toString(36).substring(2, 9),
    userId,
    nome: payload.nome,
    valorAtual: payload.valor_atual,
    tipo: payload.tipo,
    dataInicio: payload.data_inicio,
    icone: icons[Math.floor(Math.random() * icons.length)],
    cor: colors[Math.floor(Math.random() * colors.length)],
    status: 'Ativo',
  };
  
  mockInvestments.push(newInvestment);
  return newInvestment;
};

export const updateInvestmentPlan = async (id: string, payload: UpdateInvestmentPlanRequest): Promise<InvestmentPlan> => {
  const userId = authService.getCurrentUserId();
  const index = mockInvestments.findIndex(inv => inv.id === id && inv.userId === userId);
  if (index === -1) throw new Error('Investment not found');
  
  const updated = { ...mockInvestments[index] };
  if (payload.nome !== undefined) updated.nome = payload.nome;
  if (payload.tipo !== undefined) updated.tipo = payload.tipo;
  if (payload.valor_atual !== undefined) updated.valorAtual = payload.valor_atual;
  if (payload.data_inicio !== undefined) updated.dataInicio = payload.data_inicio;
  
  mockInvestments[index] = updated;
  return updated;
};

export const addInvestmentContribution = async (id: string, amount: number): Promise<InvestmentPlan> => {
  const userId = authService.getCurrentUserId();
  const index = mockInvestments.findIndex(inv => inv.id === id && inv.userId === userId);
  if (index === -1) throw new Error('Investment not found');
  
  const updated = { ...mockInvestments[index], valorAtual: mockInvestments[index].valorAtual + amount };
  mockInvestments[index] = updated;
  return updated;
};
