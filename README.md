# ImGui Canvas

Build a web-based visual UI builder and code generator called "ImGui Studio 2026". The application allows developers to design desktop menus using a drag-and-drop HTML canvas and export a fully configured, zero-dependency C++ Visual Studio 2026 (v145 toolset) solution in one click.

### Tech Stack & Libraries

- Framework: React + TypeScript + Tailwind CSS

- UI Components: Lucide React (icons), Radix UI / Shadcn primitives

- Archiving & Export: `jszip` and `file-saver` (for client-side ZIP compilation without backend/AI API calls)

---

### Core Application Architecture

#### 1. Visual Drag-and-Drop Editor (Figma-like Canvas)

- **Canvas Viewport**: Interactive 2D canvas styled like a native ImGui desktop window with title bar, close/minimize buttons, dark dark-gray color palette (`#1A1A1D`, `#252526`), and adjustable dimensions (width/height).

- **Component Palette**: Drag-and-drop or click-to-add elements:

  - **Text / Headers**: Static labels, headers, separator lines.

  - **Inputs**: Text Input (with password masking option), Numeric Input, Checkboxes, Radio buttons.

  - **Interactive**: Action Buttons, Toggle Switches, Combo Boxes (dropdowns), Sliders (`ImGui::SliderFloat`).

  - **Layout**: Child Windows, Tab Bars & Tab Items, Group Boxes, Columns/Table grids.

  - **Media**: Image/Icon placeholders linked to local asset keys.

- **Inspector Panel (Properties)**: When an element is selected on the canvas, allow editing:

  - Label / Text content

  - Variable name (e.g., `char username[64]`, `bool bToggle`)

  - Width, Height, SameLine toggle (`ImGui::SameLine()`)

  - Color styling (Button colors, Text colors using `ImGui::PushStyleColor`)

  - Custom ImGui flags (`ImGuiInputTextFlags_Password`, `ImGuiWindowFlags_NoResize`, etc.)

#### 2. Built-in Templates & Presets

Provide a "Presets" dropdown with 1-click layout loaders:

- **Simple Login Form**: Clean login window with Username field, Password field (masked), "Remember Me" checkbox, and "Login" button. No external API or email setup needed—uses instant local boolean state logic (`isLoggedIn = true`).

- **Cheat / Control Panel Dashboard**: Multi-tab layout ("Aimbot", "Visuals", "Settings") with sliders, toggles, color pickers, and status indicators.

- **Minimal License Key Loader**: License key input, HWID display label, and "Authenticate" button.

#### 3. Asset Manager

- File upload interface allowing users to import `.png`, `.jpg`, and `.ico` files.

- Generates C++ header bindings (`stb_image.h` integration) and stores images as relative paths (`./assets/icon.png`) for rendering via `ID3D11ShaderResourceView*`.

#### 4. Dual Live View Mode

- **Canvas Preview**: Drag, reposition, reorder, delete, and duplicate components live.

- **Generated C++ Code Viewer**: Real-time syntax-highlighted editor showing the generated `RenderUI()` function updating live as components change.

---

### One-Click Visual Studio 2026 (v145) Exporter Engine

When the user clicks **"Export Visual Studio Project (.zip)"**, use `JSZip` to bundle a complete C++ project directory containing:

1. **`ImGuiStudioProject.sln`**: Visual Studio 2026 Solution file configured for MSVC x64.

2. **`ImGuiStudioProject.vcxproj`**: XML project file explicitly configured with:

   - `<PlatformToolset>v145</PlatformToolset>` (VS 2026 default toolset).

   - DirectX 11 (`d3d11.lib`, `d3dcompiler.lib`) and Win32 dependencies.

   - Include directories pre-routed to relative `./deps/imgui/` folders.

3. **`ImGuiStudioProject.vcxproj.filters`**: Pre-configured VS solution filter structure.

4. **`deps/imgui/` Directory**: Complete embedded Dear ImGui core source files (`imgui.cpp`, `imgui.h`, `imgui_draw.cpp`, `imgui_widgets.cpp`, `imgui_tables.cpp`, `imgui_demo.cpp`) and DirectX11/Win32 backends (`imgui_impl_win32.cpp`, `imgui_impl_win32.h`, `imgui_impl_dx11.cpp`, `imgui_impl_dx11.h`).

5. **`deps/stb/stb_image.h`**: Pre-included single-header image loader.

6. **`AssetLoader.h`**: Helper function to load local PNG/JPG images into DirectX 11 textures for ImGui render calls.

7. **`main.cpp`**: A boilerplate Win32 + DirectX 11 main loop that initializes the OS window, configures ImGui dark style, runs the `RenderUI()` code generated from the canvas, and handles clean device destruction.

8. **`CMakeLists.txt`**: Alternative CMake cross-compilation file supporting CMake 3.20+.

---

### UX & Credit Optimization Rules

- Keep all state client-side using React `useState` / `useReducer` to avoid unnecessary token usage or external server API overhead.

- Ensure exported `.cpp` code is clean, idiomatic, uses standard `ImGui::` calls, and compiles out-of-the-box in Visual Studio 2026 without requiring `vcpkg` or manual library path adjustments.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://imgui-studio.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/37a1d10a-9ddb-40c1-ace0-5f3910a57a10).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
