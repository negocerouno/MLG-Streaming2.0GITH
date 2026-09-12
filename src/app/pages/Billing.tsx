import React from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Search, Plus, MoreVertical, Download, Eye } from "lucide-react";
import { MOCK_INVOICES, MOCK_CLIENTS } from "../lib/mockData";

export function Billing() {
  const getClientName = (id: string) => MOCK_CLIENTS.find(c => c.id === id)?.name || "Desconocido";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Facturación</h1>
          <p className="text-sm text-slate-500 mt-1">Historial de pagos, facturas emitidas y pendientes de cobro.</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nueva Factura
        </Button>
      </div>

      <div className="flex items-center gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar por cliente o ID de factura..." className="pl-9" />
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Factura ID</th>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Monto</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    #{inv.id.toUpperCase()}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {getClientName(inv.clientId)}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {inv.date}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    ${inv.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={
                      inv.status === "pagada" ? "success" : 
                      inv.status === "vencida" ? "destructive" : "warning"
                    }>
                      {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-slate-900">
                        <Download className="h-4 w-4" />
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