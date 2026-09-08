export const PROJECT_NAME = "ImGuiStudioProject";
const GUID = "{B7A1F3D2-9C41-4E58-A0D9-3F1E7C5B9A21}";

export const slnFile = `Microsoft Visual Studio Solution File, Format Version 12.00
# Visual Studio Version 18
VisualStudioVersion = 18.0.34000.0
MinimumVisualStudioVersion = 10.0.40219.1
Project("{8BC9CEB8-8B4A-11D0-8D11-00A0C91BC942}") = "${PROJECT_NAME}", "${PROJECT_NAME}.vcxproj", "${GUID}"
EndProject
Global
\tGlobalSection(SolutionConfigurationPlatforms) = preSolution
\t\tDebug|x64 = Debug|x64
\t\tRelease|x64 = Release|x64
\tEndGlobalSection
\tGlobalSection(ProjectConfigurationPlatforms) = postSolution
\t\t${GUID}.Debug|x64.ActiveCfg = Debug|x64
\t\t${GUID}.Debug|x64.Build.0 = Debug|x64
\t\t${GUID}.Release|x64.ActiveCfg = Release|x64
\t\t${GUID}.Release|x64.Build.0 = Release|x64
\tEndGlobalSection
\tGlobalSection(SolutionProperties) = preSolution
\t\tHideSolutionNode = FALSE
\tEndGlobalSection
EndGlobal
`;

const imguiSources = [
  "deps\\imgui\\imgui.cpp",
  "deps\\imgui\\imgui_draw.cpp",
  "deps\\imgui\\imgui_widgets.cpp",
  "deps\\imgui\\imgui_tables.cpp",
  "deps\\imgui\\imgui_demo.cpp",
  "deps\\imgui\\backends\\imgui_impl_win32.cpp",
  "deps\\imgui\\backends\\imgui_impl_dx11.cpp",
];

export const vcxproj = `<?xml version="1.0" encoding="utf-8"?>
<Project DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <ItemGroup Label="ProjectConfigurations">
    <ProjectConfiguration Include="Debug|x64">
      <Configuration>Debug</Configuration>
      <Platform>x64</Platform>
    </ProjectConfiguration>
    <ProjectConfiguration Include="Release|x64">
      <Configuration>Release</Configuration>
      <Platform>x64</Platform>
    </ProjectConfiguration>
  </ItemGroup>
  <PropertyGroup Label="Globals">
    <VCProjectVersion>18.0</VCProjectVersion>
    <ProjectGuid>${GUID}</ProjectGuid>
    <RootNamespace>${PROJECT_NAME}</RootNamespace>
    <WindowsTargetPlatformVersion>10.0</WindowsTargetPlatformVersion>
  </PropertyGroup>
  <Import Project="$(VCTargetsPath)\\Microsoft.Cpp.Default.props" />
  <PropertyGroup Condition="'$(Configuration)'=='Debug'" Label="Configuration">
    <ConfigurationType>Application</ConfigurationType>
    <UseDebugLibraries>true</UseDebugLibraries>
    <PlatformToolset>v145</PlatformToolset>
    <CharacterSet>Unicode</CharacterSet>
  </PropertyGroup>
  <PropertyGroup Condition="'$(Configuration)'=='Release'" Label="Configuration">
    <ConfigurationType>Application</ConfigurationType>
    <UseDebugLibraries>false</UseDebugLibraries>
    <WholeProgramOptimization>true</WholeProgramOptimization>
    <PlatformToolset>v145</PlatformToolset>
    <CharacterSet>Unicode</CharacterSet>
  </PropertyGroup>
  <Import Project="$(VCTargetsPath)\\Microsoft.Cpp.props" />
  <PropertyGroup>
    <OutDir>$(SolutionDir)bin\\$(Platform)\\$(Configuration)\\</OutDir>
    <IntDir>$(SolutionDir)obj\\$(Platform)\\$(Configuration)\\</IntDir>
  </PropertyGroup>
  <ItemDefinitionGroup>
    <ClCompile>
      <LanguageStandard>stdcpp17</LanguageStandard>
      <WarningLevel>Level3</WarningLevel>
      <SDLCheck>true</SDLCheck>
      <AdditionalIncludeDirectories>$(ProjectDir);$(ProjectDir)deps\\imgui;$(ProjectDir)deps\\imgui\\backends;$(ProjectDir)deps\\stb;%(AdditionalIncludeDirectories)</AdditionalIncludeDirectories>
      <PreprocessorDefinitions>_CRT_SECURE_NO_WARNINGS;UNICODE;_UNICODE;%(PreprocessorDefinitions)</PreprocessorDefinitions>
      <MultiProcessorCompilation>true</MultiProcessorCompilation>
    </ClCompile>
    <Link>
      <SubSystem>Windows</SubSystem>
      <AdditionalDependencies>d3d11.lib;d3dcompiler.lib;dxgi.lib;dwmapi.lib;user32.lib;gdi32.lib;shell32.lib;%(AdditionalDependencies)</AdditionalDependencies>
      <GenerateDebugInformation>true</GenerateDebugInformation>
    </Link>
  </ItemDefinitionGroup>
  <ItemGroup>
    <ClCompile Include="main.cpp" />
${imguiSources.map((s) => `    <ClCompile Include="${s}" />`).join("\n")}
  </ItemGroup>
  <ItemGroup>
    <ClInclude Include="UI.h" />
    <ClInclude Include="AssetLoader.h" />
  </ItemGroup>
  <Import Project="$(VCTargetsPath)\\Microsoft.Cpp.targets" />
</Project>
`;

