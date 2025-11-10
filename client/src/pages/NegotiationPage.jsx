import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scenarioAPI, conversationAPI } from '../services/api';
import './NegotiationPage.css';

function NegotiationPage() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [scenario, setScenario] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    initializeConversation();
  }, [scenarioId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = async () => {
    try {
      setLoading(true);

      // Load scenario details
      const scenarioData = await scenarioAPI.getScenarioById(scenarioId);
      setScenario(scenarioData.scenario);

      // Start conversation
      const conversationData = await conversationAPI.startConversation(scenarioId);
      setConversationId(conversationData.conversationId);

      // Add initial AI message
      setMessages([
        {
          role: 'assistant',
          content: conversationData.initialMessage,
          timestamp: conversationData.timestamp,
        },
      ]);
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
      alert('대화를 시작할 수 없습니다. 다시 시도해주세요.');
      navigate('/scenarios');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || sending) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    // Add user message to UI
    const newMessages = [
      ...messages,
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      },
    ];
    setMessages(newMessages);

    try {
      // Convert messages to API format
      const conversationHistory = newMessages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      // Send message and get AI response
      const response = await conversationAPI.sendMessage(
        conversationId,
        userMessage,
        conversationHistory,
        scenarioId
      );

      // Add AI response to messages
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: response.aiMessage,
          timestamp: response.timestamp,
        },
      ]);

      // Update analysis if available
      if (response.analysis) {
        setAnalysis(response.analysis);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSending(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      const result = await conversationAPI.analyzeConversation(
        conversationHistory,
        scenarioId
      );

      setAnalysis(result.analysis);
      setShowAnalysis(true);
    } catch (error) {
      console.error('Failed to analyze conversation:', error);
      alert('분석에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <div className="negotiation-page">
        <div className="loading">대화를 준비하는 중...</div>
      </div>
    );
  }

  return (
    <div className="negotiation-page">
      <header className="negotiation-header">
        <button className="back-button" onClick={() => navigate('/scenarios')}>
          ← 시나리오 목록
        </button>
        <div className="scenario-info">
          <h1>{scenario.title}</h1>
          <p>{scenario.npcProfile.role}와 협상 중</p>
        </div>
        <button className="analyze-button" onClick={handleAnalyze}>
          분석 보기
        </button>
      </header>

      <div className="content-container">
        <aside className="sidebar">
          <div className="scenario-details">
            <h3>협상 목표</h3>
            <ul>
              {scenario.userGoals.map((goal, index) => (
                <li key={index}>{goal}</li>
              ))}
            </ul>

            <h3>팁</h3>
            <ul>
              {scenario.tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>

            <h3>상대방 정보</h3>
            <div className="npc-info">
              <p>
                <strong>역할:</strong> {scenario.npcProfile.role}
              </p>
              <p>
                <strong>성격:</strong> {scenario.npcProfile.personality}
              </p>
              <p>
                <strong>목표:</strong> {scenario.npcProfile.goals}
              </p>
            </div>
          </div>
        </aside>

        <main className="chat-container">
          <div className="messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">
                  <div className="message-sender">
                    {message.role === 'user' ? '나' : scenario.npcProfile.role}
                  </div>
                  <div className="message-text">{message.content}</div>
                </div>
              </div>
            ))}
            {sending && (
              <div className="message ai-message">
                <div className="message-content">
                  <div className="message-sender">{scenario.npcProfile.role}</div>
                  <div className="message-text typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="input-form" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              disabled={sending}
              className="message-input"
            />
            <button type="submit" disabled={sending || !inputMessage.trim()} className="send-button">
              전송
            </button>
          </form>
        </main>
      </div>

      {showAnalysis && analysis && (
        <div className="analysis-modal" onClick={() => setShowAnalysis(false)}>
          <div className="analysis-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowAnalysis(false)}>
              ✕
            </button>
            <h2>협상 분석</h2>

            <div className="analysis-section">
              <h3>협상 점수</h3>
              <div className="score-display">
                <div className="score-circle">{analysis.negotiationScore}</div>
                <span>/ 100</span>
              </div>
            </div>

            <div className="analysis-section">
              <h3>강점</h3>
              <ul>
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="positive">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="analysis-section">
              <h3>약점</h3>
              <ul>
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="negative">
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>

            <div className="analysis-section">
              <h3>개선 제안</h3>
              <ul>
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-section">
              <h3>사용된 전략</h3>
              <ul>
                {analysis.tactics.map((tactic, index) => (
                  <li key={index}>{tactic}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NegotiationPage;
