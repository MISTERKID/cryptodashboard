import { useEffect, useState } from 'react';
import { 
  TickerData, 
  KlineData,
  SYMBOL_NAMES, 
  SYMBOL_ICONS,
  formatPrice, 
  formatVolume, 
  formatPercent,
  fetchKlines 
} from '@/services/binanceApi';
import { MiniChart } from './MiniChart';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CryptoTableProps {
  tickers: TickerData[];
}

export function CryptoTable({ tickers }: CryptoTableProps) {
  const [klineData, setKlineData] = useState<Record<string, KlineData[]>>({});

  useEffect(() => {
    const fetchAllKlines = async () => {
      const promises = tickers.map(async (ticker) => {
        try {
          const data = await fetchKlines(ticker.symbol, '1h', 24);
          return { symbol: ticker.symbol, data };
        } catch {
          return { symbol: ticker.symbol, data: [] };
        }
      });
      
      const results = await Promise.all(promises);
      const klines: Record<string, KlineData[]> = {};
      results.forEach(({ symbol, data }) => {
        klines[symbol] = data;
      });
      setKlineData(klines);
    };

    if (tickers.length) {
      fetchAllKlines();
    }
  }, [tickers]);

  const sortedTickers = [...tickers].sort((a, b) => 
    parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume)
  );

  return (
    <div className="glass-card rounded-lg overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 stat-label font-medium">#</th>
              <th className="text-left p-4 stat-label font-medium">Asset</th>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-right p-4 stat-label font-medium cursor-help">Price</th>
                </TooltipTrigger>
                <TooltipContent><p>Current market price in USDT</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-right p-4 stat-label font-medium cursor-help">24h Change</th>
                </TooltipTrigger>
                <TooltipContent><p>Price change percentage over the last 24 hours</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-right p-4 stat-label font-medium hidden md:table-cell cursor-help">24h High</th>
                </TooltipTrigger>
                <TooltipContent><p>Highest price reached in the last 24 hours</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-right p-4 stat-label font-medium hidden md:table-cell cursor-help">24h Low</th>
                </TooltipTrigger>
                <TooltipContent><p>Lowest price reached in the last 24 hours</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-right p-4 stat-label font-medium cursor-help">Volume (USDT)</th>
                </TooltipTrigger>
                <TooltipContent><p>Total trading volume in USDT over the last 24 hours</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <th className="text-right p-4 stat-label font-medium hidden lg:table-cell cursor-help">24h Trend</th>
                </TooltipTrigger>
                <TooltipContent><p>Visual price trend over the last 24 hours (hourly data)</p></TooltipContent>
              </Tooltip>
            </tr>
          </thead>
          <tbody>
            {sortedTickers.map((ticker, index) => {
              const changePercent = parseFloat(ticker.priceChangePercent);
              const isGain = changePercent > 0;
              const isNeutral = changePercent === 0;
              const symbol = ticker.symbol.replace('USDT', '');

              return (
                <tr 
                  key={ticker.symbol}
                  className="border-b border-border/50 hover:bg-accent/30 transition-colors group"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <td className="p-4 data-cell text-muted-foreground">
                    {index + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-lg font-mono">
                        {SYMBOL_ICONS[ticker.symbol] || symbol[0]}
                      </div>
                      <div>
                        <p className="font-medium">{symbol}</p>
                        <p className="text-xs text-muted-foreground">
                          {SYMBOL_NAMES[ticker.symbol] || symbol}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <span className="data-cell font-semibold">
                      ${formatPrice(ticker.lastPrice)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className={`flex items-center justify-end gap-1 data-cell ${
                      isNeutral ? 'text-neutral' : isGain ? 'price-gain' : 'price-loss'
                    }`}>
                      {isNeutral ? (
                        <Minus className="w-3 h-3" />
                      ) : isGain ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {formatPercent(ticker.priceChangePercent)}
                    </div>
                  </td>
                  <td className="p-4 text-right hidden md:table-cell">
                    <span className="data-cell text-muted-foreground">
                      ${formatPrice(ticker.highPrice)}
                    </span>
                  </td>
                  <td className="p-4 text-right hidden md:table-cell">
                    <span className="data-cell text-muted-foreground">
                      ${formatPrice(ticker.lowPrice)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="data-cell">
                      ${formatVolume(ticker.quoteVolume)}
                    </span>
                  </td>
                  <td className="p-4 text-right hidden lg:table-cell">
                    <div className="flex justify-end">
                      <MiniChart 
                        data={klineData[ticker.symbol] || []} 
                        isGain={isGain}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
