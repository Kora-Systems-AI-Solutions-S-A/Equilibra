import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ModalBase } from '@/shared/ui/ModalBase';
import { DrawerBase } from '@/shared/ui/DrawerBase';
import { useUIStore } from '@/store/ui.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/shared/ui/Button';
import { useMonthlyRecordsStore } from '@/store/monthlyRecords.store';
import { useDebtPlansStore } from '@/store/debtPlans.store';
import { calculateProgressPercent, calculateValorRestante } from '@/helpers/debtPlan.calculations';
import { DebtPriority } from '@/models/debtPlan.model';
import { MonthlyRecordType, MonthlyRecordStatus } from '@/models/monthlyRecord.model';
import { motion } from 'motion/react';
import { ModalExpandedCard } from '@/features/dashboard/components/ModalExpandedCard';
import { InvestmentContributionModal, CreateInvestmentModal } from '@/features/dashboard/investimentos';
import { AppFooter } from './AppFooter';
import { formatCurrency, cn } from '@/lib/utils';
import { MoneyInput } from '@/shared/ui/MoneyInput';

import { getCurrentMonthYear, addMonthsToMonthYear, getMonthsDifference, getMonthsBetween } from '@/lib/date';

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  value: z.number().min(0.01, 'Valor deve ser maior que zero'),
  category: z.string().optional(),
  origin: z.string().optional(),
  type: z.enum(['Receita', 'Despesa']),
  status: z.enum(['Pago', 'Pendente', 'Recebido', 'Cancelado']),
  observations: z.string().optional(),
});

const planSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  totalValue: z.number().min(1, 'Valor total é obrigatório'),
  monthlyPayment: z.number().min(1, 'Valor mensal é obrigatório'),
  priority: z.enum(['Alta', 'Média', 'Baixa']),
});

