'use client';

import { createContext, useContext, useEffect, useState } from 'react';

/**
 * Presentation Mode.
 *
 * The engineering build and the presentation build are the same application.
 * There is one set of components, one set of routes and one stylesheet; this
 * context only decides whether a Photograph Placeholder resolves to its
 * commissioning brief or to the delivered photograph. Nothing else reads it,
 * and no layout, spacing, typography or colour depends on it.
 *
 * On by default, because §10 and §14 are explicit that no screen may ship
 * carrying a placeholder. Set NEXT_PUBLIC_PRESENTATION=0 in `.env.local`, or
 * append `?mode=engineering` to any URL, to see the frozen placeholder state.
 */
const DEFAULT_ON = process.env.NEXT_PUBLIC_PRESENTATION !== '0';

const PresentationContext = createContext(DEFAULT_ON);

export function PresentationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server and first client render both use the build-time default, so
  // hydration is deterministic. The query override is applied after mount.
  const [presenting, setPresenting] = useState(DEFAULT_ON);

  useEffect(() => {
    const mode = new URLSearchParams(window.location.search).get('mode');
    if (mode === 'engineering') setPresenting(false);
    else if (mode === 'presentation') setPresenting(true);
    else setPresenting(DEFAULT_ON);
  }, []);

  return (
    <PresentationContext.Provider value={presenting}>
      {children}
    </PresentationContext.Provider>
  );
}

/** True when delivered photography should replace commissioning briefs. */
export function usePresentation() {
  return useContext(PresentationContext);
}
