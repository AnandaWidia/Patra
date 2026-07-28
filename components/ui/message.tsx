import { Gap } from './gap';
import { cn } from '@/lib/cn';

/**
 * Message — 342×196.
 *
 * Figma component doc (2:2387): "A transcript entry, not a chat bubble. §09
 * records the traveller channel as asynchronous and never a phone call, so
 * the exchange is a correspondence rather than a conversation. Both sides sit
 * in the serif — AM-02 governs by authorship, and both the host and the
 * traveller wrote their own words. Speaker is carried by an attribution label
 * and by surface: host messages on surface/raised, traveller messages on the
 * page. Never by alignment, and never by colour alone."
 */
interface MessageProps {
  /** e.g. "I MADE · 14 JUNE, 9:12". Announced before the body (§11). */
  attribution: string;
  body: string;
  from: 'host' | 'you';
}

export function Message({ attribution, body, from }: MessageProps) {
  return (
    <article
      className={cn(
        'flex w-full flex-col items-start',
        from === 'host' && 'bg-surface-raised p-4'
      )}
    >
      <p className="type-platform-label text-text-secondary w-full">
        {attribution}
      </p>
      <Gap size={8} />
      <p className="type-host-body text-text-primary w-full">{body}</p>
    </article>
  );
}
