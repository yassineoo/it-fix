"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div className="card p-8 text-center">
        <div className="text-5xl mb-3">⚠️</div>
        <h1 className="text-xl font-bold mb-2">Une erreur est survenue</h1>
        <p className="text-sm text-slate-600 mb-4">
          {error.message || "Erreur inattendue."}
        </p>
        <button onClick={reset} className="btn btn-primary">
          Réessayer
        </button>
      </div>
    </div>
  );
}
