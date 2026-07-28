'use client';

import { ActionControl } from '@/components/ui/action-control';
import { ExperienceCard } from '@/components/ui/experience-card';
import { Gap } from '@/components/ui/gap';
import { PhotographPlaceholder } from '@/components/ui/photograph-placeholder';
import { HostBody, Label, Lede } from '@/components/ui/typography';
import type { PhotoKey } from '@/constants/assets';
import { ROUTES } from '@/constants/routes';
import { useExperiences } from '@/lib/hooks/use-patra-data';

/**
 * Home — Figma 2:3320.
 * §02 — an entry surface: status bar only, no tab bar. Reached once per
 * launch; it is not a tab.
 * §03 — cards and CTA are tappable.
 */
export function HomeScreen() {
  const { data: experiences } = useExperiences();

  return (
    <>
      <PhotographPlaceholder
        photo="home-hero"
        subject="SUBJECT · I Made Suarta at his workbench, mid-cut, not looking up"
      />
      <Gap size={24} />

      <Lede>
        He has carved the same figure for thirty-one years, and he still does
        not think he has it right.
      </Lede>
      <Gap size={8} />
      <Label>I MADE SUARTA · MAS, GIANYAR</Label>
      <Gap size={48} />

      <HostBody>
        Days spent with Balinese households, verified in person by their own
        banjar, booked directly.
      </HostBody>
      <Gap size={48} />

      <Label>OPEN THIS WEEK</Label>
      <Gap size={12} />
      {experiences.map((experience, index) => (
        <div key={experience.id} className="w-full">
          {index > 0 ? <Gap size={16} /> : null}
          <ExperienceCard
            href={ROUTES.experienceDetail(experience.id)}
            photo={experience.photoKey as PhotoKey}
            craft={experience.home.label}
            hostName={experience.hostName}
            availability={experience.home.detail}
            verification={experience.home.verification}
          />
        </div>
      ))}
      <Gap size={48} />

      <Label>WHERE THE MONEY GOES</Label>
      <Gap size={12} />
      <HostBody>
        Eighty per cent of what you pay reaches the household you spend the day
        with. It is a line on your receipt, not a claim on this page.
      </HostBody>
      <Gap size={48} />

      <ActionControl href={ROUTES.explore}>Explore experiences</ActionControl>
    </>
  );
}
