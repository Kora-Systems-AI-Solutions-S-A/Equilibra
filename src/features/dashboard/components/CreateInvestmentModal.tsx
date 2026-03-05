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
  initialValue: z.number().min(0.01, 'O valor deve ser maior que zero'),
  startDate: z.string().min(1, 'A data é obrigatória'),
});

type InvestmentFormValues = z.infer<typeof investmentSchema>;

export const CreateInvestmentModal = () => {
  const { isCreateInvestmentModalOpen, closeCreateInvestmentModal } = useUIStore();
  const { addInvestment } = useInvestmentsStore();

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
      initialValue: 0,
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = (data: InvestmentFormValues) => {
    addInvestment(data);
    alert('Investimento criado com sucesso!');
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
          value={watch('initialValue') || 0}
          onChange={(val) => setValue('initialValue', val)}
          error={errors.initialValue?.message}
        />

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase" style={{ color: 'var(--modal-muted)' }}>Data de Início</label>
          <input
            type="date"
            {...register('startDate')}
            className="w-full p-3 rounded-xl outline-none transition-colors"
            style={{ backgroundColor: 'var(--modal-surface)', color: 'var(--modal-text)', border: '1px solid var(--modal-border)' }}
          />
          {errors.startDate && <p className="text-[10px] text-red-500 font-bold">{errors.startDate.message}</p>}
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
