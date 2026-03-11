import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUIStore } from '@/store/ui.store';
import { useInvestmentsStore } from '@/store/investments.store';
import { useNotificationStore } from '@/store/notification.store';
import { ModalBase } from '@/shared/ui/ModalBase';
import { Button } from '@/shared/ui/Button';
import { MoneyInput } from '@/shared/ui/MoneyInput';

const contributionSchema = z.object({
  amount: z.number().min(0.01, 'O valor deve ser maior que zero'),
  date: z.string().min(1, 'A data é obrigatória'),
  note: z.string().optional(),
});

type ContributionFormValues = z.infer<typeof contributionSchema>;

export const InvestmentContributionModal = () => {
  const { investmentContributionModal, closeInvestmentContributionModal } = useUIStore();
  const { investments, addContribution } = useInvestmentsStore();
  const { showNotification } = useNotificationStore();

  const [lastPlanId, setLastPlanId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (investmentContributionModal.planId) {
      setLastPlanId(investmentContributionModal.planId);
    }
  }, [investmentContributionModal.planId]);

  const activePlanId = investmentContributionModal.planId || lastPlanId;
  const selectedPlan = investments.find(inv => inv.id === activePlanId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
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

  const onSubmit = async (data: ContributionFormValues) => {
    if (investmentContributionModal.planId) {
      await addContribution(investmentContributionModal.planId, data.amount, data.date, data.note);
      showNotification('Reforço registrado com sucesso!', 'success');
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
            <p className="text-sm font-bold" style={{ color: 'var(--modal-text)' }}>{selectedPlan?.nome || 'Não selecionado'}</p>
          </div>
        </div>

        <MoneyInput
          label="Valor do Reforço"
          value={watch('amount') || 0}
          onChange={(val) => setValue('amount', val)}
          error={errors.amount?.message}
        />

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
