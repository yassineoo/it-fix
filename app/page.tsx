import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <div className="py-12">
      <div className="max-w-3xl">
        <span className="badge badge-open mb-4">Extranet support IT</span>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Un bug&nbsp;? Un ticket. Un technicien. Réglé.
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          IT-Fix est la plateforme interne qui connecte les employés aux
          techniciens de support. Décrivez la panne, joignez la capture d&apos;écran,
          suivez la résolution en temps réel.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/signup" className="btn btn-primary">
            Créer un compte employé
          </Link>
          <Link href="/login" className="btn btn-secondary">
            Se connecter
          </Link>
        </div>
      </div>

      <section className="grid md:grid-cols-3 gap-4 mt-16">
        <div className="card p-6">
          <h3 className="font-semibold mb-2">1. Consultez les techniciens</h3>
          <p className="text-sm text-slate-600">
            Parcourez le catalogue : réseau, hardware, logiciels, sécurité.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-2">2. Ouvrez un ticket</h3>
          <p className="text-sm text-slate-600">
            Décrivez la panne et joignez la capture d&apos;écran du bug.
          </p>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold mb-2">3. Suivez la résolution</h3>
          <p className="text-sm text-slate-600">
            Tableau de bord personnel : vos tickets, vos statuts. Rien que vous.
          </p>
        </div>
      </section>
    </div>
  );
}
