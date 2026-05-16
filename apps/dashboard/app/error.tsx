"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-md w-full text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} />
        </div>
        <h1 className="text-xl font-bold mb-2">Algo deu errado</h1>
        <p className="text-sm text-gray-500 mb-6">
          Ocorreu um erro ao carregar essa página. Você pode tentar novamente ou voltar para o dashboard.
        </p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm">
            Tentar novamente
          </button>
          <Link href="/leads"
            className="px-4 py-2 border rounded-md text-sm hover:bg-gray-50">
            Voltar
          </Link>
        </div>
        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 text-left">
            <summary className="text-xs text-gray-400 cursor-pointer">Detalhes técnicos</summary>
            <pre className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded overflow-auto">{error.message}</pre>
          </details>
        )}
      </div>
    </main>
  );
}