export const filters = `<?xml version="1.0" encoding="utf-8"?>
<Project ToolsVersion="4.0" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <ItemGroup>
    <Filter Include="App"><UniqueIdentifier>{11111111-1111-1111-1111-111111111111}</UniqueIdentifier></Filter>
    <Filter Include="ImGui"><UniqueIdentifier>{22222222-2222-2222-2222-222222222222}</UniqueIdentifier></Filter>
    <Filter Include="ImGui\\Backends"><UniqueIdentifier>{33333333-3333-3333-3333-333333333333}</UniqueIdentifier></Filter>
  </ItemGroup>
  <ItemGroup>
    <ClCompile Include="main.cpp"><Filter>App</Filter></ClCompile>
    <ClCompile Include="deps\\imgui\\imgui.cpp"><Filter>ImGui</Filter></ClCompile>
    <ClCompile Include="deps\\imgui\\imgui_draw.cpp"><Filter>ImGui</Filter></ClCompile>
    <ClCompile Include="deps\\imgui\\imgui_widgets.cpp"><Filter>ImGui</Filter></ClCompile>
    <ClCompile Include="deps\\imgui\\imgui_tables.cpp"><Filter>ImGui</Filter></ClCompile>
    <ClCompile Include="deps\\imgui\\imgui_demo.cpp"><Filter>ImGui</Filter></ClCompile>
    <ClCompile Include="deps\\imgui\\backends\\imgui_impl_win32.cpp"><Filter>ImGui\\Backends</Filter></ClCompile>
    <ClCompile Include="deps\\imgui\\backends\\imgui_impl_dx11.cpp"><Filter>ImGui\\Backends</Filter></ClCompile>
  </ItemGroup>
  <ItemGroup>
    <ClInclude Include="UI.h"><Filter>App</Filter></ClInclude>
    <ClInclude Include="AssetLoader.h"><Filter>App</Filter></ClInclude>
  </ItemGroup>
</Project>
`;

export const cmakeLists = `cmake_minimum_required(VERSION 3.20)
project(${PROJECT_NAME} CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(\${PROJECT_NAME} WIN32
    main.cpp
    deps/imgui/imgui.cpp
    deps/imgui/imgui_draw.cpp
    deps/imgui/imgui_widgets.cpp
    deps/imgui/imgui_tables.cpp
    deps/imgui/imgui_demo.cpp
    deps/imgui/backends/imgui_impl_win32.cpp
    deps/imgui/backends/imgui_impl_dx11.cpp
)

target_include_directories(\${PROJECT_NAME} PRIVATE
    \${CMAKE_CURRENT_SOURCE_DIR}
    \${CMAKE_CURRENT_SOURCE_DIR}/deps/imgui
    \${CMAKE_CURRENT_SOURCE_DIR}/deps/imgui/backends
    \${CMAKE_CURRENT_SOURCE_DIR}/deps/stb
)

target_link_libraries(\${PROJECT_NAME} PRIVATE d3d11 d3dcompiler dxgi dwmapi)

add_custom_command(TARGET \${PROJECT_NAME} POST_BUILD
    COMMAND \${CMAKE_COMMAND} -E copy_directory
    \${CMAKE_CURRENT_SOURCE_DIR}/assets $<TARGET_FILE_DIR:\${PROJECT_NAME}>/assets)
`;

