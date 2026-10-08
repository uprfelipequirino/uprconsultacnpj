type Tone = "success" | "danger" | "warn" | "info";

const tones: Record<Tone, string> = {
  success: "text-success border-success/30",
  danger: "text-danger border-danger/30",
  warn: "text-warn border-warn/30",
  info: "text-info border-info/30",
};

export default function StatusBadge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-block rounded-md border px-2 py-0.5 text-xs font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}
