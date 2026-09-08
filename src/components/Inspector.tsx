import type { Widget, WindowConfig } from "@/lib/builder-types";

const field = "w-full rounded-md border border-ig-border bg-ig-frame px-2 py-1.5 text-[13px] text-ig-text outline-none focus:border-ig-accent";
const labelCls = "mb-1 block text-[11px] uppercase tracking-wide text-ig-dim";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

const HAS_VAR = ["inputText", "inputInt", "checkbox", "toggle", "radio", "combo", "slider", "colorEdit", "image"];
const HAS_ITEMS = ["radio", "combo", "tabbar", "columns"];
const HAS_SIZE = ["button", "child", "group", "image"];
const HAS_WIDTH = ["inputText", "inputInt", "combo", "slider"];

export function Inspector({
  widget,
  win,
  onChange,
  onWindowChange,
}: {
  widget: Widget | null;
  win: WindowConfig;
  onChange: (patch: Partial<Widget>) => void;
  onWindowChange: (patch: Partial<WindowConfig>) => void;
}) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <section className="space-y-3">
        <h3 className="text-[12px] font-semibold uppercase tracking-wider text-ig-dim">Window</h3>
        <F label="Title">
          <input className={field} value={win.title} onChange={(e) => onWindowChange({ title: e.target.value })} />
        </F>
        <div className="grid grid-cols-2 gap-2">
          <F label="Width">
            <input type="number" className={field} value={win.width} onChange={(e) => onWindowChange({ width: +e.target.value })} />
          </F>
          <F label="Height">
            <input type="number" className={field} value={win.height} onChange={(e) => onWindowChange({ height: +e.target.value })} />
          </F>
        </div>
        <F label="Window flags">
          <input className={field} value={win.flags} onChange={(e) => onWindowChange({ flags: e.target.value })} placeholder="ImGuiWindowFlags_NoResize" />
        </F>
      </section>

      <div className="h-px bg-ig-border" />

      {!widget ? (
        <p className="text-[13px] text-ig-dim">Select an element on the canvas to edit its properties.</p>
      ) : (
        <section className="space-y-3">
          <h3 className="text-[12px] font-semibold uppercase tracking-wider text-ig-dim">
            {widget.kind} properties
          </h3>
          <F label="Label / text">
            <input className={field} value={widget.label} onChange={(e) => onChange({ label: e.target.value })} />
          </F>

          {HAS_VAR.includes(widget.kind) && (
            <F label="Variable name">
              <input className={field} value={widget.varName} onChange={(e) => onChange({ varName: e.target.value })} />
            </F>
          )}

          {HAS_ITEMS.includes(widget.kind) && (
            <F label="Items (comma separated)">
              <input
                className={field}
                value={widget.items.join(", ")}
                onChange={(e) => onChange({ items: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
              />
            </F>
          )}

          {(HAS_SIZE.includes(widget.kind) || HAS_WIDTH.includes(widget.kind)) && (
            <div className="grid grid-cols-2 gap-2">
              <F label="Width">
                <input type="number" className={field} value={widget.width} onChange={(e) => onChange({ width: +e.target.value })} />
              </F>
              {HAS_SIZE.includes(widget.kind) && (
                <F label="Height">
                  <input type="number" className={field} value={widget.height} onChange={(e) => onChange({ height: +e.target.value })} />
                </F>
              )}
            </div>
          )}

          {widget.kind === "slider" && (
            <div className="grid grid-cols-3 gap-2">
              <F label="Min">
                <input type="number" className={field} value={widget.min} onChange={(e) => onChange({ min: +e.target.value })} />
              </F>
              <F label="Max">
                <input type="number" className={field} value={widget.max} onChange={(e) => onChange({ max: +e.target.value })} />
              </F>
              <F label="Value">
                <input type="number" className={field} value={widget.value} onChange={(e) => onChange({ value: +e.target.value })} />
              </F>
            </div>
          )}

          {widget.kind === "image" && (
            <F label="Asset key (./assets/…)">
              <input className={field} value={widget.assetKey} onChange={(e) => onChange({ assetKey: e.target.value })} />
            </F>
          )}

          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-[13px] text-ig-text">
              <input type="checkbox" checked={widget.sameLine} onChange={(e) => onChange({ sameLine: e.target.checked })} />
              SameLine()
            </label>
            {widget.kind === "inputText" && (
              <label className="flex items-center gap-2 text-[13px] text-ig-text">
                <input type="checkbox" checked={widget.password} onChange={(e) => onChange({ password: e.target.checked })} />
                Password
              </label>
            )}
            {(widget.kind === "checkbox" || widget.kind === "toggle") && (
              <label className="flex items-center gap-2 text-[13px] text-ig-text">
                <input type="checkbox" checked={widget.checked} onChange={(e) => onChange({ checked: e.target.checked })} />
                Default on
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <F label="Element color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-8 w-10 rounded border border-ig-border bg-ig-frame"
                  value={widget.color ?? "#2f6feb"}
                  onChange={(e) => onChange({ color: e.target.value })}
                />
                <button className="text-[11px] text-ig-dim hover:text-ig-text" onClick={() => onChange({ color: null })}>
                  clear
                </button>
              </div>
            </F>
            <F label="Text color">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  className="h-8 w-10 rounded border border-ig-border bg-ig-frame"
                  value={widget.textColor ?? "#e4e4e7"}
                  onChange={(e) => onChange({ textColor: e.target.value })}
                />
                <button className="text-[11px] text-ig-dim hover:text-ig-text" onClick={() => onChange({ textColor: null })}>
                  clear
                </button>
              </div>
            </F>
          </div>

          <F label="Custom ImGui flags">
            <input
              className={field}
              value={widget.flags}
              onChange={(e) => onChange({ flags: e.target.value })}
              placeholder="ImGuiInputTextFlags_CharsNoBlank"
            />
          </F>
        </section>
      )}
    </div>
  );
}
