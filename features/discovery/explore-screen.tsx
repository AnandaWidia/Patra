'use client';

import { ExperienceCard } from '@/components/ui/experience-card';
import { Gap } from '@/components/ui/gap';
import { Body, HostBody, Label, Title } from '@/components/ui/typography';
import type { PhotoKey } from '@/constants/assets';
import { ROUTES } from '@/constants/routes';
import { useExperiences } from '@/lib/hooks/use-patra-data';

/**
 * Explore — Figma 2:2682 "[FROZEN] Explore — 390 · Mobile".
 * §03 — primary discovery. Search is a state of this screen, not a route.
 *
 * The frozen frame carries 48px vertical padding because it predates shell
 * integration; §06 sets 24px top and 24px bottom on root surfaces once the
 * chrome exists, which is what the shell applies (Stage 5 refinement R4).
 */
export function ExploreScreen() {
  const { data: experiences } = useExperiences();

  return (
    <>
      <Label>GIANYAR · JUNE</Label>
      <Gap size={12} />
      <Title>This week the village is making offerings.</Title>
      <Gap size={16} />

      {/* §11 — the attribution is announced before the words it attributes. */}
      <Label>EXPLAINED BY BANJAR MAS, IN THEIR WORDS</Label>
      <Gap size={8} />
      <HostBody>
        Galungan begins on Wednesday. Most compounds in Mas close for three days
        while the families prepare — the offerings take that long, and they are
        not made in advance.
      </HostBody>
      <Gap size={16} />
      <HostBody>
        Four households are open around it. They are not fitting you in. These
        are the days they were already free.
      </HostBody>
      <Gap size={48} />

      <Label>OPEN BEFORE AND AFTER</Label>
      <Gap size={12} />
      {experiences.map((experience, index) => (
        <div key={experience.id} className="w-full">
          {index > 0 ? <Gap size={24} /> : null}
          <ExperienceCard
            href={ROUTES.experienceDetail(experience.id)}
            photo={experience.photoKey as PhotoKey}
            craft={experience.explore.label}
            hostName={experience.hostName}
            availability={experience.explore.detail}
            verification={experience.explore.verification}
          />
        </div>
      ))}
      <Gap size={48} />

      <Body className="text-text-secondary">
        Nothing else is open until Thursday 18 June. That is not a shortage — it
        is what the calendar looks like when a village keeps it.
      </Body>
    </>
  );
}
