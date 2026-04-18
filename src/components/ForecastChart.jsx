import { memo } from "react";

const ForecastChart = memo(function ForecastChart({ data }) {
  if (!data || data.length < 2) return null;

  const W = 420;
  const H = 130;
  const padX = 24;
  const padY = 20;

  const temps = data.map((d) => d.main.temp);
  const max = Math.max(...temps);
  const min = Math.min(...temps);
  const range = max - min || 1;

  const toX = (i) => padX + (i / (temps.length - 1)) * (W - padX * 2);
  const toY = (t) => H - padY - ((t - min) / range) * (H - padY * 2);

  const points = temps.map((t, i) => ({ x: toX(i), y: toY(t) }));
  const polyline = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="bg-white/20 border border-white/20 p-5 rounded-3xl
                    text-white shadow-2xl flex-1 min-w-[300px]">
      <h3 className="mb-3 font-medium">24-hr Temperature Trend</h3>

      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* fill area */}
        <polygon
          points={`${points[0].x},${H} ${polyline} ${points[points.length - 1].x},${H}`}
          fill="url(#tg)"
        />

        {/* line */}
        <polyline fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinejoin="round" points={polyline} />

        {/* dots + hour labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#38bdf8" />
            <text
              x={p.x} y={H - 3}
              textAnchor="middle" fontSize="9"
              fill="rgba(255,255,255,0.6)"
            >
              {new Date(data[i].dt * 1000).getHours()}h
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
});

export default ForecastChart;
