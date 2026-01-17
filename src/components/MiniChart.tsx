import { KlineData } from '@/services/binanceApi';

interface MiniChartProps {
  data: KlineData[];
  isGain: boolean;
}

export function MiniChart({ data, isGain }: MiniChartProps) {
  if (!data.length) return null;

  const prices = data.map(k => parseFloat(k.close));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min || 1;

  const width = 80;
  const height = 32;
  const padding = 2;

  const points = prices.map((price, i) => {
    const x = padding + (i / (prices.length - 1)) * (width - padding * 2);
    const y = height - padding - ((price - min) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = isGain ? 'hsl(var(--gain))' : 'hsl(var(--loss))';

  return (
    <svg 
      width={width} 
      height={height} 
      className="overflow-visible"
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <linearGradient id={`gradient-${isGain ? 'gain' : 'loss'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
