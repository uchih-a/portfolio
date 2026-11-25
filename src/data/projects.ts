import type { MediaKey } from './media';

export type ProjectId = 'landiq' | 'enterprise-data-warehouse' | 'voxign';

export interface ProjectLinks {
  repo: string;
  live: string | null;
}

export interface ProjectVideoMedia {
  type: 'video';
  /** Video path key — the file is intentionally absent for now; components fall back to the poster. */
  src: MediaKey;
  poster: MediaKey;
}

export interface ProjectImageMedia {
  type: 'image';
  image: MediaKey;
}

export type ProjectMainMedia = ProjectVideoMedia | ProjectImageMedia;

export interface Project {
  id: ProjectId;
  category: string;
  title: string;
  summary: string;
  note?: string;
  status?: string;
  stack: string[];
  links: ProjectLinks;
  media: {
    main: ProjectMainMedia;
    gallery: MediaKey[];
  };
  /** Thumbnail used by the nav "work" menu. */
  thumbKey: MediaKey;
}

export const projects: Project[] = [
  {
    id: 'landiq',
    category: 'Software · ML',
    title: 'LandIQ — Kenya Land Valuation',
    summary:
      'End-to-end land price estimation platform: Scrapy-collected listings and a neural network trained on 5,796+ listings across 30 counties (R² 0.71), served through a FastAPI backend with JWT auth, PostgreSQL and a React dashboard.',
    note: 'Estimates are based on scraped asking prices, not final sale prices.',
    stack: ['FastAPI', 'PostgreSQL', 'Alembic', 'React', 'Docker', 'Nginx', 'Scrapy'],
    links: {
      repo: 'https://github.com/uchih-a/landiq',
      live: 'https://landiq-one.vercel.app',
    },
    media: {
      main: { type: 'video', src: 'landiq-demo', poster: 'landiq-video-poster' },
      gallery: ['landiq-1', 'landiq-2'],
    },
    thumbKey: 'thumb-1',
  },
  {
    id: 'enterprise-data-warehouse',
    category: 'Data Engineering',
    title: 'Enterprise Data Warehouse',
    summary:
      'Medallion (Bronze, Silver, Gold) warehouse in SQL Server consolidating ERP and CRM sources, with T-SQL ETL scripts, data quality tests, a documented data catalog and a star-schema reporting layer.',
    stack: ['SQL Server', 'T-SQL', 'Star schema', 'Data catalog'],
    links: {
      repo: 'https://github.com/uchih-a/Enterprise-Data-Warehouse',
      live: null,
    },
    media: {
      main: { type: 'image', image: 'dw-main' },
      gallery: ['dw-1', 'dw-2'],
    },
    thumbKey: 'thumb-2',
  },
  {
    id: 'voxign',
    category: 'Computer Vision · Research prototype',
    title: 'Voxign',
    status: 'In progress',
    summary:
      'Research prototype for real-time American Sign Language recognition: MediaPipe hand landmarks captured in the browser are sent to a FastAPI backend where TensorFlow/Keras models predict individual letters (A-Z) and 30-frame word sequences. The React + TypeScript PWA adds JWT authentication with role-based access, inference history stored in PostgreSQL, and offline support.',
    stack: ['TensorFlow/Keras', 'MediaPipe', 'FastAPI', 'PostgreSQL', 'React', 'TypeScript', 'Docker'],
    links: {
      repo: 'https://github.com/uchih-a/Voxign',
      live: null,
    },
    media: {
      main: { type: 'image', image: 'voxign-main' },
      gallery: ['voxign-1', 'voxign-2'],
    },
    thumbKey: 'thumb-3',
  },
];
