import {
  LookupError,
  type BrasilApiCnpj,
  type CompanyData,
} from "../types/cnpj";
import { isValidCNPJ, onlyDigits } from "../utils/cnpj";
import { getTaxRegime } from "../utils/taxRules";

const BASE_URL = "https://brasilapi.com.br/api/cnpj/v1";

const clean = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : null;

export async function fetchCNPJ(input: string): Promise<CompanyData> {
  const cnpj = onlyDigits(input);
  if (!isValidCNPJ(cnpj)) throw new LookupError("invalid");

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/${cnpj}`);
  } catch {
    throw new LookupError("unavailable");
  }

  if (res.status === 404) throw new LookupError("notfound");
  if (res.status === 400) throw new LookupError("generic");
  if (!res.ok) throw new LookupError("unavailable");

  let data: BrasilApiCnpj;
  try {
    data = await res.json();
  } catch {
    throw new LookupError("generic");
  }

  return {
    cnpj,
    razaoSocial: clean(data.razao_social),
    nomeFantasia: clean(data.nome_fantasia),
    situacao: clean(data.descricao_situacao_cadastral),
    municipio: clean(data.municipio),
    uf: clean(data.uf),
    regime: getTaxRegime(data),
  };
}
