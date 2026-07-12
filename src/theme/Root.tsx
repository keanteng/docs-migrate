import React from 'react';
import type { ReactNode } from 'react';
import LanguageSwitcher from '@site/src/theme/LanguageSwitcher';

export default function Root({ children }: { children: ReactNode }) {
  return (
    <>
      <LanguageSwitcher />
      {children}
    </>
  );
}
