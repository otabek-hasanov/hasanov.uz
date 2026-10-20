import { Outlet } from 'react-router-dom';
import { useData } from '../hooks/useData';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';

export default function Layout() {
  const { data: profile } = useData('/profile');

  return (
    <>
      <Navbar />
      <main className="relative z-10" tabIndex={-1}>
        <Outlet context={{ profile }} />
      </main>
      <Footer profile={profile} />
      <BackToTop />
    </>
  );
}
