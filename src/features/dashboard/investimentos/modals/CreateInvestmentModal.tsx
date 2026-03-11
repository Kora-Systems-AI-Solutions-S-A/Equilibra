import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUIStore } from '@/store/ui.store';
import { useInvestmentsStore } from '@/store/investments.store';
import { ModalBase } from '@/shared/ui/ModalBase';
import { Button } from '@/shared/ui/Button';
import { MoneyInput } from '@/shared/ui/MoneyInput';

const investmentSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório'),
  type: z.string().min(1, 'O tipo é obrigatório'),
  initial_amount: z.number().min(0.01, 'O valor deve ser maior que zero'),
  start_date: z.string().min(1, 'A data é obrigatória'),
});

type InvestmentFormValues = z.infer<typeof investmentSchema>;

export const CreateInvestmentModal = () => {
  const { isCreateInvestmentModalOpen, closeCreateInvestmentModal } = useUIStore();
  const { createInvestmentPlan } = useInvestmentsStore();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      name: '',
      type: 'Ações',
      initial_amount: 0,
      start_date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: InvestmentFormValues) => {
    await createInvestmentPlan(data);
    closeCreateInvestmentModal();
    reset();
  };

  return (
    <ModalBase
      isOpen={isCreateInvestmentModalOpen}
      onClose={closeCreateInvestmentModal}
      title="Criar Novo Investimento"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Nome do Investimento</label>
          <input
            {...register('name')}
            className="w-full p-3 rounded-xl outline-none transition-colors font-bold"
            style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
            placeholder="Ex: Apple Inc."
          />
          {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Tipo</label>
          <select
            {...register('type')}
            className="w-full p-3 rounded-xl outline-none transition-colors"
            style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
          >
            <option value="Ações">Ações</option>
            <option value="ETF">ETF</option>
            <option value="Poupança">Poupança</option>
            <option value="Cripto">Cripto</option>
            <option value="FII">Fundos Imobiliários</option>
          </select>
          {errors.type && <p className="text-[10px] text-red-500 font-bold">{errors.type.message}</p>}
        </div>

        <MoneyInput
          label="Valor Inicial"
          value={watch('initial_amount') || 0}
          onChange={(val) => setValue('initial_amount', val)}
          error={errors.initial_amount?.message}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Data de Início</label>
          <input
            type="date"
            {...register('start_date')}
            className="w-full p-3 rounded-xl outline-none transition-colors"
            style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
          />
          {errors.start_date && <p className="text-[10px] text-red-500 font-bold">{errors.start_date.message}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={closeCreateInvestmentModal}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            Criar investimento
          </Button>
        </div>
      </form>
    </ModalBase>
  );
};
