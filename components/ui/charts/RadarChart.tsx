interface RadarItem {
  label: string;
  value: number;  // 0-1
}

export function RadarChart({ items, size = 260 }: { items: RadarItem[]; size?: number }) {
  const n = items.length;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const labelR = size * 0.48;

  const getXY = (idx: number, radius: number) => {
    const angle = (idx / n) * 2 * Math.PI - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  // Grid circles
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  // Polygon path for data
  const dataPoints = items.map((item, i) => getXY(i, r * Math.max(0.05, item.value)));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z';

  // Grid lines (spokes)
  const spokes = items.map((_, i) => {
    const outer = getXY(i, r);
    return `M${cx},${cy} L${outer.x.toFixed(1)},${outer.y.toFixed(1)}`;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {/* Grid circles */}
      {gridLevels.map((lvl, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r * lvl}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}

      {/* Spokes */}
      {spokes.map((d, i) => (
        <path key={i} d={d} stroke="#e5e7eb" strokeWidth="1" />
      ))}

      {/* Data polygon */}
      <path d={dataPath} fill="rgba(59,130,246,0.18)" stroke="#3b82f6" strokeWidth="2" />

      {/* Data dots */}
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={4} fill="#3b82f6" />
      ))}

      {/* Labels */}
      {items.map((item, i) => {
        const pos = getXY(i, labelR);
        const pct = Math.round(item.value * 100);
        const anchor = pos.x < cx - 5 ? 'end' : pos.x > cx + 5 ? 'start' : 'middle';
        return (
          <text
            key={i}
            x={pos.x}
            y={pos.y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="500"
            fill="#374151"
          >
            {item.label.length > 6 ? item.label.slice(0, 6) : item.label}
          </text>
        );
      })}
    </svg>
  );
}
