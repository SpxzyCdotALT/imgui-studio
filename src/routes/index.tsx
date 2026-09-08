import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useReducer, useRef, useState } from "react";
import {
  AlignLeft,
  Box,
  CheckSquare,
  ChevronDown,
  Circle,
  Code2,
  Columns3,
  Copy,
  Download,
  Hash,
  Heading,
  Image as ImageIcon,
  LayoutTemplate,
  Minus,
  MonitorPlay,
  MousePointerClick,
  Palette,
  SlidersHorizontal,
  SquareStack,
  Trash2,
  Type,
  Upload,
} from "lucide-react";
import { CanvasWidget } from "@/components/CanvasWidget";
import { CodeView } from "@/components/CodeView";
import { Inspector } from "@/components/Inspector";
import {
  createWidget,
  uid,
  type AssetFile,
  type BuilderState,
  type Widget,
  type WidgetKind,
  type WindowConfig,
} from "@/lib/builder-types";
import { generateRenderUI } from "@/lib/codegen";
import { exportProject } from "@/lib/exporter";
import { emptyState, presets } from "@/lib/presets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ImGui Studio 2026 — Visual Dear ImGui UI Builder & C++ Exporter" },
      {
        name: "description",
        content:
          "Design Dear ImGui desktop menus on a drag-and-drop canvas and export a ready-to-compile Visual Studio 2026 (v145) DirectX 11 C++ solution in one click.",
      },
      { property: "og:title", content: "ImGui Studio 2026 — Visual Dear ImGui UI Builder" },
      {
        property: "og:description",
        content:
          "Drag-and-drop ImGui menu designer with live C++ codegen and a zero-dependency Visual Studio 2026 project exporter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Studio,
});

type Action =
  | { type: "add"; kind: WidgetKind }
  | { type: "select"; id: string | null }
  | { type: "patch"; id: string; patch: Partial<Widget> }
  | { type: "delete"; id: string }
  | { type: "duplicate"; id: string }
  | { type: "move"; from: number; to: number }
  | { type: "window"; patch: Partial<WindowConfig> }
  | { type: "assets"; assets: AssetFile[] }
  | { type: "load"; state: BuilderState };

