import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const LightboxContext = createContext(() => {});

export function useLightbox() {
  return useContext(LightboxContext);
}

export function LightboxProvider({ children }) {
  const [src, setSrc] = useState(null);
  const open = useCallback((url) => setSrc(url), []);
  const close = useCallback(() => setSrc(null), []);

  useEffect(() => {
    document.body.classList.toggle('lightbox-open', !!src);
    if (!src) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [src, close]);

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 p-6 cursor-zoom-out ${src ? '' : 'hidden'}`}
        onClick={close}
      >
        {src && <img src={src} alt="" className="max-h-[85vh] max-w-full rounded-lg shadow-2xl" />}
      </div>
    </LightboxContext.Provider>
  );
}
