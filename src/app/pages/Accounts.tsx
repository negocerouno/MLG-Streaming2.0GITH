import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { MOCK_PLATFORMS, MOCK_CLIENTS } from "../lib/mockData";
import { UserPlus, UserMinus, Settings, Key } from "lucide-react";
import { motion } from "motion/react";
import { useData } from "../context/DataContext";

export function Accounts() {
  const { accounts, releaseSlot, assignSlot } = useData();

  const getPlatform = (id: string) => MOCK_PLATFORMS.find((p) => p.id === id);

  const handleAssign = (accountId: string, slotId: string) => {
    const randomClient = MOCK_CLIENTS[Math.floor(Math.random() * MOCK_CLIENTS.length)];
    assignSlot(accountId, slotId, randomClient.id, randomClient.name.split(" ")[0], "1234");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Cuentas</h1>
          <p className="text-sm text-slate-500 mt-1">Administra los espacios y perfiles de tus cuentas compartidas.</p>
        </div>
      </div>

      {accounts.length === 0 && (
        <div className="flex flex-col items-center justify-center h-48 text-center text-slate-400">
          <p className="text-sm">No hay cuentas creadas. Ve a Plataformas y agrega una cuenta.</p>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
        {accounts.map((acc, index) => {
          const platform = getPlatform(acc.platformId);
          if (!platform) return null;

          const occupiedCount = acc.slots.filter((s) => s.status === "ocupado").length;
          const totalCount = acc.slots.length;
          const isFull = occupiedCount === totalCount;

          return (
            <motion.div
              key={acc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="overflow-hidden flex flex-col h-full border-slate-200">
                <div className={`h-2 w-full ${platform.color}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        <img src={platform.logoUrl} alt={platform.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <p className="text-xs text-slate-500 font-medium truncate w-48">{acc.email}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4 text-slate-400" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-sm">
                    <Badge variant={isFull ? "default" : "success"}>
                      {occupiedCount} / {totalCount} Ocupados
                    </Badge>
                    {isFull && <Badge variant="destructive">Cuenta Llena</Badge>}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 bg-slate-50/50 p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {acc.slots.map((slot) => {
                      const isOccupied = slot.status === "ocupado";
                      return (
                        <div
                          key={slot.id}
                          className={`
                            relative group flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all duration-200
                            ${isOccupied
                              ? "bg-white border-slate-200 shadow-sm hover:border-indigo-300"
                              : "bg-green-50 border-green-200 border-dashed hover:bg-green-100"
                            }
                          `}
                        >
                          {isOccupied ? (
                            <>
                              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => releaseSlot(acc.id, slot.id)}
                                  className="h-6 w-6 rounded bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                                  title="Liberar espacio"
                                >
                                  <UserMinus className="h-3 w-3" />
                                </button>
                              </div>
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center mb-2 text-indigo-700 font-bold">
                                {slot.profileName?.charAt(0) || "U"}
                              </div>
                              <span className="text-xs font-semibold text-slate-900 truncate w-full">{slot.profileName}</span>
                              {slot.pin && (
                                <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                                  <Key className="h-3 w-3" />
                                  <span>{slot.pin}</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                                <UserPlus className="h-5 w-5 text-green-600" />
                              </div>
                              <span className="text-xs font-medium text-green-700">Disponible</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute inset-0 h-full w-full opacity-0"
                                onClick={() => handleAssign(acc.id, slot.id)}
                              >
                                Asignar
                              </Button>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
