import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plus, X, CheckCircle, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { MaintenanceRequest, MOCK_MAINTENANCE, MOCK_CLIENTS, MOCK_PLATFORMS } from "../lib/mockData";

type Status = MaintenanceRequest["status"];

const STATUS_LABELS: Record<Status, string> = {
  abierto: "Abierto",
  en_progreso: "En Progreso",
  resuelto: "Resuelto",
};

const STATUS_BADGE: Record<Status, "warning" | "default" | "success"> = {
  abierto: "warning",
  en_progreso: "default",
  resuelto: "success",
};

const STATUS_ICON: Record<Status, React.ReactNode> = {
  abierto: <AlertCircle className="h-3.5 w-3.5" />,
  en_progreso: <Clock className="h-3.5 w-3.5" />,
  resuelto: <CheckCircle className="h-3.5 w-3.5" />,
};

function DetailModal({
  request,
  onClose,
  onUpdate,
}: {
  request: MaintenanceRequest;
  onClose: () => void;
  onUpdate: (updated: MaintenanceRequest) => void;
}) {
  const client = MOCK_CLIENTS.find((c) => c.id === request.clientId);

  const advance = () => {
    const now = new Date().toLocaleString("es-DO");
    if (request.status === "abierto") {
      onUpdate({
        ...request,
        status: "en_progreso",
        history: [
          ...request.history,
          { date: now, note: "Solicitud tomada. En proceso de solución.", status: "en_progreso" },
        ],
      });
    } else if (request.status === "en_progreso") {
      onUpdate({
        ...request,
        status: "resuelto",
        resolvedAt: now,
        history: [
          ...request.history,
          { date: now, note: "Avería confirmada como resuelta.", status: "resuelto" },
        ],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 max-h-[90vh] flex flex-col">
        <div className="flex items-start justify-between p-6 border-b border-slate-100 shrink-0">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={STATUS_BADGE[request.status]}>
                <span className="flex items-center gap-1">
                  {STATUS_ICON[request.status]}
                  {STATUS_LABELS[request.status]}
                </span>
              </Badge>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">{request.title}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {client?.name} · {request.platform}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          <div>
            <p className="text-sm font-medium text-slate-700 mb-1">Descripción</p>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{request.description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-3">Historial de actividad</p>
            <div className="relative space-y-0">
              {request.history.map((entry, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 rounded-full shrink-0 mt-1 ${
                      entry.status === "resuelto" ? "bg-green-500" :
                      entry.status === "en_progreso" ? "bg-indigo-500" : "bg-yellow-500"
                    }`} />
                    {i < request.history.length - 1 && (
                      <div className="w-px flex-1 bg-slate-200 my-1" />
                    )}
                  </div>
                  <div className="pb-5">
                    <p className="text-xs text-slate-400">{entry.date}</p>
                    <p className="text-sm text-slate-700 mt-0.5">{entry.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {request.status !== "resuelto" && (
          <div className="p-6 border-t border-slate-100 shrink-0 flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">Cerrar</Button>
            <Button onClick={advance} className="flex-1">
              {request.status === "abierto" ? (
                <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Tomar en Progreso</span>
              ) : (
                <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Confirmar Resuelta</span>
              )}
            </Button>
          </div>
        )}
        {request.status === "resuelto" && (
          <div className="p-6 border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Resuelta el {request.resolvedAt}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NewRequestModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (req: MaintenanceRequest) => void;
}) {
  const [form, setForm] = useState({ clientId: MOCK_CLIENTS[0].id, title: "", description: "", platform: MOCK_PLATFORMS[0].name });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString().slice(0, 10);
    onSave({
      id: `m${Date.now()}`,
      ...form,
      status: "abierto",
      createdAt: now,
      history: [{ date: now, note: "Solicitud creada.", status: "abierto" }],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Nueva Solicitud de Mantenimiento</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Cliente</label>
            <select
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              {MOCK_CLIENTS.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Plataforma afectada</label>
            <select
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              {MOCK_PLATFORMS.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Título del problema</label>
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ej: No puede acceder al perfil"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción detallada</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe el problema del cliente..."
              rows={3}
              required
              className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Crear Solicitud</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const FILTER_OPTIONS: Array<{ label: string; value: Status | "todos" }> = [
  { label: "Todos", value: "todos" },
  { label: "Abierto", value: "abierto" },
  { label: "En Progreso", value: "en_progreso" },
  { label: "Resuelto", value: "resuelto" },
];

export function Maintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(MOCK_MAINTENANCE);
  const [filter, setFilter] = useState<Status | "todos">("todos");
  const [selected, setSelected] = useState<MaintenanceRequest | null>(null);
  const [showNew, setShowNew] = useState(false);

  const getClient = (id: string) => MOCK_CLIENTS.find((c) => c.id === id);

  const filtered = filter === "todos" ? requests : requests.filter((r) => r.status === filter);

  const handleUpdate = (updated: MaintenanceRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelected(updated);
  };

  const counts = {
    abierto: requests.filter((r) => r.status === "abierto").length,
    en_progreso: requests.filter((r) => r.status === "en_progreso").length,
    resuelto: requests.filter((r) => r.status === "resuelto").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Mantenimientos</h1>
          <p className="text-sm text-slate-500 mt-1">Gestiona las averías y solicitudes de soporte de tus clientes.</p>
        </div>
        <Button onClick={() => setShowNew(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nueva Solicitud
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Abiertos", count: counts.abierto, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
          { label: "En Progreso", count: counts.en_progreso, color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
          { label: "Resueltos", count: counts.resuelto, color: "text-green-600", bg: "bg-green-50 border-green-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-sm text-slate-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
              filter === opt.value
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <Card className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Título</th>
                <th className="px-6 py-4 font-medium">Plataforma</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req) => {
                const client = getClient(req.clientId);
                return (
                  <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img src={client?.avatarUrl} alt={client?.name} className="h-7 w-7 rounded-full object-cover" />
                        <span className="font-medium text-slate-900">{client?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 max-w-xs truncate">{req.title}</td>
                    <td className="px-6 py-4 text-slate-500">{req.platform}</td>
                    <td className="px-6 py-4">
                      <Badge variant={STATUS_BADGE[req.status]}>
                        <span className="flex items-center gap-1">
                          {STATUS_ICON[req.status]}
                          {STATUS_LABELS[req.status]}
                        </span>
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{req.createdAt}</td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelected(req)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        Ver <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    No hay solicitudes en esta categoría.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map((req) => {
          const client = getClient(req.clientId);
          return (
            <Card key={req.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={STATUS_BADGE[req.status]}>
                        <span className="flex items-center gap-1">
                          {STATUS_ICON[req.status]}
                          {STATUS_LABELS[req.status]}
                        </span>
                      </Badge>
                    </div>
                    <p className="font-semibold text-slate-900 text-sm">{req.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{client?.name} · {req.platform}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelected(req)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selected && (
        <DetailModal
          request={selected}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}

      {showNew && (
        <NewRequestModal
          onClose={() => setShowNew(false)}
          onSave={(req) => setRequests((prev) => [req, ...prev])}
        />
      )}
    </div>
  );
}
