/**
 * Device frame.
 *
 * §06 — 390 × 844 logical points is the only size designed, and §14 says to
 * treat any wider layout as undesigned rather than inferring one. So on
 * viewports wider than the phone we do not reflow the application: we centre
 * the designed frame and leave the surrounding page empty.
 *
 * Narrow viewports (375, 390, 393, 414) simply let the frame fill the width;
 * the content column is 342px inside 24px padding and tolerates that range.
 */
export function DevicePreview({ children }: { children: React.ReactNode }) {
  return (
    // The page itself never scrolls. §06 — "the scroll region clips; the shell
    // does not" — so the only scrollable element is the shell's content area.
    <div className="bg-surface-sunken flex h-[100dvh] w-full justify-center overflow-hidden md:items-center">
      <div
        className={
          'bg-surface-page relative flex h-[100dvh] w-full max-w-[390px] flex-col overflow-hidden ' +
          // The designed frame is 844px tall, but a desktop browser window is
          // routinely shorter. Capping the frame to the window keeps the status
          // bar, header and bottom navigation on screen; the scroll region
          // absorbs the difference, which is what §06 already specifies —
          // "derived, not hardcoded: 844 minus the chrome present". At 844px or
          // taller the frame is exactly the designed size.
          'md:h-[min(844px,100dvh)]'
        }
      >
        {children}
      </div>
    </div>
  );
}
