import type { Widget } from "@/lib/builder-types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {children}
      <span className="text-[12px] text-ig-text">{label}</span>
    </div>
  );
}

export function CanvasWidget({ w, assetUrl }: { w: Widget; assetUrl?: string }) {
  const frame = "rounded-[3px] border border-ig-border bg-ig-frame px-2 py-[3px] text-[12px] text-ig-text";
  switch (w.kind) {
    case "text":
      return <div className="text-[12px]" style={{ color: w.textColor ?? undefined }}>{w.label}</div>;
    case "header":
      return (
        <div className="w-full">
          <div className="text-[12px] font-semibold text-ig-text">{w.label}</div>
          <div className="mt-1 h-px w-full bg-ig-border" />
        </div>
      );
    case "separator":
      return <div className="h-px w-full bg-ig-border" />;
    case "inputText":
      return (
        <Row label={w.label}>
          <div className={frame} style={{ width: w.width }}>
            {w.password ? "••••••••" : <span className="text-ig-dim">text</span>}
          </div>
        </Row>
      );
    case "inputInt":
      return (
        <Row label={w.label}>
          <div className={frame} style={{ width: w.width }}>0</div>
        </Row>
      );
    case "checkbox":
    case "toggle":
      return (
        <Row label={w.label}>
          <span className="grid h-[15px] w-[15px] place-items-center rounded-[3px] border border-ig-border bg-ig-frame text-[10px] text-ig-accent">
            {w.checked ? "✓" : ""}
          </span>
        </Row>
      );
    case "radio":
      return (
        <div className="flex flex-wrap items-center gap-3">
          {w.items.map((it, i) => (
            <Row key={it + i} label={it}>
              <span className="grid h-[14px] w-[14px] place-items-center rounded-full border border-ig-border bg-ig-frame">
                {i === 0 && <span className="h-[6px] w-[6px] rounded-full bg-ig-accent" />}
              </span>
            </Row>
          ))}
        </div>
      );
    case "button":
      return (
        <div
          className="grid place-items-center rounded-[3px] border border-ig-border text-[12px] text-ig-text"
          style={{ width: w.width, height: w.height, background: w.color ?? undefined }}
        >
          {w.label}
        </div>
      );
    case "combo":
      return (
        <Row label={w.label}>
          <div className={`${frame} flex items-center justify-between`} style={{ width: w.width }}>
            <span>{w.items[0] ?? "—"}</span>
            <span className="text-ig-dim">▾</span>
          </div>
        </Row>
      );
    case "slider": {
      const pct = ((w.value - w.min) / Math.max(1, w.max - w.min)) * 100;
      return (
        <Row label={w.label}>
          <div className="relative h-[18px] rounded-[3px] border border-ig-border bg-ig-frame" style={{ width: w.width }}>
            <div className="absolute inset-y-[2px] w-[10px] rounded-[2px] bg-ig-accent" style={{ left: `calc(${pct}% - 5px)` }} />
            <span className="absolute inset-0 grid place-items-center text-[11px] text-ig-text">{w.value.toFixed(2)}</span>
          </div>
        </Row>
      );
    }
    case "colorEdit":
      return (
        <Row label={w.label}>
          <span className="h-[16px] w-[28px] rounded-[3px] border border-ig-border" style={{ background: w.color ?? "#fff" }} />
        </Row>
      );
    case "child":
    case "group":
      return (
        <div
          className="rounded-[3px] border border-ig-border bg-ig-child p-2 text-[11px] text-ig-dim"
          style={{ width: w.width, height: w.height }}
        >
          {w.label}
        </div>
      );
    case "tabbar":
      return (
        <div className="w-full border-b border-ig-border">
          <div className="flex gap-1">
            {w.items.map((t, i) => (
              <span
                key={t}
                className={`rounded-t-[3px] px-3 py-1 text-[12px] ${i === 0 ? "bg-ig-frame text-ig-text" : "text-ig-dim"}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      );
    case "columns":
      return (
        <div className="w-full overflow-hidden rounded-[3px] border border-ig-border text-[11px]">
          <div className="flex bg-ig-frame">
            {w.items.map((c) => (
              <span key={c} className="flex-1 border-r border-ig-border px-2 py-1 text-ig-text last:border-r-0">{c}</span>
            ))}
          </div>
          <div className="flex">
            {w.items.map((c) => (
              <span key={c} className="flex-1 border-r border-ig-border px-2 py-1 text-ig-dim last:border-r-0">--</span>
            ))}
          </div>
        </div>
      );
    case "image":
      return assetUrl ? (
        <img src={assetUrl} alt={w.label} style={{ width: w.width, height: w.height }} className="rounded-[3px] object-contain" />
      ) : (
        <div
          className="grid place-items-center rounded-[3px] border border-dashed border-ig-border text-[11px] text-ig-dim"
          style={{ width: w.width, height: w.height }}
        >
          {w.assetKey || "image"}
        </div>
      );
    default:
      return null;
  }
}
