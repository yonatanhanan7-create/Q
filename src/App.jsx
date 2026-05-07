import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

import Banner from './components/Banner.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import StatsBar from './components/StatsBar.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Strategy from './components/Strategy.jsx';
import Dashboard from './components/Dashboard.jsx';
import RiskWarning from './components/RiskWarning.jsx';
import Terms from './components/Terms.jsx';
import RiskDisclosure from './components/RiskDisclosure.jsx';
import Footer from './components/Footer.jsx';

const ROUTES = ['home', 'dashboard', 'terms', 'risk'];

function getViewFromHash() {
  const hash = window.location.hash.replace('#/', '');
  return ROUTES.includes(hash) ? hash : 'home';
}

export default function App() {
  const { isConnected } = useAccount();
  const [view, setView] = useState(getViewFromHash);

  useEffect(() => {
    const onHash = () => setView(getViewFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const navigate = (next) => {
    window.location.hash = next === 'home' ? '' : `/${next}`;
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans">
      <Banner />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] grid-bg" />

      <Navbar
        onNavigate={navigate}
        currentView={view}
        showDashboardLink={isConnected}
      />

      <main className="relative">
        {view === 'dashboard' && <Dashboard />}
        {view === 'terms' && <Terms />}
        {view === 'risk' && <RiskDisclosure />}
        {view === 'home' && (
          <>
            <Hero onLaunchApp={() => navigate('dashboard')} />
            <StatsBar />
            <HowItWorks />
            <Strategy />
            {isConnected && (
              <section
                id="dashboard"
                className="mx-auto max-w-7xl px-6 py-20"
              >
                <Dashboard embedded />
              </section>
            )}
            <RiskWarning onLearnMore={() => navigate('risk')} />
          </>
        )}
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
