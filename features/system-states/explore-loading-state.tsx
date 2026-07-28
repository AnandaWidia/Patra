import { Gap } from '@/components/ui/gap';
import { HostBody, Label, Meta } from '@/components/ui/typography';

/**
 * Explore (Loading) — Figma 2:3382.
 *
 * §03 — no action offered. Static skeletons only, no shimmer.
 * §05 — surface/sunken is the loading-skeleton token, and there is no
 * animation token beyond the single 300ms transition, so the skeletons do
 * not pulse.
 */
export function ExploreLoadingState() {
  return (
    <div aria-busy="true" aria-live="polite" className="w-full">
      <Label>STILL LOADING</Label>
      <Gap size={12} />
      <HostBody>
        Reception in Mas is patchy and this can take a moment. Nothing is lost
        if you wait.
      </HostBody>
      <Gap size={48} />

      {[0, 1, 2].map((index) => (
        <div key={index} className="w-full">
          {index > 0 ? <Gap size={16} /> : null}
          <div
            aria-hidden="true"
            className="rounded-control bg-surface-sunken h-[180px] w-full"
          />
        </div>
      ))}
      <Gap size={24} />

      <Meta>
        No action is offered here on purpose. Waiting is the only correct thing
        to do, and a button would imply otherwise.
      </Meta>
    </div>
  );
}
