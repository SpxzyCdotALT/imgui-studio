import { useMemo } from "react";

const KEYWORDS =
  /\b(static|inline|void|bool|int|float|char|const|if|else|true|false|nullptr|struct|return|pragma|include)\b/g;

function highlight(code: string) {
  const escaped = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/(\/\/[^\n]*)/g, '<span class="text-ig-dim italic">$1</span>')
    .replace(/(&quot;|")([^"\n]*)(")/g, '<span class="text-[#ce9178]">"$2"</span>')
    .replace(/\bImGui(?:Col|WindowFlags|InputTextFlags|TableFlags|Cond|ConfigFlags)?\b/g, '<span class="text-[#4ec9b0]">$&</span>')
    .replace(KEYWORDS, '<span class="text-[#569cd6]">$&</span>')
    .replace(/\b(\d+\.?\d*f?)\b/g, '<span class="text-[#b5cea8]">$1</span>');
}

export function CodeView({ code }: { code: string }) {
  const html = useMemo(() => highlight(code), [code]);
  const lines = code.split("\n").length;
  return (
    <div className="flex h-full overflow-auto bg-ig-bg font-mono text-[12px] leading-[1.55]">
      <div className="select-none border-r border-ig-border px-3 py-3 text-right text-ig-dim">
        {Array.from({ length: lines }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <pre className="flex-1 px-4 py-3 text-ig-text" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
