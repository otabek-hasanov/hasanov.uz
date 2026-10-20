import { Link } from 'react-router-dom';
import { useI18n, localePath } from '../i18n';

export default function NotFound() {
  const { locale, t } = useI18n();
  return (
    <section className="flex min-h-screen items-center px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-lg text-center">
        <p className="text-7xl font-extrabold text-brand-500">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-800 dark:text-white">{t('errors.not_found')}</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">{t('errors.not_found_desc')}</p>
        <Link to={localePath(locale)} className="btn-primary mt-8">
          {t('errors.back_home')}
        </Link>
      </div>
    </section>
  );
}
