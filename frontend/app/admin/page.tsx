"use client";

import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";

import { AppShell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { listAdminRegulations, uploadRegulation } from "@/lib/api";

type Regulation = {
  id: string;
  country_name: string;
  regulator_name: string;
  regulation_category: string;
  license_type: string;
  document_title: string;
  original_filename: string;
};

export default function AdminPage() {
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    listAdminRegulations().then(setRegulations).catch(() => setRegulations([]));
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Uploading and indexing regulation...");
    const formData = new FormData(event.currentTarget);
    try {
      await uploadRegulation(formData);
      setMessage("Regulation uploaded and indexed.");
      setRegulations(await listAdminRegulations());
      event.currentTarget.reset();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    }
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-6xl px-6 py-8">
        <div className="border-b border-line pb-6">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-signal">
            <UploadCloud className="h-4 w-4" />
            Admin regulation library
          </div>
          <h1 className="mt-2 text-3xl font-semibold text-ink">Upload country regulations</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Upload PDF, TXT, or Markdown files. Wepesi extracts text, chunks it, embeds it, stores metadata, and makes it available to the compliance advisor.</p>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4 rounded-lg border border-line bg-white p-5 shadow-sm md:grid-cols-2">
          <Field name="country_name" label="Country name" defaultValue="Nigeria" />
          <Field name="regulator_name" label="Regulator name" defaultValue="Central Bank of Nigeria" />
          <Field name="regulation_category" label="Regulation category" defaultValue="Payments/remittance" />
          <Field name="license_type" label="License type" defaultValue="Payment Service Provider" />
          <Field name="document_title" label="Document title" defaultValue="CBN payment services licensing guidance" />
          <Field name="source_url" label="Source URL" />
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</span>
            <textarea name="notes" className="mt-2 min-h-24 w-full rounded-md border border-line px-3 py-3 text-sm outline-none focus:border-signal" />
          </label>
          <label className="block md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Upload file</span>
            <input name="file" type="file" accept=".pdf,.txt,.md,.markdown" required className="mt-2 w-full rounded-md border border-line px-3 py-3 text-sm" />
          </label>
          <div className="md:col-span-2 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500">{message}</p>
            <Button variant="signal">Upload regulation</Button>
          </div>
        </form>

        <div className="mt-6 rounded-lg border border-line bg-white shadow-sm">
          <div className="border-b border-line px-5 py-4 font-semibold text-ink">Indexed regulations</div>
          <div className="divide-y divide-line">
            {regulations.length === 0 ? (
              <div className="px-5 py-4 text-sm text-slate-500">No regulations uploaded yet.</div>
            ) : (
              regulations.map((item) => (
                <div key={item.id} className="grid gap-2 px-5 py-4 text-sm md:grid-cols-[1fr_0.7fr_0.7fr]">
                  <div>
                    <div className="font-semibold text-ink">{item.document_title}</div>
                    <div className="mt-1 text-slate-500">{item.original_filename}</div>
                  </div>
                  <div className="text-slate-600">{item.country_name} · {item.regulator_name}</div>
                  <div className="text-slate-600">{item.regulation_category} · {item.license_type}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </AppShell>
  );
}

function Field({ name, label, defaultValue = "" }: { name: string; label: string; defaultValue?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <input name={name} defaultValue={defaultValue} className="mt-2 h-11 w-full rounded-md border border-line px-3 text-sm outline-none focus:border-signal" />
    </label>
  );
}
