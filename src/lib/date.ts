export const getCurrentMonthYear = () => {
  const now = new Date();
  return `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
};

export const addMonthsToMonthYear = (monthYear: string, months: number) => {
  const [month, year] = monthYear.split('/').map(Number);
  const date = new Date(year, month - 1);
  date.setMonth(date.getMonth() + months);
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
};

export const getMonthsDifference = (startMonthYear: string, endMonthYear: string) => {
  const [startMonth, startYear] = startMonthYear.split('/').map(Number);
  const [endMonth, endYear] = endMonthYear.split('/').map(Number);
  return (endYear - startYear) * 12 + (endMonth - startMonth);
};

export const getMonthsBetween = (startMonthYear: string, installmentsPaid: number, totalNeeded: number) => {
  const months = [];
  for (let i = installmentsPaid; i < totalNeeded; i++) {
    months.push(addMonthsToMonthYear(startMonthYear, i));
  }
  return months;
};
