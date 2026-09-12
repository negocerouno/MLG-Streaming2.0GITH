import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plus, Users, X, Edit2 } from "lucide-react";
import { MOCK_PLATFORMS, Platform, Account } from "../lib/mockData";
import { motion } from "motion/react";
import { useData } from "../context/DataContext";

type AddAccountModalProps = {
  platform: Platform;
  onClose: () => void;
  onAdd: (account: Account) => void;
};

function AddAccountModal({ platform, onClose, onAdd }: AddAccountModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [slots, setSlots] = useState(platform.capacity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: Account = {
      id: `a${Date.now()}`,
      platformId: platform.id,
      email,
      password,
      slots: Array.from({ length: slots }, (_, i) => ({
        id: `s${Date.now()}_${i}`,
        status: "disponible" as const,
      })),
    };
    onAdd(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Agregar Cuenta</h2>
            <p className="text-sm text-slate-500">{platform.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email de la cuenta</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="cuenta@plataforma.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Contraseña (referencia)</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Número de espacios (slots)</label>
            <Input
              type="number"
              min={1}
              max={20}
              value={slots}
              onChange={(e) => setSlots(Number(e.target.value))}
              required
            />
            <p className="text-xs text-slate-400 mt-1">Capacidad estándar de {platform.name}: {platform.capacity}</p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Crear Cuenta</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

type EditPlatformModalProps = {
  platform: Platform;
  onClose: () => void;
  onSave: (platform: Platform) => void;
};

function EditPlatformModal({ platform, onClose, onSave }: EditPlatformModalProps) {
  const [form, setForm] = useState({ ...platform });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Editar Plataforma</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Capacidad de slots</label>
            <Input type="number" min={1} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Platform["type"] })}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              <option value="compartido">Compartido</option>
              <option value="individual">Individual</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar Cambios</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Platforms() {
  const { addAccount } = useData();
  const [platforms, setPlatforms] = useState<Platform[]>(MOCK_PLATFORMS);
  const [addingFor, setAddingFor] = useState<Platform | null>(null);
  const [editingPlatform, setEditingPlatform] = useState<Platform | null>(null);
  const [showNewPlatform, setShowNewPlatform] = useState(false);

  const handleSavePlatform = (updated: Platform) => {
    setPlatforms((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const accountsCount = (platformId: string) => {
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Plataformas</h1>
          <p className="text-sm text-slate-500 mt-1">Gestiona las plataformas de streaming disponibles.</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setShowNewPlatform(true)}>
          <Plus className="h-4 w-4" /> Nueva Plataforma
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {platforms.map((platform, i) => (
          <motion.div
            key={platform.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative h-32 overflow-hidden">
                <img
                  src={platform.logoUrl}
                  alt={platform.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <Badge variant="secondary" className="text-xs bg-white/90 text-slate-900">
                    {platform.type === "compartido" ? "Compartido" : "Individual"}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{platform.name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500">
                      <Users className="h-3.5 w-3.5" />
                      <span>{platform.capacity} slots por cuenta</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingPlatform(platform)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors p-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    onClick={() => setAddingFor(platform)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Agregar Cuenta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {addingFor && (
        <AddAccountModal
          platform={addingFor}
          onClose={() => setAddingFor(null)}
          onAdd={addAccount}
        />
      )}

      {editingPlatform && (
        <EditPlatformModal
          platform={editingPlatform}
          onClose={() => setEditingPlatform(null)}
          onSave={handleSavePlatform}
        />
      )}
    </div>
  );
}
