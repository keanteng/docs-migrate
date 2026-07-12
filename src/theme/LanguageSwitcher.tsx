import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'zh-CN', label: '中文' },
  { code: 'ms', label: 'Bahasa Melayu' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
];

export default function LanguageSwitcher() {
  const [current, setCurrent] = useState('en');
  const [ready, setReady] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return;

    const widget = document.createElement('div');
    widget.id = 'google_translate_element';
    widget.hidden = true;
    document.body.appendChild(widget);

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: LANGUAGES.map((l) => l.code).join(','),
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.onload = () => {
      const iv = setInterval(() => {
        const combo = document.querySelector(
          '.goog-te-combo'
        ) as HTMLSelectElement | null;
        if (combo) {
          setCurrent(combo.value);
          setReady(true);
          clearInterval(iv);
        }
      }, 100);
    };
    document.body.appendChild(script);

    const mo = new MutationObserver(() => {
      const el = document.querySelector('.navbar__items--right');
      if (el) {
        setContainer(el as HTMLElement);
        mo.disconnect();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);

  const switchLang = (code: string) => {
    setCurrent(code);
    if (code === 'en') {
      const combo = document.querySelector(
        '.goog-te-combo'
      ) as HTMLSelectElement | null;
      if (combo) {
        combo.value = 'en';
        combo.dispatchEvent(new Event('change'));
      }
      return;
    }
    const combo = document.querySelector(
      '.goog-te-combo'
    ) as HTMLSelectElement | null;
    if (combo) {
      combo.value = code;
      combo.dispatchEvent(new Event('change'));
    }
  };

  const el = (
    <select
      value={current}
      onChange={(e) => switchLang(e.target.value)}
      disabled={!ready}
      style={{
        marginLeft: 12,
        padding: '4px 28px 4px 10px',
        border: '1px solid var(--ifm-color-emphasis-300)',
        borderRadius: 6,
        background: 'var(--ifm-background-color)',
        color: 'var(--ifm-font-color-base)',
        fontSize: 13,
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      {LANGUAGES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );

  return container ? createPortal(el, container) : null;
}
