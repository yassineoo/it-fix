import { createClient } from "@/lib/supabase/server";
import { TechnicianCard } from "@/components/TechnicianCard";
import type { Technician } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function TechniciansPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("technicians")
    .select("*")
    .order("full_name");

  const technicians = (data ?? []) as Technician[];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Nos techniciens</h1>
        <p className="text-slate-600 text-sm">
          Choisissez un spécialiste pour ouvrir un ticket.
        </p>
      </div>

      {technicians.length === 0 ? (
        <div className="card p-8 text-center text-slate-600">
          Aucun technicien dans le catalogue. Exécutez{" "}
          <code className="text-xs bg-slate-100 px-1 rounded">supabase/seed.sql</code>.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.map((t) => (
            <TechnicianCard key={t.id} technician={t} />
          ))}
        </div>
      )}
    </div>
  );
}
