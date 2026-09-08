import type { BuilderState, Widget } from "./builder-types";

const sanitize = (s: string) => s.replace(/[^A-Za-z0-9_]/g, "_");
const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

function hexToVec4(hex: string, alpha = 1) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return `ImVec4(${r.toFixed(3)}f, ${g.toFixed(3)}f, ${b.toFixed(3)}f, ${alpha.toFixed(2)}f)`;
}

export function generateStateBlock(state: BuilderState): string {
  const lines: string[] = [];
  for (const w of state.widgets) {
    const v = sanitize(w.varName || "");
    if (!v) continue;
    switch (w.kind) {
      case "inputText":
        lines.push(`static char ${v}[128] = "";`);
        break;
      case "inputInt":
        lines.push(`static int ${v} = 0;`);
        break;
      case "checkbox":
      case "toggle":
        lines.push(`static bool ${v} = ${w.checked ? "true" : "false"};`);
        break;
      case "radio":
      case "combo":
        lines.push(`static int ${v} = 0;`);
        break;
      case "slider":
        lines.push(`static float ${v} = ${w.value.toFixed(2)}f;`);
        break;
      case "colorEdit":
        lines.push(`static float ${v}[4] = { ${(() => {
          const h = (w.color || "#ffffff").replace("#", "");
          return [0, 2, 4]
            .map((i) => (parseInt(h.slice(i, i + 2), 16) / 255).toFixed(3) + "f")
            .join(", ");
        })()}, 1.00f };`);
        break;
      case "image":
        lines.push(`static ID3D11ShaderResourceView* tex_${v} = nullptr; // ./assets/${w.assetKey || v}`);
        break;
      default:
        break;
    }
  }
  return lines.length ? lines.join("\n    ") : "// no persistent state";
}

