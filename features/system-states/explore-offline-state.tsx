'use client';

import { ExperienceCard } from '@/components/ui/experience-card';
import { Gap } from '@/components/ui/gap';
import { StatusBand } from '@/components/ui/status-band';
import { Body, Label, Meta } from '@/components/ui/typography';
import { ROUTES } from '@/constants/routes';

/** The two experiences the traveller had already opened, so already cached. */
const CACHED = [
  {
    id: 'exp-01',
    photo: 'card-carving' as const,
    craft: 'Carving in hibiscus wood',
    hostName: 'I Made Suarta',
    village: 'Mas, Gianyar',
    verification: 'Verified by Banjar Mas',
  },
  {
    id: 'exp-02',
    photo: 'card-cooking' as const,
    craft: 'Cooking and offerings',
    hostName: 'Ibu Wayan',
    village: 'Kemenuh, Gianyar',
    verification: 'Verified by Banjar Mas',
  },
];

const UNAVAILABLE = [
  '·  Booking a day — the calendar has to be checked against the village.',
  '·  Sending a message — it would sit unsent and you would not know.',
  '·  Eleven other experiences — they were never opened, so they were never saved.',
];

/**
 * Explore (Offline) — Figma 2:3426.
 * §03 — separates cached content from unavailable functionality.
 */
export function ExploreOfflineState() {
  return (
    <>
      <StatusBand
        tone="offline"
        label="NO SIGNAL"
        note="What you opened before is saved. Booking and messages need a connection."
      />
      <Gap size={48} />

      <Label>SAVED TO THIS PHONE</Label>
      <Gap size={12} />
      {CACHED.map((experience, index) => (
        <div key={experience.id} className="w-full">
          {index > 0 ? <Gap size={16} /> : null}
          <ExperienceCard
            href={ROUTES.experienceDetail(experience.id)}
            photo={experience.photo}
            craft={experience.craft}
            hostName={experience.hostName}
            availability={experience.village}
            verification={experience.verification}
          />
        </div>
      ))}
      <Gap size={48} />

      <Label>NEEDS A CONNECTION</Label>
      <Gap size={12} />
      {UNAVAILABLE.map((line, index) => (
        <div key={line} className="w-full">
          {index > 0 ? <Gap size={8} /> : null}
          <Body className="text-text-secondary whitespace-pre-wrap">
            {line}
          </Body>
        </div>
      ))}
      <Gap size={8} />
      <Gap size={16} />

      <Meta>
        Your booking detail is complete offline. That one was saved on purpose,
        not by accident.
      </Meta>
    </>
  );
}
