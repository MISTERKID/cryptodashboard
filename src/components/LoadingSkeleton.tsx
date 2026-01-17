export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-lg p-4">
            <div className="h-4 w-20 bg-muted rounded shimmer mb-2" />
            <div className="h-8 w-24 bg-muted rounded shimmer" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="flex gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 w-20 bg-muted rounded shimmer" />
            ))}
          </div>
        </div>
        {[...Array(8)].map((_, i) => (
          <div key={i} className="p-4 border-b border-border/50 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-muted shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-muted rounded shimmer" />
              <div className="h-3 w-16 bg-muted rounded shimmer" />
            </div>
            <div className="h-4 w-20 bg-muted rounded shimmer" />
            <div className="h-4 w-16 bg-muted rounded shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
}
