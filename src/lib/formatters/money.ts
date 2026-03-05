/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formata um número para o padrão Euro (ex: 1.234,56 €)
 */
export const formatEuro = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

/**
 * Converte uma string formatada em Euro para um número
 */
export const parseEuro = (input: string): number => {
  if (!input) return 0;
  
  // Remove o símbolo do Euro e espaços
  let cleanInput = input.replace(/[€\s]/g, '');
  
  // Se o padrão for pt-PT, o separador de milhar é '.' e o decimal é ','
  // Precisamos converter para o padrão que o parseFloat entende (milhar vazio, decimal '.')
  cleanInput = cleanInput.replace(/\./g, '').replace(',', '.');
  
  const parsed = parseFloat(cleanInput);
  return isNaN(parsed) ? 0 : parsed;
};
