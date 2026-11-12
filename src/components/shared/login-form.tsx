"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(false);
    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    if (result?.error) setError(true);
    else router.push("/");
    setPending(false);
  }

  return (
    <div className="space-y-5">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="text-sm font-medium">
          Email
          <Input
            className="mt-2"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </label>
        <label className="text-sm font-medium">
          Password
          <Input
            className="mt-2"
            name="password"
            type="password"
            required
            minLength={10}
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="text-destructive text-sm" role="alert">
            Email atau password tidak valid. Silakan coba lagi.
          </p>
        )}
        <Button className="w-full" type="submit" disabled={pending}>
          {pending ? "Memeriksa..." : "Masuk"}
        </Button>
      </form>
      <div className="border-border border-t pt-5">
        <Button
          className="w-full"
          type="button"
          variant="outline"
          onClick={() => void signIn("google", { callbackUrl: "/" })}
        >
          Lanjutkan dengan Google
        </Button>
      </div>
    </div>
  );
}
