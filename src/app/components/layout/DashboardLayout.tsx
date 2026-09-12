import React from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  LayoutDashboard, Users, LayoutGrid, MonitorPlay,
  CreditCard, Receipt, Package, Bell,
  Settings, Folder, Search, LogOut, Menu,
  Wrench, Wallet, DollarSign,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Clientes", href: "/clients" },
  { icon: LayoutGrid, label: "Plataformas", href: "/platforms" },
  { icon: MonitorPlay, label: "Cuentas", href: "/accounts" },
  { icon: Receipt, label: "Suscripciones", href: "/subscriptions" },
  { icon: CreditCard, label: "Facturación", href: "/billing" },
  { icon: Wrench, label: "Mantenimientos", href: "/maintenance" },
  { icon: Wallet, label: "Gastos", href: "/expenses" },
  { icon: DollarSign, label: "Cuentas x Cobrar", href: "/receivables" },
  { icon: Package, label: "Combos", href: "/combos" },
  { icon: Bell, label: "Notificaciones", href: "/notifications" },
  { icon: Folder, label: "Archivos", href: "/files" },
  { icon: Settings, label: "Configuración", href: "/settings" },
];

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center px-6 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-2 text-indigo-600">
            <MonitorPlay className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight text-slate-900">StreamSaaS</span>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 p-4 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-indigo-600" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-4 border-t border-slate-200 shrink-0">
          <div className="flex items-center gap-3 mb-3 px-1">
            <img
              src="https://i.pravatar.cc/150?img=11"
              alt="avatar"
              className="h-8 w-8 rounded-full bg-slate-200 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name ?? "Admin"}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>

            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar clientes, cuentas..."
                className="h-10 w-64 rounded-full border border-slate-300 bg-slate-50 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <img
                src="https://i.pravatar.cc/150?img=11"
                alt="User avatar"
                className="h-8 w-8 rounded-full bg-slate-200"
              />
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name ?? "Admin"}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-50 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
