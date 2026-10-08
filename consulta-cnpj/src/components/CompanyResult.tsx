import { Calculator, CheckCircle2, CircleHelp, RotateCcw, XCircle } from "lucide-react";
import type { CompanyData } from "../types/cnpj";
import { formatCNPJ } from "../utils/cnpj";
import StatusBadge from "./StatusBadge";

const NA = "Não informado";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd className="mt-0.5 break-words text-sm">{children}</dd>
    </div>
  );
}

export default function CompanyResult({
  data,
  onReset,
  onCalculate,
}: {
  data: CompanyData;
  onReset: () => void;
  onCalculate: () => void;
}) {
  const { regime } = data;
  const Icon = regime.isSimples ? CheckCircle2 : regime.regime === "REGULAR" ? XCircle : CircleHelp;
  const iconColor = regime.isSimples ? "text-success" : regime.regime === "REGULAR" ? "text-danger" : "text-warn";

  const situacao = data.situacao?.toUpperCase() ?? null;
  const localidade = [data.municipio, data.uf].filter(Boolean).join(" / ");

  return (
    <section className="fade-in w-full" aria-live="polite">
      <div className="flex flex-col items-center text-center">
        <Icon size={40} className={iconColor} aria-hidden />
        <h1 className="mt-3 text-2xl font-bold leading-tight">{regime.label}</h1>
        {regime.isMEI && (
          <div className="mt-2">
            <StatusBadge tone="info">MEI</StatusBadge>
          </div>
        )}
      </div>

      <dl className="mt-6 space-y-3 border-t border-line pt-5 text-left">
        <Row label="CNPJ">{formatCNPJ(data.cnpj)}</Row>
        <Row label="Razão Social">{data.razaoSocial?.toUpperCase() ?? NA}</Row>
        <Row label="Nome Fantasia">{data.nomeFantasia?.toUpperCase() ?? NA}</Row>
        <Row label="Situação">
          {situacao ? (
            <StatusBadge tone={situacao === "ATIVA" ? "success" : "danger"}>{situacao}</StatusBadge>
          ) : (
            NA
          )}
        </Row>
        <Row label="Município / UF">{localidade || NA}</Row>
        <Row label="Regime tributário">
          {regime.label}
          {regime.isMEI ? " (MEI)" : ""}
        </Row>
      </dl>

      <button
        type="button"
        onClick={onCalculate}
        className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        <Calculator size={16} aria-hidden />
        Calcular créditos
      </button>

      <button
        type="button"
        onClick={onReset}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-line bg-white text-sm font-medium transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
      >
        <RotateCcw size={16} aria-hidden />
        Nova consulta
      </button>
    </section>
  );
}
