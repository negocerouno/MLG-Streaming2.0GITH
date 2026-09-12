export type Platform = {
  id: string;
  name: string;
  type: "compartido" | "individual";
  capacity: number;
  logoUrl: string;
  color: string;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "activo" | "inactivo";
  lastPayment: string;
  activeSubs: number;
  avatarUrl: string;
};

export type Account = {
  id: string;
  platformId: string;
  email: string;
  password?: string;
  slots: {
    id: string;
    status: "disponible" | "ocupado";
    clientId?: string;
    profileName?: string;
    pin?: string;
  }[];
};

export type Subscription = {
  id: string;
  clientId: string;
  plan: string;
  nextPayment: string;
  status: "activa" | "vencida" | "cancelada";
  price: number;
};

export type Invoice = {
  id: string;
  clientId: string;
  amount: number;
  status: "pagada" | "pendiente" | "vencida";
  date: string;
};

export type MaintenanceRequest = {
  id: string;
  clientId: string;
  title: string;
  description: string;
  platform: string;
  status: "abierto" | "en_progreso" | "resuelto";
  createdAt: string;
  resolvedAt?: string;
  history: { date: string; note: string; status: string }[];
};

export type PlatformExpense = {
  id: string;
  platformId: string;
  description: string;
  amount: number;
  type: "recurrente" | "manual";
  frequency?: "mensual" | "anual";
  dueDate: string;
  status: "pagado" | "pendiente";
};

export const MOCK_PLATFORMS: Platform[] = [
  { id: "p1", name: "Netflix Premium", type: "compartido", capacity: 5, logoUrl: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=100&q=80", color: "bg-red-500" },
  { id: "p2", name: "Spotify Premium", type: "compartido", capacity: 6, logoUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=100&q=80", color: "bg-green-500" },
  { id: "p3", name: "HBO Max", type: "compartido", capacity: 3, logoUrl: "https://images.unsplash.com/photo-1586899028174-e7098604235b?w=100&q=80", color: "bg-purple-600" },
  { id: "p4", name: "Disney+", type: "compartido", capacity: 4, logoUrl: "https://images.unsplash.com/photo-1615986201152-7686a4867f30?w=100&q=80", color: "bg-blue-600" },
];

export const MOCK_CLIENTS: Client[] = [
  { id: "c1", name: "Carlos Mendoza", email: "carlos@example.com", phone: "+18091234567", status: "activo", lastPayment: "2023-10-15", activeSubs: 2, avatarUrl: "https://i.pravatar.cc/150?u=c1" },
  { id: "c2", name: "Ana Ruiz", email: "ana@example.com", phone: "+18097654321", status: "activo", lastPayment: "2023-10-20", activeSubs: 1, avatarUrl: "https://i.pravatar.cc/150?u=c2" },
  { id: "c3", name: "Luis Fernandez", email: "luis@example.com", status: "inactivo", lastPayment: "2023-09-01", activeSubs: 0, avatarUrl: "https://i.pravatar.cc/150?u=c3" },
  { id: "c4", name: "Maria Silva", email: "maria@example.com", phone: "+18095551234", status: "activo", lastPayment: "2023-10-22", activeSubs: 3, avatarUrl: "https://i.pravatar.cc/150?u=c4" },
  { id: "c5", name: "Jorge Gomez", email: "jorge@example.com", status: "activo", lastPayment: "2023-10-25", activeSubs: 1, avatarUrl: "https://i.pravatar.cc/150?u=c5" },
];

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: "a1",
    platformId: "p1",
    email: "netflix_cuenta1@empresa.com",
    slots: [
      { id: "s1", status: "ocupado", clientId: "c1", profileName: "Carlos", pin: "1234" },
      { id: "s2", status: "ocupado", clientId: "c2", profileName: "Ana R.", pin: "0000" },
      { id: "s3", status: "disponible" },
      { id: "s4", status: "disponible" },
      { id: "s5", status: "disponible" },
    ]
  },
  {
    id: "a2",
    platformId: "p2",
    email: "spotify_fam1@empresa.com",
    slots: [
      { id: "s6", status: "ocupado", clientId: "c4", profileName: "Maria" },
      { id: "s7", status: "ocupado", clientId: "c5", profileName: "Jorge" },
      { id: "s8", status: "ocupado", clientId: "c1", profileName: "Carlos Sp" },
      { id: "s9", status: "disponible" },
      { id: "s10", status: "disponible" },
      { id: "s11", status: "disponible" },
    ]
  },
  {
    id: "a3",
    platformId: "p1",
    email: "netflix_cuenta2@empresa.com",
    slots: [
      { id: "s12", status: "ocupado", clientId: "c4", profileName: "Maria F", pin: "9999" },
      { id: "s13", status: "ocupado", clientId: "c5", profileName: "Jorgito", pin: "1111" },
      { id: "s14", status: "ocupado", clientId: "c1", profileName: "Carlitos", pin: "2222" },
      { id: "s15", status: "ocupado", clientId: "c2", profileName: "Anita", pin: "3333" },
      { id: "s16", status: "disponible" },
    ]
  }
];

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  { id: "sub1", clientId: "c1", plan: "Netflix Premium + Spotify", nextPayment: "2023-11-15", status: "activa", price: 15.99 },
  { id: "sub2", clientId: "c2", plan: "Netflix Premium", nextPayment: "2023-11-20", status: "activa", price: 6.99 },
  { id: "sub3", clientId: "c3", plan: "Disney+", nextPayment: "2023-09-01", status: "cancelada", price: 4.99 },
  { id: "sub4", clientId: "c4", plan: "Combo Total", nextPayment: "2023-11-22", status: "activa", price: 25.00 },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: "inv1", clientId: "c1", amount: 15.99, status: "pagada", date: "2023-10-15" },
  { id: "inv2", clientId: "c2", amount: 6.99, status: "pagada", date: "2023-10-20" },
  { id: "inv3", clientId: "c3", amount: 4.99, status: "vencida", date: "2023-09-01" },
  { id: "inv4", clientId: "c4", amount: 25.00, status: "pendiente", date: "2023-10-22" },
  { id: "inv5", clientId: "c5", amount: 8.99, status: "pagada", date: "2023-10-25" },
];