export const AppShell = () => {
  const {
    isRegisterModalOpen, closeRegisterModal,
    isAddPlanModalOpen, closeAddPlanModal,
    planDrawer, closePlanDrawer,
    sidebarCollapsed,
    registerModalContext
  } = useUIStore();

  const [isMobile, setIsMobile] = useState(false);
  const [simulation, setSimulation] = useState<{ installments: number; start: string; end: string } | null>(null);
  const [latePaymentData, setLatePaymentData] = useState<{ planId: string; months: string[] } | null>(null);
  const [lastLatePayment, setLastLatePayment] = useState<{ planId: string; months: string[] } | null>(null);
  const [selectedLateMonths, setSelectedLateMonths] = useState<string[]>([]);

  useEffect(() => {
    if (latePaymentData) {
      setLastLatePayment(latePaymentData);
    }
  }, [latePaymentData]);

  const activeLatePayment = latePaymentData || lastLatePayment;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const {
    items: records,
    selectedMonth,
    createMonthlyRecord,
    updateMonthlyRecord,
    selectedRecord,
    setSelectedRecord
  } = useMonthlyRecordsStore();
  const {
    createDebtPlan,
    updatePlan,
    registerInstallmentPayment,
    items: plans
  } = useDebtPlansStore();

  const [lastPlanId, setLastPlanId] = useState<string | null>(null);

  useEffect(() => {
    if (planDrawer.planId) {
      setLastPlanId(planDrawer.planId);
    }
  }, [planDrawer.planId]);

  const activePlanId = planDrawer.planId || lastPlanId;
  const selectedPlan = plans.find(p => p.id === activePlanId);

  const transactionForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'Despesa',
      status: 'Pendente',
      category: 'Habitação'
    }
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (isRegisterModalOpen && selectedRecord) {
      transactionForm.reset({
        description: selectedRecord.descricao,
        value: selectedRecord.valor,
        category: selectedRecord.categoria,
        origin: selectedRecord.origem,
        type: selectedRecord.tipo,
        status: selectedRecord.status,
        observations: selectedRecord.observacoes,
      });
    } else if (isRegisterModalOpen && !selectedRecord) {
      transactionForm.reset({
        type: 'Despesa',
        status: 'Pendente',
        category: 'Habitação',
        description: '',
        value: 0,
        origin: '',
        observations: ''
      });
    }
  }, [isRegisterModalOpen, selectedRecord, transactionForm]);

  const watchType = transactionForm.watch('type');

  useEffect(() => {
    // Limpar status/categoria quando o tipo muda
    if (watchType === 'Receita') {
      transactionForm.setValue('status', 'Recebido');
      transactionForm.setValue('category', undefined);
    } else {
      // Valor padrão para Despesa, apenas se não estivermos editando um registro existente
      // Se estivermos editando, preservamos o que veio do banco (já mapeado no reset acima)
      if (!selectedRecord) {
        transactionForm.setValue('status', 'Pendente');
        transactionForm.setValue('category', 'Habitação');
        transactionForm.setValue('origin', undefined);
      }
    }
  }, [watchType, transactionForm, selectedRecord]);

  const planForm = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      priority: 'Média'
    }
  });

  const onTransactionSubmit = async (data: z.infer<typeof transactionSchema>) => {
    try {
      if (selectedRecord) {
        await updateMonthlyRecord(selectedRecord.id, {
          type: data.type as MonthlyRecordType,
          description: data.description,
          origin: data.origin,
          category: data.category,
          amount: data.value,
          status: data.status as MonthlyRecordStatus,
          observations: data.observations,
        });
        closeRegisterModal();
        setSelectedRecord(undefined);
      } else {
        await createMonthlyRecord({
          type: data.type as MonthlyRecordType,
          description: data.description,
          origin: data.origin,
          category: data.category,
          amount: data.value,
          status: data.status as MonthlyRecordStatus,
          occurred_at: new Date().toISOString(),
          reference_month: selectedMonth,
          observations: data.observations,
        });

        // If coming from monthlySummary context, don't close, just reset
        if (registerModalContext === 'monthlySummary') {
          transactionForm.reset({
            type: data.type as MonthlyRecordType, // Keep the same type for convenience
            status: data.type === 'Receita' ? 'Recebido' : 'Pendente',
            category: data.type === 'Despesa' ? 'Habitação' : undefined,
            description: '',
            value: 0,
            origin: '',
            observations: ''
          });
        } else {
          closeRegisterModal();
        }
      }
    } catch (error) {
      console.error('Failed to save record:', error);
    }
  };

  const handleSimulate = () => {
    const values = planForm.getValues();
    if (values.totalValue > 0 && values.monthlyPayment > 0) {
      const installments = Math.ceil(values.totalValue / values.monthlyPayment);
      const start = getCurrentMonthYear();
      const end = addMonthsToMonthYear(start, installments - 1);
      setSimulation({ installments, start, end });
    }
  };

  const onPlanSubmit = async (data: z.infer<typeof planSchema>) => {
    const installments = Math.ceil(data.totalValue / data.monthlyPayment);
    const start = new Date().toISOString();

    try {
      await createDebtPlan({
        name: data.name,
        total_amount: data.totalValue,
        remaining_amount: data.totalValue,
        monthly_payment: data.monthlyPayment,
        interest_rate: 0,
        priority: data.priority as DebtPriority,
        start_date: start,
        total_installments: installments,
      });
      closeAddPlanModal();
      planForm.reset();
      setSimulation(null);
    } catch (error) {
      // Error is handled in store
    }
  };

  const handleRegisterPayment = async () => {
    if (!selectedPlan) return;
    const progress = calculateProgressPercent(selectedPlan);
    if (progress === 100) return;

    const currentMonthYear = getCurrentMonthYear();
    // For now, we still use the month/year logic for late payment detection in UI
    // but the actual registration goes to the API
    const startMonthYear = new Date(selectedPlan.dataInicio).toLocaleDateString('pt-PT', { month: '2-digit', year: 'numeric' });
    const monthsSinceStart = getMonthsDifference(startMonthYear, currentMonthYear);

    if (selectedPlan.parcelasPagas < monthsSinceStart) {
      const lateMonths = getMonthsBetween(startMonthYear, selectedPlan.parcelasPagas, monthsSinceStart);
      setLatePaymentData({ planId: selectedPlan.id, months: lateMonths });
      setSelectedLateMonths(lateMonths);
    } else {
      await registerInstallmentPayment(selectedPlan.id);
    }
  };

  const handleConfirmLatePayments = async () => {
    if (!latePaymentData) return;
    await registerInstallmentPayment(latePaymentData.planId, selectedLateMonths.length);
    setLatePaymentData(null);
    setSelectedLateMonths([]);
  };

  const handleReadjustPlan = async () => {
    if (!latePaymentData || !selectedPlan) return;

    const remainingValue = calculateValorRestante(selectedPlan);
    const monthlyPayment = selectedPlan.valorMensal;
    const newInstallmentsRemaining = Math.ceil(remainingValue / monthlyPayment);
    const currentMonthYear = getCurrentMonthYear();
    const newEnd = addMonthsToMonthYear(currentMonthYear, newInstallmentsRemaining - 1);

    // Convert newEnd back to ISO if needed, but for now we just update the plan
    // Note: the backend should ideally handle this readjustment logic
    await updatePlan(selectedPlan.id, {
      dataTermino: new Date().toISOString(), // This is just a placeholder
    });

    setLatePaymentData(null);
    setSelectedLateMonths([]);
  };

  return (
    <div className="flex h-screen w-full bg-background-light overflow-hidden">
      <Sidebar />
      <motion.div
        initial={false}
        animate={{ paddingLeft: isMobile ? 0 : (sidebarCollapsed ? 84 : 240) }}
        className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300"
      >
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col overflow-x-hidden">
          <Outlet />
          <AppFooter />
        </div>
      </motion.div>

      <ModalExpandedCard />

      <ModalBase isOpen={isRegisterModalOpen} onClose={() => { closeRegisterModal(); setSelectedRecord(undefined); }} title={selectedRecord ? "Editar Movimentação" : "Registrar Movimentação"}>
        <form onSubmit={transactionForm.handleSubmit(onTransactionSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Tipo</label>
            <select
              {...transactionForm.register('type')}
              className="rounded-lg p-2 outline-none transition-all"
              style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
            >
              <option value="Despesa">Despesa</option>
              <option value="Receita">Receita</option>
            </select>
          </div>

          {watchType === 'Receita' ? (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Origem</label>
                <input
                  {...transactionForm.register('origin')}
                  placeholder="Ex: Salário, Freelance..."
                  className="rounded-lg p-2 outline-none transition-all"
                  style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Descrição</label>
                <input
                  {...transactionForm.register('description')}
                  className="rounded-lg p-2 outline-none transition-all"
                  style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
                />
              </div>
              <MoneyInput
                label="Valor"
                value={transactionForm.watch('value') || 0}
                onChange={(val) => transactionForm.setValue('value', val)}
                error={transactionForm.formState.errors.value?.message}
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Situação</label>
                <select
                  {...transactionForm.register('status')}
                  className="rounded-lg p-2 outline-none transition-all"
                  style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
                >
                  <option value="Recebido">Recebido</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Descrição</label>
                <input
                  {...transactionForm.register('description')}
                  className="rounded-lg p-2 outline-none transition-all"
                  style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Categoria</label>
                <select
                  {...transactionForm.register('category')}
                  className="rounded-lg p-2 outline-none transition-all"
                  style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
                >
                  <option value="Habitação">Habitação</option>
                  <option value="Alimentação">Alimentação</option>
                  <option value="Lazer">Lazer</option>
                  <option value="Transporte">Transporte</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Educação">Educação</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <MoneyInput
                label="Valor"
                value={transactionForm.watch('value') || 0}
                onChange={(val) => transactionForm.setValue('value', val)}
                error={transactionForm.formState.errors.value?.message}
              />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Situação</label>
                <select
                  {...transactionForm.register('status')}
                  className="rounded-lg p-2 outline-none transition-all"
                  style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
                >
                  <option value="Pago">Pago</option>
                  <option value="Pendente">Pendente</option>
                </select>
              </div>
            </>
          )}
          <Button type="submit" className="mt-4">Salvar</Button>
        </form>
      </ModalBase>

      <ModalBase isOpen={isAddPlanModalOpen} onClose={() => { closeAddPlanModal(); setSimulation(null); }} title="Novo Planejamento">
        <form onSubmit={planForm.handleSubmit(onPlanSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Nome do Plano</label>
            <input
              {...planForm.register('name')}
              className="rounded-lg p-2 outline-none transition-all"
              style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
            />
          </div>
          <MoneyInput
            label="Valor Total"
            value={planForm.watch('totalValue') || 0}
            onChange={(val) => planForm.setValue('totalValue', val)}
            error={planForm.formState.errors.totalValue?.message}
          />
          <MoneyInput
            label="Valor Mensal a Pagar"
            value={planForm.watch('monthlyPayment') || 0}
            onChange={(val) => planForm.setValue('monthlyPayment', val)}
            error={planForm.formState.errors.monthlyPayment?.message}
          />
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Prioridade</label>
            <select
              {...planForm.register('priority')}
              className="rounded-lg p-2 outline-none transition-all"
              style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
            >
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>

          {simulation && (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col gap-2">
              <p className="text-[10px] font-bold uppercase text-slate-400">Resultado da Simulação</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500">Parcelas</span>
                  <span className="text-sm font-bold text-slate-900">{simulation.installments}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500">Início</span>
                  <span className="text-sm font-bold text-slate-900">{simulation.start}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500">Término</span>
                  <span className="text-sm font-bold text-slate-900">{simulation.end}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={handleSimulate}>Simular</Button>
            <Button type="submit" className="flex-1">Criar Plano</Button>
          </div>
        </form>
      </ModalBase>

      <ModalBase isOpen={!!latePaymentData} onClose={() => setLatePaymentData(null)} title="Pagamentos em Atraso" zIndex={120}>
        <div className="flex flex-col gap-6">
          <p className="text-sm text-slate-600">Existem parcelas anteriores em atraso. O que deseja fazer?</p>

          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-bold uppercase text-slate-400">Meses pendentes</p>
            <div className="max-h-[120px] overflow-y-auto flex flex-col gap-2 pr-2">
              {activeLatePayment?.months.map(month => (
                <label key={month} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedLateMonths.includes(month)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLateMonths([...selectedLateMonths, month]);
                      } else {
                        setSelectedLateMonths(selectedLateMonths.filter(m => m !== month));
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-slate-700">{month}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleConfirmLatePayments} disabled={selectedLateMonths.length === 0}>
              Marcar pagamentos em atraso
            </Button>
            <Button variant="outline" onClick={handleReadjustPlan}>
              Reajustar plano para novas datas
            </Button>
          </div>
        </div>
      </ModalBase>

      <DrawerBase isOpen={planDrawer.isOpen} onClose={closePlanDrawer} title="Detalhes do Plano">
        {selectedPlan && (() => {
          const progress = calculateProgressPercent(selectedPlan);
          const remaining = calculateValorRestante(selectedPlan);
          const startMonthYear = new Date(selectedPlan.dataInicio).toLocaleDateString('pt-PT', { month: '2-digit', year: 'numeric' });
          const endMonthYear = selectedPlan.dataTermino
            ? new Date(selectedPlan.dataTermino).toLocaleDateString('pt-PT', { month: '2-digit', year: 'numeric' })
            : '-';

          return (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                  <h4 className="text-2xl font-black" style={{ color: 'var(--modal-text)' }}>{selectedPlan.nome}</h4>
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    selectedPlan.prioridade === 'Alta' ? "bg-red-100 text-red-600" :
                      selectedPlan.prioridade === 'Média' ? "bg-orange-100 text-orange-600" :
                        "bg-blue-100 text-blue-600"
                  )}>
                    Prioridade {selectedPlan.prioridade}
                  </span>
                </div>
                <p style={{ color: 'var(--modal-muted)' }}>Progresso de quitação</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--modal-surface)' }}>
                  <div className="h-full" style={{ backgroundColor: 'var(--modal-accent)', width: `${progress}%` }} />
                </div>
                <span className="font-bold" style={{ color: 'var(--modal-text)' }}>{progress}%</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Total</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--modal-text)' }}>{formatCurrency(selectedPlan.valorTotal)}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Mensalidade</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--modal-text)' }}>{formatCurrency(selectedPlan.valorMensal)}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Restante</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--modal-danger)' }}>{formatCurrency(remaining)}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Parcelas</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--modal-text)' }}>{selectedPlan.parcelasPagas}/{selectedPlan.parcelasTotal}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Início</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--modal-text)' }}>{startMonthYear}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                  <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Término Previsto</p>
                  <p className="text-sm font-bold" style={{ color: 'var(--modal-text)' }}>{endMonthYear}</p>
                </div>
              </div>
              {progress === 100 ? (
                <div className="mt-auto p-4 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600 uppercase">Plano concluído</span>
                </div>
              ) : (
                <Button className="mt-auto" onClick={handleRegisterPayment}>Registrar pagamento</Button>
              )}
            </div>
          );
        })()}
      </DrawerBase>
      <InvestmentContributionModal />
      <CreateInvestmentModal />
    </div>
  );
};
