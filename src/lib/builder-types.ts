export type WidgetKind =
  | "text"
  | "header"
  | "separator"
  | "inputText"
  | "inputInt"
  | "checkbox"
  | "radio"
  | "button"
  | "toggle"
  | "combo"
  | "slider"
  | "colorEdit"
  | "child"
  | "tabbar"
  | "group"
  | "columns"
  | "image";

export interface Widget {
  id: string;
  kind: WidgetKind;
  label: string;
  varName: string;
  width: number;
  height: number;
  sameLine: boolean;
  password: boolean;
  items: string[];
  min: number;
  max: number;
  value: number;
  checked: boolean;
  color: string | null;
  textColor: string | null;
  flags: string;
  assetKey: string;
}

export interface WindowConfig {
  title: string;
  width: number;
  height: number;
  flags: string;
}

export interface AssetFile {
  key: string;
  name: string;
  dataUrl: string;
}

export interface BuilderState {
  win: WindowConfig;
  widgets: Widget[];
  selectedId: string | null;
  assets: AssetFile[];
}

let counter = 0;
export const uid = () => `w${Date.now().toString(36)}${(counter++).toString(36)}`;

export const widgetDefaults: Record<WidgetKind, Partial<Widget>> = {
  text: { label: "Static text", varName: "" },
  header: { label: "Section Header", varName: "" },
  separator: { label: "Separator", varName: "" },
  inputText: { label: "Username", varName: "username", width: 220 },
  inputInt: { label: "Amount", varName: "amount", width: 160 },
  checkbox: { label: "Remember Me", varName: "bRemember" },
  radio: { label: "Option", varName: "radioIndex", items: ["First", "Second"] },
  button: { label: "Login", varName: "", width: 120, height: 28 },
  toggle: { label: "Enabled", varName: "bEnabled" },
  combo: { label: "Mode", varName: "modeIndex", items: ["Normal", "Legit", "Rage"], width: 200 },
  slider: { label: "Smoothing", varName: "fSmoothing", min: 0, max: 100, value: 35, width: 220 },
  colorEdit: { label: "Accent", varName: "accentColor", color: "#4ea1ff" },
  child: { label: "Child Window", varName: "child_panel", width: 260, height: 120 },
  tabbar: { label: "MainTabs", varName: "main_tabs", items: ["Aimbot", "Visuals", "Settings"] },
  group: { label: "Group", varName: "group_box", width: 240, height: 100 },
  columns: { label: "Table", varName: "grid", items: ["Name", "Value"] },
  image: { label: "Logo", varName: "logo", width: 96, height: 96, assetKey: "logo" },
};

export function createWidget(kind: WidgetKind): Widget {
  return {
    id: uid(),
    kind,
    label: kind,
    varName: "",
    width: 200,
    height: 24,
    sameLine: false,
    password: false,
    items: [],
    min: 0,
    max: 100,
    value: 50,
    checked: false,
    color: null,
    textColor: null,
    flags: "",
    assetKey: "",
    ...widgetDefaults[kind],
  } as Widget;
}
