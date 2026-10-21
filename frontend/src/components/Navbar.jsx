import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n, localePath, SUPPORTED_LOCALES, LOCALE_NAMES, LOCALE_FLAGS } from '../i18n';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { locale, t } = useI18n();
  const location = useLocation();
  const { isDark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const home = localePath(locale);
  const projectsUrl = localePath(locale, 'projects');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!langOpen) return undefined;
    const close = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [langOpen]);

  const currentPathAfterLocale = location.pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
  function langHref(loc) {
    const base = localePath(loc, currentPathAfterLocale);
    return location.hash ? base + location.hash : base;
  }

  const navLinks = [
    { href: `${home}#hero`, label: t('nav.home'), id: 'hero' },
    { href: `${home}#about`, label: t('nav.about'), id: 'about' },
    { href: `${home}#skills`, label: t('nav.skills'), id: 'skills' },
    { href: `${home}#experience`, label: t('nav.experience'), id: 'experience' },
  ];

  return (
    <header id="navbar" className={`fixed inset-x-0 top-0 z-30 transition-all duration-300 ${scrolled ? 'glass' : ''}`}>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to={home} className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          Hasanov<span className="text-brand-500">.</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a key={link.id} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
          <Link to={projectsUrl} className="nav-link">
            {t('nav.projects')}
          </Link>
          <a href={`${home}#contact`} className="nav-link">
            {t('nav.contact')}
          </a>
        </div>

        <div className="flex items-center gap-2">
          <a href="/api/resume" className="btn-outline hidden !px-4 !py-2 text-sm sm:inline-flex">
            {t('nav.resume')}
          </a>

          <div className="relative" ref={langRef}>
            <button
              type="button"
              aria-label={t('lang.switch')}
              onClick={() => setLangOpen((v) => !v)}
              className="glass flex h-10 items-center gap-1 rounded-full px-3 text-sm font-medium text-slate-600 transition hover:-translate-y-0.5 hover:text-brand-600 dark:text-slate-300"
            >
              <img src={LOCALE_FLAGS[locale]} alt="" width="20" height="14" className="h-3.5 w-5 rounded-sm object-cover" />
              <span className="uppercase">{locale}</span>
            </button>
            {langOpen && (
              <div className="glass absolute right-0 top-12 w-40 overflow-hidden rounded-xl py-1">
                {SUPPORTED_LOCALES.map((loc) => (
                  <Link
                    key={loc}
                    to={langHref(loc)}
                    onClick={() => setLangOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 ${
                      loc === locale ? 'font-semibold text-brand-600 dark:text-brand-400' : ''
                    }`}
                  >
                    <img src={LOCALE_FLAGS[loc]} alt="" width="20" height="14" className="h-3.5 w-5 rounded-sm object-cover" />
                    <span>{LOCALE_NAMES[loc]}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <button type="button" aria-label="Toggle theme" onClick={toggle} className="icon-btn">
            <svg className={`h-4 w-4 ${isDark ? 'hidden' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
            </svg>
            <svg className={`h-4 w-4 ${isDark ? '' : 'hidden'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 14.5A7.5 7.5 0 0 1 10.5 5a7.5 7.5 0 1 0 9.5 9.5Z" />
            </svg>
          </button>

          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label="Menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="icon-btn lg:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </nav>

      <div className={`overflow-hidden px-5 transition-all duration-300 lg:hidden ${mobileOpen ? 'max-h-[480px]' : 'max-h-0'}`}>
        <div className="glass flex flex-col gap-1 rounded-2xl p-4">
          {navLinks.map((link) => (
            <a key={link.id} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
              {link.label}
            </a>
          ))}
          <Link to={projectsUrl} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            {t('nav.projects')}
          </Link>
          <a href={`${home}#contact`} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            {t('nav.contact')}
          </a>
          <a href="/api/resume" className="mt-1 rounded-lg bg-brand-500 px-3 py-2 text-center text-sm font-medium text-white">
            {t('nav.resume')}
          </a>
        </div>
      </div>
    </header>
  );
}