export const MOCK_MAINTENANCE: MaintenanceRequest[] = [
  {
    id: "m1",
    clientId: "c1",
    title: "No puede acceder al perfil de Netflix",
    description: "El cliente reporta que al intentar iniciar sesión recibe error de contraseña incorrecta.",
    platform: "Netflix Premium",
    status: "resuelto",
    createdAt: "2023-10-10",
    resolvedAt: "2023-10-11",
    history: [
      { date: "2023-10-10 09:00", note: "Solicitud creada por cliente.", status: "abierto" },
      { date: "2023-10-10 11:30", note: "Se verificó la cuenta. Contraseña restablecida.", status: "en_progreso" },
      { date: "2023-10-11 08:00", note: "Cliente confirmó acceso exitoso. Avería resuelta.", status: "resuelto" },
    ]
  },
  {
    id: "m2",
    clientId: "c2",
    title: "Spotify no reproduce en dispositivo",
    description: "La aplicación de Spotify cierra inesperadamente en el teléfono del cliente.",
    platform: "Spotify Premium",
    status: "en_progreso",
    createdAt: "2023-10-22",
    history: [
      { date: "2023-10-22 14:00", note: "Solicitud creada. Se pidió al cliente reinstalar la app.", status: "abierto" },
      { date: "2023-10-23 09:00", note: "Cliente reinstalió. El problema persiste. Se escaló.", status: "en_progreso" },
    ]
  },
  {
    id: "m3",
    clientId: "c4",
    title: "Perfil de Disney+ bloqueado",
    description: "El perfil del cliente fue bloqueado por actividad inusual.",
    platform: "Disney+",
    status: "abierto",
    createdAt: "2023-10-25",
    history: [
      { date: "2023-10-25 16:00", note: "Solicitud recibida. Pendiente revisión.", status: "abierto" },
    ]
  },
];

export const MOCK_EXPENSES: PlatformExpense[] = [
  { id: "e1", platformId: "p1", description: "Suscripción mensual Netflix Premium", amount: 22.99, type: "recurrente", frequency: "mensual", dueDate: "2023-11-01", status: "pendiente" },
  { id: "e2", platformId: "p2", description: "Suscripción mensual Spotify Familiar", amount: 15.99, type: "recurrente", frequency: "mensual", dueDate: "2023-11-05", status: "pagado" },
  { id: "e3", platformId: "p3", description: "Suscripción anual HBO Max", amount: 99.99, type: "recurrente", frequency: "anual", dueDate: "2024-01-15", status: "pagado" },
  { id: "e4", platformId: "p4", description: "Pago de activación Disney+", amount: 9.99, type: "manual", dueDate: "2023-10-20", status: "pagado" },
  { id: "e5", platformId: "p1", description: "Segunda cuenta Netflix Premium", amount: 22.99, type: "recurrente", frequency: "mensual", dueDate: "2023-11-01", status: "pendiente" },
];

export const DASHBOARD_CHART_DATA = [
  { name: "Ene", ingresos: 400 },
  { name: "Feb", ingresos: 600 },
  { name: "Mar", ingresos: 800 },
  { name: "Abr", ingresos: 950 },
  { name: "May", ingresos: 1200 },
  { name: "Jun", ingresos: 1500 },
  { name: "Jul", ingresos: 1400 },
  { name: "Ago", ingresos: 1800 },
  { name: "Sep", ingresos: 2100 },
  { name: "Oct", ingresos: 2400 },
];