export const assetLoaderH = `#pragma once
// AssetLoader.h - load PNG/JPG/ICO files into D3D11 textures for ImGui::Image()
#include <d3d11.h>
#include "stb_image.h"

inline bool LoadTextureFromFile(const char* filename, ID3D11Device* device,
                                ID3D11ShaderResourceView** out_srv,
                                int* out_width = nullptr, int* out_height = nullptr)
{
    int width = 0, height = 0, channels = 0;
    unsigned char* data = stbi_load(filename, &width, &height, &channels, 4);
    if (!data)
        return false;

    D3D11_TEXTURE2D_DESC desc{};
    desc.Width = width;
    desc.Height = height;
    desc.MipLevels = 1;
    desc.ArraySize = 1;
    desc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
    desc.SampleDesc.Count = 1;
    desc.Usage = D3D11_USAGE_DEFAULT;
    desc.BindFlags = D3D11_BIND_SHADER_RESOURCE;

    D3D11_SUBRESOURCE_DATA sub{};
    sub.pSysMem = data;
    sub.SysMemPitch = width * 4;

    ID3D11Texture2D* texture = nullptr;
    HRESULT hr = device->CreateTexture2D(&desc, &sub, &texture);
    stbi_image_free(data);
    if (FAILED(hr) || !texture)
        return false;

    D3D11_SHADER_RESOURCE_VIEW_DESC srv{};
    srv.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
    srv.ViewDimension = D3D11_SRV_DIMENSION_TEXTURE2D;
    srv.Texture2D.MipLevels = 1;
    hr = device->CreateShaderResourceView(texture, &srv, out_srv);
    texture->Release();

    if (out_width) *out_width = width;
    if (out_height) *out_height = height;
    return SUCCEEDED(hr);
}
`;

