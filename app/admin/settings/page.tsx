"use client";

import AdminGuard from "@/app/components/AdminGuard";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type Settings = {
  id: number;
  society_name: string;
  short_name: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  facebook: string;
  instagram: string;
  x: string;
  linkedin: string;
  youtube: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  membership_fee: string;
  renewal_fee: string;
  stripe_public_key: string;
  stripe_secret_key: string;
  registration_open: boolean;
  donations_enabled: boolean;
  business_directory_enabled: boolean;
};

const defaultSettings: Settings = {
  id: 1,
  society_name: "Ugandan Society in BC",
  short_name: "USBC",
  email: "",
  phone: "",
  address: "",
  website: "",
  facebook: "",
  instagram: "",
  x: "",
  linkedin: "",
  youtube: "",
  logo_url: "/logo.png",
  primary_color: "#111827",
  secondary_color: "#FACC15",
  accent_color: "#DC2626",
  membership_fee: "30",
  renewal_fee: "30",
  stripe_public_key: "",
  stripe_secret_key: "",
  registration_open: true,
  donations_enabled: true,
  business_directory_enabled: true,
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);

    const { data, error } = await supabase
      .from("Settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!error && data) {
      setSettings({
        ...defaultSettings,
        ...data,
        membership_fee: String(data.membership_fee ?? "30"),
        renewal_fee: String(data.renewal_fee ?? "30"),
      });
    }

    setLoading(false);
  }

  async function saveSettings() {
    setSaving(true);

    const payload = {
      ...settings,
      id: 1,
      membership_fee: Number(settings.membership_fee || 0),
      renewal_fee: Number(settings.renewal_fee || 0),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("Settings")
      .upsert(payload, { onConflict: "id" });

    setSaving(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Settings saved successfully.");
  }

  function updateField(field: keyof Settings, value: string | boolean) {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  if (loading) {
    return (
      <AdminGuard permission="settings">
        <main className="min-h-screen bg-gray-100 px-6 py-12">
          <p className="rounded-3xl bg-white p-8 font-bold shadow">
            Loading settings...
          </p>
        </main>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard permission="settings">
      <main className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-3xl bg-gray-950 p-10 text-white shadow-xl">
            <p className="font-black uppercase tracking-widest text-yellow-400">
              USBC Administration
            </p>

            <h1 className="mt-3 text-5xl font-black">System Settings</h1>

            <p className="mt-4 max-w-3xl text-gray-300">
              Manage society information, membership fees, website settings,
              social media links, and system features.
            </p>
          </div>

          <div className="grid gap-8">
            <Section title="Organization">
              <Input label="Society Name" value={settings.society_name} onChange={(v) => updateField("society_name", v)} />
              <Input label="Short Name" value={settings.short_name} onChange={(v) => updateField("short_name", v)} />
              <Input label="Logo URL" value={settings.logo_url} onChange={(v) => updateField("logo_url", v)} />
              <Input label="Website" value={settings.website} onChange={(v) => updateField("website", v)} />
            </Section>

            <Section title="Contact Information">
              <Input label="Email" value={settings.email} onChange={(v) => updateField("email", v)} />
              <Input label="Phone" value={settings.phone} onChange={(v) => updateField("phone", v)} />
              <Textarea label="Address" value={settings.address} onChange={(v) => updateField("address", v)} />
            </Section>

            <Section title="Social Media">
              <Input label="Facebook" value={settings.facebook} onChange={(v) => updateField("facebook", v)} />
              <Input label="Instagram" value={settings.instagram} onChange={(v) => updateField("instagram", v)} />
              <Input label="X / Twitter" value={settings.x} onChange={(v) => updateField("x", v)} />
              <Input label="LinkedIn" value={settings.linkedin} onChange={(v) => updateField("linkedin", v)} />
              <Input label="YouTube" value={settings.youtube} onChange={(v) => updateField("youtube", v)} />
            </Section>

            <Section title="Membership & Payments">
              <Input label="Membership Fee" value={settings.membership_fee} onChange={(v) => updateField("membership_fee", v)} />
              <Input label="Renewal Fee" value={settings.renewal_fee} onChange={(v) => updateField("renewal_fee", v)} />
              <Input label="Stripe Public Key" value={settings.stripe_public_key} onChange={(v) => updateField("stripe_public_key", v)} />
              <Input label="Stripe Secret Key" value={settings.stripe_secret_key} onChange={(v) => updateField("stripe_secret_key", v)} />
            </Section>

            <Section title="Appearance">
              <Input label="Primary Color" value={settings.primary_color} onChange={(v) => updateField("primary_color", v)} />
              <Input label="Secondary Color" value={settings.secondary_color} onChange={(v) => updateField("secondary_color", v)} />
              <Input label="Accent Color" value={settings.accent_color} onChange={(v) => updateField("accent_color", v)} />
            </Section>

            <Section title="Website Features">
              <Toggle label="Registration Open" checked={settings.registration_open} onChange={(v) => updateField("registration_open", v)} />
              <Toggle label="Donations Enabled" checked={settings.donations_enabled} onChange={(v) => updateField("donations_enabled", v)} />
              <Toggle label="Business Directory Enabled" checked={settings.business_directory_enabled} onChange={(v) => updateField("business_directory_enabled", v)} />
            </Section>

            <div className="rounded-3xl bg-white p-8 shadow">
              <button
                onClick={saveSettings}
                disabled={saving}
                className="rounded-xl bg-red-600 px-8 py-4 font-bold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </AdminGuard>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl bg-white p-8 shadow">
      <h2 className="mb-6 text-3xl font-black text-gray-950">{title}</h2>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-bold text-gray-700">{label}</span>
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border px-4 py-4 text-gray-950"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 md:col-span-2">
      <span className="font-bold text-gray-700">{label}</span>
      <textarea
        rows={4}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border px-4 py-4 text-gray-950"
      />
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between rounded-xl border p-5">
      <span className="font-bold text-gray-800">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-6 w-6"
      />
    </label>
  );
}