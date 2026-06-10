import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { config } from "@/content/tecnico";

export default function ObrigadoPage() {
  const ob = config.obrigado;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 to-blue-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{ob.headline}</h1>
        <p className="text-gray-500 leading-relaxed mb-8">{ob.corpo}</p>

        <Link
          href={ob.ctaSecundario.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-900 transition-colors text-sm"
        >
          {ob.ctaSecundario.label} →
        </Link>
      </div>
    </main>
  );
}