function reducer(state: BuilderState, action: Action): BuilderState {
  switch (action.type) {
    case "add": {
      const w = createWidget(action.kind);
      return { ...state, widgets: [...state.widgets, w], selectedId: w.id };
    }
    case "select":
      return { ...state, selectedId: action.id };
    case "patch":
      return {
        ...state,
        widgets: state.widgets.map((w) => (w.id === action.id ? { ...w, ...action.patch } : w)),
      };
    case "delete":
      return {
        ...state,
        widgets: state.widgets.filter((w) => w.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      };
    case "duplicate": {
      const i = state.widgets.findIndex((w) => w.id === action.id);
      if (i < 0) return state;
      const copy = { ...state.widgets[i], id: uid() };
      const widgets = [...state.widgets];
      widgets.splice(i + 1, 0, copy);
      return { ...state, widgets, selectedId: copy.id };
    }
    case "move": {
      const widgets = [...state.widgets];
      const [item] = widgets.splice(action.from, 1);
      widgets.splice(action.to, 0, item);
      return { ...state, widgets };
    }
    case "window":
      return { ...state, win: { ...state.win, ...action.patch } };
    case "assets":
      return { ...state, assets: action.assets };
    case "load":
      return action.state;
  }
}

const PALETTE: { group: string; items: { kind: WidgetKind; label: string; Icon: typeof Type }[] }[] = [
  {
    group: "Text",
    items: [
      { kind: "text", label: "Text", Icon: Type },
      { kind: "header", label: "Header", Icon: Heading },
      { kind: "separator", label: "Separator", Icon: Minus },
    ],
  },
  {
    group: "Inputs",
    items: [
      { kind: "inputText", label: "Text Input", Icon: AlignLeft },
      { kind: "inputInt", label: "Numeric Input", Icon: Hash },
      { kind: "checkbox", label: "Checkbox", Icon: CheckSquare },
      { kind: "radio", label: "Radio Group", Icon: Circle },
    ],
  },
  {
    group: "Interactive",
    items: [
      { kind: "button", label: "Button", Icon: MousePointerClick },
      { kind: "toggle", label: "Toggle", Icon: CheckSquare },
      { kind: "combo", label: "Combo Box", Icon: ChevronDown },
      { kind: "slider", label: "Slider", Icon: SlidersHorizontal },
      { kind: "colorEdit", label: "Color Picker", Icon: Palette },
    ],
  },
  {
    group: "Layout",
    items: [
      { kind: "child", label: "Child Window", Icon: Box },
      { kind: "tabbar", label: "Tab Bar", Icon: SquareStack },
      { kind: "group", label: "Group Box", Icon: Box },
      { kind: "columns", label: "Table / Columns", Icon: Columns3 },
    ],
  },
  { group: "Media", items: [{ kind: "image", label: "Image", Icon: ImageIcon }] },
];

function Studio() {
  const [state, dispatch] = useReducer(reducer, undefined, emptyState);
  const [tab, setTab] = useState<"canvas" | "code">("canvas");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const code = useMemo(() => generateRenderUI(state), [state]);
  const selected = state.widgets.find((w) => w.id === state.selectedId) ?? null;

  const assetUrl = (key: string) => state.assets.find((a) => a.key === key || a.name === key)?.dataUrl;

  async function onFiles(files: FileList | null) {
    if (!files) return;
    const added: AssetFile[] = [];
    for (const file of Array.from(files)) {
      const dataUrl = await new Promise<string>((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.readAsDataURL(file);
      });
      added.push({ key: file.name.replace(/\.[^.]+$/, ""), name: file.name, dataUrl });
    }
    dispatch({ type: "assets", assets: [...state.assets, ...added] });
  }

  async function handleExport() {
    setBusy(true);
    try {
      await exportProject(state, setStatus);
      setStatus("Exported ImGuiStudioProject.zip");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Export failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-ig-bg text-ig-text">
      {/* Top bar */}
      <header className="flex shrink-0 items-center gap-4 border-b border-ig-border bg-ig-panel px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Code2 className="h-5 w-5 text-ig-accent" />
          <h1 className="text-[15px] font-semibold tracking-tight">ImGui Studio 2026</h1>
          <span className="rounded border border-ig-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-ig-dim">
            v145 toolset
          </span>
        </div>

        <div className="ml-4 flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4 text-ig-dim" />
          <select
            className="rounded-md border border-ig-border bg-ig-frame px-2 py-1.5 text-[13px] outline-none"
            defaultValue=""
            onChange={(e) => {
              const p = presets[e.target.value];
              if (p) dispatch({ type: "load", state: { ...p(), assets: state.assets } });
            }}
          >
            <option value="">Presets…</option>
            {Object.keys(presets).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <button
            className="rounded-md border border-ig-border px-2.5 py-1.5 text-[13px] text-ig-dim hover:text-ig-text"
            onClick={() => dispatch({ type: "load", state: { ...emptyState(), assets: state.assets } })}
          >
            Clear
          </button>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {status && <span className="text-[12px] text-ig-dim">{status}</span>}
          <button
            onClick={handleExport}
            disabled={busy}
            className="flex items-center gap-2 rounded-md bg-ig-accent px-3.5 py-2 text-[13px] font-medium text-ig-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {busy ? "Packaging…" : "Export Visual Studio Project (.zip)"}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Palette */}
        <aside className="w-56 shrink-0 overflow-y-auto border-r border-ig-border bg-ig-panel p-3">
          <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-ig-dim">Components</h2>
          {PALETTE.map((g) => (
            <div key={g.group} className="mb-4">
              <p className="mb-1.5 text-[11px] text-ig-dim">{g.group}</p>
              <div className="space-y-1">
                {g.items.map(({ kind, label, Icon }) => (
                  <button
                    key={kind + label}
                    draggable
                    onDragStart={() => (dragIndex.current = null)}
                    onClick={() => dispatch({ type: "add", kind })}
                    className="flex w-full items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-left text-[13px] hover:border-ig-border hover:bg-ig-frame"
                  >
                    <Icon className="h-4 w-4 text-ig-dim" />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-2 border-t border-ig-border pt-3">
            <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ig-dim">Assets</h2>
            <button
              onClick={() => fileInput.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-ig-border px-2 py-2 text-[12px] text-ig-dim hover:text-ig-text"
            >
              <Upload className="h-4 w-4" /> Import png / jpg / ico
            </button>
            <input
              ref={fileInput}
              type="file"
              accept=".png,.jpg,.jpeg,.ico"
              multiple
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
            <ul className="mt-2 space-y-1">
              {state.assets.map((a) => (
                <li key={a.name} className="flex items-center gap-2 rounded bg-ig-frame px-2 py-1 text-[11px]">
                  <img src={a.dataUrl} alt="" className="h-5 w-5 rounded object-cover" />
                  <span className="truncate text-ig-dim">./assets/{a.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Center */}
        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex shrink-0 items-center gap-1 border-b border-ig-border bg-ig-panel px-3 py-1.5">
            {([["canvas", "Canvas Preview", MonitorPlay], ["code", "Generated C++", Code2]] as const).map(
              ([id, label, Icon]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] ${
                    tab === id ? "bg-ig-frame text-ig-text" : "text-ig-dim hover:text-ig-text"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ),
            )}
            <span className="ml-auto text-[12px] text-ig-dim">{state.widgets.length} elements</span>
          </div>

          {tab === "code" ? (
            <div className="min-h-0 flex-1">
              <CodeView code={code} />
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto bg-[radial-gradient(circle_at_1px_1px,#2a2a2e_1px,transparent_0)] [background-size:18px_18px] p-10">
              <div
                className="mx-auto overflow-hidden rounded-md border border-ig-border bg-ig-panel shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
                style={{ width: state.win.width }}
              >
                <div className="flex items-center justify-between bg-ig-title px-3 py-1.5">
                  <span className="text-[12px] text-ig-text">{state.win.title}</span>
                  <span className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-ig-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-ig-border" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#c94f4f]" />
                  </span>
                </div>
                <div
                  className="space-y-2 p-3.5"
                  style={{ minHeight: state.win.height }}
                  onClick={() => dispatch({ type: "select", id: null })}
                >
                  {state.widgets.length === 0 && (
                    <p className="py-16 text-center text-[12px] text-ig-dim">
                      Click a component on the left, or load a preset.
                    </p>
                  )}
                  {state.widgets.map((w, i) => (
                    <div
                      key={w.id}
                      draggable
                      onDragStart={() => (dragIndex.current = i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (dragIndex.current !== null && dragIndex.current !== i)
                          dispatch({ type: "move", from: dragIndex.current, to: i });
                        dragIndex.current = null;
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch({ type: "select", id: w.id });
                      }}
                      className={`group relative cursor-grab rounded-[4px] border px-1.5 py-1 ${
                        state.selectedId === w.id
                          ? "border-ig-accent bg-ig-accent/5"
                          : "border-transparent hover:border-ig-border"
                      } ${w.sameLine ? "-mt-1 ml-6" : ""}`}
                    >
                      <CanvasWidget w={w} assetUrl={assetUrl(w.assetKey)} />
                      <div className="absolute -top-2 right-1 hidden gap-1 group-hover:flex">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch({ type: "duplicate", id: w.id });
                          }}
                          className="rounded border border-ig-border bg-ig-frame p-1 text-ig-dim hover:text-ig-text"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch({ type: "delete", id: w.id });
                          }}
                          className="rounded border border-ig-border bg-ig-frame p-1 text-ig-dim hover:text-[#e06c6c]"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Inspector */}
        <aside className="w-72 shrink-0 border-l border-ig-border bg-ig-panel">
          <Inspector
            widget={selected}
            win={state.win}
            onChange={(patch) => selected && dispatch({ type: "patch", id: selected.id, patch })}
            onWindowChange={(patch) => dispatch({ type: "window", patch })}
          />
        </aside>
      </div>
    </div>
  );
}
