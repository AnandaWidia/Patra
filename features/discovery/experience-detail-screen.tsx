'use client';

import Link from 'next/link';

import { ActionControl } from '@/components/ui/action-control';
import { Gap } from '@/components/ui/gap';
import { PhotographPlaceholder } from '@/components/ui/photograph-placeholder';
import { RevenueSplitBlock } from '@/components/ui/revenue-split-block';
import { Review } from '@/components/ui/review';
import {
  Body,
  HostBody,
  Label,
  Lede,
  Meta,
  Title,
} from '@/components/ui/typography';
import { VerificationBlock } from '@/components/ui/verification-block';
import { ROUTES } from '@/constants/routes';
import { useExperienceDetail, useReviews } from '@/lib/hooks/use-patra-data';

/**
 * Experience Detail — Figma 2:1863.
 * §03 — the decision surface. The host name is the route to Host Profile.
 *
 * The Photograph Placeholder sits outside the content column (full bleed),
 * so this screen supplies its own padding rather than using the shell's.
 */
export function ExperienceDetailScreen({
  experienceId,
}: {
  experienceId: string;
}) {
  const { data: host } = useExperienceDetail(experienceId);
  const { data: hostReviews } = useReviews(experienceId);

  return (
    <>
      <PhotographPlaceholder
        photo="experience-detail-hero"
        subject={host.photoBrief}
      />

      <div className="flex flex-col items-start px-6 pt-6 pb-12">
        <Label>{host.villageLabel}</Label>
        <Gap size={8} />
        {/* §03 — the host name is the route to Host Profile. */}
        <Link
          href={ROUTES.hostProfile(host.id)}
          className="focus-visible:outline-boundary-focus w-full focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Title>{host.name}</Title>
        </Link>
        <Gap size={4} />
        <Meta>{host.craft}</Meta>
        <Gap size={24} />

        <Lede>{host.storyLine}</Lede>
        <Gap size={16} />
        {host.longStory.map((paragraph, index) => (
          <div key={paragraph.slice(0, 24)} className="w-full">
            {index > 0 ? <Gap size={16} /> : null}
            <HostBody>{paragraph}</HostBody>
          </div>
        ))}
        <Gap size={24} />

        <VerificationBlock
          label={host.verification.label}
          fact={host.verification.verifiedBy}
          attribution={host.verification.note}
        />
        <Gap size={24} />

        <Label>WHAT IS FIXED</Label>
        <Gap size={8} />
        {host.fixed.map((line, index) => (
          <div key={line} className="w-full">
            {index > 0 ? <Gap size={4} /> : null}
            <Body>{line}</Body>
          </div>
        ))}
        <Gap size={4} />
        <Gap size={16} />

        <RevenueSplitBlock
          label={host.revenueSplit.label}
          figures={host.revenueSplit.figures}
          justification={host.revenueSplit.justification}
        />
        <Gap size={16} />
        <Body>{host.durationLine}</Body>
        <Gap size={24} />

        <Label>AVAILABILITY</Label>
        <Gap size={8} />
        <Body>{host.availability.summary}</Body>
        <Gap size={8} />
        {/* §11 — attribution announced before the words it attributes. */}
        <Label>{host.availability.attributedTo}</Label>
        <Gap size={8} />
        {/* §04 — a ceremonial closure is stated as a fact, in text/secondary.
            voice/refusal is reserved for calendar cells and would read as an
            error here. */}
        <Body className="text-text-secondary">
          {host.availability.explanation}
        </Body>
        <Gap size={24} />

        <Label>WHAT PEOPLE WHO WENT SAID</Label>
        <Gap size={12} />
        <Body>{host.reviewsIntro}</Body>
        <Gap size={24} />

        {hostReviews.map((review, index) => (
          <div key={review.id} className="w-full">
            {index > 0 ? <Gap size={24} /> : null}
            {index === 2 ? <Gap size={24} /> : null}
            <Review
              attribution={review.attribution}
              body={review.body}
              attendance={review.attendance}
            />
          </div>
        ))}
        <Meta>
          Only people who booked and attended can write here. We do not remove
          the critical ones.
        </Meta>
        <Gap size={24} />

        <ActionControl href={ROUTES.chooseDay(experienceId)}>
          Select a date
        </ActionControl>
        <Gap size={16} />
        <Meta className="text-center">Message I Made before you book</Meta>
      </div>
    </>
  );
}
