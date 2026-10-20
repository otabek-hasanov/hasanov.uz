import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom';
import { I18nProvider, SUPPORTED_LOCALES, DEFAULT_LOCALE } from './i18n';
import { LightboxProvider } from './components/Lightbox';
import Layout from './components/Layout';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';

const AdminApp = lazy(() => import('./pages/admin/AdminApp'));

function LocaleGate() {
  const { locale } = useParams();
  const location = useLocation();

  if (!SUPPORTED_LOCALES.includes(locale)) {
    const rest = location.pathname.replace(/^\/[^/]+/, '');
    return <Navigate to={`/${DEFAULT_LOCALE}${rest}${location.search}${location.hash}`} replace />;
  }

  return (
    <I18nProvider>
      <Layout />
    </I18nProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LightboxProvider>
        <Routes>
          <Route path="/" element={<Navigate to={`/${DEFAULT_LOCALE}`} replace />} />
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={null}>
                <AdminApp />
              </Suspense>
            }
          />
          <Route path="/:locale" element={<LocaleGate />}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </LightboxProvider>
    </BrowserRouter>
  );
}
