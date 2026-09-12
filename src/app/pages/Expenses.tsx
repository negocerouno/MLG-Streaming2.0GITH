import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Plus, X, Check, Wallet, TrendingUp, AlertCircle } from "lucide-react";
import { PlatformExpense, MOCK_EXPENSES, MOCK_PLATFORMS } from "../lib/mockData";

function getPlatformName(id: string) {
  return MOCK_PLATFORMS.find((p) => p.id === id)?.name ?? "Desconocida";
}

function getPlatformColor(id: string) {
  return MOCK_PLATFORMS.find((p) => p.id === id)?.color ?? "bg-slate-500";
}

type ExpenseModalProps = {
  onClose: () => void;
  onSave: (expense: PlatformExpense) => void;
};

function ExpenseModal({ onClose, onSave }: ExpenseModalProps) {
  const [form, setForm] = useState({
    platformId: MOCK_PLATFORMS[0].id,
    description: "",
    amount: "",
    type: "recurrente" as PlatformExpense["type"],
    frequency: "mensual" as PlatformExpense["frequency"],
    dueDate: new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: `e${Date.now()}`,
      platformId: form.platformId,
      description: form.description,
      amount: parseFloat(form.amount),
      type: form.type,
      frequency: form.type === "recurrente" ? form.frequency : undefined,
      dueDate: form.dueDate,
      status: "pendiente",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Nuevo Gasto</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Plataforma</label>
            <select
              value={form.platformId}
              onChange={(e) => setForm({ ...form, platformId: e.target.value })}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              {MOCK_PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Descripción</label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ej: Suscripción mensual Netflix"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Monto (USD)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tipo</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as PlatformExpense["type"] })}
                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              >
                <option value="recurrente">Recurrente</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            {form.type === "recurrente" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Frecuencia</label>
                <select
                  value={form.frequency}
                  onChange={(e) => setForm({ ...form, frequency: e.target.value as PlatformExpense["frequency"] })}
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                >
                  <option value="mensual">Mensual</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha de vencimiento</label>
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar Gasto</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Expenses() {
  const [expenses, setExpenses] = useState<PlatformExpense[]>(MOCK_EXPENSES);
  const [showModal, setShowModal] = useState(false);

  const markPaid = (id: string) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, status: "pagado" } : e)));
  };

  const recurringMonthly = expenses
    .filter((e) => e.type === "recurrente" && e.frequency === "mensual")
    .reduce((s, e) => s + e.amount, 0);

  const manualTotal = expenses
    .filter((e) => e.type === "manual")
    .reduce((s, e) => s + e.amount, 0);

  const pending = expenses.filter((e) => e.status === "pendiente").reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gastos de Plataforma</h1>
          <p className="text-sm text-slate-500 mt-1">Controla los pagos recurrentes y gastos operativos de la empresa.</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo Gasto
        </Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Recurrente Mensual</p>
                <p className="text-xl font-bold text-slate-900">${recurringMonthly.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Gastos Manuales</p>
                <p className="text-xl font-bold text-slate-900">${manualTotal.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Pendientes de Pago</p>
                <p className="text-xl font-bold text-yellow-700">${pending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Plataforma</th>
                <th className="px-6 py-4 font-medium">Descripción</th>
                <th className="px-6 py-4 font-medium">Tipo</th>
                <th className="px-6 py-4 font-medium">Frecuencia</th>
                <th className="px-6 py-4 font-medium">Monto</th>
                <th className="px-6 py-4 font-medium">Vencimiento</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acción</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${getPlatformColor(exp.platformId)}`} />
                      <span className="font-medium text-slate-900">{getPlatformName(exp.platformId)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 max-w-xs truncate">{exp.description}</td>
                  <td className="px-6 py-4">
                    <Badge variant={exp.type === "recurrente" ? "default" : "secondary"}>
                      {exp.type === "recurrente" ? "Recurrente" : "Manual"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-500 capitalize">{exp.frequency ?? "—"}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">${exp.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-500">{exp.dueDate}</td>
                  <td className="px-6 py-4">
                    <Badge variant={exp.status === "pagado" ? "success" : "warning"}>
                      {exp.status === "pagado" ? "Pagado" : "Pendiente"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {exp.status === "pendiente" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markPaid(exp.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" /> Marcar Pagado
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {expenses.map((exp) => (
          <Card key={exp.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2.5 w-2.5 rounded-full ${getPlatformColor(exp.platformId)}`} />
                    <span className="text-xs font-medium text-slate-500">{getPlatformName(exp.platformId)}</span>
                  </div>
                  <p className="font-semibold text-slate-900 text-sm">{exp.description}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Vence: {exp.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${exp.amount.toFixed(2)}</p>
                  <Badge variant={exp.status === "pagado" ? "success" : "warning"} className="mt-1">
                    {exp.status === "pagado" ? "Pagado" : "Pendiente"}
                  </Badge>
                </div>
              </div>
              {exp.status === "pendiente" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => markPaid(exp.id)}
                >
                  <Check className="h-3.5 w-3.5 mr-1" /> Marcar Pagado
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {showModal && (
        <ExpenseModal
          onClose={() => setShowModal(false)}
          onSave={(exp) => setExpenses((prev) => [exp, ...prev])}
        />
      )}
    </div>
  );
}
