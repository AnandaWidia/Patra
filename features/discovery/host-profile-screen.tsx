'use client';

import { ActionControl, TextLink } from '@/components/ui/action-control';
import { AvailabilityWeek } from '@/components/ui/availability-week';
import { ExperienceCard } from '@/components/ui/experience-card';
import { Gap } from '@/components/ui/gap';
import { PhotographPlaceholder } from '@/components/ui/photograph-placeholder';
import {
  HostBody,
  Label,
  LedeItalic,
  Meta,
  Title,
} from '@/components/ui/typography';
import { VerificationBlock } from '@/components/ui/verification-block';
import { ROUTES } from '@/constants/routes';
import { useHostProfile } from '@/lib/hooks/use-patra-data';

/** The week strip as the frozen frame sets it: 14–16 June closed. */
const WEEK = [
  { weekday: 'M', date: 13, open: true },
  { weekday: 'T', date: 14, open: false },
  { weekday: 'W', date: 15, open: false },
  { weekday: 'T', date: 16, open: false },
  { weekday: 'F', date: 17, open: true },
  { weekday: 'S', date: 18, open: true },
  { weekday: 'S', date: 19, open: true },
];

/**
 * Host Profile — Figma 2:2529.
 * §03 — person and provenance. Contains one untitled italic node (§14),
 * implemented here as host/lede italic.
 */
export function HostProfileScreen({ hostId = 'host-01' }: { hostId?: string }) {
  const { data: host } = useHostProfile(hostId);

  return (
    <>
      <PhotographPlaceholder
        photo="host-profile-hero"
        subject="HOST-004 · Portrait · I Made in the workshop doorway, morning light, not looking at the lens"
      />

      <div className="flex flex-col items-start px-6 pt-6 pb-12">
        <Label>{host.villageLabel}</Label>
        <Gap size={8} />
        <Title>{host.name}</Title>
        <Gap size={4} />
        <Meta>{host.craft}</Meta>
        <Gap size={24} />

        {/* §11 — attribution announced before the words it attributes. */}
        <Label>DALAM BAHASANYA SENDIRI</Label>
        <Gap size={12} />
        {/* §14 — the Bahasa quotation had no assigned text style because the
            scale has no italic variant. Implemented as host/lede italic. */}
        <LedeItalic lang="id">{host.quoteOriginal}</LedeItalic>
        <Gap size={12} />
        <HostBody className="text-text-secondary">
          {host.quoteTranslated}
        </HostBody>
        <Gap size={16} />
        {host.longStory.map((paragraph) => (
          <HostBody key={paragraph.slice(0, 24)}>{paragraph}</HostBody>
        ))}
        <Gap size={24} />

        <VerificationBlock
          label={host.verification.label}
          fact={host.verification.verifiedBy}
          attribution={host.verification.note}
        />
        <Gap size={24} />

        <Label>WHAT HE OFFERS</Label>
        <Gap size={12} />
        <ExperienceCard
          href={ROUTES.experienceDetail('exp-01')}
          photo="card-carving"
          photoCaption="EXP-004 · hands, chisel, unfinished wood"
          craft="MAS, GIANYAR"
          hostName="Carving in hibiscus wood"
          availability="Carving, four hours, six people or fewer"
          verification="Verified by Banjar Mas"
        />
        <Gap size={24} />

        <AvailabilityWeek
          label="AVAILABILITY · JUNE"
          days={WEEK}
          note="Closed 14–16 June — Galungan. The family is preparing offerings, which take three days."
        />
        <Gap size={24} />

        <ActionControl href={ROUTES.messageThread('cv-01')}>
          Message I Made
        </ActionControl>
        <Gap size={16} />
        <TextLink href={ROUTES.chooseDay('exp-01')}>Or select a date</TextLink>
      </div>
    </>
  );
}
