import { httpClient } from '@/core/api/httpClient';
import { DebtPlan } from '../models/debtPlan.model';
import { CreateDebtPlanRequest, DebtPlanDto, RegisterPaymentRequest } from '../mappers/debtPlans.dto';
import { debtPlanMapper } from '../mappers/debtPlans.mapper';

export const DebtPlansService = {
  async listDebtPlans(): Promise<DebtPlan[]> {
    const dtos = await httpClient.get<DebtPlanDto[]>('/debt-plans');
    return dtos.map(debtPlanMapper.toDomain);
  },

  async getDebtPlanById(id: string): Promise<DebtPlan> {
    const dto = await httpClient.get<DebtPlanDto>(`/debt-plans/${id}`);
    return debtPlanMapper.toDomain(dto);
  },

  async createDebtPlan(payload: CreateDebtPlanRequest): Promise<DebtPlan> {
    const dto = await httpClient.post<DebtPlanDto>('/debt-plans', payload);
    return debtPlanMapper.toDomain(dto);
  },

  async registerInstallmentPayment(id: string, quantity: number = 1): Promise<DebtPlan> {
    const payload: RegisterPaymentRequest = { quantity };
    const dto = await httpClient.post<DebtPlanDto>(`/debt-plans/${id}/payments`, payload);
    return debtPlanMapper.toDomain(dto);
  },
};
