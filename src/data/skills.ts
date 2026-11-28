/**
 * Skills / tools for the home-page marquee between the hero and
 * projects. Two rows: languages (scroll right) and frameworksTools
 * (scroll left). `icon` is the matching simple-icons export slug
 * (e.g. 'siPython'); entries without one render as text-only pills —
 * simple-icons ships no SQL, T-SQL, SQL Server, Power BI, Alembic or
 * DHIS2 icon (verified against simple-icons v16).
 */
export interface Skill {
  name: string;
  /** simple-icons export slug; absent = text-only pill. */
  icon?: string;
}

export const languages: Skill[] = [
  { name: 'Python', icon: 'siPython' },
  { name: 'SQL' },
  { name: 'T-SQL' },
  { name: 'TypeScript', icon: 'siTypescript' },
  { name: 'JavaScript', icon: 'siJavascript' },
  { name: 'R', icon: 'siR' },
];

export const frameworksTools: Skill[] = [
  { name: 'FastAPI', icon: 'siFastapi' },
  { name: 'React', icon: 'siReact' },
  { name: 'Node.js', icon: 'siNodedotjs' },
  { name: 'Scrapy', icon: 'siScrapy' },
  { name: 'Pandas', icon: 'siPandas' },
  { name: 'PostgreSQL', icon: 'siPostgresql' },
  { name: 'SQL Server' },
  { name: 'Docker', icon: 'siDocker' },
  { name: 'Nginx', icon: 'siNginx' },
  { name: 'Git', icon: 'siGit' },
  { name: 'Power BI' },
  { name: 'Alembic' },
  { name: 'DHIS2' },
];
