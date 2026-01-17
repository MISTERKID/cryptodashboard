import { useQuery } from '@tanstack/react-query';
import { fetchKlines, formatPrice, SYMBOL_NAMES, SYMBOL_ICONS } from '@/services/binanceApi';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const CHART_SYMBOLS = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT'];
const INTERVALS = [
  { label: '1H', value: '1m', limit: 60 },
  { label: '24H', value: '1h', limit: 24 },
  { label: '7D', value: '4h', limit: 42 },
  { label: '30D', value: '1d', limit: 30 },
];

export function PriceChart() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [selectedInterval, setSelectedInterval] = useState(INTERVALS[1]);

  const { data: klines, isLoading } = useQuery({
    queryKey: ['chart', selectedSymbol, selectedInterval.value],
    queryFn: () => fetchKlines(selectedSymbol, selectedInterval.value, selectedInterval.limit),
    refetchInterval: 60000,
  });

  const chartData = klines?.map((k) => ({
    time: new Date(k.closeTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      ...(selectedInterval.value === '1d' && { hour: undefined, minute: undefined, day: '2-digit', month: 'short' })
    }),
    price: parseFloat(k.close),
    high: parseFloat(k.high),
    low: parseFloat(k.low),
  })) || [];

  const currentPrice = chartData.length ? chartData[chartData.length - 1].price : 0;
  const startPrice = chartData.length ? chartData[0].price : 0;
  const priceChange = currentPrice - startPrice;
  const priceChangePercent = startPrice ? (priceChange / startPrice) * 100 : 0;
  const isGain = priceChange >= 0;

  return (
    <div className="glass-card rounded-lg p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Symbol selector */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex gap-1 p-1 bg-secondary rounded-lg">
                {CHART_SYMBOLS.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => setSelectedSymbol(symbol)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      selectedSymbol === symbol
                        ? 'bg-background text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="font-mono mr-1">{SYMBOL_ICONS[symbol]}</span>
                    {symbol.replace('USDT', '')}
                  </button>
                ))}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select cryptocurrency to view price chart</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Interval selector */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex gap-1 p-1 bg-secondary rounded-lg">
              {INTERVALS.map((interval) => (
                <button
                  key={interval.label}
                  onClick={() => setSelectedInterval(interval)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedInterval.label === interval.label
                      ? 'bg-background text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {interval.label}
                </button>
              ))}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Select time range for chart data</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Price info */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <h2 className="text-3xl font-semibold font-mono tracking-tight cursor-help">
                ${formatPrice(currentPrice)}
              </h2>
            </TooltipTrigger>
            <TooltipContent>
              <p>Current market price in USDT</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={`text-sm font-mono cursor-help ${isGain ? 'price-gain' : 'price-loss'}`}>
                {isGain ? '+' : ''}{formatPrice(priceChange)} ({isGain ? '+' : ''}{priceChangePercent.toFixed(2)}%)
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Price change from the start of selected period</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {SYMBOL_NAMES[selectedSymbol]} / USDT
        </p>
      </div>

      {/* Chart */}
      <div className="h-[300px] w-full">
        {isLoading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop 
                    offset="0%" 
                    stopColor={isGain ? 'hsl(var(--gain))' : 'hsl(var(--loss))'} 
                    stopOpacity={0.3} 
                  />
                  <stop 
                    offset="100%" 
                    stopColor={isGain ? 'hsl(var(--gain))' : 'hsl(var(--loss))'} 
                    stopOpacity={0} 
                  />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickMargin={10}
                interval="preserveStartEnd"
                minTickGap={50}
              />
              <YAxis 
                domain={['auto', 'auto']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                tickFormatter={(value) => `$${formatPrice(value)}`}
                width={80}
                tickMargin={10}
              />
              <RechartsTooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-card)',
                }}
                labelStyle={{ color: 'hsl(var(--muted-foreground))', marginBottom: 4 }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`$${formatPrice(value)}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={isGain ? 'hsl(var(--gain))' : 'hsl(var(--loss))'}
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