function widgetCall(w: Widget, indent: string): string {
  const v = sanitize(w.varName || "unnamed");
  const L = esc(w.label);
  const out: string[] = [];
  if (w.sameLine) out.push(`ImGui::SameLine();`);

  const pushes: string[] = [];
  if (w.textColor) pushes.push(`ImGui::PushStyleColor(ImGuiCol_Text, ${hexToVec4(w.textColor)});`);
  if (w.color && w.kind !== "colorEdit") {
    pushes.push(`ImGui::PushStyleColor(ImGuiCol_Button, ${hexToVec4(w.color)});`);
    pushes.push(`ImGui::PushStyleColor(ImGuiCol_FrameBg, ${hexToVec4(w.color)});`);
  }
  out.push(...pushes);

  const extra = w.flags.trim();
  const flagArg = (base: string) => (extra ? `${base} | ${extra}` : base);
  const widthLine = () => `ImGui::SetNextItemWidth(${w.width}.0f);`;

  switch (w.kind) {
    case "text":
      out.push(`ImGui::TextUnformatted("${L}");`);
      break;
    case "header":
      out.push(`ImGui::SeparatorText("${L}");`);
      break;
    case "separator":
      out.push(`ImGui::Separator();`);
      break;
    case "inputText":
      out.push(widthLine());
      out.push(
        `ImGui::InputText("${L}", ${v}, IM_ARRAYSIZE(${v})${
          w.password ? `, ${flagArg("ImGuiInputTextFlags_Password")}` : extra ? `, ${extra}` : ""
        });`,
      );
      break;
    case "inputInt":
      out.push(widthLine());
      out.push(`ImGui::InputInt("${L}", &${v});`);
      break;
    case "checkbox":
      out.push(`ImGui::Checkbox("${L}", &${v});`);
      break;
    case "toggle":
      out.push(`ImGui::Checkbox("${L}", &${v}); // toggle`);
      break;
    case "radio":
      w.items.forEach((it, i) => {
        out.push(`ImGui::RadioButton("${esc(it)}", &${v}, ${i});${i < w.items.length - 1 ? " ImGui::SameLine();" : ""}`);
      });
      break;
    case "button":
      out.push(`if (ImGui::Button("${L}", ImVec2(${w.width}.0f, ${w.height}.0f)))`);
      out.push(`{`);
      out.push(`    // TODO: handle "${L}" click`);
      out.push(`}`);
      break;
    case "combo": {
      const arr = `${v}_items`;
      out.push(`static const char* ${arr}[] = { ${w.items.map((i) => `"${esc(i)}"`).join(", ")} };`);
      out.push(widthLine());
      out.push(`ImGui::Combo("${L}", &${v}, ${arr}, IM_ARRAYSIZE(${arr}));`);
      break;
    }
    case "slider":
      out.push(widthLine());
      out.push(`ImGui::SliderFloat("${L}", &${v}, ${w.min.toFixed(2)}f, ${w.max.toFixed(2)}f, "%.2f");`);
      break;
    case "colorEdit":
      out.push(`ImGui::ColorEdit4("${L}", ${v});`);
      break;
    case "child":
      out.push(`ImGui::BeginChild("${L}", ImVec2(${w.width}.0f, ${w.height}.0f), true);`);
      out.push(`{`);
      out.push(`    ImGui::TextUnformatted("${L} content");`);
      out.push(`}`);
      out.push(`ImGui::EndChild();`);
      break;
    case "group":
      out.push(`ImGui::BeginGroup();`);
      out.push(`{`);
      out.push(`    ImGui::TextUnformatted("${L}");`);
      out.push(`}`);
      out.push(`ImGui::EndGroup();`);
      break;
    case "tabbar":
      out.push(`if (ImGui::BeginTabBar("${L}"))`);
      out.push(`{`);
      for (const t of w.items) {
        out.push(`    if (ImGui::BeginTabItem("${esc(t)}"))`);
        out.push(`    {`);
        out.push(`        ImGui::TextUnformatted("${esc(t)} page");`);
        out.push(`        ImGui::EndTabItem();`);
        out.push(`    }`);
      }
      out.push(`    ImGui::EndTabBar();`);
      out.push(`}`);
      break;
    case "columns":
      out.push(`if (ImGui::BeginTable("${L}", ${Math.max(1, w.items.length)}, ImGuiTableFlags_Borders | ImGuiTableFlags_RowBg))`);
      out.push(`{`);
      for (const c of w.items) out.push(`    ImGui::TableSetupColumn("${esc(c)}");`);
      out.push(`    ImGui::TableHeadersRow();`);
      out.push(`    ImGui::TableNextRow();`);
      w.items.forEach((_, i) => {
        out.push(`    ImGui::TableSetColumnIndex(${i}); ImGui::TextUnformatted("--");`);
      });
      out.push(`    ImGui::EndTable();`);
      out.push(`}`);
      break;
    case "image":
      out.push(`if (tex_${v}) ImGui::Image((ImTextureID)tex_${v}, ImVec2(${w.width}.0f, ${w.height}.0f));`);
      out.push(`else ImGui::TextDisabled("[image: ${esc(w.assetKey || w.label)}]");`);
      break;
  }

  if (pushes.length) out.push(`ImGui::PopStyleColor(${pushes.length});`);
  return out.map((l) => indent + l).join("\n");
}

export function generateRenderUI(state: BuilderState): string {
  const flags = state.win.flags.trim() || "ImGuiWindowFlags_None";
  const body = state.widgets.length
    ? state.widgets.map((w) => widgetCall(w, "        ")).join("\n\n")
    : "        ImGui::TextDisabled(\"Add widgets in ImGui Studio 2026\");";

  return `// -----------------------------------------------------------------------------
// Generated by ImGui Studio 2026 - do not hand-edit above the marker.
// -----------------------------------------------------------------------------
#pragma once
#include "imgui.h"
#include <d3d11.h>

inline void RenderUI()
{
    ${generateStateBlock(state)}

    ImGui::SetNextWindowSize(ImVec2(${state.win.width}.0f, ${state.win.height}.0f), ImGuiCond_FirstUseEver);
    if (ImGui::Begin("${esc(state.win.title)}", nullptr, ${flags}))
    {
${body}
    }
    ImGui::End();
}
`;
}
