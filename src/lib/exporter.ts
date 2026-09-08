import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { BuilderState } from "./builder-types";
import { generateRenderUI } from "./codegen";
import {
  PROJECT_NAME,
  assetLoaderH,
  cmakeLists,
  filters,
  mainCpp,
  readme,
  slnFile,
  vcxproj,
} from "./cpp-templates";

const IMGUI_TAG = "v1.91.5";
const IMGUI_BASE = `https://cdn.jsdelivr.net/gh/ocornut/imgui@${IMGUI_TAG}`;
const STB_URL = "https://cdn.jsdelivr.net/gh/nothings/stb@master/stb_image.h";

const IMGUI_FILES = [
  "imgui.cpp",
  "imgui.h",
  "imgui_internal.h",
  "imgui_draw.cpp",
  "imgui_widgets.cpp",
  "imgui_tables.cpp",
  "imgui_demo.cpp",
  "imconfig.h",
  "imstb_rectpack.h",
  "imstb_textedit.h",
  "imstb_truetype.h",
  "backends/imgui_impl_win32.cpp",
  "backends/imgui_impl_win32.h",
  "backends/imgui_impl_dx11.cpp",
  "backends/imgui_impl_dx11.h",
];

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}`);
  return res.text();
}

function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const bin = atob(base64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function exportProject(
  state: BuilderState,
  onProgress?: (msg: string) => void,
): Promise<void> {
  const zip = new JSZip();
  const root = zip.folder(PROJECT_NAME)!;

  onProgress?.("Generating C++ sources...");
  root.file("UI.h", generateRenderUI(state));
  root.file("main.cpp", mainCpp(state.win.title, state.win.width, state.win.height));
  root.file("AssetLoader.h", assetLoaderH);
  root.file(`${PROJECT_NAME}.sln`, slnFile);
  root.file(`${PROJECT_NAME}.vcxproj`, vcxproj);
  root.file(`${PROJECT_NAME}.vcxproj.filters`, filters);
  root.file("CMakeLists.txt", cmakeLists);
  root.file("README.md", readme(PROJECT_NAME));
  root.file("studio-layout.json", JSON.stringify({ win: state.win, widgets: state.widgets }, null, 2));

  onProgress?.("Downloading Dear ImGui sources...");
  const imgui = root.folder("deps")!.folder("imgui")!;
  const results = await Promise.all(
    IMGUI_FILES.map(async (f) => ({ f, text: await fetchText(`${IMGUI_BASE}/${f}`) })),
  );
  for (const { f, text } of results) imgui.file(f, text);
  imgui.file("LICENSE.txt", await fetchText(`${IMGUI_BASE}/LICENSE.txt`));

  onProgress?.("Downloading stb_image...");
  root.folder("deps")!.folder("stb")!.file("stb_image.h", await fetchText(STB_URL));

  if (state.assets.length) {
    onProgress?.("Packing assets...");
    const assets = root.folder("assets")!;
    for (const a of state.assets) assets.file(a.name, dataUrlToBytes(a.dataUrl));
  }

  onProgress?.("Compressing archive...");
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  saveAs(blob, `${PROJECT_NAME}.zip`);
  onProgress?.("Done");
}
