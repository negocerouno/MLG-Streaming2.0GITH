# Plan: Nuevos Módulos y Mejoras

## Context
Se requiere extender la aplicación StreamSaaS con siete áreas nuevas: autenticación, mantenimientos, contacto WhatsApp en clientes, creación de cuentas desde plataformas, módulo de gastos, cuentas por cobrar y configuración completa. Todo sigue el patrón existente: páginas en `src/app/pages/`, datos mock en `mockData.ts`, componentes UI de `ui/Card`, `ui/Button`, `ui/Badge`, `ui/Input`, modales usando el `dialog.tsx` ya instalado (shadcn/Radix).

---

## Archivos críticos a modificar
- `src/app/lib/mockData.ts` — nuevos tipos y constantes
- `src/app/App.tsx` — añadir `AuthProvider` + `DataProvider`
- `src/app/routes.tsx` — nuevas rutas + `ProtectedRoute`
- `src/app/components/layout/DashboardLayout.tsx` — nuevos ítems de sidebar + botón logout
- `src/app/pages/Clients.tsx` — botón WhatsApp + modal de edición con teléfono
- `src/app/pages/Platforms.tsx` — botón "Agregar Cuenta" por plataforma + modal de creación
- `src/app/pages/Accounts.tsx` — consumir estado compartido de cuentas

## Archivos nuevos a crear
- `src/app/context/AuthContext.tsx`
- `src/app/context/DataContext.tsx`
- `src/app/pages/Login.tsx`
- `src/app/pages/Maintenance.tsx`
- `src/app/pages/Expenses.tsx`
- `src/app/pages/Receivables.tsx`
- `src/app/pages/Settings.tsx`

---

## 1. Tipos nuevos en `mockData.ts`

```ts
// Añadir campo phone a Client
type Client = { ..., phone?: string }

type MaintenanceRequest = {
  id: string;
  clientId: string;
  title: string;
  description: string;
  platform: string;
  status: "abierto" | "en_progreso" | "resuelto";
  createdAt: string;
  resolvedAt?: string;
  history: { date: string; note: string; status: string }[];
}

type PlatformExpense = {
  id: string;
  platformId: string;
  description: string;
  amount: number;
  type: "recurrente" | "manual";
  frequency?: "mensual" | "anual";
  dueDate: string;
  status: "pagado" | "pendiente";
}
```

Exportar constantes iniciales: `MOCK_MAINTENANCE`, `MOCK_EXPENSES`.

---

## 2. Contextos compartidos

### `AuthContext.tsx`
- Estado: `isAuthenticated: boolean`, `user: { name, email }`, funciones `login(email, password)`, `logout()`
- Credenciales mock fijas: `admin@streamsaas.com` / `admin123`
- Persistencia: `localStorage` (clave `stream_auth`)
- Exporta `useAuth()` hook

### `DataContext.tsx`
- Estado compartido de `accounts: Account[]` (para que Platforms y Accounts compartan los mismos datos)
- Funciones: `addAccount(account)`, `releaseSlot(...)`, `assignSlot(...)`
- Exporta `useData()` hook

Ambos contextos se envuelven en `App.tsx`:
```tsx
<AuthProvider>
  <DataProvider>
    <RouterProvider router={router} />
  </DataProvider>
</AuthProvider>
```

---

## 3. Login (`src/app/pages/Login.tsx`)
- Pantalla de pantalla completa, fondo `bg-slate-50`, card centrado
- Logo StreamSaaS + ícono `MonitorPlay`
- Campos: email (Input), contraseña (Input type="password")
- Botón "Iniciar Sesión" llama a `login()` de AuthContext
- Error inline si credenciales incorrectas (texto rojo, no modal)
- Al autenticarse redirige a `/` con `<Navigate>`

### `ProtectedRoute` (dentro de `routes.tsx`)
```tsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
```
- Ruta `/login` fuera del `DashboardLayout`
- Toda la ruta raíz `/` se envuelve en `ProtectedRoute`

---

## 4. Módulo Mantenimientos (`src/app/pages/Maintenance.tsx`)
- Estado local: lista de `MaintenanceRequest[]` inicializada desde `MOCK_MAINTENANCE`
- **Vista principal**: tabla/cards con columnas: Cliente, Título, Plataforma, Estado (Badge: `warning`=abierto, `default`=en_progreso, `success`=resuelto), Fecha, Acción "Ver"
- **Modal de detalle** (usa `dialog.tsx` de Radix ya instalado):
  - Muestra historial de entradas como línea de tiempo vertical (dot + fecha + nota)
  - Botón "Marcar como Resuelta" (solo visible si status ≠ resuelto): cambia status a `"resuelto"`, agrega entrada al historial, registra `resolvedAt`
  - Botón "En Progreso" si está abierto: cambia a `"en_progreso"`
- **Botón "Nueva Solicitud"**: abre modal de creación con campos: cliente (select), título, descripción, plataforma
- Filtro por estado (tabs o select: Todos / Abierto / En Progreso / Resuelto)
- Nueva ruta: `{ path: "maintenance", Component: Maintenance }`
- Sidebar: nuevo ítem `{ icon: Wrench, label: "Mantenimientos", href: "/maintenance" }`

---

## 5. Módulo Clientes — Botón WhatsApp
Cambios en `src/app/pages/Clients.tsx`:
- Añadir campo `phone` al tipo `Client` en mockData; poblar algunos clientes con número de prueba
- En cada fila de tabla y en la card mobile, agregar un pequeño botón verde con ícono `MessageCircle` (lucide)
- **`onDoubleClick`**: abre `window.open("https://wa.me/${phone.replace(/\D/g, '')}", "_blank")`
- Si el cliente no tiene `phone`, el botón aparece deshabilitado/gris con tooltip "Sin número registrado"
- El modal de edición de cliente (nuevo, abre con botón Edit existente) incluye campo "Teléfono/WhatsApp" que guarda el número

