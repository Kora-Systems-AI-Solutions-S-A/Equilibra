import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ModalBase } from '@/components/ui/ModalBase';
import { DrawerBase } from '@/components/ui/DrawerBase';
import { useUIStore } from '@/store/ui.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { useTransactionsStore } from '@/store/transactions.store';
import { useDebtPlansStore } from '@/store/debtPlans.store';
import { motion } from 'motion/react';
import { ModalExpandedCard } from '@/features/dashboard/components/ModalExpandedCard';
import { InvestmentContributionModal } from '@/features/dashboard/components/InvestmentContributionModal';
import { CreateInvestmentModal } from '@/features/dashboard/components/CreateInvestmentModal';
import { AppFooter } from './AppFooter';
import { formatCurrency, cn } from '@/lib/utils';

import { getCurrentMonthYear, addMonthsToMonthYear, getMonthsDifference, getMonthsBetween } from '@/lib/date';

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  value: z.number().min(0.01, 'Valor deve ser maior que zero'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  type: z.enum(['income', 'expense']),
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
    sidebarCollapsed
  } = useUIStore();

  const [isMobile, setIsMobile] = useState(false);
  const [simulation, setSimulation] = useState<{ installments: number; start: string; end: string } | null>(null);
  const [latePaymentData, setLatePaymentData] = useState<{ planId: string; months: string[] } | null>(null);
  const [selectedLateMonths, setSelectedLateMonths] = useState<string[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const addTransaction = useTransactionsStore(s => s.addTransaction);
  const addPlan = useDebtPlansStore(s => s.addPlan);
  const updatePlan = useDebtPlansStore(s => s.updatePlan);
  const registerPayment = useDebtPlansStore(s => s.registerPayment);
  const plans = useDebtPlansStore(s => s.plans);
  const selectedPlan = plans.find(p => p.id === planDrawer.planId);

  const transactionForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'expense' }
  });

  const planForm = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      priority: 'Média'
    }
  });

  const onTransactionSubmit = (data: z.infer<typeof transactionSchema>) => {
    addTransaction({
      ...data,
      date: new Date().toISOString().split('T')[0],
    });
    closeRegisterModal();
    transactionForm.reset();
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

  const onPlanSubmit = (data: z.infer<typeof planSchema>) => {
    const installments = Math.ceil(data.totalValue / data.monthlyPayment);
    const start = getCurrentMonthYear();
    const end = addMonthsToMonthYear(start, installments - 1);

    addPlan({
      ...data,
      startMonthYear: start,
      predictedEndMonthYear: end,
      installmentsTotal: installments,
      installmentsPaid: 0,
      remainingValue: data.totalValue,
      progressPercent: 0,
      priority: data.priority,
    });
    closeAddPlanModal();
    planForm.reset();
    setSimulation(null);
  };

  const handleRegisterPayment = () => {
    if (!selectedPlan) return;
    if (selectedPlan.progressPercent === 100) return;

    const currentMonthYear = getCurrentMonthYear();
    const monthsSinceStart = getMonthsDifference(selectedPlan.startMonthYear, currentMonthYear);
    
    // If installmentsPaid is less than monthsSinceStart, it means there are months between 
    // the start and now that haven't been paid.
    if (selectedPlan.installmentsPaid < monthsSinceStart) {
      const lateMonths = getMonthsBetween(selectedPlan.startMonthYear, selectedPlan.installmentsPaid, monthsSinceStart);
      setLatePaymentData({ planId: selectedPlan.id, months: lateMonths });
      setSelectedLateMonths(lateMonths);
    } else {
      registerPayment(selectedPlan.id);
    }
  };

  const handleConfirmLatePayments = () => {
    if (!latePaymentData) return;
    registerPayment(latePaymentData.planId, selectedLateMonths.length);
    setLatePaymentData(null);
    setSelectedLateMonths([]);
  };

  const handleReadjustPlan = () => {
    if (!latePaymentData || !selectedPlan) return;
    
    const remainingValue = selectedPlan.remainingValue;
    const monthlyPayment = selectedPlan.monthlyPayment;
    const newInstallmentsRemaining = Math.ceil(remainingValue / monthlyPayment);
    const currentMonthYear = getCurrentMonthYear();
    const newEnd = addMonthsToMonthYear(currentMonthYear, newInstallmentsRemaining - 1);
    
    const newInstallmentsTotal = selectedPlan.installmentsPaid + newInstallmentsRemaining;
    const newPercent = (selectedPlan.installmentsPaid / newInstallmentsTotal) * 100;

    updatePlan(selectedPlan.id, {
      predictedEndMonthYear: newEnd,
      installmentsTotal: newInstallmentsTotal,
      progressPercent: Number(newPercent.toFixed(1)),
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

      <ModalBase isOpen={isRegisterModalOpen} onClose={closeRegisterModal} title="Registrar Movimentação">
        <form onSubmit={transactionForm.handleSubmit(onTransactionSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Descrição</label>
            <input 
              {...transactionForm.register('description')} 
              className="rounded-lg p-2 outline-none transition-all" 
              style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Valor</label>
            <input 
              type="number" 
              step="0.01" 
              {...transactionForm.register('value', { valueAsNumber: true })} 
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
              <option value="Renda">Renda</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Tipo</label>
            <select 
              {...transactionForm.register('type')} 
              className="rounded-lg p-2 outline-none transition-all"
              style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
          </div>
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
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Valor Total</label>
            <input 
              type="number" 
              {...planForm.register('totalValue', { valueAsNumber: true })} 
              className="rounded-lg p-2 outline-none transition-all" 
              style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Valor Mensal a Pagar</label>
            <input 
              type="number" 
              {...planForm.register('monthlyPayment', { valueAsNumber: true })} 
              className="rounded-lg p-2 outline-none transition-all" 
              style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
            />
          </div>
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
              {latePaymentData?.months.map(month => (
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
        {selectedPlan && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-start">
                <h4 className="text-2xl font-black" style={{ color: 'var(--modal-text)' }}>{selectedPlan.name}</h4>
                <span className={cn(
                  "px-2 py-1 rounded text-[10px] font-bold uppercase",
                  selectedPlan.priority === 'Alta' ? "bg-red-100 text-red-600" :
                  selectedPlan.priority === 'Média' ? "bg-orange-100 text-orange-600" :
                  "bg-blue-100 text-blue-600"
                )}>
                  Prioridade {selectedPlan.priority}
                </span>
              </div>
              <p style={{ color: 'var(--modal-muted)' }}>Progresso de quitação</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--modal-surface)' }}>
                <div className="h-full" style={{ backgroundColor: 'var(--modal-accent)', width: `${selectedPlan.progressPercent}%` }} />
              </div>
              <span className="font-bold" style={{ color: 'var(--modal-text)' }}>{selectedPlan.progressPercent}%</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Total</p>
                <p className="text-lg font-bold" style={{ color: 'var(--modal-text)' }}>{formatCurrency(selectedPlan.totalValue)}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Mensalidade</p>
                <p className="text-lg font-bold" style={{ color: 'var(--modal-text)' }}>{formatCurrency(selectedPlan.monthlyPayment)}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Restante</p>
                <p className="text-lg font-bold" style={{ color: 'var(--modal-danger)' }}>{formatCurrency(selectedPlan.remainingValue)}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Parcelas</p>
                <p className="text-lg font-bold" style={{ color: 'var(--modal-text)' }}>{selectedPlan.installmentsPaid}/{selectedPlan.installmentsTotal}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Início</p>
                <p className="text-sm font-bold" style={{ color: 'var(--modal-text)' }}>{selectedPlan.startMonthYear}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Término Previsto</p>
                <p className="text-sm font-bold" style={{ color: 'var(--modal-text)' }}>{selectedPlan.predictedEndMonthYear}</p>
              </div>
            </div>
            {selectedPlan.progressPercent === 100 ? (
              <div className="mt-auto p-4 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center">
                <span className="text-sm font-bold text-green-600 uppercase">Plano concluído</span>
              </div>
            ) : (
              <Button className="mt-auto" onClick={handleRegisterPayment}>Registrar Pagamento</Button>
            )}
          </div>
        )}
      </DrawerBase>
      <InvestmentContributionModal />
      <CreateInvestmentModal />
    </div>
  );
};
