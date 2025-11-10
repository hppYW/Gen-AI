import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { scenarioAPI } from '../services/api';
import './ScenarioListPage.css';

function ScenarioListPage() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadScenarios();
  }, []);

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const data = await scenarioAPI.getAllScenarios();
      setScenarios(data.scenarios);
    } catch (error) {
      console.error('Failed to load scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredScenarios = scenarios.filter((scenario) => {
    if (filter === 'all') return true;
    return scenario.difficulty === filter;
  });

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444',
    };
    return colors[difficulty] || '#6b7280';
  };

  const getDifficultyLabel = (difficulty) => {
    const labels = {
      easy: '쉬움',
      medium: '보통',
      hard: '어려움',
    };
    return labels[difficulty] || difficulty;
  };

  if (loading) {
    return (
      <div className="scenario-list-page">
        <div className="loading">시나리오를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="scenario-list-page">
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← 홈으로
        </button>
        <h1>협상 시나리오 선택</h1>
        <p>연습하고 싶은 협상 상황을 선택하세요</p>
      </header>

      <div className="filter-section">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          전체
        </button>
        <button
          className={`filter-button ${filter === 'easy' ? 'active' : ''}`}
          onClick={() => setFilter('easy')}
        >
          쉬움
        </button>
        <button
          className={`filter-button ${filter === 'medium' ? 'active' : ''}`}
          onClick={() => setFilter('medium')}
        >
          보통
        </button>
        <button
          className={`filter-button ${filter === 'hard' ? 'active' : ''}`}
          onClick={() => setFilter('hard')}
        >
          어려움
        </button>
      </div>

      <div className="scenarios-grid">
        {filteredScenarios.map((scenario) => (
          <div key={scenario.id} className="scenario-card">
            <div className="scenario-header">
              <h2>{scenario.title}</h2>
              <span
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(scenario.difficulty) }}
              >
                {getDifficultyLabel(scenario.difficulty)}
              </span>
            </div>

            <p className="scenario-description">{scenario.description}</p>

            <div className="scenario-details">
              <div className="detail-item">
                <strong>역할:</strong> {scenario.npcProfile.role}
              </div>
              <div className="detail-item">
                <strong>목표:</strong>
                <ul>
                  {scenario.userGoals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              className="start-scenario-button"
              onClick={() => navigate(`/negotiate/${scenario.id}`)}
            >
              시작하기
            </button>
          </div>
        ))}
      </div>

      {filteredScenarios.length === 0 && (
        <div className="no-scenarios">
          해당 난이도의 시나리오가 없습니다.
        </div>
      )}
    </div>
  );
}

export default ScenarioListPage;
