import React from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Dashboard } from "./pages/Dashboard";
import { Clients } from "./pages/Clients";
import { Platforms } from "./pages/Platforms";
import { Accounts } from "./pages/Accounts";
import { Subscriptions } from "./pages/Subscriptions";
import { Billing } from "./pages/Billing";
import { Maintenance } from "./pages/Maintenance";
import { Expenses } from "./pages/Expenses";
import { Receivables } from "./pages/Receivables";
import { Settings } from "./pages/Settings";
import { Login } from "./pages/Login";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}

const UnderConstruction = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 flex items-center justify-center">
      <span className="text-3xl text-slate-400">🏗️</span>
    </div>
    <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
    <p className="text-slate-500 max-w-sm">
      Esta sección está en desarrollo. Pronto podrás acceder a todas sus funcionalidades.
    </p>
  </div>
);

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "clients", Component: Clients },
      { path: "platforms", Component: Platforms },
      { path: "accounts", Component: Accounts },
      { path: "subscriptions", Component: Subscriptions },
      { path: "billing", Component: Billing },
      { path: "maintenance", Component: Maintenance },
      { path: "expenses", Component: Expenses },
      { path: "receivables", Component: Receivables },
      { path: "settings", Component: Settings },
      { path: "combos", Component: () => <UnderConstruction title="Paquetes y Combos" /> },
      { path: "notifications", Component: () => <UnderConstruction title="Notificaciones Globales" /> },
      { path: "files", Component: () => <UnderConstruction title="Gestor de Archivos" /> },
      { path: "*", Component: () => <Navigate to="/" replace /> },
    ],
  },
]);
