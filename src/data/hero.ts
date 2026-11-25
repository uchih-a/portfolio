import type { MediaKey } from './media';

export interface HeroSlide {
  /** Display lines of the big slide title. */
  title: string[];
  /** Small caption heading above the caption text. */
  captionHeading: string;
  caption: string;
  /** Background media for the slide. */
  mediaKey: MediaKey;
  /** background-position for the slide photo (kept in data so real photos
   *  can be dropped in without touching the component). */
  photoPosition: string;
  /** Right-rail thumbnail media key (project screenshots later). */
  thumbKey: MediaKey;
}

export const hero: HeroSlide[] = [
  {
    title: ["HI, I'M ALEXANDER"],
    captionHeading: 'Data engineer',
    caption: 'Data engineer who builds software, from pipelines to production APIs.',
    mediaKey: 'hero-1',
    photoPosition: 'center 62%',
    thumbKey: 'rail-1',
  },
  {
    title: ['PIPELINES &', 'WAREHOUSES'],
    captionHeading: 'Data engineering',
    caption:
      'Medallion-architecture warehouses and Python pipelines that turn scattered data into clean, reportable tables.',
    mediaKey: 'hero-2',
    photoPosition: 'center 55%',
    thumbKey: 'rail-2',
  },
  {
    title: ['FULL-STACK', 'PRODUCTS'],
    captionHeading: 'Software',
    caption: 'React, FastAPI and Node apps on PostgreSQL, shipped with Docker and real users.',
    mediaKey: 'hero-3',
    photoPosition: 'center 40%',
    thumbKey: 'rail-3',
  },
];
