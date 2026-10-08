import type { BrasilApiCnpj, TaxRegimeInfo } from "../types/cnpj";

/** Identifica o regime tributário a partir da resposta (defensivo). */
export function getTaxRegime(data: BrasilApiCnpj | null | undefined): TaxRegimeInfo {
  const simples = data?.opcao_pelo_simples;
  const mei = data?.opcao_pelo_mei;

  const isMEI = mei === true;
  const isSimples = simples === true || isMEI;

  if (isSimples) {
    return { regime: "SIMPLES_NACIONAL", label: "Simples Nacional", isSimples: true, isMEI };
  }

  if (simples === false || mei === false) {
    return {
      regime: "REGULAR",
      label: "Não enquadrado no Simples Nacional",
      isSimples: false,
      isMEI: false,
    };
  }

  return {
    regime: "INDISPONIVEL",
    label: "Informação não disponível",
    isSimples: false,
    isMEI: false,
  };
}

/* ------------------------- Parâmetros da planilha ------------------------- */

export const TAX_PARAMETERS = {
  referenceRate: 0.265,
  cbsFull: 0.265 / 3,
  ibsFull: 0.265 * (2 / 3),
};

export interface TaxRates {
  cbsRate: number;
  ibsRate: number;
  /** Percentual vigente de ICMS/ISS (1 = 100%). */
  currentTaxFactor: number;
}

/** Tabela de transição da Reforma Tributária. */
export function getTaxRates(year: number): TaxRates {
  const { cbsFull, ibsFull } = TAX_PARAMETERS;

  if (year < 2026) return { cbsRate: 0, ibsRate: 0, currentTaxFactor: 1 };

  switch (year) {
    case 2026:
      return { cbsRate: 0.009, ibsRate: 0.001, currentTaxFactor: 1 };
    case 2027:
    case 2028:
      return { cbsRate: cbsFull, ibsRate: 0, currentTaxFactor: 1 };
    case 2029:
      return { cbsRate: cbsFull, ibsRate: ibsFull * (1 / 3), currentTaxFactor: 0.9 };
    case 2030:
      return { cbsRate: cbsFull, ibsRate: ibsFull * (2 / 3), currentTaxFactor: 0.8 };
    case 2031:
      return { cbsRate: cbsFull, ibsRate: ibsFull * (3 / 4), currentTaxFactor: 0.7 };
    case 2032:
      return { cbsRate: cbsFull, ibsRate: ibsFull * (4 / 5), currentTaxFactor: 0.6 };
    default:
      return { cbsRate: cbsFull, ibsRate: ibsFull, currentTaxFactor: 0 };
  }
}

/* --------------------------- Tipos de entrada --------------------------- */

export const INPUT_CREDIT_FACTORS = {
  INSUMO: 1,
  ATIVO_IMOBILIZADO: 1,
  SEM_CREDITO: 0,
} as const;

export type InputType = keyof typeof INPUT_CREDIT_FACTORS;

/* ---------------------------- Regras por produto ---------------------------- */

export const PRODUCT_RULES = {
  acucar: { factor: 0, treatment: "Cesta Básica Nacional", result: "Alíquota zero na saída." },
  etanol: { factor: 1, treatment: "Regime específico monofásico" },
  cana: { factor: 0.4, treatment: "Redução de 60% das alíquotas" },
  levedura: { factor: 1, treatment: "Regra padrão" },
  energia: { factor: 1, treatment: "Regra padrão" },
} as const;

export type ProductKey = keyof typeof PRODUCT_RULES;

/** Regimes do fornecedor considerados nos cálculos de crédito. */
export type SupplierRegime =
  | "SIMPLES_NACIONAL"
  | "SIMPLES_REGIME_REGULAR"
  | "REGULAR"
  | "INDISPONIVEL";
