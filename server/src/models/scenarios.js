// 협상 시나리오 데이터
export const scenarios = [
  {
    id: 'salary-negotiation',
    title: '연봉 협상',
    description: '새로운 직장에서 채용 담당자와 연봉을 협상합니다.',
    difficulty: 'medium',
    category: 'career',
    npcProfile: {
      role: '인사팀 매니저',
      personality: '전문적이고 분석적이며, 회사의 예산을 지켜야 합니다',
      goals: '우수한 인재를 합리적인 연봉으로 채용',
      constraints: '예산 범위: 4000만원 ~ 5500만원',
      startingPosition: '연봉 4500만원 제안'
    },
    userGoals: [
      '가능한 높은 연봉 확보',
      '추가 복지 혜택 협상',
      '성과급 조건 논의'
    ],
    tips: [
      '시장 조사 데이터를 활용하세요',
      '본인의 가치를 구체적으로 설명하세요',
      '대안을 제시하세요 (복지, 성과급 등)'
    ]
  },
  {
    id: 'vendor-contract',
    title: '공급업체 계약',
    description: '소프트웨어 구매를 위해 공급업체와 가격과 조건을 협상합니다.',
    difficulty: 'hard',
    category: 'business',
    npcProfile: {
      role: 'B2B 영업 담당자',
      personality: '설득력 있고 친근하며, 딜을 성사시키려 노력합니다',
      goals: '최대한 높은 가격으로 계약 체결',
      constraints: '최소 할인율: 20%, 계약 기간: 최소 2년',
      startingPosition: '연간 라이선스 $50,000, 1년 계약'
    },
    userGoals: [
      '가격 할인 확보',
      '유연한 계약 조건',
      '추가 서비스 포함'
    ],
    tips: [
      '경쟁사 가격을 언급하세요',
      '장기 계약을 협상 카드로 사용하세요',
      '단계적 도입을 제안하세요'
    ]
  },
  {
    id: 'client-deadline',
    title: '프로젝트 마감일 협상',
    description: '비현실적인 마감일을 요구하는 클라이언트와 협상합니다.',
    difficulty: 'easy',
    category: 'project-management',
    npcProfile: {
      role: '프로젝트 클라이언트',
      personality: '급하고 요구사항이 많지만, 품질을 중요시합니다',
      goals: '가능한 빨리 프로젝트 완료',
      constraints: '예산 초과 불가, 품질 타협 불가',
      startingPosition: '2주 내 완료 요구'
    },
    userGoals: [
      '현실적인 타임라인 확보',
      '추가 리소스 요청',
      '범위 조정'
    ],
    tips: [
      '리스크를 명확히 설명하세요',
      '단계별 배포를 제안하세요',
      'MVP 접근법을 제시하세요'
    ]
  },
  {
    id: 'real-estate',
    title: '부동산 가격 협상',
    description: '아파트 매매가격을 협상합니다.',
    difficulty: 'medium',
    category: 'personal',
    npcProfile: {
      role: '부동산 중개인',
      personality: '경험이 많고 시장을 잘 알고 있으며, 거래 성사를 원합니다',
      goals: '매도자와 매수자 모두 만족하는 가격 도출',
      constraints: '매도자 최저가: 5억 5천, 현재 호가: 6억',
      startingPosition: '6억원 호가'
    },
    userGoals: [
      '가격 인하',
      '하자 수리 요구',
      '이사 시기 조정'
    ],
    tips: [
      '주변 시세를 조사하세요',
      '건물의 단점을 근거로 제시하세요',
      '현금 매수 등 강점을 활용하세요'
    ]
  },
  {
    id: 'team-resource',
    title: '팀 리소스 배분',
    description: '다른 부서 리더와 개발자 리소스 배분을 협상합니다.',
    difficulty: 'hard',
    category: 'management',
    npcProfile: {
      role: '다른 팀 리더',
      personality: '경쟁적이고 자기 팀 우선이지만, 회사 전체 이익도 고려합니다',
      goals: '자신의 팀에 최고의 개발자 확보',
      constraints: '상위 경영진의 공정성 기대',
      startingPosition: '시니어 개발자 2명 요구'
    },
    userGoals: [
      '충분한 인력 확보',
      '적절한 역량 분배',
      '협력 관계 유지'
    ],
    tips: [
      'Win-Win 솔루션을 찾으세요',
      '데이터로 필요성을 입증하세요',
      '협업 방안을 제시하세요'
    ]
  }
];

export const getScenarioById = (id) => {
  return scenarios.find(s => s.id === id);
};

export const getScenariosByCategory = (category) => {
  return scenarios.filter(s => s.category === category);
};

export const getScenariosByDifficulty = (difficulty) => {
  return scenarios.filter(s => s.difficulty === difficulty);
};
