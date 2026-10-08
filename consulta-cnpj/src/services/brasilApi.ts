import {
  LookupError,
  type BrasilApiCnpj,
  type CompanyData,
} from "../types/cnpj";
import { isValidCNPJ, onlyDigits } from "../utils/cnpj";
import { getTaxRegime } from "../utils/taxRules";

const BASE_URL = "https://brasilapi.com.br/api/cnpj/v1";
const FALLBACK_URL = "https://open.cnpja.com/office";
const REQUEST_TIMEOUT_MS = 8_000;

const clean = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : null;

interface CnpjaResponse {
  alias?: string | null;
  company?: {
    name?: string | null;
    simples?: { optant?: boolean | null } | null;
    simei?: { optant?: boolean | null } | null;
  } | null;
  status?: { text?: string | null } | null;
  address?: { city?: string | null; state?: string | null } | null;
}

function makeCompanyData(
  cnpj: string,
  razaoSocial: unknown,
  nomeFantasia: unknown,
  situacao: unknown,
  municipio: unknown,
  uf: unknown,
  simples: boolean | null | undefined,
  mei: boolean | null | undefined,
): CompanyData {
  return {
    cnpj,
    razaoSocial: clean(razaoSocial),
    nomeFantasia: clean(nomeFantasia),
    situacao: clean(situacao),
    municipio: clean(municipio),
    uf: clean(uf),
    regime: getTaxRegime({
      opcao_pelo_simples: simples,
      opcao_pelo_mei: mei,
    }),
  };
}

async function requestJson<T>(url: string): Promise<{ response: Response; data?: T }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return { response };
    return { response, data: await response.json() as T };
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchCNPJ(input: string): Promise<CompanyData> {
  const cnpj = onlyDigits(input);
  if (!isValidCNPJ(cnpj)) throw new LookupError("invalid");

  let allNotFound = true;
  const providers = [
    {
      url: `${BASE_URL}/${cnpj}`,
      parse: (data: BrasilApiCnpj) =>
        makeCompanyData(
          cnpj,
          data.razao_social,
          data.nome_fantasia,
          data.descricao_situacao_cadastral,
          data.municipio,
          data.uf,
          data.opcao_pelo_simples,
          data.opcao_pelo_mei,
        ),
    },
    {
      url: `${FALLBACK_URL}/${cnpj}`,
      parse: (data: CnpjaResponse) =>
        makeCompanyData(
          cnpj,
          data.company?.name,
          data.alias,
          data.status?.text,
          data.address?.city,
          data.address?.state,
          data.company?.simples?.optant,
          data.company?.simei?.optant,
        ),
    },
  ];

  for (const provider of providers) {
    try {
      const { response, data } = await requestJson<
        BrasilApiCnpj | CnpjaResponse
      >(provider.url);
      if (response.status === 404) continue;
      allNotFound = false;
      if (!response.ok || data === undefined) continue;
      return provider.parse(data);
    } catch {
      allNotFound = false;
    }
  }

  throw new LookupError(allNotFound ? "notfound" : "unavailable");
}
