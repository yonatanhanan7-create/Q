import { useState } from 'react';
import { useAccount } from 'wagmi';

import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import StatsBar from './components/StatsBar.jsx';
import HowItWorks from './components/HowItWorks.jsx';
import Strategy from './components/Strategy.jsx';
import Dashboard from './components/Dashboard.jsx';
import RiskWarning from './components/RiskWarning.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const { isConnected } = useAccount();
  const [view, setView] = useState('home');

  const showDashboard = view === 'dashboard' || isConnected;

  return (
    <div className="relative min-h-screen overflow-x-hidden font-sans">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] grid-bg" />

      <Navbar
        onNavigate={setView}
        currentView={view}
        showDashboardLink={isConnected}
      />

      <main className="relative">
        {view === 'dashboard' ? (
          <Dashboard />
        ) : (
          <>
            <Hero onLaunchApp={() => setView('dashboard')} />
            <StatsBar />
            <HowItWorks />
            <Strategy />
            {showDashboard && (
              <section id="dashboard" className="mx-auto max-w-7xl px-6 py-20">
                <Dashboard embedded />
              </section>
            )}
          </>
        )}
        <RiskWarning />
      </main>

      <Footer />
    </div>
  );
}
