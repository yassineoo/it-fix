import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto mt-12">
      <div className="card p-8 text-center">
        <div className="text-6xl font-bold text-brand-600 mb-3">404</div>
        <h1 className="text-xl font-bold mb-2">Page introuvable</h1>
        <p className="text-sm text-slate-600 mb-6">
          Cette page n&apos;existe pas, ou le ticket demandé n&apos;est pas à vous.
        </p>
        <Link href="/dashboard" className="btn btn-primary">
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
