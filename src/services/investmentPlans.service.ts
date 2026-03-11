import { InvestmentPlan, InvestmentContribution } from '@/models/investmentPlan.model';
import { CreateInvestmentPlanRequest, UpdateInvestmentPlanRequest } from '@/mappers/investmentPlans.dto';
import { investmentPlanMapper } from '@/mappers/investmentPlans.mapper';
import { supabase } from '@/core/supabase/client';

export const InvestmentPlansService = {
  async listInvestmentPlans(userId: string): Promise<InvestmentPlan[]> {
    const { data: plansData, error: plansError } = await supabase
      .from('investments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (plansError) throw new Error(plansError.message);
    if (!plansData || plansData.length === 0) return [];

    const planIds = plansData.map(p => p.id);

    const { data: contribData, error: contribError } = await supabase
      .from('investment_contributions')
      .select('investment_id, amount')
      .in('investment_id', planIds);

    if (contribError) throw new Error(contribError.message);

    return plansData.map(planRow => {
      const contributions = contribData?.filter(c => c.investment_id === planRow.id) || [];
      const totalContributions = contributions.reduce((sum, c) => sum + Number(c.amount), 0);

      const domainPlan = investmentPlanMapper.toDomain(planRow);
      domainPlan.valorAtual = domainPlan.valorInicial + totalContributions;
      return domainPlan;
    });
  },

  async getInvestmentPlanById(userId: string, id: string): Promise<InvestmentPlan> {
    const { data: planData, error: planError } = await supabase
      .from('investments')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (planError) throw new Error(planError.message);
    if (!planData) throw new Error('Plano de investimento não encontrado');

    const { data: contribData, error: contribError } = await supabase
      .from('investment_contributions')
      .select('amount')
      .eq('investment_id', id);

    if (contribError) throw new Error(contribError.message);

    const totalContributions = (contribData || []).reduce((sum, c) => sum + Number(c.amount), 0);
    const domainPlan = investmentPlanMapper.toDomain(planData);
    domainPlan.valorAtual = domainPlan.valorInicial + totalContributions;

    return domainPlan;
  },

  async createInvestmentPlan(userId: string, payload: CreateInvestmentPlanRequest): Promise<InvestmentPlan> {
    const icons = ['Globe', 'Landmark', 'Building2'];
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-orange-100 text-orange-600',
      'bg-purple-100 text-purple-600',
      'bg-emerald-100 text-emerald-600'
    ];

    // Pick random icon and color if not provided
    const payloadWithDefaults = {
      ...payload,
      icon: payload.icon || icons[Math.floor(Math.random() * icons.length)],
      color: payload.color || colors[Math.floor(Math.random() * colors.length)],
    };

    const { data, error } = await supabase
      .from('investments')
      .insert({
        user_id: userId,
        name: payloadWithDefaults.name,
        type: payloadWithDefaults.type,
        target_amount: payloadWithDefaults.target_amount || 0,
        initial_amount: payloadWithDefaults.initial_amount,
        institution: payloadWithDefaults.institution,
        status: payloadWithDefaults.status || 'Ativo',
        start_date: payloadWithDefaults.start_date || new Date().toISOString(),
        icon: payloadWithDefaults.icon,
        color: payloadWithDefaults.color,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return investmentPlanMapper.toDomain(data);
  },

  async updateInvestmentPlan(userId: string, id: string, updates: UpdateInvestmentPlanRequest): Promise<InvestmentPlan> {
    const { data, error } = await supabase
      .from('investments')
      .update({
        name: updates.name,
        type: updates.type,
        target_amount: updates.target_amount,
        institution: updates.institution,
        status: updates.status,
        start_date: updates.start_date,
        icon: updates.icon,
        color: updates.color,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new Error(error.message);

    // Fetch recalculated domain plan
    return this.getInvestmentPlanById(userId, id);
  },

  async addInvestmentContribution(userId: string, planId: string, amount: number, date?: string, note?: string): Promise<InvestmentPlan> {
    // Basic verification
    await this.getInvestmentPlanById(userId, planId);

    const { error } = await supabase
      .from('investment_contributions')
      .insert({
        investment_id: planId,
        amount: amount,
        occurred_at: date || new Date().toISOString(),
        notes: note,
      });

    if (error) throw new Error(error.message);

    // Fetch recalculated total amount
    return this.getInvestmentPlanById(userId, planId);
  },
};
