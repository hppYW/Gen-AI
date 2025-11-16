import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NegotiationGuidePage.css';

function NegotiationGuidePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basics');

  const techniques = [
    {
      id: 'batna',
      title: 'BATNA (Best Alternative To a Negotiated Agreement)',
      icon: '🎯',
      description: '협상이 결렬될 경우의 최선의 대안',
      details: '협상에 임하기 전에 항상 BATNA를 준비하세요. 이것이 있으면 협상에서 불리한 조건을 거부할 수 있는 힘이 생깁니다.',
      example: '예시: 연봉 협상 시 다른 회사의 오퍼를 받아두면 현재 회사와의 협상력이 강해집니다.'
    },
    {
      id: 'anchoring',
      title: '앵커링 (Anchoring)',
      icon: '⚓',
      description: '첫 제안으로 협상의 기준점을 설정',
      details: '먼저 제안하는 쪽이 협상의 범위를 정할 수 있습니다. 합리적이면서도 야심찬 첫 제안을 하세요.',
      example: '예시: "이 프로젝트의 적정 가격은 500만원입니다" → 상대방의 생각이 이 금액 주변으로 고정됨'
    },
    {
      id: 'mirroring',
      title: '미러링 (Mirroring)',
      icon: '🪞',
      description: '상대방의 말이나 행동을 반영하여 공감대 형성',
      details: '상대방의 마지막 단어나 핵심 문구를 반복하면 더 많은 정보를 얻을 수 있고 신뢰를 구축할 수 있습니다.',
      example: '상대: "예산이 부족해요." → 당신: "예산이 부족하시군요?" → 상대가 더 자세히 설명함'
    },
    {
      id: 'silence',
      title: '전략적 침묵 (Strategic Silence)',
      icon: '🤐',
      description: '침묵을 활용해 상대방이 더 많이 말하게 만들기',
      details: '제안 후 침묵하세요. 불편한 침묵을 견디지 못하고 상대방이 먼저 양보하거나 추가 정보를 제공할 수 있습니다.',
      example: '당신이 가격을 제시한 후 → 침묵 → 상대방이 먼저 "그럼 중간에서..." 라고 양보 제안'
    },
    {
      id: 'winwin',
      title: '윈-윈 접근 (Win-Win Approach)',
      icon: '🤝',
      description: '양측 모두 이익을 얻는 해결책 찾기',
      details: '협상을 제로섬 게임이 아닌 파이를 키우는 과정으로 생각하세요. 상대방의 진짜 니즈를 파악하면 창의적인 해결책을 찾을 수 있습니다.',
      example: '가격 협상 → 대신 장기 계약, 추가 서비스, 추천 등 다른 가치를 교환'
    },
    {
      id: 'labeling',
      title: '감정 라벨링 (Labeling)',
      icon: '🏷️',
      description: '상대방의 감정을 언어로 표현하여 공감 표시',
      details: '"~처럼 보이네요", "~하신 것 같습니다"로 상대방의 감정을 인정하면 방어적 태도가 줄어듭니다.',
      example: '"이 제안이 부담스러우신 것 같네요" → 상대방이 진짜 우려사항을 털어놓기 시작'
    }
  ];

  const communicationTips = [
    {
      icon: '👂',
      title: '적극적 경청',
      content: '상대방의 말을 끊지 말고 끝까지 들으세요. 진짜 니즈를 파악하는 것이 핵심입니다.'
    },
    {
      icon: '❓',
      title: '개방형 질문',
      content: '"예/아니오"로 답할 수 없는 질문을 하세요. "어떻게 생각하세요?", "왜 그렇게 생각하시나요?"'
    },
    {
      icon: '😊',
      title: '긍정적 언어',
      content: '"안 됩니다" 대신 "이런 방법은 어떨까요?"로 대안을 제시하세요.'
    },
    {
      icon: '🎭',
      title: '감정 조절',
      content: '화가 나도 침착함을 유지하세요. 감정적이 되면 판단력이 흐려집니다.'
    },
    {
      icon: '📊',
      title: '데이터 활용',
      content: '객관적인 데이터나 시장 조사 결과를 제시하면 설득력이 높아집니다.'
    },
    {
      icon: '⏰',
      title: '타이밍',
      content: '중요한 제안은 상대방이 지치지 않았을 때 하세요. 끝에 가까워질수록 양보하기 쉽습니다.'
    }
  ];

  const mistakes = [
    {
      icon: '❌',
      title: '너무 빨리 양보하기',
      description: '첫 제안에서 바로 양보하면 더 많이 양보할 것으로 예상됩니다.'
    },
    {
      icon: '🗣️',
      title: '너무 많이 말하기',
      description: '정보를 과도하게 제공하면 협상력이 약해집니다. 듣는 것이 말하는 것보다 중요합니다.'
    },
    {
      icon: '😤',
      title: '감정적으로 반응하기',
      description: '모욕이나 낮은 제안에 감정적으로 반응하면 불리해집니다. 침착함을 유지하세요.'
    },
    {
      icon: '🎯',
      title: '목표 없이 시작하기',
      description: '명확한 목표와 최저선이 없으면 불리한 합의를 할 수 있습니다.'
    },
    {
      icon: '💪',
      title: '너무 공격적이기',
      description: '상대방을 적으로 만들면 협력적 해결책을 찾기 어렵습니다.'
    },
    {
      icon: '📝',
      title: '서면화하지 않기',
      description: '구두 합의만 하면 나중에 분쟁이 생길 수 있습니다. 반드시 문서화하세요.'
    }
  ];

  const scenarios = [
    {
      title: '연봉 협상',
      tips: [
        '시장 조사를 통해 적정 연봉 범위 파악',
        '자신의 성과와 기여도를 구체적인 수치로 준비',
        '연봉 외 복리후생, 재택근무 등 다른 협상 카드 준비',
        '첫 제안은 희망 금액보다 10-20% 높게 시작'
      ]
    },
    {
      title: '프로젝트 계약',
      tips: [
        '프로젝트 범위를 명확히 정의하고 문서화',
        '추가 작업에 대한 요율 미리 합의',
        '중간 점검 일정과 결제 조건 명시',
        '불가항력 상황에 대한 조항 포함'
      ]
    },
    {
      title: '납품 조건',
      tips: [
        '배송 일정, 품질 기준 구체적으로 명시',
        '지연 시 페널티와 보상 조건 합의',
        '수량 할인이나 장기 계약 옵션 제안',
        '샘플 또는 시범 운영 기간 제안'
      ]
    }
  ];

  return (
    <div className="guide-page">
      <header className="guide-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
        <h1>📚 협상 기술 가이드북</h1>
        <p className="subtitle">성공적인 협상을 위한 실전 전략과 테크닉</p>
      </header>

      <div className="guide-tabs">
        <button
          className={`tab ${activeTab === 'basics' ? 'active' : ''}`}
          onClick={() => setActiveTab('basics')}
        >
          기본 원칙
        </button>
        <button
          className={`tab ${activeTab === 'techniques' ? 'active' : ''}`}
          onClick={() => setActiveTab('techniques')}
        >
          협상 기술
        </button>
        <button
          className={`tab ${activeTab === 'communication' ? 'active' : ''}`}
          onClick={() => setActiveTab('communication')}
        >
          커뮤니케이션
        </button>
        <button
          className={`tab ${activeTab === 'mistakes' ? 'active' : ''}`}
          onClick={() => setActiveTab('mistakes')}
        >
          피해야 할 실수
        </button>
        <button
          className={`tab ${activeTab === 'scenarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('scenarios')}
        >
          시나리오별 팁
        </button>
      </div>

      <div className="guide-content">
        {activeTab === 'basics' && (
          <div className="tab-content">
            <h2>협상의 기본 원칙</h2>

            <div className="principle-card">
              <h3>1. 🎯 명확한 목표 설정</h3>
              <p>협상에 임하기 전에 다음을 명확히 하세요:</p>
              <ul>
                <li><strong>최상의 결과</strong>: 이상적으로 얻고 싶은 것</li>
                <li><strong>목표 결과</strong>: 현실적으로 달성 가능한 것</li>
                <li><strong>최저선</strong>: 이것보다 낮으면 협상을 중단할 기준</li>
              </ul>
            </div>

            <div className="principle-card">
              <h3>2. 🔍 정보 수집</h3>
              <p>상대방에 대해 최대한 많이 알아내세요:</p>
              <ul>
                <li>상대방의 니즈와 우선순위는?</li>
                <li>시장 평균 가격이나 조건은?</li>
                <li>상대방의 BATNA는 무엇일까?</li>
                <li>협상에 영향을 미치는 외부 요인은?</li>
              </ul>
            </div>

            <div className="principle-card">
              <h3>3. 🤝 관계 구축</h3>
              <p>협상은 일회성이 아닙니다:</p>
              <ul>
                <li>장기적 관계를 고려한 윤리적 협상</li>
                <li>상대방을 존중하고 신뢰 구축</li>
                <li>감정적이 되지 말고 문제에 집중</li>
              </ul>
            </div>

            <div className="principle-card">
              <h3>4. 🎨 창의적 문제 해결</h3>
              <p>가격만이 협상 요소가 아닙니다:</p>
              <ul>
                <li>납품 일정, 결제 조건, 품질 기준</li>
                <li>추가 서비스, 교육, 지원</li>
                <li>장기 계약, 독점권, 우선권</li>
                <li>여러 요소를 조합한 패키지 딜</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'techniques' && (
          <div className="tab-content">
            <h2>핵심 협상 기술</h2>
            <div className="techniques-grid">
              {techniques.map((technique) => (
                <div key={technique.id} className="technique-card">
                  <div className="technique-header">
                    <span className="technique-icon">{technique.icon}</span>
                    <h3>{technique.title}</h3>
                  </div>
                  <p className="technique-description">{technique.description}</p>
                  <p className="technique-details">{technique.details}</p>
                  <div className="technique-example">
                    <strong>💡 {technique.example}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'communication' && (
          <div className="tab-content">
            <h2>효과적인 커뮤니케이션 전략</h2>
            <div className="tips-grid">
              {communicationTips.map((tip, index) => (
                <div key={index} className="tip-card">
                  <span className="tip-icon">{tip.icon}</span>
                  <h3>{tip.title}</h3>
                  <p>{tip.content}</p>
                </div>
              ))}
            </div>

            <div className="dialogue-examples">
              <h3>좋은 대화 vs 나쁜 대화</h3>

              <div className="example-comparison">
                <div className="bad-example">
                  <h4>❌ 나쁜 예시</h4>
                  <div className="dialogue">
                    <p><strong>상대:</strong> "이 가격은 너무 비쌉니다."</p>
                    <p><strong>당신:</strong> "아니요, 이게 정상 가격입니다."</p>
                  </div>
                  <p className="explanation">→ 방어적이고 대화가 막힙니다.</p>
                </div>

                <div className="good-example">
                  <h4>✅ 좋은 예시</h4>
                  <div className="dialogue">
                    <p><strong>상대:</strong> "이 가격은 너무 비쌉니다."</p>
                    <p><strong>당신:</strong> "가격이 부담스러우신 것 같네요. 어떤 부분이 특히 우려되시나요?"</p>
                  </div>
                  <p className="explanation">→ 감정을 인정하고 더 깊은 대화로 이어집니다.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'mistakes' && (
          <div className="tab-content">
            <h2>협상에서 피해야 할 실수</h2>
            <div className="mistakes-grid">
              {mistakes.map((mistake, index) => (
                <div key={index} className="mistake-card">
                  <span className="mistake-icon">{mistake.icon}</span>
                  <h3>{mistake.title}</h3>
                  <p>{mistake.description}</p>
                </div>
              ))}
            </div>

            <div className="warning-box">
              <h3>⚠️ 협상 중단을 고려해야 할 때</h3>
              <ul>
                <li>상대방이 비윤리적이거나 불법적인 제안을 할 때</li>
                <li>최저선 아래로 조건이 내려갈 때</li>
                <li>상대방이 악의적으로 시간을 끌거나 속일 때</li>
                <li>BATNA가 현재 제안보다 확실히 좋을 때</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'scenarios' && (
          <div className="tab-content">
            <h2>시나리오별 협상 팁</h2>
            {scenarios.map((scenario, index) => (
              <div key={index} className="guide-scenario-card">
                <h3>💼 {scenario.title}</h3>
                <ul>
                  {scenario.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="guide-footer">
        <div className="cta-box">
          <h3>🎮 이제 실전에서 연습해보세요!</h3>
          <p>가이드를 읽었다면 시뮬레이터에서 직접 협상 스킬을 연습해보세요.</p>
          <button className="start-button" onClick={() => navigate('/scenarios')}>
            시나리오 선택하러 가기 →
          </button>
        </div>
      </div>
    </div>
  );
}

export default NegotiationGuidePage;
