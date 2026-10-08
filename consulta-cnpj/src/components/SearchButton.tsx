import { LoaderCircle, Search } from "lucide-react";

export default function SearchButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-black text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-700"
    >
      {loading ? (
        <>
          <LoaderCircle size={16} className="animate-spin" aria-hidden />
          Consultando...
        </>
      ) : (
        <>
          <Search size={16} aria-hidden />
          Consultar CNPJ
        </>
      )}
    </button>
  );
}
