import { accuracyToColor } from '@/lib/utils';

interface BarItem {
  label: string;
  value: number;  // 0-1
  count?: number;
}

export function HorizontalBarChart({ items, title }: { items: BarItem[]; title?: string }) {
  return (
    <div className="w-full">
      {title && <div className="text-base font-bold text-gray-800 mb-3">{title}</div>}
      <div className="space-y-3">
        {items.map((item, i) => {
          const pct = Math.round(item.value * 100);
          const color = item.value >= 0.8 ? 'bg-emerald-500'
            : item.value >= 0.65 ? 'bg-blue-500'
            : item.value >= 0.50 ? 'bg-amber-500'
            : 'bg-red-500';
          return (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 truncate max-w-[60%]">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.count !== undefined && (
                    <span className="text-xs text-gray-400">{item.count}問</span>
                  )}
                  <span className={`text-sm font-bold ${accuracyToColor(item.value)}`}>{pct}%</span>
                </div>
              </div>
              <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DifficultyBar({
  easy, medium, hard,
}: {
  easy: { correct: number; total: number };
  medium: { correct: number; total: number };
  hard: { correct: number; total: number };
}) {
  const items = [
    { label: '基礎', ...easy, color: 'bg-green-500 text-green-700' },
    { label: '標準', ...medium, color: 'bg-amber-500 text-amber-700' },
    { label: '応用', ...hard, color: 'bg-red-500 text-red-700' },
  ];
  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const pct = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
        const [bg] = item.color.split(' ');
        return (
          <div key={i}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm text-gray-500">
                {item.correct}/{item.total}問 ({pct}%)
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${bg}`} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
