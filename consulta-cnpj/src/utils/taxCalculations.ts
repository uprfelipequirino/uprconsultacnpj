import type { SupplierRegime } from "./taxRules";

/**
 * Fator de crédito: no Simples Nacional o crédito é proporcional à alíquota
 * efetiva paga; nos demais casos (inclusive "Simples c/ opção pelo regime
 * regular") o crédito é integral.
 */
export function calculateCreditFactor(p: {
  supplierRegime: SupplierRegime;
  effectiveSimpleRate: number;
  cbsRate: number;
  ibsRate: number;
}): number {
  if (p.supplierRegime !== "SIMPLES_NACIONAL") return 1;

  const totalRate = p.cbsRate + p.ibsRate;
  if (totalRate <= 0) return 0;

  return p.effectiveSimpleRate / totalRate;
}

interface CreditParams {
  acquisitionValue: number;
  creditFactor: number;
  inputFactor: number;
}

export function calculateCBSCredit(p: CreditParams & { cbsRate: number }): number {
  const full = p.acquisitionValue * p.cbsRate;
  return full * p.creditFactor * p.inputFactor;
}

export function calculateIBSCredit(p: CreditParams & { ibsRate: number }): number {
  const full = p.acquisitionValue * p.ibsRate;
  return full * p.creditFactor * p.inputFactor;
}

/* ------------------------------ Formatação ------------------------------ */

export const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatPercent = (v: number) =>
  `${(v * 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
