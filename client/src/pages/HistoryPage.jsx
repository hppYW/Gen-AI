import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import localStorageService from '../services/localStorage';
import './HistoryPage.css';

function HistoryPage() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadConversations();
  }, []);

  function loadConversations() {
    try {
      setLoading(true);
      const conversationsData = localStorageService.getAllConversations();
      setConversations(conversationsData);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleDelete(conversationId) {
    if (window.confirm('이 대화 기록을 삭제하시겠습니까?')) {
      localStorageService.deleteConversation(conversationId);
      loadConversations();
    }
  }

  function formatDate(timestamp) {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getScoreColor(score) {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  }

  if (loading) {
    return (
      <div className="history-page">
        <div className="loading">대화 기록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <header className="history-header">
          <h1>내 협상 기록</h1>
          <p>지금까지의 협상 연습 내역을 확인하세요</p>
        </header>

        {conversations.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>아직 협상 기록이 없습니다</h2>
            <p>첫 협상을 시작해보세요!</p>
            <button
              className="start-button"
              onClick={() => navigate('/scenarios')}
            >
              시나리오 선택하기
            </button>
          </div>
        ) : (
          <div className="conversations-list">
            {conversations.map((conversation) => (
              <div key={conversation.id} className="conversation-card">
                <div className="conversation-header">
                  <div>
                    <h3>{conversation.scenarioTitle}</h3>
                    <p className="conversation-date">
                      {formatDate(conversation.createdAt)}
                    </p>
                  </div>
                  {conversation.finalScore && (
                    <div
                      className="score-badge"
                      style={{ backgroundColor: getScoreColor(conversation.finalScore) }}
                    >
                      {conversation.finalScore}점
                    </div>
                  )}
                </div>

                <div className="conversation-stats">
                  <div className="stat">
                    <span className="stat-label">메시지 수</span>
                    <span className="stat-value">{conversation.messageCount || 0}</span>
                  </div>
                </div>

                {conversation.analysis && (
                  <div className="conversation-summary">
                    <h4>주요 피드백</h4>
                    {conversation.analysis.strengths &&
                      conversation.analysis.strengths.length > 0 && (
                        <p className="strength">
                          ✓ {conversation.analysis.strengths[0]}
                        </p>
                      )}
                    {conversation.analysis.suggestions &&
                      conversation.analysis.suggestions.length > 0 && (
                        <p className="suggestion">
                          → {conversation.analysis.suggestions[0]}
                        </p>
                      )}
                  </div>
                )}

                <div className="conversation-actions">
                  <button
                    className="retry-button"
                    onClick={() => navigate(`/negotiate/${conversation.scenarioId}`)}
                  >
                    다시 연습하기
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(conversation.conversationId)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;
