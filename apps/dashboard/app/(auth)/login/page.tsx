import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-[100dvh] flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-1">Dashboard Florence</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Entre com sua conta</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
