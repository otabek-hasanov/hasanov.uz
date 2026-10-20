import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useI18n, localePath, pickLocalized } from '../i18n';
import { useData, useReveal } from '../hooks/useData';
import { useLightbox } from '../components/Lightbox';
import NotFound from './NotFound';

export default function ProjectDetail() {
  const { locale, t } = useI18n();
  const { slug } = useParams();
  const { data: project, loading, error } = useData(`/projects/${slug}`, [slug]);
  const openLightbox = useLightbox();
  useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (error && error.status === 404) return <NotFound />;
  if (loading || !project) return <section className="min-h-screen px-5 pt-32 lg:px-8" />;

  const title = pickLocalized(project.title, locale);
  const summary = pickLocalized(project.summary, locale);
  const description = pickLocalized(project.description, locale);
  const gallery = project.gallery_urls || project.gallery || [];

  return (
    <section className="px-5 pb-24 pt-32 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link to={localePath(locale, 'projects')} className="reveal is-visible inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {t('projects.back_to_projects')}
        </Link>

        <div className="reveal is-visible mt-6">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl dark:text-white">{title}</h1>
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">{summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(project.tags || []).map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                {t('projects.live_demo')}
              </a>
            )}
            {project.repo_url && (
              <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
                {t('projects.source_code')}
              </a>
            )}
          </div>
        </div>

        {project.cover_image && (
          <div className="reveal is-visible mt-10 overflow-hidden rounded-2xl shadow-xl">
            <img
              src={project.cover_image}
              alt={title}
              loading="eager"
              className="w-full cursor-zoom-in object-cover"
              onClick={() => openLightbox(project.cover_image)}
            />
          </div>
        )}

        <div className="reveal is-visible prose prose-slate mt-10 max-w-none leading-relaxed text-slate-600 dark:prose-invert dark:text-slate-300">
          <p style={{ whiteSpace: 'pre-line' }}>{description}</p>
        </div>

        {gallery.length > 0 && (
          <div className="reveal is-visible mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {gallery.map((img) => (
              <img
                key={img}
                src={img}
                alt={title}
                loading="lazy"
                className="h-32 w-full cursor-zoom-in rounded-xl object-cover transition hover:opacity-90 sm:h-40"
                onClick={() => openLightbox(img)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
