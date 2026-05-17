"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { WepesiLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    try {
      await registerUser({ email, password, company_name: companyName });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to register");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border border-line bg-white p-6 shadow-soft">
        <WepesiLogo />
        <h1 className="mt-8 text-2xl font-semibold text-ink">Create your Wepesi workspace</h1>
        <p className="mt-2 text-sm text-slate-500">The first registered user automatically becomes an admin.</p>
        <label className="mt-6 block text-sm font-medium text-slate-700">
          Company
          <input className="mt-2 h-11 w-full rounded-md border border-line px-3 outline-none focus:border-signal" value={companyName} onChange={(event) => setCompanyName(event.target.value)} required />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Email
          <input className="mt-2 h-11 w-full rounded-md border border-line px-3 outline-none focus:border-signal" value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Password
          <input className="mt-2 h-11 w-full rounded-md border border-line px-3 outline-none focus:border-signal" value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} required />
        </label>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <Button className="mt-6 w-full" variant="signal">Create account</Button>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already registered? <Link href="/login" className="font-semibold text-signal">Log in</Link>
        </p>
      </form>
    </main>
  );
}