---

## 6. Módulo Plataformas — Crear cuentas adicionales
Cambios en `src/app/pages/Platforms.tsx`:
- Cada card de plataforma tendrá un botón secundario "Agregar Cuenta" (outline, pequeño)
- Al presionar abre un modal (`dialog.tsx`) con formulario:
  - Campo: Email de la cuenta
  - Campo: Contraseña (opcional, para referencia)
  - Campo: Número de slots (number input, default = `platform.capacity`)
- Al confirmar: llama `addAccount()` de `DataContext` con el nuevo `Account` generado
- Cambios en `Accounts.tsx`: leer `accounts` de `DataContext` en lugar de `useState(MOCK_ACCOUNTS)` directamente
- El modal de edición de plataforma (botón `MoreVertical`) permite editar nombre, capacidad, tipo

---

## 7. Módulo Gastos (`src/app/pages/Expenses.tsx`)
- Estado local: `expenses: PlatformExpense[]` desde `MOCK_EXPENSES`
- **Vista**: tabla con columnas: Plataforma, Descripción, Tipo (Badge: recurrente/manual), Frecuencia, Monto, Fecha Vencimiento, Estado (pagado/pendiente), Acciones
- **Resumen superior**: 3 cards — Total mensual recurrente / Total manual / Pendientes de pago
- **Botón "Nuevo Gasto"**: modal con campos: plataforma (select de MOCK_PLATFORMS), descripción, monto, tipo (recurrente/manual), frecuencia (si recurrente: mensual/anual), fecha vencimiento
- Botón "Marcar Pagado" por ítem cambia su status
- Nueva ruta: `{ path: "expenses", Component: Expenses }`
- Sidebar: nuevo ítem `{ icon: Wallet, label: "Gastos", href: "/expenses" }`

---

## 8. Módulo Cuentas por Cobrar (`src/app/pages/Receivables.tsx`)
- Cruza `MOCK_INVOICES` + `MOCK_SUBSCRIPTIONS` + `MOCK_CLIENTS`
- Por cada cliente calcula: deuda total pendiente, próxima fecha de pago, días de atraso (si `nextPayment` < hoy)
- **Alerta visual**: si días de atraso > 0, la fila tiene fondo `bg-red-50` y un Badge `destructive` "X días vencido"
- Si vence en los próximos 3 días: badge `warning` "Por vencer"
- Si al día: badge `success` "Al día"
- Tabla: Cliente, Deuda Pendiente, Próximo Pago, Estado, Días Atraso
- Cards de resumen: Total por cobrar / Clientes en mora / Por vencer esta semana
- Botón "Registrar Pago" por cliente (modal simple: monto, fecha, nota) — actualiza estado local
- Nueva ruta: `{ path: "receivables", Component: Receivables }`
- Sidebar: nuevo ítem `{ icon: DollarSign, label: "Cuentas por Cobrar", href: "/receivables" }`

---

## 9. Módulo Configuración (`src/app/pages/Settings.tsx`)
Reemplaza el `UnderConstruction` actual de `settings`. Secciones con tabs verticales:

| Tab | Contenido |
|---|---|
| **Perfil** | Nombre, email (del auth context), avatar URL, botón guardar |
| **Empresa** | Nombre empresa, dirección, teléfono, moneda, logo |
| **Seguridad** | Cambiar contraseña (actual + nueva + confirmar), sin backend (solo valida localmente) |
| **Notificaciones** | Toggle switches para alertas de vencimiento, pagos fallidos, nuevos clientes |
| **Apariencia** | Selección de color primario (3 opciones: indigo/violet/blue) y modo (light placeholder) |

- Usa Radix `Tabs` (ya instalado en `ui/tabs.tsx`)
- Cambios se guardan en `localStorage` para persistir entre recargas

---

## 10. DashboardLayout — Actualizaciones
- Añadir 4 nuevos ítems al array `SIDEBAR_ITEMS`:
  - `{ icon: Wrench, label: "Mantenimientos", href: "/maintenance" }`
  - `{ icon: Wallet, label: "Gastos", href: "/expenses" }`
  - `{ icon: DollarSign, label: "Cuentas x Cobrar", href: "/receivables" }`
- El ítem "Configuración" ya existe (`href: "/settings"`)
- Añadir botón **Cerrar Sesión** al final del sidebar (usa `LogOut` ya importado) que llama `logout()` de AuthContext

---

## Verificación
1. Abrir la app: debe redirigir a `/login`
2. Ingresar `admin@streamsaas.com` / `admin123` → entra al Dashboard
3. Ir a Clientes → botón WhatsApp verde visible; doble-click en uno con teléfono → abre wa.me
4. Ir a Plataformas → botón "Agregar Cuenta" en cada card → modal → al guardar, ir a Cuentas y ver la nueva cuenta
5. Ir a Mantenimientos → crear nueva solicitud → verla en tabla → entrar al detalle → confirmar resuelta → estado cambia a verde
6. Ir a Gastos → crear gasto recurrente mensual → aparece en lista → marcar como pagado
7. Ir a Cuentas por Cobrar → clientes con fecha pasada aparecen con fondo rojo y badge "X días vencido"
8. Ir a Configuración → editar perfil → guardar → datos persisten al recargar
9. Botón logout en sidebar → regresa a `/login`, localStorage limpiado
