/**
 * THE single map of every media path used on the site.
 * All media lives in /public/media and must be referenced only through this map.
 *
 * hero-*            hero slide backgrounds
 * thumb-1..3        nav "work" menu thumbnails (landiq, EDW, voxign)
 * rail-1..3         hero right-rail thumbnails (project screenshots later)
 * clouds            decorative cloud layer (hero screen-blended banks)
 * landiq-*          LandIQ gallery images + video poster
 * landiq-demo.mp4   LandIQ demo video (intentionally absent for now —
 *                   components must fall back to the poster)
 * dw-*              Enterprise Data Warehouse diagram + gallery
 * voxign-*          Voxign main + gallery
 * duka-*            Duka Manager gallery + video poster
 * duka-demo.mp4     Duka Manager demo video (intentionally absent for now)
 */
export const MEDIA = {
  'hero-1': '/media/hero-1.svg',
  'hero-2': '/media/hero-2.svg',
  'hero-3': '/media/hero-3.svg',
  'thumb-1': '/media/thumb-1.svg',
  'thumb-2': '/media/thumb-2.svg',
  'thumb-3': '/media/thumb-3.svg',
  'rail-1': '/media/rail-1.svg',
  'rail-2': '/media/rail-2.svg',
  'rail-3': '/media/rail-3.svg',
  clouds: '/media/clouds.svg',
  'landiq-video-poster': '/media/landiq-video-poster.svg',
  'landiq-demo': '/media/landiq-demo.mp4',
  'landiq-1': '/media/landiq-1.svg',
  'landiq-2': '/media/landiq-2.svg',
  'dw-main': '/media/dw-main.svg',
  'dw-1': '/media/dw-1.svg',
  'dw-2': '/media/dw-2.svg',
  'voxign-main': '/media/voxign-main.svg',
  'voxign-1': '/media/voxign-1.svg',
  'voxign-2': '/media/voxign-2.svg',
  'duka-1': '/media/duka-1.svg',
  'duka-2': '/media/duka-2.svg',
  'duka-3': '/media/duka-3.svg',
  'duka-poster': '/media/duka-poster.svg',
  'duka-demo': '/media/duka-demo.mp4',
} as const;

export type MediaKey = keyof typeof MEDIA;

/** Resolve a media key to its public URL. */
export function media(key: MediaKey): string {
  return MEDIA[key];
}

/** Keys that point at video files (used by components to pick a <video> element). */
export const VIDEO_KEYS: readonly MediaKey[] = ['landiq-demo', 'duka-demo'];
