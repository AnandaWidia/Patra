'use client';

import { useEffect, useState } from 'react';

/**
 * Status Bar — 390×44.
 *
 * §04 says "Do not implement — use the platform status bar. Present in Figma
 * only so frames read as a phone." A browser has no platform status bar, and
 * every frozen frame budgets 44px for it inside the 844px viewport. Omitting
 * it would shift every screen up by 44px and break the derived scroll-region
 * heights in §06. It is therefore rendered here, as chrome, exactly as the
 * component specifies: surface/page, platform/label time.
 */
export function StatusBar() {
  const [time, setTime] = useState('9:41');

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          hour: 'numeric',
          minute: '2-digit',
        })
      );
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="bg-surface-page flex h-11 shrink-0 items-center justify-between px-6"
    >
      <span className="type-platform-label text-text-primary">{time}</span>
      <span className="type-platform-label text-text-primary">PATRA</span>
    </div>
  );
}
