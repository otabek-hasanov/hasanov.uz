import { Link } from 'react-router-dom';
import { useI18n, localePath, pickLocalized } from '../i18n';
import { useData, useReveal } from '../hooks/useData';

export default function Projects() {
  const { locale, t } = useI18n();
  const { data: projects } = useData('/projects');
  useReveal();

  return (
    <section className="px-5 pb-24 pt-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="reveal is-visible text-center">
          <h1 className="section-heading">{t('projects.title')}</h1>
          <p className="section-subheading">{t('projects.subtitle')}</p>
        </div>

        {!projects || projects.length === 0 ? (
          <p className="mt-14 text-center text-slate-400">{t('projects.no_projects')}</p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article key={project.id} className="card-hover reveal is-visible group overflow-hidden">
                <Link to={localePath(locale, `projects/${project.slug}`)} className="block overflow-hidden">
                  {project.cover_image ? (
                    <img
                      src={project.cover_image}
                      alt={pickLocalized(project.title, locale)}
                      loading="lazy"
                      width="480"
                      height="300"
                      className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-48 w-full items-center justify-center bg-gradient-to-br from-brand-400/20 to-sky-400/20 text-3xl font-bold text-brand-500/60">
                      {pickLocalized(project.title, locale)[0]}
                    </div>
                  )}
                </Link>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">{pickLocalized(project.title, locale)}</h2>
                    {!!project.is_featured && <span className="tag-chip">{t('projects.featured')}</span>}
                  </div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{pickLocalized(project.summary, locale)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(project.tags || []).slice(0, 4).map((tag) => (
                      <span key={tag} className="tag-chip">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={localePath(locale, `projects/${project.slug}`)}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:gap-2 dark:text-brand-400"
                  >
                    {t('projects.view_project')}
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
