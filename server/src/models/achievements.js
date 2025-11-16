// 업적/배지 시스템
export const achievements = [
  {
    id: 'first-negotiation',
    title: '첫 협상',
    description: '첫 번째 협상을 완료했습니다',
    icon: '🎯',
    condition: (stats) => stats.completedNegotiations >= 1
  },
  {
    id: 'master-negotiator',
    title: '협상 마스터',
    description: '10번의 협상을 완료했습니다',
    icon: '👑',
    condition: (stats) => stats.completedNegotiations >= 10
  },
  {
    id: 'perfect-deal',
    title: '완벽한 딜',
    description: '호감도 90 이상으로 협상을 완료했습니다',
    icon: '⭐',
    condition: (stats) => stats.maxRapport >= 90
  },
  {
    id: 'sweet-talker',
    title: '달변가',
    description: '5번 이상 happy 상태를 만들었습니다',
    icon: '😊',
    condition: (stats) => stats.happyCount >= 5
  },
  {
    id: 'comeback-king',
    title: '역전의 명수',
    description: '호감도 30 이하에서 60 이상으로 회복했습니다',
    icon: '🔥',
    condition: (stats) => stats.hadComeback === true
  },
  {
    id: 'efficient-negotiator',
    title: '효율적인 협상가',
    description: '5턴 이내에 협상을 성공적으로 완료했습니다',
    icon: '⚡',
    condition: (stats) => stats.lastNegotiationTurns <= 5 && stats.lastNegotiationSuccess === true
  },
  {
    id: 'daily-life-expert',
    title: '일상 협상 전문가',
    description: '일상생활 카테고리 협상 3개 완료',
    icon: '🏠',
    condition: (stats) => stats.dailyLifeCompletions >= 3
  },
  {
    id: 'business-pro',
    title: '비즈니스 프로',
    description: '비즈니스 카테고리 협상 5개 완료',
    icon: '💼',
    condition: (stats) => stats.businessCompletions >= 5
  },
  {
    id: 'five-star',
    title: '별점 만점',
    description: '5성 평가를 받았습니다',
    icon: '🌟',
    condition: (stats) => stats.hasFiveStar === true
  },
  {
    id: 'persistent',
    title: '끈기있는 협상가',
    description: '15턴 이상의 긴 협상을 완료했습니다',
    icon: '🎖️',
    condition: (stats) => stats.maxTurns >= 15
  }
];

/**
 * Check which achievements are unlocked based on user stats
 */
export function checkAchievements(userStats) {
  return achievements.filter(achievement =>
    achievement.condition(userStats)
  );
}

/**
 * Get newly unlocked achievements
 */
export function getNewAchievements(previousUnlocked, currentStats) {
  const currentUnlocked = checkAchievements(currentStats);
  const previousIds = new Set(previousUnlocked.map(a => a.id));

  return currentUnlocked.filter(achievement =>
    !previousIds.has(achievement.id)
  );
}

/**
 * Calculate star rating based on negotiation performance
 */
export function calculateStarRating(analysis, emotionState) {
  const score = analysis?.negotiationScore || 50;
  const rapport = emotionState?.rapport || 50;

  // Combined score (60% negotiation score, 40% rapport)
  const finalScore = (score * 0.6) + (rapport * 0.4);

  if (finalScore >= 90) return 5;
  if (finalScore >= 75) return 4;
  if (finalScore >= 60) return 3;
  if (finalScore >= 40) return 2;
  return 1;
}
