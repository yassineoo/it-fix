"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfo(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, department }
      }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    if (data.session) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setInfo(
        "Compte créé. Si la confirmation par email est activée dans Supabase, " +
          "vérifiez votre boîte mail, sinon vous pouvez vous connecter."
      );
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-1">Créer un compte employé</h1>
        <p className="text-sm text-slate-600 mb-6">
          Ouvrez votre accès à IT-Fix pour déclarer des pannes.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="fullName">Nom complet</label>
            <input
              id="fullName" className="input" required
              value={fullName} onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="department">Département</label>
            <input
              id="department" className="input"
              placeholder="ex: Comptabilité, RH, Direction..."
              value={department} onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email" type="email" className="input" autoComplete="email"
              required value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Mot de passe</label>
            <input
              id="password" type="password" className="input" minLength={6}
              autoComplete="new-password"
              required value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </div>
          )}
          {info && (
            <div className="text-sm text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              {info}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-sm text-slate-600 mt-6 text-center">
          Déjà inscrit ?{" "}
          <Link href="/login" className="text-brand-600 font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
