import { Link, useLocation } from 'react-router-dom';
import { site } from '../../data/site';

export default function Footer() {
  const year = new Date().getFullYear();
  const { pathname } = useLocation();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-ink">{site.name}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{site.tagline}</p>
          <p className="mt-2 text-sm text-muted">{site.location}</p>
        </div>
        <ul className="flex items-center gap-1">
          {pathname !== '/' && (
            <li>
              <Link
                to="/"
                className="flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                Portfolio
              </Link>
            </li>
          )}
          {site.social.github && (
            <li>
              <a
                href={site.social.github}
                target="_blank"
                rel="noreferrer noopener"
                className="flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                GitHub
              </a>
            </li>
          )}
          {site.social.linkedin && (
            <li>
              <a
                href={site.social.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                className="flex min-h-11 items-center rounded-full px-4 text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                LinkedIn
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs text-muted sm:px-6 lg:px-8">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  );
}
