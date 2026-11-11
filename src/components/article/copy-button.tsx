'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Localized } from '@/components/language';

export function CopyButton({ text, label = 'Copy BibTeX' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button type="button" className="pill copy-button" onClick={copy}>
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {copied ? <Localized en="Copied" zh="已复制" /> : label === 'Copy BibTeX' ? <Localized en="Copy BibTeX" zh="复制 BibTeX" /> : label}
    </button>
  );
}
