// 협상 시나리오 데이터
export const scenarios = [
  {
    id: 'salary-negotiation',
    title: '연봉 협상',
    description: '새로운 직장에서 채용 담당자와 연봉을 협상합니다.',
    difficulty: 'medium',
    category: 'career',
    background: {
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
      gradient: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))'
    },
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
    background: {
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80',
      gradient: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))'
    },
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
    background: {
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1920&q=80',
      gradient: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))'
    },
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
    background: {
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80',
      gradient: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))'
    },
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
    background: {
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80',
      gradient: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))'
    },
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
  },
  {
    id: 'second-hand-deal',
    title: '중고 노트북 거래',
    description: '당근마켓에서 중고 노트북을 구매하려고 판매자와 가격을 협상합니다.',
    difficulty: 'easy',
    category: 'daily-life',
    background: {
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1920&q=80',
      gradient: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))'
    },
    npcProfile: {
      role: '중고 노트북 판매자',
      personality: '친절하지만 자신의 물건 가치를 잘 알고 있으며, 빨리 팔고 싶어합니다',
      goals: '합리적인 가격에 빠르게 판매',
      constraints: '최저 희망가: 45만원, 호가: 55만원',
      startingPosition: '55만원에 판매 희망, 약간의 협상 가능'
    },
    userGoals: [
      '최대한 저렴한 가격에 구매',
      '제품 상태 확인 및 보증 요구',
      '직거래 장소/시간 조율'
    ],
    tips: [
      '중고나라 등 다른 플랫폼 시세를 언급하세요',
      '제품의 단점(스크래치, 배터리 성능 등)을 근거로 제시하세요',
      '현금 즉시 거래를 강점으로 활용하세요'
    ]
  },
  {
    id: 'roommate-chores',
    title: '룸메이트와 집안일 분담',
    description: '함께 사는 룸메이트와 청소, 설거지 등 집안일 분담을 협상합니다.',
    difficulty: 'easy',
    category: 'daily-life',
    background: {
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&q=80',
      gradient: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))'
    },
    npcProfile: {
      role: '룸메이트',
      personality: '느긋하고 친근하지만 집안일에 소극적이며, 공정함을 중요하게 생각합니다',
      goals: '자신이 싫어하는 일은 피하고 싶음',
      constraints: '공평한 분담은 인정함, 바쁜 일정',
      startingPosition: '각자 알아서 하자는 입장'
    },
    userGoals: [
      '공평한 집안일 분담',
      '명확한 규칙 정하기',
      '좋은 관계 유지'
    ],
    tips: [
      '각자의 일정과 선호도를 고려하세요',
      '로테이션 시스템을 제안하세요',
      '작은 것부터 시작해서 점진적으로 개선하세요'
    ]
  },
  {
    id: 'gym-membership',
    title: '헬스장 등록 할인',
    description: '동네 헬스장에서 회원 등록 시 가격 할인을 협상합니다.',
    difficulty: 'easy',
    category: 'daily-life',
    background: {
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80',
      gradient: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7))'
    },
    npcProfile: {
      role: '헬스장 관장',
      personality: '친절하고 장사를 잘하고 싶어하며, 장기 회원을 선호합니다',
      goals: '신규 회원 유치 및 장기 등록 유도',
      constraints: '기본 3개월 등록 시 월 6만원, 최대 할인 30%',
      startingPosition: '3개월 18만원 (월 6만원)'
    },
    userGoals: [
      '할인된 가격에 등록',
      'PT나 부가 서비스 혜택',
      '유연한 환불 조건'
    ],
    tips: [
      '장기 등록을 조건으로 할인을 요청하세요',
      '친구 소개나 지인 추천을 언급하세요',
      '주변 다른 헬스장 가격을 비교하세요'
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
