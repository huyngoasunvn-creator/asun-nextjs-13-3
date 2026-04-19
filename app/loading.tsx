function LoadingBlock({
  className = "",
}: {
  className?: string;
}) {
  return <div className={`animate-pulse rounded-sm bg-slate-200/80 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="space-y-4 md:space-y-6 mt-2" aria-hidden="true">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3">
        <LoadingBlock className="md:col-span-2 h-[200px] md:h-[380px]" />
        <div className="hidden md:flex flex-col gap-3">
          <LoadingBlock className="flex-1 min-h-[182px]" />
          <LoadingBlock className="flex-1 min-h-[182px]" />
        </div>
      </div>

      <div className="bg-white p-3 md:p-4 rounded-sm shadow-sm border border-slate-100 space-y-3">
        <LoadingBlock className="h-4 w-40" />
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="min-w-[210px] md:min-w-[240px] h-[85px] md:h-[95px] rounded-sm border border-slate-100 bg-slate-50 p-3 flex items-center gap-3"
            >
              <LoadingBlock className="h-full w-16 md:w-20" />
              <div className="flex-1 space-y-2">
                <LoadingBlock className="h-3 w-24" />
                <LoadingBlock className="h-3 w-32" />
                <LoadingBlock className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-3 md:p-4 rounded-sm shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex gap-2 w-full md:w-auto">
          {Array.from({ length: 4 }).map((_, index) => (
            <LoadingBlock key={index} className="h-9 w-20 md:w-24" />
          ))}
        </div>
        <LoadingBlock className="h-9 w-full md:w-64" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4">
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-sm border border-slate-100 shadow-sm overflow-hidden"
          >
            <LoadingBlock className="aspect-square w-full rounded-none" />
            <div className="p-3 space-y-2">
              <LoadingBlock className="h-2.5 w-16" />
              <LoadingBlock className="h-4 w-full" />
              <LoadingBlock className="h-4 w-5/6" />
              <LoadingBlock className="h-5 w-24" />
              <LoadingBlock className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
