"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Technician, TicketPriority } from "@/lib/types";

type Props = {
  technicians: Pick<Technician, "id" | "full_name" | "speciality" | "available">[];
  defaultTechnicianId?: string;
};

export function TicketForm({ technicians, defaultTechnicianId }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technicianId, setTechnicianId] = useState(
    defaultTechnicianId || technicians[0]?.id || ""
  );
  const [priority, setPriority] = useState<TicketPriority>("medium");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Session expirée, reconnectez-vous.");
      setLoading(false);
      return;
    }

    let screenshotPath: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop() || "png";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("bug-screenshots")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) {
        setError("Upload échoué : " + upErr.message);
        setLoading(false);
        return;
      }
      screenshotPath = path;
    }

    const { data: ticket, error: insErr } = await supabase
      .from("tickets")
      .insert({
        employee_id: user.id,
        technician_id: technicianId,
        title,
        description,
        priority,
        screenshot_path: screenshotPath
      })
      .select()
      .single();

    setLoading(false);
    if (insErr) {
      setError(insErr.message);
      return;
    }
    router.push(`/tickets/${ticket.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="title">Titre du problème</label>
        <input
          id="title" className="input" required maxLength={120}
          placeholder="ex: Imprimante ne répond pas"
          value={title} onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="label" htmlFor="description">Description détaillée</label>
        <textarea
          id="description" className="input min-h-[120px]" required
          placeholder="Expliquez ce qui se passe, depuis quand, message d'erreur..."
          value={description} onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="technician">Technicien</label>
          <select
            id="technician" className="input" required
            value={technicianId} onChange={(e) => setTechnicianId(e.target.value)}
          >
            {technicians.map((t) => (
              <option key={t.id} value={t.id} disabled={!t.available}>
                {t.full_name} — {t.speciality}{!t.available ? " (occupé)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="priority">Priorité</label>
          <select
            id="priority" className="input"
            value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)}
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label" htmlFor="file">Capture d&apos;écran du bug</label>
        <input
          id="file" type="file" accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0 file:bg-brand-50 file:text-brand-700
                     file:font-medium hover:file:bg-brand-100"
        />
        <p className="text-xs text-slate-500 mt-1">
          Formats : PNG, JPG. Visible uniquement par vous.
        </p>
      </div>

      {error && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer le ticket"}
        </button>
      </div>
    </form>
  );
}
