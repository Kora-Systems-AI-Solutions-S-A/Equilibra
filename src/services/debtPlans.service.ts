import { DebtPlan, DebtPriority } from '@/models/debtPlan.model';
import { CreateDebtPlanRequest } from '@/mappers/debtPlans.dto';
import { authService } from '@/services/auth.service';

// TEMP MOCK - remover quando API real estiver pronta
let mockDebtPlans: DebtPlan[] = [
  {
    id: '1',
    userId: '1',
    nome: 'Financiamento Imobiliário',
    valorTotal: 450000,
    valorMensal: 2500,
    prioridade: DebtPriority.HIGH,
    dataInicio: '2023-01-01T00:00:00.000Z',
    parcelasTotal: 360,
    parcelasPagas: 14,
  },
  {
    id: '2',
    userId: '1',
    nome: 'Cartão de Crédito Platinum',
    valorTotal: 12500,
    valorMensal: 1200,
    prioridade: DebtPriority.HIGH,
    dataInicio: '2024-01-15T00:00:00.000Z',
    parcelasTotal: 12,
    parcelasPagas: 3,
  },
  {
    id: '3',
    userId: '1',
    nome: 'Empréstimo Pessoal',
    valorTotal: 25000,
    valorMensal: 850,
    prioridade: DebtPriority.MEDIUM,
    dataInicio: '2023-06-10T00:00:00.000Z',
    parcelasTotal: 48,
    parcelasPagas: 10,
  }
];

export const DebtPlansService = {
  async listDebtPlans(): Promise<DebtPlan[]> {
    const userId = authService.getCurrentUserId();
    if (!userId) return [];

    // Simula atraso de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    const filtered = mockDebtPlans.filter(p => p.userId === userId);
    return Promise.resolve([...filtered]);
  },

  async getDebtPlanById(id: string): Promise<DebtPlan> {
    const userId = authService.getCurrentUserId();
    const plan = mockDebtPlans.find(p => p.id === id && p.userId === userId);
    if (!plan) throw new Error('Plano não encontrado');
    return Promise.resolve({ ...plan });
  },

  async createDebtPlan(payload: CreateDebtPlanRequest): Promise<DebtPlan> {
    const userId = authService.getCurrentUserId();
    if (!userId) throw new Error('Utilizador não autenticado');

    const newPlan: DebtPlan = {
      id: Math.random().toString(36).substring(7),
      userId,
      nome: payload.nome,
      valorTotal: payload.valorTotal,
      valorMensal: payload.valorMensal,
      prioridade: payload.prioridade,
      dataInicio: payload.dataInicio,
      parcelasTotal: payload.parcelasTotal,
      parcelasPagas: 0,
    };
    mockDebtPlans = [newPlan, ...mockDebtPlans];
    return Promise.resolve(newPlan);
  },

  async registerInstallmentPayment(id: string, quantity: number = 1): Promise<DebtPlan> {
    const userId = authService.getCurrentUserId();
    const index = mockDebtPlans.findIndex(p => p.id === id && p.userId === userId);
    if (index === -1) throw new Error('Plano não encontrado');
    
    const plan = mockDebtPlans[index];
    const updatedPlan = {
      ...plan,
      parcelasPagas: Math.min(plan.parcelasTotal, plan.parcelasPagas + quantity)
    };
    
    mockDebtPlans[index] = updatedPlan;
    return Promise.resolve({ ...updatedPlan });
  },
};
