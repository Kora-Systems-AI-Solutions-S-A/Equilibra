import { MonthlyRecord } from '@/models/monthlyRecord.model';
import { addMonthsToMonthYear, getMonthsDifference } from '@/lib/date';

// Filtra apenas registros ativos (Pago ou Pendente para despesas, Recebido ou Pendente para receitas)
const isActive = (record: MonthlyRecord) => record.status !== 'Cancelado';

// --- RECEITAS ---

export const getIncomeRecords = (records: MonthlyRecord[]) => 
  records.filter(r => r.tipo === 'Receita' && isActive(r));

export const getTotalReceivedInMonth = (records: MonthlyRecord[]) => 
  getIncomeRecords(records)
    .filter(r => r.status === 'Recebido')
    .reduce((acc, curr) => acc + curr.valor, 0);

export const getTotalPendingIncomeInMonth = (records: MonthlyRecord[]) => 
  getIncomeRecords(records)
    .filter(r => r.status === 'Pendente')
    .reduce((acc, curr) => acc + curr.valor, 0);

export const getTotalIncomeInMonth = (records: MonthlyRecord[]) => 
  getIncomeRecords(records).reduce((acc, curr) => acc + curr.valor, 0);

export const getIncomeMonthComparison = (currentTotal: number, previousTotal: number) => {
  if (previousTotal === 0) return 0;
  return ((currentTotal - previousTotal) / previousTotal) * 100;
};

export const getProjectedNextMonthIncome = (records: MonthlyRecord[]) => {
  // Simples projeção baseada no total do mês atual (considerando que receitas costumam ser recorrentes)
  return getTotalIncomeInMonth(records);
};

// --- DESPESAS ---

export const getExpenseRecords = (records: MonthlyRecord[]) => 
  records.filter(r => r.tipo === 'Despesa' && isActive(r));

export const getTotalPaidExpensesInMonth = (records: MonthlyRecord[]) => 
  getExpenseRecords(records)
    .filter(r => r.status === 'Pago')
    .reduce((acc, curr) => acc + curr.valor, 0);

export const getTotalPendingExpensesInMonth = (records: MonthlyRecord[]) => 
  getExpenseRecords(records)
    .filter(r => r.status === 'Pendente')
    .reduce((acc, curr) => acc + curr.valor, 0);

export const getTotalActiveExpensesInMonth = (records: MonthlyRecord[]) => 
  getExpenseRecords(records).reduce((acc, curr) => acc + curr.valor, 0);

// --- GRÁFICOS ---

export const getExpenseCategoryChartData = (records: MonthlyRecord[]) => {
  const expenses = getExpenseRecords(records);
  const categories: Record<string, number> = {};
  
  expenses.forEach(exp => {
    const cat = exp.categoria || 'Outros';
    categories[cat] = (categories[cat] || 0) + exp.valor;
  });

  return Object.entries(categories).map(([name, value]) => ({ name, value }));
};

export const getIncomeVsExpenseChartData = (records: MonthlyRecord[]) => {
  const income = getTotalIncomeInMonth(records);
  const expense = getTotalActiveExpensesInMonth(records);
  
  return [
    { name: 'Entradas', value: income },
    { name: 'Saídas', value: expense }
  ];
};

export const getCashFlowChartData = (records: MonthlyRecord[]) => {
  const totalIncome = getTotalIncomeInMonth(records);
  const totalExpense = getTotalActiveExpensesInMonth(records);
  const total = totalIncome + totalExpense;
  const saldo = totalIncome - totalExpense;
  
  const incomePercent = total > 0 ? (totalIncome / total) * 100 : 0;
  const expensePercent = total > 0 ? (totalExpense / total) * 100 : 0;

  return {
    totalIncome,
    totalExpense,
    total,
    saldo,
    incomePercent,
    expensePercent
  };
};

export const getIncomeExpenseTrendChartData = (allRecords: MonthlyRecord[], currentMonthRef: string) => {
  // Retorna os últimos 6 meses de tendência
  const months: string[] = [];
  const [currentMonth, currentYear] = currentMonthRef.split('/').map(Number);
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentYear, currentMonth - 1 - i, 1);
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    months.push(`${m}/${y}`);
  }

  return months.map(monthRef => {
    const monthRecords = allRecords.filter(r => r.mesReferencia === monthRef && isActive(r));
    const income = monthRecords
      .filter(r => r.tipo === 'Receita')
      .reduce((acc, curr) => acc + curr.valor, 0);
    const expense = monthRecords
      .filter(r => r.tipo === 'Despesa')
      .reduce((acc, curr) => acc + curr.valor, 0);

    // Get short month name for display
    const [m] = monthRef.split('/');
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const shortName = monthNames[parseInt(m) - 1];

    return {
      month: shortName,
      income,
      expense
    };
  });
};
