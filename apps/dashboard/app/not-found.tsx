import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="text-gray-500 mb-6">Página não encontrada</p>
      <Link href="/leads" className="text-blue-600 hover:underline">Voltar ao dashboard</Link>
    </main>
  );
}
