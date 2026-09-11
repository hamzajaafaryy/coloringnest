interface AdPlaceholderProps {
  slotName?: string;
  format?: "banner" | "rectangle" | "horizontal";
  className?: string;
}

export default function AdPlaceholder({
  slotName = "Ad Space",
  format = "horizontal",
  className = "",
}: AdPlaceholderProps) {
  const formatClasses = {
    banner: "h-24 max-w-4xl",
    rectangle: "h-64 max-w-sm",
    horizontal: "h-32 max-w-5xl",
  };

  return (
    <div
      className={`my-8 mx-auto w-full ${formatClasses[format]} bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center text-slate-400 text-xs ${className}`}
      aria-hidden="true"
    >
      <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">
        Advertisement
      </span>
      <span className="mt-1 text-slate-400 font-sans">{slotName}</span>
    </div>
  );
}
