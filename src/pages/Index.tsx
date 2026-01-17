import { useQuery } from '@tanstack/react-query';
import { fetch24hrTickers } from '@/services/binanceApi';
import { DashboardHeader } from '@/components/DashboardHeader';
import { MarketStats } from '@/components/MarketStats';
import { CryptoTable } from '@/components/CryptoTable';
import { PriceChart } from '@/components/PriceChart';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';

const Index = () => {
  const { 
    data: tickers, 
    isLoading, 
    error, 
    refetch,
    dataUpdatedAt 
  } = useQuery({
    queryKey: ['tickers'],
    queryFn: fetch24hrTickers,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  });

  const lastUpdate = dataUpdatedAt ? new Date(dataUpdatedAt) : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-8 px-4">
        <DashboardHeader 
          lastUpdate={lastUpdate}
          isLoading={isLoading}
          onRefresh={() => refetch()}
        />

        {error && (
          <div className="glass-card rounded-lg p-6 mb-6 border-loss/50">
            <p className="text-loss-foreground">
              Failed to load market data. Please try again.
            </p>
          </div>
        )}

        {isLoading && !tickers ? (
          <LoadingSkeleton />
        ) : tickers ? (
          <div className="space-y-6">
            <MarketStats tickers={tickers} />
            <PriceChart />
            <CryptoTable tickers={tickers} />
          </div>
        ) : null}

        <footer className="mt-12 pt-6 border-t border-border">
          <p className="text-center text-sm text-muted-foreground">
            Data provided by Binance API • Prices in USDT
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
