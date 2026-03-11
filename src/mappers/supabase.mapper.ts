/**
 * Arquivo central de mapeamento (Data Mapper Pattern)
 * Serve como um "escudo mecânico" separando a infraestrutura de dados (Supabase)
 * do domínio e modelos locais da aplicação de Frontend.
 * 
 * Este arquivo será responsável por receber dados do banco (ex: formato snake_case `valor_total`)
 * e devolver Interfaces puras da nossa Store local (ex: formato camelCase `valorTotal`)
 */

// Utility function to handle dates from postgres
export const mapDateToIso = (dbDate: string | null | undefined): string => {
    if (!dbDate) return new Date().toISOString();
    return new Date(dbDate).toISOString();
};
