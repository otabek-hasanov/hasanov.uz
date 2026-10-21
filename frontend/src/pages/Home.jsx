import { Suspense, lazy, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n, localePath, pickLocalized } from '../i18n';
import { useData, useReveal } from '../hooks/useData';
import { postJson } from '../api';
import TechIcon from '../components/icons/TechIcon';
import SocialIcon from '../components/icons/SocialIcon';

const Hologram = lazy(() => import('../components/Hologram'));

function HologramFallback() {
  return (
    <div className="relative mx-auto h-72 w-72 sm:h-96 sm:w-96 lg:h-[26rem] lg:w-[26rem]">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/25 via-ice-400/15 to-transparent blur-2xl animate-float-slow" />
      <div className="absolute inset-[18%] rounded-full border border-brand-400/30" />
      <div className="absolute inset-[30%] rounded-full bg-white/10 backdrop-blur-sm" />
    </div>
  );
}

function Counter({ target }) {
  const [value, setValue] = useState(0);
  const ref = useReveal2(() => {
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
  return (
    <div ref={ref} className="text-3xl font-extrabold text-brand-500">
      {value}
    </div>
  );
}

function useReveal2(onEnter) {
  const [node, setNode] = useState(null);
  useEffect(() => {
    if (!node || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onEnter(entry);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);
  return setNode;
}

function SkillRow({ skill }) {
  const ref = useReveal2((entry) => {
    const fill = entry.target.querySelector('.skill-bar-fill');
    if (fill) fill.style.width = skill.percent + '%';
  });
  return (
    <div ref={ref} className="reveal is-visible flex items-center gap-4" data-skill-row>
      <TechIcon icon={skill.icon} className="h-10 w-10" />
      <div className="flex-1">
        <div className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
          <span>{skill.name}</span>
          <span className="text-slate-400">{skill.percent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div className="skill-bar-fill h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { locale, t } = useI18n();
  const { data: profile } = useData('/profile');
  const { data: skills } = useData('/skills');
  const { data: experiences } = useData('/experiences');
  const { data: educations } = useData('/educations');
  const { data: projects } = useData('/projects?featured=1');

  useReveal();

  const title = profile ? pickLocalized(profile.title, locale) : '';
  const bio = profile ? pickLocalized(profile.bio, locale) : '';
  const social = profile?.social || {};

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  async function submitContact(e) {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const result = await postJson('/contact', { ...form, locale });
      setStatus({ ok: true, message: result.message });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      const message = err.data?.message || Object.values(err.data?.errors || {})[0]?.[0] || t('contact.error');
      setStatus({ ok: false, message });
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <section id="hero" className="hero-gradient relative flex min-h-screen items-center px-5 pt-28 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="reveal is-visible text-center lg:text-left">
            <span className="tag-chip mb-5 inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              {t('hero.available')}
            </span>

            <p className="text-lg font-medium text-brand-600 dark:text-brand-400">{t('hero.greeting')}</p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              {profile?.name || 'Hasanov'}
            </h1>
            <p className="mt-4 text-xl font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mx-auto mt-5 max-w-lg text-slate-500 lg:mx-0 dark:text-slate-400">{bio}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a href="#projects" className="btn-primary">
                {t('hero.cta_projects')}
              </a>
              <a href="#contact" className="btn-outline">
                {t('hero.cta_contact')}
              </a>
            </div>
          </div>

          <Suspense fallback={<HologramFallback />}>
            <Hologram skills={skills || []} />
          </Suspense>
        </div>

        <a
          href="#about"
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-float-slow text-slate-400 sm:block"
          aria-label={t('hero.scroll')}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </a>
      </section>

      <section id="about" className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="reveal is-visible text-center">
            <h2 className="section-heading">{t('about.title')}</h2>
            <p className="section-subheading">{t('about.subtitle')}</p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="reveal is-visible relative mx-auto w-full max-w-xs lg:col-span-4 lg:mx-0">
              <div className="absolute -inset-4 -z-10 rounded-full bg-gradient-to-br from-brand-500/25 via-ice-400/15 to-transparent blur-2xl animate-float-slow" />
              <div className="glass overflow-hidden rounded-full p-3">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    width="400"
                    height="400"
                    loading="lazy"
                    className="aspect-square w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center rounded-full bg-gradient-to-br from-brand-500/10 to-ice-400/10">
                    <span className="text-7xl font-bold text-brand-500/40">{(profile?.name || 'H')[0]}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="reveal is-visible lg:col-span-5">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">{bio}</p>
              <div className="mt-8 grid grid-cols-1 gap-4 text-sm text-slate-500 dark:text-slate-400 sm:grid-cols-2">
                {profile?.email && (
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{t('contact.email_label')}:</span> {profile.email}
                  </div>
                )}
                {profile?.phone && (
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{t('contact.phone_label')}:</span> {profile.phone}
                  </div>
                )}
                {profile?.location && (
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{t('contact.location_label')}:</span> {profile.location}
                  </div>
                )}
              </div>
              <a href="https://checkout.uz/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
                {t('about.download_resume')}
              </a>
            </div>

            <div className="reveal is-visible grid grid-cols-3 gap-4 self-start lg:col-span-3 lg:grid-cols-1">
              <div className="card p-5 text-center">
                <Counter target={profile?.years_experience || 0} />
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('stats.years_experience')}</div>
              </div>
              <div className="card p-5 text-center">
                <Counter target={profile?.projects_done || 0} />
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('stats.projects_done')}</div>
              </div>
              <div className="card p-5 text-center">
                <Counter target={profile?.happy_clients || 0} />
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t('stats.happy_clients')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="skills" className="bg-slate-100/60 px-5 py-24 lg:px-8 dark:bg-slate-900/30">
        <div className="mx-auto max-w-4xl">
          <div className="reveal is-visible text-center">
            <h2 className="section-heading">{t('skills.title')}</h2>
            <p className="section-subheading">{t('skills.subtitle')}</p>
          </div>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {(skills || []).map((skill) => (
              <SkillRow key={skill.id} skill={skill} />
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="reveal is-visible text-center">
            <h2 className="section-heading">{t('experience.title')}</h2>
            <p className="section-subheading">{t('experience.subtitle')}</p>
          </div>

          <div className="mt-14 space-y-8 border-l border-slate-200 pl-8 dark:border-slate-800">
            {(experiences || []).map((exp) => (
              <div key={exp.id} className="reveal is-visible relative">
                <span className="absolute -left-[41px] top-1 h-3 w-3 rounded-full border-2 border-white bg-brand-500 dark:border-slate-950" />
                <div className="card-hover p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{pickLocalized(exp.title, locale)}</h3>
                    <span className="text-sm text-slate-400">
                      {exp.start_date} — {exp.end_date || t('experience.present')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-brand-600 dark:text-brand-400">
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{pickLocalized(exp.description, locale)}</p>
                </div>
              </div>
            ))}
          </div>

          {educations && educations.length > 0 && (
            <>
              <div id="education" className="mt-20 reveal is-visible text-center">
                <h2 className="section-heading">{t('education.title')}</h2>
                <p className="section-subheading">{t('education.subtitle')}</p>
              </div>
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {educations.map((edu) => (
                  <div key={edu.id} className="card-hover reveal is-visible flex items-start gap-4 p-6">
                    {edu.logo && (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-sm ring-1 ring-slate-200 dark:bg-slate-100 dark:ring-slate-800">
                        <img src={edu.logo} alt={edu.institution} width="28" height="28" loading="lazy" className="h-full w-full object-contain" />
                      </span>
                    )}
                    <div>
                      <h3 className="font-semibold text-slate-800 dark:text-white">{pickLocalized(edu.title, locale)}</h3>
                      <p className="mt-1 text-sm text-brand-600 dark:text-brand-400">{edu.institution}</p>
                      <p className="mt-2 text-xs text-slate-400">
                        {edu.start_date} — {edu.end_date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section id="projects" className="bg-slate-100/60 px-5 py-24 lg:px-8 dark:bg-slate-900/30">
        <div className="mx-auto max-w-6xl">
          <div className="reveal is-visible text-center">
            <h2 className="section-heading">{t('projects.title')}</h2>
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
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{pickLocalized(project.title, locale)}</h3>
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
                      <svg className="h-4 w-4 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="reveal is-visible mt-12 text-center">
            <Link to={localePath(locale, 'projects')} className="btn-outline">
              {t('projects.view_all')}
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="reveal is-visible text-center">
            <h2 className="section-heading">{t('contact.title')}</h2>
            <p className="section-subheading">{t('contact.subtitle')}</p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-5">
            <div className="reveal is-visible card p-8 lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-white">{t('contact.info_title')}</h3>
              <ul className="mt-6 space-y-4 text-sm text-slate-500 dark:text-slate-400">
                {profile?.email && (
                  <li>
                    <strong className="text-slate-700 dark:text-slate-200">{t('contact.email_label')}:</strong>{' '}
                    <a href={`mailto:${profile.email}`} className="hover:text-brand-600">
                      {profile.email}
                    </a>
                  </li>
                )}
                {profile?.phone && (
                  <li>
                    <strong className="text-slate-700 dark:text-slate-200">{t('contact.phone_label')}:</strong> {profile.phone}
                  </li>
                )}
                {profile?.location && (
                  <li>
                    <strong className="text-slate-700 dark:text-slate-200">{t('contact.location_label')}:</strong> {profile.location}
                  </li>
                )}
              </ul>
              <div className="mt-8 flex gap-3">
                {['github', 'linkedin', 'telegram', 'instagram'].map((key) => (
                  <SocialIcon key={key} platform={key} url={social[key]} />
                ))}
              </div>
            </div>

            <form onSubmit={submitContact} className="reveal is-visible card space-y-4 p-8 lg:col-span-3">
              {status && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    status.ok
                      ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
                      : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                  }`}
                >
                  {status.message}
                </div>
              )}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  required
                  placeholder={t('contact.name_placeholder')}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field"
                />
                <input
                  type="email"
                  required
                  placeholder={t('contact.email_placeholder')}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field"
                />
              </div>
              <input
                type="text"
                placeholder={t('contact.subject_placeholder')}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="input-field"
              />
              <textarea
                rows="5"
                required
                placeholder={t('contact.message_placeholder')}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-field"
              />
              <button type="submit" disabled={sending} className="btn-primary w-full">
                {sending ? t('contact.sending') : t('contact.send')}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
