"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyCodeButtonProps {
  code: string;
}

export default function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "복사됨" : "코드 복사"}
      className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-foreground/40 transition-colors hover:bg-surface-hover hover:text-foreground">
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {copied ? "복사됨" : "복사"}
    </button>
  );
}
