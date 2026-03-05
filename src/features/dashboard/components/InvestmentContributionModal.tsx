import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUIStore } from '@/store/ui.store';
import { useInvestmentsStore } from '@/store/investments.store';
import { ModalBase } from '@/components/ui/ModalBase';
import { Button } from '@/components/ui/Button';

const contributionSchema = z.object({
  amount: z.number().min(0.01, 'O valor deve ser maior que zero'),
  date: z.string().min(1, 'A data é obrigatória'),
  note: z.string().optional(),
});

type ContributionFormValues = z.infer<typeof contributionSchema>;

export const InvestmentContributionModal = () => {
  const { investmentContributionModal, closeInvestmentContributionModal } = useUIStore();
  const { investments, addContribution } = useInvestmentsStore();
  
  const selectedPlan = investments.find(inv => inv.id === investmentContributionModal.planId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      note: '',
    },
  });

  useEffect(() => {
    if (investmentContributionModal.isOpen) {
      reset({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        note: '',
      });
    }
  }, [investmentContributionModal.isOpen, reset]);

  const onSubmit = (data: ContributionFormValues) => {
    if (investmentContributionModal.planId) {
      addContribution(investmentContributionModal.planId, data.amount, data.date, data.note);
      alert('Reforço registrado com sucesso!');
      closeInvestmentContributionModal();
    }
  };

  return (
    <ModalBase
      isOpen={investmentContributionModal.isOpen}
      onClose={closeInvestmentContributionModal}
      title="Reforçar Investimento"
      maxWidth="max-w-md"
      zIndex={60}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Plano Selecionado</label>
          <div 
            className="p-3 rounded-xl border"
            style={{ backgroundColor: 'var(--modal-surface)', borderColor: 'var(--modal-border)' }}
          >
            <p className="text-sm font-bold" style={{ color: 'var(--modal-text)' }}>{selectedPlan?.name || 'Não selecionado'}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Valor do Reforço (€)</label>
          <input
            type="number"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            className="w-full p-3 rounded-xl outline-none transition-colors font-bold"
            style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
            placeholder="0,00"
          />
          {errors.amount && <p className="text-[10px] text-red-500 font-bold">{errors.amount.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Data</label>
          <input
            type="date"
            {...register('date')}
            className="w-full p-3 rounded-xl outline-none transition-colors"
            style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
          />
          {errors.date && <p className="text-[10px] text-red-500 font-bold">{errors.date.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Observação (Opcional)</label>
          <textarea
            {...register('note')}
            rows={3}
            className="w-full p-3 rounded-xl outline-none transition-colors resize-none"
            style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
            placeholder="Ex: Bônus salarial..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={closeInvestmentContributionModal}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Salvar reforço
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};
