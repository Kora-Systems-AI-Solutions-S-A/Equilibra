import { DebtPlan } from '@/models/debtPlan.model';
import { CreateDebtPlanRequest } from '@/mappers/debtPlans.dto';
import { debtPlanMapper } from '@/mappers/debtPlans.mapper';
import { supabase } from '@/core/supabase/client';

export const DebtPlansService = {
  async listDebtPlans(userId: string): Promise<DebtPlan[]> {
    const { data, error } = await supabase
      .from('debt_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map(debtPlanMapper.toDomain);
  },

  async getDebtPlanById(userId: string, id: string): Promise<DebtPlan> {
    const { data, error } = await supabase
      .from('debt_plans')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error('Plano não encontrado');

    return debtPlanMapper.toDomain(data);
  },

  async createDebtPlan(userId: string, payload: CreateDebtPlanRequest): Promise<DebtPlan> {
    const startDate = new Date(payload.start_date);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + payload.total_installments);

    const { data, error } = await supabase
      .from('debt_plans')
      .insert({
        user_id: userId,
        name: payload.name,
        total_amount: payload.total_amount,
        remaining_amount: payload.remaining_amount,
        monthly_payment: payload.monthly_payment,
        interest_rate: payload.interest_rate || 0,
        priority: payload.priority,
        start_date: payload.start_date,
        end_date: endDate.toISOString(),
        total_installments: payload.total_installments,
        paid_installments: 0,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return debtPlanMapper.toDomain(data);
  },

  async updateDebtPlan(userId: string, id: string, updates: Partial<DebtPlan>): Promise<DebtPlan> {
    // Note: This mapping is partial and might need more fields if the UI allows full editing
    const { data, error } = await supabase
      .from('debt_plans')
      .update({
        name: updates.nome,
        total_amount: updates.valorTotal,
        remaining_amount: updates.remainingAmount,
        monthly_payment: updates.valorMensal,
        interest_rate: updates.interestRate,
        priority: updates.prioridade,
        start_date: updates.dataInicio,
        total_installments: updates.parcelasTotal,
        paid_installments: updates.parcelasPagas,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return debtPlanMapper.toDomain(data);
  },

  async registerInstallmentPayment(userId: string, id: string, quantity: number = 1): Promise<DebtPlan> {
    const plan = await this.getDebtPlanById(userId, id);

    const newPaidInstallments = Math.min(plan.parcelasTotal, plan.parcelasPagas + quantity);
    const amountToDeduct = quantity * plan.valorMensal;
    const newRemainingAmount = Math.max(0, plan.remainingAmount - amountToDeduct);

    const { data, error } = await supabase
      .from('debt_plans')
      .update({
        paid_installments: newPaidInstallments,
        remaining_amount: newRemainingAmount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return debtPlanMapper.toDomain(data);
  },
};
