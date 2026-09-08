import { createWidget, type BuilderState, type Widget, type WidgetKind } from "./builder-types";

const w = (kind: WidgetKind, patch: Partial<Widget>): Widget => ({ ...createWidget(kind), ...patch });

export const presets: Record<string, () => BuilderState> = {
  "Simple Login Form": () => ({
    win: { title: "Sign In", width: 380, height: 260, flags: "ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoCollapse" },
    selectedId: null,
    assets: [],
    widgets: [
      w("header", { label: "Welcome back" }),
      w("inputText", { label: "Username", varName: "username", width: 260 }),
      w("inputText", { label: "Password", varName: "password", width: 260, password: true }),
      w("checkbox", { label: "Remember Me", varName: "bRemember", checked: true }),
      w("button", { label: "Login", width: 120, height: 30, color: "#2f6feb" }),
      w("button", { label: "Cancel", width: 100, height: 30, sameLine: true }),
      w("text", { label: "Status: not authenticated" }),
    ],
  }),
  "Control Panel Dashboard": () => ({
    win: { title: "Control Panel", width: 520, height: 420, flags: "ImGuiWindowFlags_NoCollapse" },
    selectedId: null,
    assets: [],
    widgets: [
      w("tabbar", { label: "MainTabs", varName: "main_tabs", items: ["Aimbot", "Visuals", "Settings"] }),
      w("header", { label: "Aimbot" }),
      w("toggle", { label: "Enable Aimbot", varName: "bAimbot", checked: true }),
      w("slider", { label: "Smoothing", varName: "fSmoothing", min: 0, max: 100, value: 35, width: 300 }),
      w("slider", { label: "FOV", varName: "fFov", min: 1, max: 180, value: 90, width: 300 }),
      w("combo", { label: "Hitbox", varName: "hitboxIndex", items: ["Head", "Chest", "Nearest"], width: 220 }),
      w("header", { label: "Visuals" }),
      w("checkbox", { label: "Box ESP", varName: "bBoxEsp", checked: true }),
      w("checkbox", { label: "Skeleton", varName: "bSkeleton", sameLine: true }),
      w("colorEdit", { label: "ESP Color", varName: "espColor", color: "#4ea1ff" }),
      w("separator", {}),
      w("text", { label: "Status: idle", textColor: "#59d98a" }),
    ],
  }),
  "License Key Loader": () => ({
    win: { title: "Loader", width: 400, height: 220, flags: "ImGuiWindowFlags_NoResize" },
    selectedId: null,
    assets: [],
    widgets: [
      w("image", { label: "Logo", varName: "logo", assetKey: "logo", width: 64, height: 64 }),
      w("header", { label: "License Authentication" }),
      w("inputText", { label: "License Key", varName: "licenseKey", width: 280 }),
      w("text", { label: "HWID: %s" }),
      w("button", { label: "Authenticate", width: 150, height: 30, color: "#2f6feb" }),
      w("text", { label: "Status: awaiting key" }),
    ],
  }),
};

export const emptyState = (): BuilderState => ({
  win: { title: "ImGui Studio Window", width: 460, height: 340, flags: "ImGuiWindowFlags_None" },
  widgets: [],
  selectedId: null,
  assets: [],
});
