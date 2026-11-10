import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { EventProvider } from './context/EventContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import RoleSwitcher from './components/RoleSwitcher';

// Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import EventDetailPage from './pages/EventDetailPage';
import SubmitEventPage from './pages/SubmitEventPage';
import MyEventsPage from './pages/MyEventsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';

// Modals
import TrustEngineModal from './components/TrustEngineModal';
import EvidenceViewerModal from './components/EvidenceViewerModal';
import ConfirmationModal from './components/ConfirmationModal';
import ReportModal from './components/ReportModal';
import QRModal from './components/QRModal';
import QRScannerModal from './components/QRScannerModal';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [activeEventId, setActiveEventId] = useState(null);

  // Modals state
  const [isTrustEngineOpen, setIsTrustEngineOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [evidenceEvent, setEvidenceEvent] = useState(null);
  const [confirmationEvent, setConfirmationEvent] = useState(null);
  const [reportEvent, setReportEvent] = useState(null);
  const [qrEvent, setQrEvent] = useState(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRoute, activeEventId]);

  const handleNavigate = (route) => {
    setCurrentRoute(route);
  };

  const handleViewEvent = (eventId) => {
    setActiveEventId(eventId);
    setCurrentRoute('event-detail');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        onOpenScanner={() => setIsScannerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onViewEvent={handleViewEvent}
            onOpenTrustEngine={() => setIsTrustEngineOpen(true)}
            onOpenQR={(ev) => setQrEvent(ev)}
          />
        )}

        {currentRoute === 'explore' && (
          <ExplorePage
            onViewEvent={handleViewEvent}
            onOpenTrustEngine={() => setIsTrustEngineOpen(true)}
            onOpenQR={(ev) => setQrEvent(ev)}
          />
        )}

        {currentRoute === 'event-detail' && (
          <EventDetailPage
            eventId={activeEventId}
            onBack={() => setCurrentRoute('explore')}
            onOpenConfirmation={(ev) => setConfirmationEvent(ev)}
            onOpenReport={(ev) => setReportEvent(ev)}
            onOpenEvidence={(ev) => setEvidenceEvent(ev)}
            onOpenQR={(ev) => setQrEvent(ev)}
            onOpenTrustEngine={() => setIsTrustEngineOpen(true)}
          />
        )}

        {currentRoute === 'submit' && (
          <SubmitEventPage
            onNavigate={handleNavigate}
            onViewEvent={handleViewEvent}
          />
        )}

        {currentRoute === 'my-events' && (
          <MyEventsPage
            onNavigate={handleNavigate}
            onViewEvent={handleViewEvent}
            onOpenTrustEngine={() => setIsTrustEngineOpen(true)}
            onOpenQR={(ev) => setQrEvent(ev)}
          />
        )}

        {currentRoute === 'admin' && (
          <AdminDashboardPage
            onViewEvent={handleViewEvent}
            onOpenEvidence={(ev) => setEvidenceEvent(ev)}
            onOpenTrustEngine={() => setIsTrustEngineOpen(true)}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            onOpenTrustEngine={() => setIsTrustEngineOpen(true)}
          />
        )}

        {currentRoute === 'auth' && (
          <AuthPage
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenTrustEngine={() => setIsTrustEngineOpen(true)}
      />

      {/* Demo Floating Persona Switcher */}
      <RoleSwitcher />

      {/* Global Modals */}
      <TrustEngineModal
        isOpen={isTrustEngineOpen}
        onClose={() => setIsTrustEngineOpen(false)}
      />

      <EvidenceViewerModal
        isOpen={Boolean(evidenceEvent)}
        onClose={() => setEvidenceEvent(null)}
        event={evidenceEvent}
      />

      <ConfirmationModal
        isOpen={Boolean(confirmationEvent)}
        onClose={() => setConfirmationEvent(null)}
        event={confirmationEvent}
      />

      <ReportModal
        isOpen={Boolean(reportEvent)}
        onClose={() => setReportEvent(null)}
        event={reportEvent}
      />

      <QRModal
        isOpen={Boolean(qrEvent)}
        onClose={() => setQrEvent(null)}
        event={qrEvent}
      />

      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <EventProvider>
          <AppContent />
        </EventProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
