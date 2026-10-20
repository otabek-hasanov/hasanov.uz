import { useI18n } from '../i18n';
import SocialIcon from './icons/SocialIcon';

export default function Footer({ profile }) {
  const { t } = useI18n();
  const social = profile?.social || {};
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-20 border-t border-slate-200/70 bg-white/60 py-10 backdrop-blur dark:border-slate-800 dark:bg-ink-950/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center lg:px-8">
        <div className="text-lg font-bold text-slate-900 dark:text-white">
          Hasanov<span className="text-brand-500">.</span>
        </div>

        <div className="flex items-center gap-3">
          {['github', 'linkedin', 'telegram', 'instagram'].map((key) => (
            <SocialIcon key={key} platform={key} url={social[key]} />
          ))}
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          &copy; {year} Hasanov.uz — {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}
