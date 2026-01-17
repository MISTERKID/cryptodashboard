import { TickerData, formatVolume } from '@/services/binanceApi';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface MarketStatsProps {
  tickers: TickerData[];
}

export function MarketStats({ tickers }: MarketStatsProps) {
  const totalVolume = tickers.reduce((acc, t) => acc + parseFloat(t.quoteVolume), 0);
  const gainers = tickers.filter(t => parseFloat(t.priceChangePercent) > 0).length;
  const losers = tickers.length - gainers;
  
  const avgChange = tickers.reduce((acc, t) => acc + parseFloat(t.priceChangePercent), 0) / tickers.length;

  const stats = [
    {
      label: '24h Volume',
      value: `$${formatVolume(totalVolume)}`,
      icon: BarChart3,
      tooltip: 'Total trading volume in USDT across all displayed cryptocurrencies in the last 24 hours',
    },
    {
      label: 'Gainers',
      value: gainers.toString(),
      icon: TrendingUp,
      className: 'price-gain',
      tooltip: 'Number of cryptocurrencies with positive price change in the last 24 hours',
    },
    {
      label: 'Losers',
      value: losers.toString(),
      icon: TrendingDown,
      className: 'price-loss',
      tooltip: 'Number of cryptocurrencies with negative or zero price change in the last 24 hours',
    },
    {
      label: 'Avg Change',
      value: `${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%`,
      icon: Activity,
      className: avgChange >= 0 ? 'price-gain' : 'price-loss',
      tooltip: 'Average percentage price change across all displayed cryptocurrencies',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Tooltip key={stat.label}>
          <TooltipTrigger asChild>
            <div
              className="glass-card rounded-lg p-4 animate-fade-in cursor-help"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <span className="stat-label">{stat.label}</span>
              </div>
              <p className={`stat-value ${stat.className || ''}`}>
                {stat.value}
              </p>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[250px]">
            <p>{stat.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
