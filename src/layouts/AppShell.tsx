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
import { formatCurrency } from '@/lib/utils';

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  value: z.number().min(0.01, 'Valor deve ser maior que zero'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  type: z.enum(['income', 'expense']),
});

const planSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  totalValue: z.number().min(1, 'Valor total é obrigatório'),
});

export const AppShell = () => {
  const { 
    isRegisterModalOpen, closeRegisterModal,
    isAddPlanModalOpen, closeAddPlanModal,
    planDrawer, closePlanDrawer,
    sidebarCollapsed
  } = useUIStore();

  const addTransaction = useTransactionsStore(s => s.addTransaction);
  const addPlan = useDebtPlansStore(s => s.addPlan);
  const plans = useDebtPlansStore(s => s.plans);
  const selectedPlan = plans.find(p => p.id === planDrawer.planId);

  const transactionForm = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: { type: 'expense' }
  });

  const planForm = useForm<z.infer<typeof planSchema>>({
    resolver: zodResolver(planSchema),
  });

  const onTransactionSubmit = (data: z.infer<typeof transactionSchema>) => {
    addTransaction({
      ...data,
      date: new Date().toISOString().split('T')[0],
    });
    closeRegisterModal();
    transactionForm.reset();
  };

  const onPlanSubmit = (data: z.infer<typeof planSchema>) => {
    addPlan({
      ...data,
      paidPercentage: 0,
      remainingValue: data.totalValue,
    });
    closeAddPlanModal();
    planForm.reset();
  };

  return (
    <div className="flex h-screen w-full bg-background-light overflow-hidden">
      <Sidebar />
      <motion.div 
        animate={{ paddingLeft: sidebarCollapsed ? 84 : 240 }}
        className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300"
      >
        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
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

      <ModalBase isOpen={isAddPlanModalOpen} onClose={closeAddPlanModal} title="Novo Planejamento">
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
          <Button type="submit" className="mt-4">Criar Plano</Button>
        </form>
      </ModalBase>

      <DrawerBase isOpen={planDrawer.isOpen} onClose={closePlanDrawer} title="Detalhes do Plano">
        {selectedPlan && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h4 className="text-2xl font-black" style={{ color: 'var(--modal-text)' }}>{selectedPlan.name}</h4>
              <p style={{ color: 'var(--modal-muted)' }}>Progresso de pagamento</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--modal-surface)' }}>
                <div className="h-full" style={{ backgroundColor: 'var(--modal-accent)', width: `${selectedPlan.paidPercentage}%` }} />
              </div>
              <span className="font-bold" style={{ color: 'var(--modal-text)' }}>{selectedPlan.paidPercentage}%</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Total</p>
                <p className="text-lg font-bold" style={{ color: 'var(--modal-text)' }}>{formatCurrency(selectedPlan.totalValue)}</p>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'var(--modal-surface)' }}>
                <p className="text-[10px] font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Restante</p>
                <p className="text-lg font-bold" style={{ color: 'var(--modal-danger)' }}>{formatCurrency(selectedPlan.remainingValue)}</p>
              </div>
            </div>
            <Button className="mt-auto">Registrar Pagamento</Button>
          </div>
        )}
      </DrawerBase>
      <InvestmentContributionModal />
      <CreateInvestmentModal />
    </div>
  );
};
