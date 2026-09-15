import React, { useState } from 'react';
import { useCyberState } from './hooks/useCyberState';
import { ActivePage, CertificateItem } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { AiMentorDrawer } from './components/common/AiMentorDrawer';
import { CertificateModal } from './components/common/CertificateModal';

// Pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { SkillCheckPage } from './pages/SkillCheckPage';
import { DashboardPage } from './pages/DashboardPage';
import { LearningPathsPage } from './pages/LearningPathsPage';
import { ModuleDetailPage } from './pages/ModuleDetailPage';
import { ScenarioPage } from './pages/ScenarioPage';
import { AiFeedbackPage } from './pages/AiFeedbackPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const {
    currentPage,
    setCurrentPage,
    navigateTo,
    user,
    setUser,
    paths,
    scenarios,
    selectedScenarioId,
    setSelectedScenarioId,
    selectedPathId,
    setSelectedPathId,
    selectedModuleId,
    setSelectedModuleId,
    skills,
    badges,
    certificates,
    mentorInsight,
    lastSkillCheck,
    lastScenarioDecision,
    submitScenarioDecision,
    completeSkillCheck,
    updateModuleProgress,
    resetAllData,
    isMentorDrawerOpen,
    setIsMentorDrawerOpen,
    isCertificateModalOpen,
    setIsCertificateModalOpen,
    activeCertificate,
    setActiveCertificate,
  } = useCyberState();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const activePage = currentPage;
  const handleNavigate = navigateTo;

  // Standalone pages that don't need the dashboard shell (sidebar/navbar)
  const isStandalonePage = activePage === 'landing' || activePage === 'auth';

  return (
    <div className="min-h-screen bg-[#080d19] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {isStandalonePage ? (
        // Standalone Layout (Landing or Auth)
        <main className="flex-1 w-full">
          {activePage === 'landing' && (
            <LandingPage onNavigate={handleNavigate} paths={paths} />
          )}
          {activePage === 'auth' && (
            <AuthPage
              onNavigate={handleNavigate}
              user={user}
              setUser={setUser}
            />
          )}
        </main>
      ) : (
        // Main Student Application Shell
        <div className="flex flex-1 w-full min-h-screen">
          {/* Desktop Sidebar Navigation */}
          <Sidebar
            currentPage={activePage}
            activePage={activePage}
            user={user}
            onNavigate={handleNavigate}
            onOpenMentor={() => setIsMentorDrawerOpen(true)}
            unreadNotificationsCount={2}
          />

          {/* Right Main Stage */}
          <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
            {/* Top Utility Navbar */}
            <Navbar
              user={user}
              currentPage={activePage}
              activePage={activePage}
              onNavigate={handleNavigate}
              onOpenMentor={() => setIsMentorDrawerOpen(true)}
              onToggleMobileNav={() => setIsMobileNavOpen(true)}
            />

            {/* Page Router */}
            <main className="flex-1 overflow-y-auto">
              {activePage === 'skill-check' && (
                <SkillCheckPage
                  onNavigate={handleNavigate}
                  onCompleteSkillCheck={completeSkillCheck}
                  lastResult={lastSkillCheck || undefined}
                />
              )}

              {activePage === 'dashboard' && (
                <DashboardPage
                  user={user}
                  paths={paths}
                  mentorInsight={mentorInsight}
                  onNavigate={handleNavigate}
                  onOpenMentor={() => setIsMentorDrawerOpen(true)}
                />
              )}

              {activePage === 'learning-paths' && (
                <LearningPathsPage
                  paths={paths}
                  onNavigate={handleNavigate}
                  selectedPathId={selectedPathId}
                />
              )}

              {activePage === 'module-detail' && (
                <ModuleDetailPage
                  paths={paths}
                  selectedPathId={selectedPathId}
                  selectedModuleId={selectedModuleId}
                  onNavigate={handleNavigate}
                  onUpdateModuleProgress={updateModuleProgress}
                />
              )}

              {activePage === 'interactive-scenario' && (
                <ScenarioPage
                  scenarios={scenarios}
                  selectedScenarioId={selectedScenarioId}
                  onSelectScenarioId={setSelectedScenarioId}
                  onSubmitDecision={(scenario, option) => {
                    submitScenarioDecision(scenario, option);
                  }}
                  onNavigate={handleNavigate}
                />
              )}

              {activePage === 'ai-feedback' && (
                <AiFeedbackPage
                  decisionData={lastScenarioDecision}
                  onNavigate={handleNavigate}
                  onOpenMentor={() => setIsMentorDrawerOpen(true)}
                />
              )}

              {activePage === 'progress-analytics' && (
                <AnalyticsPage
                  user={user}
                  skills={skills}
                  onNavigate={handleNavigate}
                />
              )}

              {(activePage === 'badges' || (activePage as string) === 'achievements') && (
                <AchievementsPage
                  user={user}
                  badges={badges}
                  certificates={certificates}
                  onOpenCertificate={(cert) => {
                    setActiveCertificate(cert);
                    setIsCertificateModalOpen(true);
                  }}
                  onNavigate={handleNavigate}
                />
              )}

              {activePage === 'leaderboard' && (
                <LeaderboardPage user={user} onNavigate={handleNavigate} />
              )}

              {activePage === 'profile' && (
                <ProfilePage
                  user={user}
                  badges={badges}
                  paths={paths}
                  onNavigate={handleNavigate}
                />
              )}

              {activePage === 'settings' && (
                <SettingsPage
                  user={user}
                  setUser={setUser}
                  onResetData={resetAllData}
                  onNavigate={handleNavigate}
                />
              )}
            </main>
          </div>

          {/* Mobile Bottom Navigation Bar & Drawer */}
          <MobileNav
            isOpen={isMobileNavOpen}
            onClose={() => setIsMobileNavOpen(false)}
            currentPage={activePage}
            activePage={activePage}
            onNavigate={(page) => {
              handleNavigate(page);
              setIsMobileNavOpen(false);
            }}
            onOpenMentor={() => {
              setIsMobileNavOpen(false);
              setIsMentorDrawerOpen(true);
            }}
          />
        </div>
      )}

      {/* Signature CyberMentor AI Interactive Drawer */}
      <AiMentorDrawer
        isOpen={isMentorDrawerOpen}
        onClose={() => setIsMentorDrawerOpen(false)}
        user={user}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      {/* Academic Certificate Modal */}
      {isCertificateModalOpen && activeCertificate && (
        <CertificateModal
          certificate={activeCertificate}
          user={user}
          onClose={() => {
            setIsCertificateModalOpen(false);
            setActiveCertificate(null);
          }}
        />
      )}
    </div>
  );
}
