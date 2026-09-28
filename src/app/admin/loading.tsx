const skeletonItems = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"];

export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#F7F8FC_0%,#F5F7FF_48%,#F1F3FA_100%)] px-3 pb-8 pt-3 font-sans sm:px-5 sm:pb-10">
      <section className="mx-auto grid max-w-[1480px] gap-4 xl:grid-cols-[16rem_minmax(0,1fr)]">

        {/* Sidebar skeleton */}
        <aside className="overflow-hidden rounded-3xl border border-white/55 bg-white/[0.65] shadow-[0_8px_32px_rgba(0,113,194,0.08)] backdrop-blur-2xl xl:sticky xl:top-4 xl:self-start">
          {/* Logo area */}
          <div className="border-b border-white/55 px-4 py-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-2xl bg-[#0071c2]/20" />
              <div className="space-y-2">
                <div className="h-2.5 w-20 animate-pulse rounded bg-[#0071c2]/15" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-2.5 w-32 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          </div>

          {/* Nav items */}
          <div className="grid gap-2 px-3 py-3">
            {skeletonItems.map((item) => (
              <div key={item} className="h-9 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>

          {/* Stats */}
          <div className="border-t border-white/55 px-4 py-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="h-2.5 w-12 animate-pulse rounded bg-[#0071c2]/15" />
              <div className="h-5 w-10 animate-pulse rounded-full bg-emerald-100" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["x", "y", "z"].map((s) => (
                <div key={s} className="h-12 animate-pulse rounded-2xl border border-white/55 bg-white/55" />
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="border-t border-white/55 px-4 py-4">
            <div className="h-9 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </aside>

        {/* Content skeleton */}
        <div className="space-y-4">
          {/* ViewHeader / search bar area */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-[0_2px_12px_rgba(0,113,194,0.06)]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-xl bg-[#0071c2]/15" />
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-48 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
            <div className="h-8 w-28 animate-pulse rounded-xl bg-slate-100" />
          </div>

          {/* Metric cards row */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {["a", "b", "c", "d"].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,113,194,0.06)]"
              />
            ))}
          </div>

          {/* Main content panels */}
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
            <div className="h-72 animate-pulse rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,113,194,0.06)]" />
            <div className="h-72 animate-pulse rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,113,194,0.06)]" />
          </div>
        </div>

      </section>
    </main>
  );
}
