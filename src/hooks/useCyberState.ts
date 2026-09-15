import { useState, useEffect, useCallback } from 'react';
import {
  ActivePage,
  UserProfile,
  SkillCategoryScore,
  LearningPath,
  ScenarioItem,
  BadgeItem,
  CertificateItem,
  LeaderboardUser,
  MentorInsight,
  SkillCheckResult,
  ScenarioOption,
} from '../types';
import {
  initialUserProfile,
  initialSkillScores,
  learningPathsData,
  sampleScenarios,
  initialBadges,
  initialCertificates,
  initialLeaderboard,
  defaultMentorInsight,
} from '../data/mockData';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'cybermentor_state_v2';

interface StoredState {
  user: UserProfile;
  skills: SkillCategoryScore[];
  paths: LearningPath[];
  badges: BadgeItem[];
  certificates: CertificateItem[];
  mentorInsight: MentorInsight;
  lastSkillCheck?: SkillCheckResult;
  completedScenarioIds: string[];
}

export function useCyberState() {
  const [currentPage, setCurrentPage] = useState<ActivePage>('dashboard');
  const [selectedPathId, setSelectedPathId] = useState<string>('cyber-safety-fundamentals');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-phishing-social');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scenario-univ-phish');
  const [lastScenarioDecision, setLastScenarioDecision] = useState<{
    scenario: ScenarioItem;
    option: ScenarioOption;
    previousScore: number;
    newScore: number;
  } | null>(null);

  const [isMentorDrawerOpen, setIsMentorDrawerOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [activeCertificate, setActiveCertificate] = useState<CertificateItem | null>(null);

  // Core persistent state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.user && typeof parsed.user === 'object') {
          return {
            ...initialUserProfile,
            ...parsed.user,
            avatar: parsed.user.avatar || initialUserProfile.avatar,
          };
        }
      }
    } catch {
      // ignore
    }
    return initialUserProfile;
  });

  const [skills, setSkills] = useState<SkillCategoryScore[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.skills) return parsed.skills;
      }
    } catch {
      // ignore
    }
    return initialSkillScores;
  });

  const [paths, setPaths] = useState<LearningPath[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.paths) return parsed.paths;
      }
    } catch {
      // ignore
    }
    return learningPathsData;
  });

  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.badges) return parsed.badges;
      }
    } catch {
      // ignore
    }
    return initialBadges;
  });

  const [certificates, setCertificates] = useState<CertificateItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.certificates) return parsed.certificates;
      }
    } catch {
      // ignore
    }
    return initialCertificates;
  });

  const [mentorInsight, setMentorInsight] = useState<MentorInsight>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.mentorInsight) return parsed.mentorInsight;
      }
    } catch {
      // ignore
    }
    return defaultMentorInsight;
  });

  const [lastSkillCheck, setLastSkillCheck] = useState<SkillCheckResult | undefined>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        return parsed.lastSkillCheck;
      }
    } catch {
      // ignore
    }
    return undefined;
  });

  const [completedScenarioIds, setCompletedScenarioIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredState = JSON.parse(saved);
        if (parsed.completedScenarioIds) return parsed.completedScenarioIds;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Sync to local storage
  useEffect(() => {
    try {
      const dataToStore: StoredState = {
        user,
        skills,
        paths,
        badges,
        certificates,
        mentorInsight,
        lastSkillCheck,
        completedScenarioIds,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
    } catch (e) {
      console.error('Failed to sync CyberMentor state:', e);
    }
  }, [user, skills, paths, badges, certificates, mentorInsight, lastSkillCheck, completedScenarioIds]);

  // Execute scenario decision
  const submitScenarioDecision = useCallback((scenario: ScenarioItem, option: ScenarioOption) => {
    const previousScore = user.digitalTrustScore;
    const newTrustScore = Math.max(0, Math.min(100, previousScore + option.scoreImpacts.trustScoreDelta));
    const newXP = user.currentXP + option.scoreImpacts.xpDelta;
    
    // Level up calculation if applicable (e.g. 2200 for lvl 7)
    let newLevel = user.level;
    let nextXP = user.nextLevelXP;
    if (newXP >= user.nextLevelXP) {
      newLevel += 1;
      nextXP += 500;
      confetti({ particleCount: 60, spread: 55, origin: { y: 0.6 } });
    }

    setUser(prev => ({
      ...prev,
      digitalTrustScore: newTrustScore,
      trustScoreDelta: prev.trustScoreDelta + (option.scoreImpacts.trustScoreDelta > 0 ? 1 : 0),
      currentXP: newXP,
      level: newLevel,
      nextLevelXP: nextXP,
      scenariosCompletedCount: prev.scenariosCompletedCount + 1,
    }));

    // Update skill category score
    setSkills(prev =>
      prev.map(s => {
        if (s.name.toLowerCase().includes(option.scoreImpacts.skillCategory.toLowerCase()) || 
            option.scoreImpacts.skillCategory.toLowerCase().includes(s.name.toLowerCase())) {
          const nextScore = Math.max(0, Math.min(100, s.score + option.scoreImpacts.skillCategoryDelta));
          return {
            ...s,
            score: nextScore,
            change: s.change + Math.abs(option.scoreImpacts.skillCategoryDelta),
          };
        }
        return s;
      })
    );

    // If optimal, check if badges should unlock
    if (option.isOptimal) {
      setBadges(prev =>
        prev.map(b => {
          if (b.id === 'safe-decision-maker' && !b.unlocked) {
            return { ...b, unlocked: true, unlockedDate: 'Today' };
          }
          if (scenario.id === 'scenario-mfa-fatigue' && b.id === 'mfa-guardian' && !b.unlocked) {
            return { ...b, unlocked: true, unlockedDate: 'Today' };
          }
          return b;
        })
      );
    }

    setCompletedScenarioIds(prev => Array.from(new Set([...prev, scenario.id])));

    setLastScenarioDecision({
      scenario,
      option,
      previousScore,
      newScore: newTrustScore,
    });

    // Navigate to AI feedback page
    setCurrentPage('ai-feedback');
  }, [user]);

  // Complete Skill Assessment
  const completeSkillCheck = useCallback((result: SkillCheckResult) => {
    setLastSkillCheck(result);
    setUser(prev => ({
      ...prev,
      digitalTrustScore: result.digitalTrustScore,
      trustScoreDelta: 6,
    }));

    // Unlock First Steps badge
    setBadges(prev =>
      prev.map(b => (b.id === 'first-steps' ? { ...b, unlocked: true, unlockedDate: 'Today' } : b))
    );

    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  }, []);

  // Complete a module step / advance progress
  const updateModuleProgress = useCallback((pathId: string, moduleId: string, progressDelta: number) => {
    setPaths(prev =>
      prev.map(path => {
        if (path.id !== pathId) return path;

        const updatedModules = path.modules.map(mod => {
          if (mod.id !== moduleId) return mod;
          const nextProgress = Math.min(100, Math.max(0, mod.progress + progressDelta));
          const completed = nextProgress >= 100;
          return {
            ...mod,
            progress: nextProgress,
            isCompleted: completed,
          };
        });

        // calculate overall path progress
        const totalModProgress = updatedModules.reduce((acc, m) => acc + m.progress, 0);
        const overallPathProgress = updatedModules.length > 0 ? Math.round(totalModProgress / updatedModules.length) : path.progress;

        return {
          ...path,
          progress: overallPathProgress,
          modules: updatedModules,
        };
      })
    );

    setUser(prev => ({
      ...prev,
      currentXP: prev.currentXP + 35,
    }));
  }, []);

  // Reset to default mock data
  const resetAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(initialUserProfile);
    setSkills(initialSkillScores);
    setPaths(learningPathsData);
    setBadges(initialBadges);
    setCertificates(initialCertificates);
    setMentorInsight(defaultMentorInsight);
    setLastSkillCheck(undefined);
    setCompletedScenarioIds([]);
    setCurrentPage('dashboard');
  }, []);

  const navigateTo = useCallback((page: ActivePage, params?: { pathId?: string; moduleId?: string; scenarioId?: string }) => {
    if (params?.pathId) setSelectedPathId(params.pathId);
    if (params?.moduleId) setSelectedModuleId(params.moduleId);
    if (params?.scenarioId) setSelectedScenarioId(params.scenarioId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    currentPage,
    setCurrentPage,
    navigateTo,
    user,
    setUser,
    skills,
    paths,
    badges,
    certificates,
    mentorInsight,
    setMentorInsight,
    lastSkillCheck,
    completedScenarioIds,
    selectedPathId,
    setSelectedPathId,
    selectedModuleId,
    setSelectedModuleId,
    selectedScenarioId,
    setSelectedScenarioId,
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
    leaderboard: initialLeaderboard.map(u => 
      u.isCurrentUser 
        ? { ...u, trustScore: user.digitalTrustScore, xp: user.currentXP, level: user.level } 
        : u
    ),
    scenarios: sampleScenarios,
  };
}
