import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { User, Building2, Lock, Bell, Palette, Save, Check } from "lucide-react";

const SETTINGS_KEY = "stream_settings";

type AppSettings = {
  profile: { name: string; email: string; avatarUrl: string };
  company: { name: string; address: string; phone: string; currency: string };
  notifications: { expiration: boolean; failedPayments: boolean; newClients: boolean; maintenance: boolean };
  appearance: { primaryColor: "indigo" | "violet" | "blue" };
};

const DEFAULT_SETTINGS: AppSettings = {
  profile: { name: "Admin User", email: "admin@streamsaas.com", avatarUrl: "https://i.pravatar.cc/150?img=11" },
  company: { name: "StreamSaaS", address: "Santo Domingo, RD", phone: "+1 809 000 0000", currency: "USD" },
  notifications: { expiration: true, failedPayments: true, newClients: false, maintenance: true },
  appearance: { primaryColor: "indigo" },
};

function loadSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function saveSettings(settings: AppSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        checked ? "bg-indigo-600" : "bg-slate-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

type TabKey = "profile" | "company" | "security" | "notifications" | "appearance";

const TABS: Array<{ key: TabKey; label: string; icon: React.ReactNode }> = [
  { key: "profile", label: "Perfil", icon: <User className="h-4 w-4" /> },
  { key: "company", label: "Empresa", icon: <Building2 className="h-4 w-4" /> },
  { key: "security", label: "Seguridad", icon: <Lock className="h-4 w-4" /> },
  { key: "notifications", label: "Notificaciones", icon: <Bell className="h-4 w-4" /> },
  { key: "appearance", label: "Apariencia", icon: <Palette className="h-4 w-4" /> },
];

const COLOR_OPTIONS: Array<{ value: AppSettings["appearance"]["primaryColor"]; label: string; class: string }> = [
  { value: "indigo", label: "Índigo", class: "bg-indigo-600" },
  { value: "violet", label: "Violeta", class: "bg-violet-600" },
  { value: "blue", label: "Azul", class: "bg-blue-600" },
];

export function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("profile");
  const [settings, setSettings] = useState<AppSettings>(loadSettings);
  const [saved, setSaved] = useState(false);

  const [security, setSecurity] = useState({ current: "", next: "", confirm: "" });
  const [secError, setSecError] = useState("");
  const [secSaved, setSecSaved] = useState(false);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    setSecError("");
    if (security.current !== "admin123") {
      setSecError("La contraseña actual es incorrecta.");
      return;
    }
    if (security.next.length < 6) {
      setSecError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (security.next !== security.confirm) {
      setSecError("Las contraseñas no coinciden.");
      return;
    }
    setSecSaved(true);
    setSecurity({ current: "", next: "", confirm: "" });
    setTimeout(() => setSecSaved(false), 2500);
  };

  const update = <K extends keyof AppSettings>(section: K, patch: Partial<AppSettings[K]>) => {
    setSettings((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Configuración</h1>
        <p className="text-sm text-slate-500 mt-1">Administra las preferencias del sistema y de tu cuenta.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Tab List */}
        <nav className="sm:w-52 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors text-left border-l-2 ${
                  activeTab === tab.key
                    ? "bg-indigo-50 border-indigo-600 text-indigo-700"
                    : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className={activeTab === tab.key ? "text-indigo-600" : "text-slate-400"}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Tab Content */}
        <div className="flex-1">
          <Card>
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <>
                <CardHeader>
                  <CardTitle>Información de Perfil</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-4">
                    <img src={settings.profile.avatarUrl} alt="avatar" className="h-16 w-16 rounded-full object-cover border-2 border-slate-200" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{settings.profile.name}</p>
                      <p className="text-xs text-slate-500">{settings.profile.email}</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
                      <Input value={settings.profile.name} onChange={(e) => update("profile", { name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo</label>
                      <Input type="email" value={settings.profile.email} onChange={(e) => update("profile", { email: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">URL de Avatar</label>
                    <Input value={settings.profile.avatarUrl} onChange={(e) => update("profile", { avatarUrl: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      {saved ? <><Check className="h-4 w-4" /> Guardado</> : <><Save className="h-4 w-4" /> Guardar Cambios</>}
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {/* Company Tab */}
            {activeTab === "company" && (
              <>
                <CardHeader>
                  <CardTitle>Datos de la Empresa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre de la empresa</label>
                      <Input value={settings.company.name} onChange={(e) => update("company", { name: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Teléfono</label>
                      <Input value={settings.company.phone} onChange={(e) => update("company", { phone: e.target.value })} placeholder="+1 809 000 0000" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Dirección</label>
                      <Input value={settings.company.address} onChange={(e) => update("company", { address: e.target.value })} placeholder="Ciudad, País" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Moneda</label>
                      <select
                        value={settings.company.currency}
                        onChange={(e) => update("company", { currency: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                      >
                        <option value="USD">USD — Dólar</option>
                        <option value="DOP">DOP — Peso Dominicano</option>
                        <option value="EUR">EUR — Euro</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      {saved ? <><Check className="h-4 w-4" /> Guardado</> : <><Save className="h-4 w-4" /> Guardar Cambios</>}
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <>
                <CardHeader>
                  <CardTitle>Seguridad</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSecuritySave} className="space-y-4 max-w-sm">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña actual</label>
                      <Input type="password" value={security.current} onChange={(e) => setSecurity({ ...security, current: e.target.value })} placeholder="••••••••" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Nueva contraseña</label>
                      <Input type="password" value={security.next} onChange={(e) => setSecurity({ ...security, next: e.target.value })} placeholder="Mínimo 6 caracteres" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmar contraseña</label>
                      <Input type="password" value={security.confirm} onChange={(e) => setSecurity({ ...security, confirm: e.target.value })} placeholder="Repite la nueva contraseña" required />
                    </div>
                    {secError && (
                      <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{secError}</div>
                    )}
                    {secSaved && (
                      <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
                        <Check className="h-4 w-4" /> Contraseña actualizada correctamente.
                      </div>
                    )}
                    <div className="flex justify-end pt-2">
                      <Button type="submit" className="flex items-center gap-2">
                        <Lock className="h-4 w-4" /> Cambiar Contraseña
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <>
                <CardHeader>
                  <CardTitle>Notificaciones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {[
                    { key: "expiration" as const, label: "Alertas de vencimiento de suscripción", desc: "Notifica cuando una suscripción está por vencer." },
                    { key: "failedPayments" as const, label: "Pagos fallidos", desc: "Notifica cuando un pago no puede procesarse." },
                    { key: "newClients" as const, label: "Nuevos clientes", desc: "Notifica cuando un cliente se registra." },
                    { key: "maintenance" as const, label: "Solicitudes de mantenimiento", desc: "Notifica cuando hay nuevas averías reportadas." },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle
                        checked={settings.notifications[item.key]}
                        onChange={(v) => update("notifications", { [item.key]: v })}
                      />
                    </div>
                  ))}
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      {saved ? <><Check className="h-4 w-4" /> Guardado</> : <><Save className="h-4 w-4" /> Guardar Cambios</>}
                    </Button>
                  </div>
                </CardContent>
              </>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <>
                <CardHeader>
                  <CardTitle>Apariencia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-3">Color principal</p>
                    <div className="flex gap-3">
                      {COLOR_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => update("appearance", { primaryColor: opt.value })}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                            settings.appearance.primaryColor === opt.value
                              ? "border-slate-900 bg-slate-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className={`h-8 w-8 rounded-full ${opt.class}`} />
                          <span className="text-xs font-medium text-slate-700">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-3">Modo</p>
                    <div className="flex gap-3">
                      {["Claro", "Oscuro (próximamente)"].map((m) => (
                        <button
                          key={m}
                          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            m === "Claro"
                              ? "border-slate-900 bg-white text-slate-900"
                              : "border-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                          disabled={m !== "Claro"}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      {saved ? <><Check className="h-4 w-4" /> Guardado</> : <><Save className="h-4 w-4" /> Guardar Cambios</>}
                    </Button>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
