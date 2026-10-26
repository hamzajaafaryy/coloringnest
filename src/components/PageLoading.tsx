export default function LoadingPage() {
  return (
    <div role="status" aria-label="Loading coloring pages" className="mx-auto w-full max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
      <div className="h-7 w-44 rounded-full bg-violet-100"/>
      <div className="mt-6 h-14 max-w-lg rounded-2xl bg-violet-100"/>
      <div className="mt-4 h-5 max-w-2xl rounded-xl bg-slate-100"/>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({length:8},(_,index)=>(
          <div key={index} className="overflow-hidden rounded-[1.6rem] border border-violet-50 bg-white shadow-sm">
            <div className="aspect-square bg-gradient-to-br from-violet-100 to-rose-50"/>
            <div className="space-y-2 p-4"><div className="h-5 w-3/4 rounded-lg bg-slate-100"/><div className="h-3 w-full rounded-lg bg-slate-100"/><div className="h-10 rounded-xl bg-violet-100"/></div>
          </div>
        ))}
      </div>
      <span className="sr-only">Loading creative content</span>
    </div>
  );
}
