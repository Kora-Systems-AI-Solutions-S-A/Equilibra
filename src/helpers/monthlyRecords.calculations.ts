import { MonthlyRecord } from '@/models/monthlyRecord.model';
import { addMonthsToMonthYear, getMonthsDifference, getCurrentMonthYear } from '@/lib/date';
import { DashboardFilters } from '@/store/ui.store';

// Filtra apenas registros ativos (Pago ou Pendente para despesas, Recebido ou Pendente para receitas)
const isActive = (record: MonthlyRecord) => record.status !== 'Cancelado';

export const filterRecordsByDashboardFilters = (
  allRecords: MonthlyRecord[], 
  filters: DashboardFilters,
  currentMonthRef: string = getCurrentMonthYear()
) => {
  const [currentMonth, currentYear] = currentMonthRef.split('/').map(Number);
  
  return allRecords.filter(record => {
    // 1. Filter by Status (Active only)
    if (!isActive(record)) return false;

    // 2. Filter by Type
    const typeMap = { 'income': 'Receita', 'expense': 'Despesa' };
    const mappedTypes = filters.types.map(type => typeMap[type as keyof typeof typeMap]);
    if (!mappedTypes.includes(record.tipo)) return false;

    // 3. Filter by Period
    const [recMonth, recYear] = record.mesReferencia.split('/').map(Number);
    const recDate = new Date(recYear, recMonth - 1, 1);
    const currentDate = new Date(currentYear, currentMonth - 1, 1);

    if (filters.period === 'Este Mês') {
      return record.mesReferencia === currentMonthRef;
    } else if (filters.period === 'Mês Passado') {
      const prevDate = new Date(currentYear, currentMonth - 2, 1);
      const prevMonth = (prevDate.getMonth() + 1).toString().padStart(2, '0');
      const prevYear = prevDate.getFullYear();
      return record.mesReferencia === `${prevMonth}/${prevYear}`;
    } else if (filters.period === 'Últimos 3 Meses') {
      const threeMonthsAgo = new Date(currentYear, currentMonth - 3, 1);
      return recDate >= threeMonthsAgo && recDate <= currentDate;
    }

    return true;
  });
};

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

export const generatePath = (data: any[], key: string, height: number, width: number, padding: number = 5) => {
  if (data.length === 0) return "";
  const allValues = data.flatMap(d => [d.income, d.expense]);
  const maxVal = Math.max(...allValues, 1);
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (d[key] / maxVal) * (height - padding * 2) - padding;
    return `${x},${y}`;
  });
  return `M${points.join(" L")}`;
};
