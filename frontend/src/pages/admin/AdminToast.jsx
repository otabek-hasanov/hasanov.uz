import { createContext, useCallback, useContext, useState } from 'react';

const ToastContext = createContext(() => {});

export function useToast() {
  return useContext(ToastContext);
}

export function AdminToastProvider({ children }) {
  const [message, setMessage] = useState(null);

  const show = useCallback((text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3500);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {message && (
        <div className="mb-6 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-500/10 dark:text-green-400">{message}</div>
      )}
      {children}
    </ToastContext.Provider>
  );
}
