import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { DollarSign, AlertTriangle, Clock, CheckCircle, Plus, X } from "lucide-react";
import { MOCK_CLIENTS, MOCK_SUBSCRIPTIONS, MOCK_INVOICES } from "../lib/mockData";

function daysDiff(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
}

type ReceivableRow = {
  clientId: string;
  clientName: string;
  avatarUrl: string;
  email: string;
  pendingAmount: number;
  nextPayment: string;
  daysOverdue: number;
  subscriptionStatus: string;
};

function buildRows(): ReceivableRow[] {
  return MOCK_CLIENTS.map((client) => {
    const subs = MOCK_SUBSCRIPTIONS.filter((s) => s.clientId === client.id && s.status !== "cancelada");
    const invoices = MOCK_INVOICES.filter((inv) => inv.clientId === client.id && inv.status !== "pagada");

    const pendingAmount = invoices.reduce((s, inv) => s + inv.amount, 0);
    const nextSub = subs.sort((a, b) => a.nextPayment.localeCompare(b.nextPayment))[0];
    const nextPayment = nextSub?.nextPayment ?? "";
    const daysOverdue = nextPayment ? daysDiff(nextPayment) : 0;
    const subscriptionStatus = nextSub?.status ?? "sin suscripción";

    return {
      clientId: client.id,
      clientName: client.name,
      avatarUrl: client.avatarUrl,
      email: client.email,
      pendingAmount,
      nextPayment,
      daysOverdue,
      subscriptionStatus,
    };
  });
}

function statusBadge(row: ReceivableRow) {
  if (row.daysOverdue > 0)
    return <Badge variant="destructive"><span className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{row.daysOverdue}d vencido</span></Badge>;
  if (row.daysOverdue >= -3)
    return <Badge variant="warning"><span className="flex items-center gap-1"><Clock className="h-3 w-3" />Por vencer</span></Badge>;
  return <Badge variant="success"><span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Al día</span></Badge>;
}

type PaymentModalProps = {
  clientName: string;
  onClose: () => void;
  onSave: (data: { amount: number; date: string; note: string }) => void;
};

function PaymentModal({ clientName, onClose, onSave }: PaymentModalProps) {
  const [form, setForm] = useState({ amount: "", date: new Date().toISOString().slice(0, 10), note: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ amount: parseFloat(form.amount), date: form.date, note: form.note });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Registrar Pago</h2>
            <p className="text-sm text-slate-500">{clientName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Monto recibido (USD)</label>
            <Input type="number" step="0.01" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha de pago</label>
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nota (opcional)</label>
            <Input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Ej: Pago vía transferencia" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Registrar Pago</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Receivables() {
  const rows = buildRows();
  const [payingFor, setPayingFor] = useState<ReceivableRow | null>(null);
  const [paidClients, setPaidClients] = useState<Set<string>>(new Set());

  const totalPending = rows.reduce((s, r) => s + r.pendingAmount, 0);
  const inArrears = rows.filter((r) => r.daysOverdue > 0).length;
  const dueThisWeek = rows.filter((r) => r.daysOverdue >= -7 && r.daysOverdue <= 0).length;

  const handlePayment = (data: { amount: number; date: string; note: string }) => {
    if (payingFor) {
      setPaidClients((prev) => new Set([...prev, payingFor.clientId]));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Cuentas por Cobrar</h1>
          <p className="text-sm text-slate-500 mt-1">Seguimiento de pagos pendientes y vencimientos de clientes.</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Total por Cobrar</p>
                <p className="text-xl font-bold text-slate-900">${totalPending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Clientes en Mora</p>
                <p className="text-xl font-bold text-red-600">{inArrears}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Por Vencer (7 días)</p>
                <p className="text-xl font-bold text-yellow-700">{dueThisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="hidden sm:block rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-medium">Cliente</th>
              <th className="px-6 py-4 font-medium">Próximo Pago</th>
              <th className="px-6 py-4 font-medium">Deuda Pendiente</th>
              <th className="px-6 py-4 font-medium">Estado</th>
              <th className="px-6 py-4 font-medium text-right">Acción</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isPaid = paidClients.has(row.clientId);
              const isOverdue = row.daysOverdue > 0;
              return (
                <tr
                  key={row.clientId}
                  className={`border-b border-slate-100 transition-colors ${
                    isOverdue && !isPaid ? "bg-red-50/40 hover:bg-red-50/60" : "hover:bg-slate-50/50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={row.avatarUrl} alt={row.clientName} className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-slate-900">{row.clientName}</p>
                        <p className="text-xs text-slate-400">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{row.nextPayment || "—"}</td>
                  <td className="px-6 py-4">
                    {row.pendingAmount > 0 ? (
                      <span className="font-semibold text-red-600">${row.pendingAmount.toFixed(2)}</span>
                    ) : (
                      <span className="text-slate-400">$0.00</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {isPaid ? (
                      <Badge variant="success"><span className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Pagado</span></Badge>
                    ) : (
                      statusBadge(row)
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!isPaid && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPayingFor(row)}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" /> Registrar Pago
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {rows.map((row) => {
          const isPaid = paidClients.has(row.clientId);
          const isOverdue = row.daysOverdue > 0;
          return (
            <Card key={row.clientId} className={isOverdue && !isPaid ? "border-red-200 bg-red-50/30" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={row.avatarUrl} alt={row.clientName} className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-slate-900">{row.clientName}</p>
                      <p className="text-xs text-slate-500">Próx. pago: {row.nextPayment || "—"}</p>
                    </div>
                  </div>
                  {isPaid ? (
                    <Badge variant="success">Pagado</Badge>
                  ) : (
                    statusBadge(row)
                  )}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                  <span className={`font-bold ${row.pendingAmount > 0 ? "text-red-600" : "text-slate-400"}`}>
                    ${row.pendingAmount.toFixed(2)}
                  </span>
                  {!isPaid && (
                    <Button variant="outline" size="sm" onClick={() => setPayingFor(row)}>
                      Registrar Pago
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {payingFor && (
        <PaymentModal
          clientName={payingFor.clientName}
          onClose={() => setPayingFor(null)}
          onSave={handlePayment}
        />
      )}
    </div>
  );
}
