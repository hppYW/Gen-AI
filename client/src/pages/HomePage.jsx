import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="title">협상 시뮬레이터</h1>
        <p className="subtitle">
          AI와 함께 실전 협상 스킬을 연습하고 향상시키세요
        </p>

        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI NPC 시스템</h3>
            <p>Claude AI 기반의 현실적인 협상 상대</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📋</div>
            <h3>다양한 시나리오</h3>
            <p>연봉협상, 계약협상, 프로젝트 관리 등</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h3>실시간 피드백</h3>
            <p>즉각적인 분석과 개선 제안</p>
          </div>
        </div>

        <button
          className="start-button"
          onClick={() => navigate('/scenarios')}
        >
          시작하기
        </button>
      </div>

      <div className="info-section">
        <h2>어떻게 작동하나요?</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>시나리오 선택</h3>
            <p>다양한 협상 상황 중 연습하고 싶은 것을 선택하세요</p>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <h3>AI와 대화</h3>
            <p>자유롭게 대화하며 협상을 진행하세요</p>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <h3>피드백 받기</h3>
            <p>실시간으로 분석과 개선 방안을 확인하세요</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