export function mainCpp(windowTitle: string, w: number, h: number) {
  const title = windowTitle.replace(/"/g, '\\"');
  return `// main.cpp - Win32 + DirectX11 host generated by ImGui Studio 2026
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <d3d11.h>
#include <tchar.h>

#include "imgui.h"
#include "imgui_impl_win32.h"
#include "imgui_impl_dx11.h"

#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
#include "AssetLoader.h"
#include "UI.h"

static ID3D11Device*            g_pd3dDevice = nullptr;
static ID3D11DeviceContext*     g_pd3dDeviceContext = nullptr;
static IDXGISwapChain*          g_pSwapChain = nullptr;
static ID3D11RenderTargetView*  g_mainRenderTargetView = nullptr;
static bool                     g_SwapChainOccluded = false;
static UINT                     g_ResizeWidth = 0, g_ResizeHeight = 0;

bool CreateDeviceD3D(HWND hWnd);
void CleanupDeviceD3D();
void CreateRenderTarget();
void CleanupRenderTarget();
LRESULT WINAPI WndProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam);
extern IMGUI_IMPL_API LRESULT ImGui_ImplWin32_WndProcHandler(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam);

int WINAPI wWinMain(HINSTANCE hInstance, HINSTANCE, LPWSTR, int)
{
    WNDCLASSEXW wc = { sizeof(wc), CS_CLASSDC, WndProc, 0L, 0L, hInstance,
                       nullptr, nullptr, nullptr, nullptr, L"ImGuiStudioWindow", nullptr };
    ::RegisterClassExW(&wc);
    HWND hwnd = ::CreateWindowW(wc.lpszClassName, L"${title}", WS_OVERLAPPEDWINDOW,
                                100, 100, ${Math.max(400, Math.round(w) + 60)}, ${Math.max(300, Math.round(h) + 80)},
                                nullptr, nullptr, wc.hInstance, nullptr);

    if (!CreateDeviceD3D(hwnd))
    {
        CleanupDeviceD3D();
        ::UnregisterClassW(wc.lpszClassName, wc.hInstance);
        return 1;
    }

    ::ShowWindow(hwnd, SW_SHOWDEFAULT);
    ::UpdateWindow(hwnd);

    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;
    ImGui::StyleColorsDark();

    ImGuiStyle& style = ImGui::GetStyle();
    style.WindowRounding = 6.0f;
    style.FrameRounding = 4.0f;
    style.GrabRounding = 4.0f;
    style.WindowPadding = ImVec2(14, 12);
    style.ItemSpacing = ImVec2(10, 8);
    style.Colors[ImGuiCol_WindowBg] = ImVec4(0.102f, 0.102f, 0.114f, 1.00f);
    style.Colors[ImGuiCol_TitleBg] = ImVec4(0.145f, 0.145f, 0.149f, 1.00f);
    style.Colors[ImGuiCol_TitleBgActive] = ImVec4(0.145f, 0.145f, 0.149f, 1.00f);
    style.Colors[ImGuiCol_FrameBg] = ImVec4(0.165f, 0.165f, 0.176f, 1.00f);

    ImGui_ImplWin32_Init(hwnd);
    ImGui_ImplDX11_Init(g_pd3dDevice, g_pd3dDeviceContext);

    const ImVec4 clear_color = ImVec4(0.06f, 0.06f, 0.07f, 1.00f);
    bool done = false;
    while (!done)
    {
        MSG msg;
        while (::PeekMessage(&msg, nullptr, 0U, 0U, PM_REMOVE))
        {
            ::TranslateMessage(&msg);
            ::DispatchMessage(&msg);
            if (msg.message == WM_QUIT)
                done = true;
        }
        if (done)
            break;

        if (g_SwapChainOccluded && g_pSwapChain->Present(0, DXGI_PRESENT_TEST) == DXGI_STATUS_OCCLUDED)
        {
            ::Sleep(10);
            continue;
        }
        g_SwapChainOccluded = false;

        if (g_ResizeWidth != 0 && g_ResizeHeight != 0)
        {
            CleanupRenderTarget();
            g_pSwapChain->ResizeBuffers(0, g_ResizeWidth, g_ResizeHeight, DXGI_FORMAT_UNKNOWN, 0);
            g_ResizeWidth = g_ResizeHeight = 0;
            CreateRenderTarget();
        }

        ImGui_ImplDX11_NewFrame();
        ImGui_ImplWin32_NewFrame();
        ImGui::NewFrame();

        RenderUI();

        ImGui::Render();
        const float clear[4] = { clear_color.x, clear_color.y, clear_color.z, clear_color.w };
        g_pd3dDeviceContext->OMSetRenderTargets(1, &g_mainRenderTargetView, nullptr);
        g_pd3dDeviceContext->ClearRenderTargetView(g_mainRenderTargetView, clear);
        ImGui_ImplDX11_RenderDrawData(ImGui::GetDrawData());

        HRESULT hr = g_pSwapChain->Present(1, 0);
        g_SwapChainOccluded = (hr == DXGI_STATUS_OCCLUDED);
    }

    ImGui_ImplDX11_Shutdown();
    ImGui_ImplWin32_Shutdown();
    ImGui::DestroyContext();
    CleanupDeviceD3D();
    ::DestroyWindow(hwnd);
    ::UnregisterClassW(wc.lpszClassName, wc.hInstance);
    return 0;
}

bool CreateDeviceD3D(HWND hWnd)
{
    DXGI_SWAP_CHAIN_DESC sd{};
    sd.BufferCount = 2;
    sd.BufferDesc.Width = 0;
    sd.BufferDesc.Height = 0;
    sd.BufferDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
    sd.BufferDesc.RefreshRate.Numerator = 60;
    sd.BufferDesc.RefreshRate.Denominator = 1;
    sd.Flags = DXGI_SWAP_CHAIN_FLAG_ALLOW_MODE_SWITCH;
    sd.BufferUsage = DXGI_USAGE_RENDER_TARGET_OUTPUT;
    sd.OutputWindow = hWnd;
    sd.SampleDesc.Count = 1;
    sd.Windowed = TRUE;
    sd.SwapEffect = DXGI_SWAP_EFFECT_DISCARD;

    UINT createDeviceFlags = 0;
    D3D_FEATURE_LEVEL featureLevel;
    const D3D_FEATURE_LEVEL levels[] = { D3D_FEATURE_LEVEL_11_0, D3D_FEATURE_LEVEL_10_0 };
    HRESULT res = D3D11CreateDeviceAndSwapChain(nullptr, D3D_DRIVER_TYPE_HARDWARE, nullptr,
        createDeviceFlags, levels, 2, D3D11_SDK_VERSION, &sd, &g_pSwapChain,
        &g_pd3dDevice, &featureLevel, &g_pd3dDeviceContext);
    if (res == DXGI_ERROR_UNSUPPORTED)
        res = D3D11CreateDeviceAndSwapChain(nullptr, D3D_DRIVER_TYPE_WARP, nullptr,
            createDeviceFlags, levels, 2, D3D11_SDK_VERSION, &sd, &g_pSwapChain,
            &g_pd3dDevice, &featureLevel, &g_pd3dDeviceContext);
    if (res != S_OK)
        return false;

    CreateRenderTarget();
    return true;
}

void CleanupDeviceD3D()
{
    CleanupRenderTarget();
    if (g_pSwapChain) { g_pSwapChain->Release(); g_pSwapChain = nullptr; }
    if (g_pd3dDeviceContext) { g_pd3dDeviceContext->Release(); g_pd3dDeviceContext = nullptr; }
    if (g_pd3dDevice) { g_pd3dDevice->Release(); g_pd3dDevice = nullptr; }
}

void CreateRenderTarget()
{
    ID3D11Texture2D* pBackBuffer = nullptr;
    g_pSwapChain->GetBuffer(0, IID_PPV_ARGS(&pBackBuffer));
    if (pBackBuffer)
    {
        g_pd3dDevice->CreateRenderTargetView(pBackBuffer, nullptr, &g_mainRenderTargetView);
        pBackBuffer->Release();
    }
}

void CleanupRenderTarget()
{
    if (g_mainRenderTargetView) { g_mainRenderTargetView->Release(); g_mainRenderTargetView = nullptr; }
}

LRESULT WINAPI WndProc(HWND hWnd, UINT msg, WPARAM wParam, LPARAM lParam)
{
    if (ImGui_ImplWin32_WndProcHandler(hWnd, msg, wParam, lParam))
        return true;

    switch (msg)
    {
    case WM_SIZE:
        if (wParam == SIZE_MINIMIZED)
            return 0;
        g_ResizeWidth = (UINT)LOWORD(lParam);
        g_ResizeHeight = (UINT)HIWORD(lParam);
        return 0;
    case WM_SYSCOMMAND:
        if ((wParam & 0xfff0) == SC_KEYMENU)
            return 0;
        break;
    case WM_DESTROY:
        ::PostQuitMessage(0);
        return 0;
    }
    return ::DefWindowProcW(hWnd, msg, wParam, lParam);
}
`;
}

export function readme(name: string) {
  return `# ${name}

Generated by ImGui Studio 2026.

## Visual Studio 2026
1. Open \`${PROJECT_NAME}.sln\`.
2. Select \`Release | x64\` and press F5. Toolset: v145.
No vcpkg, NuGet, or extra include paths required.

## CMake (3.20+)
\`\`\`
cmake -B build -A x64
cmake --build build --config Release
\`\`\`

## Layout
- \`main.cpp\` - Win32 + DirectX 11 host and dark style setup
- \`UI.h\` - the generated \`RenderUI()\` function (regenerate from the studio)
- \`AssetLoader.h\` - PNG/JPG loading into \`ID3D11ShaderResourceView*\`
- \`deps/imgui\` - Dear ImGui core + Win32/DX11 backends
- \`deps/stb/stb_image.h\` - single-header image loader
- \`assets/\` - images exported from the studio asset manager
`;
}
