export interface InvestmentPlanDto {
  id: string;
  user_id: string;
  name: string;
  type: string;
  target_amount: number;
  initial_amount: number;
  institution?: string | null;
  status: string;
  start_date: string;
  icon: string;
  color: string;
  created_at: string;
  updated_at?: string | null;
}

export interface InvestmentContributionDto {
  id: string;
  investment_id: string;
  amount: number;
  occurred_at: string;
  notes?: string | null;
  created_at: string;
}

export interface CreateInvestmentPlanRequest {
  name: string;
  type: string;
  target_amount?: number;
  initial_amount: number;
  institution?: string;
  status?: string;
  start_date?: string;
  icon?: string;
  color?: string;
}

export interface UpdateInvestmentPlanRequest {
  name?: string;
  type?: string;
  target_amount?: number;
  institution?: string;
  status?: string;
  start_date?: string;
  icon?: string;
  color?: string;
}

export interface CreateInvestmentContributionRequest {
  amount: number;
  occurred_at: string;
  notes?: string;
}
