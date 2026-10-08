import { useEffect, useRef, useState } from "react";
import { FileSearch } from "lucide-react";
import usinaLogo from "./assets/usina-logo.png";
import CNPJInput from "./components/CNPJInput";
import SearchButton from "./components/SearchButton";
import CompanyResult from "./components/CompanyResult";
import CreditCalculator from "./components/CreditCalculator";
import { fetchCNPJ } from "./services/brasilApi";
import { LookupError, type CompanyData, type LookupErrorKind } from "./types/cnpj";
import { isValidCNPJ } from "./utils/cnpj";

const MESSAGES: Record<LookupErrorKind, string> = {
  invalid: "Informe um CNPJ válido.",
  notfound: "CNPJ não encontrado.",
  unavailable:
    "O serviço de consulta está temporariamente indisponível. Tente novamente em alguns instantes.",
  generic: "Não foi possível realizar a consulta. Tente novamente.",
};

export default function App() {
  const [cnpj, setCnpj] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LookupErrorKind | null>(null);
  const [result, setResult] = useState<CompanyData | null>(null);
  const [calculating, setCalculating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!result) inputRef.current?.focus();
  }, [result]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!isValidCNPJ(cnpj)) {
      setError("invalid");
      inputRef.current?.focus();
      return;
    }

    setError(null);
    setLoading(true);
    try {
      setResult(await fetchCNPJ(cnpj));
    } catch (err) {
      setError(err instanceof LookupError ? err.kind : "generic");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setCalculating(false);
    setCnpj("");
    setError(null);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-6 sm:px-6">
      <a
        href="https://www.grupoolivaltenorio.com.br/"
        className="fixed left-4 top-4 z-50"
      >
        <img
          src={usinaLogo}
          alt="Usina Porto Rico"
          className="h-auto w-36 sm:w-44"
        />
      </a>
      <span className="fixed right-4 top-4 z-50 max-w-[40vw] text-right text-sm font-medium leading-tight">
        Tecnologia da Informação
      </span>
      <div className={`w-full ${result && calculating ? "max-w-5xl" : "max-w-[420px]"}`}>
        {result && calculating ? (
          <CreditCalculator
            initialRegime={result.regime.regime}
            onBack={() => setCalculating(false)}
            onNewQuery={reset}
          />
        ) : result ? (
          <CompanyResult data={result} onReset={reset} onCalculate={() => setCalculating(true)} />
        ) : (
          <form onSubmit={handleSubmit} noValidate className="fade-in flex flex-col items-center">
            <FileSearch size={32} strokeWidth={1.75} aria-hidden />
            <h1 className="mt-3 text-2xl font-bold">Consulta de CNPJ</h1>
            <p className="mt-1 text-center text-sm text-muted">
              Consulte o enquadramento no Simples Nacional.
            </p>

            <div className="mt-8 w-full space-y-4">
              <CNPJInput
                ref={inputRef}
                value={cnpj}
                onChange={(v) => {
                  setCnpj(v);
                  if (error) setError(null);
                }}
                error={error ? MESSAGES[error] : null}
                errorIcon={error === "notfound" ? "notfound" : "alert"}
                disabled={loading}
              />
              <SearchButton loading={loading} />
              <p className="sr-only" role="status" aria-live="polite">
                {loading ? "Consultando CNPJ..." : ""}
              </p>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
