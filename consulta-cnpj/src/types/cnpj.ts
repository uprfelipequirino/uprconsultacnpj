export type RegimeCode = "SIMPLES_NACIONAL" | "REGULAR" | "INDISPONIVEL";

export interface TaxRegimeInfo {
  regime: RegimeCode;
  label: string;
  isSimples: boolean;
  isMEI: boolean;
}

export interface CompanyData {
  cnpj: string;
  razaoSocial: string | null;
  nomeFantasia: string | null;
  situacao: string | null;
  municipio: string | null;
  uf: string | null;
  regime: TaxRegimeInfo;
}

export type LookupErrorKind = "invalid" | "notfound" | "unavailable" | "generic";

export class LookupError extends Error {
  kind: LookupErrorKind;
  constructor(kind: LookupErrorKind) {
    super(kind);
    this.kind = kind;
  }
}

/** Resposta parcial da Brasil API: nenhum campo é garantido. */
export interface BrasilApiCnpj {
  cnpj?: string | null;
  razao_social?: string | null;
  nome_fantasia?: string | null;
  descricao_situacao_cadastral?: string | null;
  municipio?: string | null;
  uf?: string | null;
  opcao_pelo_simples?: boolean | null;
  opcao_pelo_mei?: boolean | null;
  data_exclusao_do_simples?: string | null;
}
