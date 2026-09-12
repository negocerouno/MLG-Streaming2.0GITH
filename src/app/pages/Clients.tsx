import React, { useState } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Search, Plus, Edit, Trash2, MessageCircle, X, Phone } from "lucide-react";
import { Client } from "../lib/mockData";
import { useData } from "../context/DataContext";

function WhatsAppButton({ phone }: { phone?: string }) {
  const handleDoubleClick = () => {
    if (!phone) return;
    const cleaned = phone.replace(/\D/g, "");
    window.open(`https://wa.me/${cleaned}`, "_blank");
  };

  return (
    <button
      onDoubleClick={handleDoubleClick}
      title={phone ? "Doble click para abrir WhatsApp" : "Sin número registrado"}
      className={`h-7 w-7 rounded-full flex items-center justify-center transition-colors ${
        phone
          ? "bg-green-100 text-green-600 hover:bg-green-200"
          : "bg-slate-100 text-slate-300 cursor-not-allowed"
      }`}
    >
      <MessageCircle className="h-3.5 w-3.5" />
    </button>
  );
}

type ClientModalProps = {
  client: Client | null;
  onClose: () => void;
  onSave: (client: Client) => void;
};

function ClientModal({ client, onClose, onSave }: ClientModalProps) {
  const isNew = !client;
  const [form, setForm] = useState<Client>(
    client ?? {
      id: `c${Date.now()}`,
      name: "",
      email: "",
      phone: "",
      status: "activo",
      lastPayment: new Date().toISOString().slice(0, 10),
      activeSubs: 0,
      avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
    }
  );

  const handleChange = (field: keyof Client, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            {isNew ? "Nuevo Cliente" : "Editar Cliente"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre completo</label>
            <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="Carlos Mendoza" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Correo electrónico</label>
            <Input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="cliente@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-green-500" />
                Teléfono / WhatsApp
              </span>
            </label>
            <Input
              value={form.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 809 000 0000"
            />
            <p className="text-xs text-slate-400 mt-1">Incluye código de país. Doble click en el ícono verde para abrir WhatsApp.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Estado</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">{isNew ? "Crear Cliente" : "Guardar Cambios"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Clients() {
  const { clients, updateClient, addClient } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingClient, setEditingClient] = useState<Client | null | "new">(null);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (client: Client) => {
    const exists = clients.find((c) => c.id === client.id);
    if (exists) {
      updateClient(client);
    } else {
      addClient(client);
    }
    setEditingClient(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clientes</h1>
          <p className="text-sm text-slate-500 mt-1">Administra la información de tus clientes.</p>
        </div>
        <Button onClick={() => setEditingClient("new")} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nuevo Cliente
        </Button>
      </div>

      <div className="flex items-center gap-4 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Buscar por nombre o email..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <Card className="hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium">Cliente</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium">Suscripciones</th>
                <th className="px-6 py-4 font-medium">Último Pago</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((client) => (
                <tr key={client.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={client.avatarUrl} alt={client.name} className="h-8 w-8 rounded-full object-cover" />
                      <div>
                        <p className="font-semibold text-slate-900">{client.name}</p>
                        <p className="text-xs text-slate-500">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={client.status === "activo" ? "success" : "secondary"}>
                      {client.status === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{client.activeSubs}</td>
                  <td className="px-6 py-4 text-slate-600">{client.lastPayment}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <WhatsAppButton phone={client.phone} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-indigo-600"
                        onClick={() => setEditingClient(client)}
                      >
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

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map((client) => (
          <Card key={client.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={client.avatarUrl} alt={client.name} className="h-10 w-10 rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-slate-900">{client.name}</p>
                    <p className="text-xs text-slate-500">{client.email}</p>
                    {client.phone && <p className="text-xs text-green-600 mt-0.5">{client.phone}</p>}
                  </div>
                </div>
                <Badge variant={client.status === "activo" ? "success" : "secondary"}>
                  {client.status === "activo" ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">Último pago: {client.lastPayment}</p>
                <div className="flex items-center gap-2">
                  <WhatsAppButton phone={client.phone} />
                  <Button variant="outline" size="sm" onClick={() => setEditingClient(client)}>
                    <Edit className="h-3.5 w-3.5 mr-1" /> Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingClient !== null && (
        <ClientModal
          client={editingClient === "new" ? null : editingClient}
          onClose={() => setEditingClient(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
