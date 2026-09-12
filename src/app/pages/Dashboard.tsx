import React, { useId, useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { DollarSign, Users, MonitorPlay, AlertTriangle } from "lucide-react";
import { DASHBOARD_CHART_DATA } from "../lib/mockData";
import { motion } from "motion/react";

// Lightweight SVG area chart — avoids Recharts internal key collisions
function AreaSparkline({ data }: { data: { name: string; ingresos: number }[] }) {
  const gradientId = useId().replace(/:/g, "-");
  const [size, setSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setSize({ w: width, h: height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const PAD = { top: 16, right: 24, bottom: 36, left: 52 };
  const W = size.w;
  const H = size.h;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const values = data.map((d) => d.ingresos);
  const minV = 0;
  const maxV = Math.max(...values) * 1.1;

  const xOf = (i: number) => PAD.left + (i / (data.length - 1)) * innerW;
  const yOf = (v: number) => PAD.top + innerH - ((v - minV) / (maxV - minV)) * innerH;

  const linePts = data.map((d, i) => `${xOf(i)},${yOf(d.ingresos)}`).join(" ");
  const areaPath =
    `M ${xOf(0)},${yOf(data[0].ingresos)} ` +
    data.slice(1).map((d, i) => `L ${xOf(i + 1)},${yOf(d.ingresos)}`).join(" ") +
    ` L ${xOf(data.length - 1)},${PAD.top + innerH} L ${xOf(0)},${PAD.top + innerH} Z`;

  // Y axis ticks
  const yTicks = [0, 500, 1000, 1500, 2000, 2500].filter((t) => t <= maxV);

  const [tooltip, setTooltip] = useState<{ i: number; x: number; y: number } | null>(null);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {W > 0 && H > 0 && (
        <svg width={W} height={H} className="overflow-visible">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {yTicks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={PAD.left + innerW}
                y1={yOf(t)}
                y2={yOf(t)}
                stroke="#e2e8f0"
                strokeDasharray="3 3"
              />
              <text
                x={PAD.left - 8}
                y={yOf(t)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={11}
                fill="#64748b"
              >
                ${t}
              </text>
            </g>
          ))}

          {/* X axis labels */}
          {data.map((d, i) => (
            <text
              key={d.name}
              x={xOf(i)}
              y={PAD.top + innerH + 18}
              textAnchor="middle"
              fontSize={11}
              fill="#64748b"
            >
              {d.name}
            </text>
          ))}

          {/* Area fill */}
          <path d={areaPath} fill={`url(#${gradientId})`} />

          {/* Line */}
          <polyline
            points={linePts}
            fill="none"
            stroke="#4f46e5"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Invisible hit targets + dots */}
          {data.map((d, i) => (
            <g
              key={d.name}
              onMouseEnter={() => setTooltip({ i, x: xOf(i), y: yOf(d.ingresos) })}
              onMouseLeave={() => setTooltip(null)}
            >
              <rect
                x={xOf(i) - 16}
                y={PAD.top}
                width={32}
                height={innerH}
                fill="transparent"
              />
              {tooltip?.i === i && (
                <circle cx={xOf(i)} cy={yOf(d.ingresos)} r={4} fill="#4f46e5" />
              )}
            </g>
          ))}

          {/* Tooltip */}
          {tooltip !== null && (() => {
            const d = data[tooltip.i];
            const bw = 80;
            const bh = 36;
            const bx = Math.min(Math.max(tooltip.x - bw / 2, PAD.left), PAD.left + innerW - bw);
            const by = tooltip.y - bh - 10;
            return (
              <g>
                <rect x={bx} y={by} width={bw} height={bh} rx={6} fill="white"
                  filter="drop-shadow(0 2px 6px rgba(0,0,0,.12))" />
                <text x={bx + bw / 2} y={by + 13} textAnchor="middle" fontSize={10} fill="#64748b">{d.name}</text>
                <text x={bx + bw / 2} y={by + 27} textAnchor="middle" fontSize={13} fontWeight="600" fill="#0f172a">
                  ${d.ingresos.toLocaleString()}
                </text>
              </g>
            );
          })()}
        </svg>
      )}
    </div>
  );
}

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Ingresos Mensuales", value: "$2,400.00", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
          { title: "Clientes Activos", value: "324", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
          { title: "Suscripciones Activas", value: "481", icon: MonitorPlay, color: "text-indigo-600", bg: "bg-indigo-100" },
          { title: "Facturas Pendientes", value: "12", icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-100" },
        ].map((metric, i) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">
                  {metric.title}
                </CardTitle>
                <div className={`h-8 w-8 rounded-full ${metric.bg} flex items-center justify-center`}>
                  <metric.icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-slate-500 mt-1">+20.1% desde el mes pasado</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chart and Alerts */}
      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 lg:col-span-5">
          <CardHeader>
            <CardTitle>Ingresos Generados</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <AreaSparkline data={DASHBOARD_CHART_DATA} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 lg:col-span-2">
          <CardHeader>
            <CardTitle>Alertas Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Suscripción por vencer", desc: "Netflix Premium - Carlos M.", time: "Hace 2 horas", type: "warning" },
                { title: "Pago fallido", desc: "Factura #INV-032", time: "Hace 5 horas", type: "error" },
                { title: "Cuenta llena", desc: "Spotify Fam #2", time: "Ayer", type: "info" },
                { title: "Nuevo cliente", desc: "Se registró Ana R.", time: "Ayer", type: "success" },
              ].map((alert) => (
                <div key={alert.title} className="flex gap-3">
                  <div className="mt-1">
                    <div className={`h-2 w-2 rounded-full mt-1.5 ${
                      alert.type === "error" ? "bg-red-500" :
                      alert.type === "warning" ? "bg-yellow-500" :
                      alert.type === "success" ? "bg-green-500" : "bg-blue-500"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none text-slate-900">{alert.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{alert.desc}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
