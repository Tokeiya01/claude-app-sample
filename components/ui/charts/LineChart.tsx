interface LinePoint {
  label: string;
  value: number;
}

export function LineChart({
  data,
  title,
  unit = '',
  color = '#3b82f6',
  height = 120,
}: {
  data: LinePoint[];
  title?: string;
  unit?: string;
  color?: string;
  height?: number;
}) {
  if (!data.length) {
    return (
      <div className="text-center text-gray-400 text-sm py-8">
        データがありません
      </div>
    );
  }

  const w = 300;
  const h = height;
  const pad = { top: 12, right: 12, bottom: 28, left: 40 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;

  const values = data.map(d => d.value);
  const minV = Math.min(...values) * 0.9;
  const maxV = Math.max(...values) * 1.05 || 1;

  const getX = (i: number) => pad.left + (i / Math.max(data.length - 1, 1)) * chartW;
  const getY = (v: number) => pad.top + chartH - ((v - minV) / (maxV - minV)) * chartH;

  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = path + ` L${points[points.length - 1].x.toFixed(1)},${(pad.top + chartH).toFixed(1)} L${pad.left},${(pad.top + chartH).toFixed(1)} Z`;

  return (
    <div className="w-full">
      {title && <div className="text-base font-bold text-gray-800 mb-2">{title}</div>}
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Area fill */}
        <path d={area} fill={color} fillOpacity="0.12" />

        {/* Line */}
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={4} fill={color} stroke="white" strokeWidth="1.5" />
        ))}

        {/* X labels */}
        {data.map((d, i) => (
          <text
            key={i}
            x={getX(i)}
            y={pad.top + chartH + 18}
            textAnchor="middle"
            fontSize="9"
            fill="#9ca3af"
          >
            {d.label}
          </text>
        ))}

        {/* Y labels */}
        {[minV, (minV + maxV) / 2, maxV].map((v, i) => (
          <text
            key={i}
            x={pad.left - 6}
            y={getY(v)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="9"
            fill="#9ca3af"
          >
            {Math.round(v)}{unit}
          </text>
        ))}

        {/* Gridlines */}
        {[minV, (minV + maxV) / 2, maxV].map((v, i) => (
          <line
            key={i}
            x1={pad.left}
            x2={pad.left + chartW}
            y1={getY(v)}
            y2={getY(v)}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
        ))}

        {/* Value labels on dots */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y - 9}
            textAnchor="middle"
            fontSize="9"
            fontWeight="600"
            fill={color}
          >
            {Math.round(data[i].value)}{unit}
          </text>
        ))}
      </svg>
    </div>
  );
}
