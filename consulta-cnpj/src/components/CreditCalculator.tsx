import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import type { RegimeCode } from "../types/cnpj";
import {
  calculateCBSCredit,
  calculateCreditFactor,
  calculateIBSCredit,
  formatCurrency,
  formatPercent,
} from "../utils/taxCalculations";
import {
  getTaxRates,
  INPUT_CREDIT_FACTORS,
  PRODUCT_RULES,
  type InputType,
  type ProductKey,
  type SupplierRegime,
} from "../utils/taxRules";

const YEARS = [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033];

const REGIMES: { value: SupplierRegime; label: string }[] = [
  { value: "SIMPLES_NACIONAL", label: "Simples Nacional" },
  { value: "SIMPLES_REGIME_REGULAR", label: "Simples c/ opção pelo regime regular" },
  { value: "REGULAR", label: "Regime regular" },
];

const INPUTS: { value: InputType; label: string }[] = [
  { value: "INSUMO", label: "Insumo/despesa com crédito" },
  { value: "ATIVO_IMOBILIZADO", label: "Ativo imobilizado" },
  { value: "SEM_CREDITO", label: "Sem direito a crédito" },
];

const PRODUCTS: { value: ProductKey; label: string }[] = [
  { value: "acucar", label: "Açúcar cristal" },
  { value: "etanol", label: "Etanol combustível" },
  { value: "cana", label: "Cana-de-açúcar" },
  { value: "levedura", label: "Levedura e derivados" },
  { value: "energia", label: "Energia elétrica excedente" },
];

const parseNum = (s: string) => parseFloat(s.replace(/\./g, "").replace(",", ".")) || 0;

const field =
  "h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1";

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function Line({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className={strong ? "font-bold" : "font-medium"}>{value}</dd>
    </div>
  );
}

export default function CreditCalculator({
  initialRegime,
  onBack,
  onNewQuery,
}: {
  initialRegime: RegimeCode;
  onBack: () => void;
  onNewQuery: () => void;
}) {
  const [year, setYear] = useState(2026);
  const [regime, setRegime] = useState<SupplierRegime>(
    initialRegime === "SIMPLES_NACIONAL" ? "SIMPLES_NACIONAL" : "REGULAR"
  );
  const [simpleRate, setSimpleRate] = useState("");
  const [inputType, setInputType] = useState<InputType>("INSUMO");
  const [product, setProduct] = useState<ProductKey>("levedura");
  const [value, setValue] = useState("");

  const { cbsRate, ibsRate, currentTaxFactor } = getTaxRates(year);
  const rule = PRODUCT_RULES[product];

  const creditFactor = calculateCreditFactor({
    supplierRegime: regime,
    effectiveSimpleRate: parseNum(simpleRate) / 100,
    cbsRate,
    ibsRate,
  });
  const inputFactor = INPUT_CREDIT_FACTORS[inputType] * rule.factor;
  const acquisitionValue = parseNum(value);

  const cbs = calculateCBSCredit({ acquisitionValue, cbsRate, creditFactor, inputFactor });
  const ibs = calculateIBSCredit({ acquisitionValue, ibsRate, creditFactor, inputFactor });

  return (
    <section className="fade-in w-full">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        <ArrowLeft size={16} aria-hidden />
        Voltar
      </button>

      <h1 className="text-2xl font-bold">Crédito IBS/CBS</h1>
      <p className="mt-1 text-sm text-muted">Calcule o crédito da aquisição conforme o regime do fornecedor.</p>

      <div className="mt-5 grid items-start gap-6 lg:grid-cols-2">
        <div className="min-w-0">
          <div className="grid grid-cols-2 gap-3">
            <Field id="year" label="Ano">
              <select id="year" className={field} value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </Field>
            <Field id="value" label="Valor da aquisição">
              <input
                id="value"
                className={field}
                inputMode="decimal"
                placeholder="R$ 0,00"
                value={value}
                onChange={(e) => setValue(e.target.value.replace(/[^\d.,]/g, ""))}
              />
            </Field>
          </div>

          <div className="mt-3 space-y-3">
            <Field id="regime" label="Regime do fornecedor">
              <select id="regime" className={field} value={regime} onChange={(e) => setRegime(e.target.value as SupplierRegime)}>
                {REGIMES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </Field>

            {regime === "SIMPLES_NACIONAL" && (
              <Field id="rate" label="Alíquota efetiva do Simples (%)">
                <input
                  id="rate"
                  className={field}
                  inputMode="decimal"
                  placeholder="0,00"
                  value={simpleRate}
                  onChange={(e) => setSimpleRate(e.target.value.replace(/[^\d.,]/g, ""))}
                />
              </Field>
            )}

            <Field id="input" label="Tipo de entrada">
              <select id="input" className={field} value={inputType} onChange={(e) => setInputType(e.target.value as InputType)}>
                {INPUTS.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </Field>

            <Field id="product" label="Produto">
              <select id="product" className={field} value={product} onChange={(e) => setProduct(e.target.value as ProductKey)}>
                {PRODUCTS.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <div className="min-w-0">
          <dl aria-live="polite" className="space-y-2 border-t border-line pt-4">
            <Line label="Alíquota CBS" value={formatPercent(cbsRate)} />
            <Line label="Alíquota IBS" value={formatPercent(ibsRate)} />
            <Line label="ICMS/ISS vigente" value={formatPercent(currentTaxFactor)} />
            <Line label="Fator de crédito" value={creditFactor.toLocaleString("pt-BR", { maximumFractionDigits: 4 })} />
            <Line label="Tratamento do produto" value={rule.treatment} />
            <Line label="Crédito CBS" value={formatCurrency(cbs)} />
            <Line label="Crédito IBS" value={formatCurrency(ibs)} />
            <Line label="Crédito total" value={formatCurrency(cbs + ibs)} strong />
          </dl>
          {"result" in rule && <p className="mt-2 text-xs text-warn">{rule.result}</p>}
          <button
            type="button"
            onClick={onNewQuery}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          >
            Nova Consulta
          </button>
        </div>
      </div>
    </section>
  );
}
