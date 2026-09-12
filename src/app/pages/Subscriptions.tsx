import React from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Search, Plus, MoreVertical, Edit, Trash2 } from "lucide-react";
import { MOCK_SUBSCRIPTIONS, MOCK_CLIENTS } from "../lib/mockData";

export function Subscriptions() {
  const getClientName = (id: string) => MOCK_CLIENTS.find(c => c.id === id)?.name || "Desconocido";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Suscripciones</h1>
          <p className="text-sm text-slate-500 mt-1">Gestiona los planes y combos activos de tus clientes.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nueva Suscripción
        </Button>
      </div>

      <div className="flex items-center gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar suscripciones..." className="pl-9" />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Plan / Combo</th>
                <th className="px-6 py-4 font-medium">Próximo Pago</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Precio</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_SUBSCRIPTIONS.map((sub) => (
                <tr key={sub.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {getClientName(sub.clientId)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {sub.plan}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {sub.nextPayment}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      sub.status === "activa" ? "success" : 
                      sub.status === "cancelada" ? "destructive" : "warning"
                    }>
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    ${sub.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}