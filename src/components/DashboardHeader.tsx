import { Activity, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DashboardHeaderProps {
  lastUpdate: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
}

export function DashboardHeader({ lastUpdate, isLoading, onRefresh }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center cursor-help">
              <Activity className="w-5 h-5" />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Live market activity indicator</p>
          </TooltipContent>
        </Tooltip>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Crypto Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Real-time data from Binance
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {lastUpdate && (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-help">
                <span className="w-2 h-2 rounded-full bg-gain animate-pulse-subtle" />
                <span>
                  Updated {lastUpdate.toLocaleTimeString()}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Data auto-refreshes every 30 seconds</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manually refresh market data</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
