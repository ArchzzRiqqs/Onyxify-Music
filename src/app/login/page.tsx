import { LoginForm } from "@/components/shared/login-form";

export default function LoginPage() {
  return (
    <main className="bg-background flex min-h-screen items-center justify-center px-6 py-12">
      <div className="bg-surface border-border w-full max-w-md rounded-2xl border p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-accent mb-2 text-sm font-semibold">Onyxify</p>
          <h1 className="text-2xl font-semibold">Masuk ke Onyxify</h1>
          <p className="text-muted mt-2 text-sm">
            Dengarkan musik favoritmu di semua perangkat.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
