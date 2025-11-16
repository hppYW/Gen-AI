import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { scenarioAPI, conversationAPI } from '../services/api';
import localStorageService from '../services/localStorage';
import PhaserGame from '../components/PhaserGame';
import StarRating from '../components/StarRating';
import AchievementToast from '../components/AchievementToast';
import soundManager from '../services/soundManager';
import './NegotiationPagePhaser.css';

function NegotiationPagePhaser() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const gameSceneRef = useRef(null);

  const [scenario, setScenario] = useState(null);
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [emotionState, setEmotionState] = useState(null);
  const [currentStarRating, setCurrentStarRating] = useState(0);
  const [newAchievement, setNewAchievement] = useState(null);
  const [showInputModal, setShowInputModal] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('시나리오 로딩 중...');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [messageFeedback, setMessageFeedback] = useState(null);
  const [suggestionUsageCount, setSuggestionUsageCount] = useState(0);
  const MAX_SUGGESTION_USES = 3;

  const initialMessagesRef = useRef([]);
  const initialEmotionRef = useRef(null);

  useEffect(() => {
    initializeConversation();
  }, [scenarioId]);

  const initializeConversation = async () => {
    try {
      setLoading(true);
      setLoadingProgress(0);
      setLoadingMessage('시나리오 정보를 불러오는 중...');

      // Load scenario details
      const scenarioData = await scenarioAPI.getScenarioById(scenarioId);
      setScenario(scenarioData.scenario);
      setLoadingProgress(30);
      setLoadingMessage('AI와 연결하는 중...');

      // Start conversation
      const conversationData = await conversationAPI.startConversation(scenarioId);
      setConversationId(conversationData.conversationId);
      setLoadingProgress(70);
      setLoadingMessage('대화 준비 중...');

      // Set initial emotion state
      if (conversationData.emotionState) {
        setEmotionState(conversationData.emotionState);
        initialEmotionRef.current = conversationData.emotionState;
      }

      // Add initial AI message
      const initialMsg = {
        role: 'assistant',
        content: conversationData.initialMessage,
        timestamp: conversationData.timestamp,
      };
      setMessages([initialMsg]);
      initialMessagesRef.current = [initialMsg];
      setLoadingProgress(90);
      setLoadingMessage('게임 화면을 준비하는 중...');

      // Update game scene
      if (gameSceneRef.current) {
        gameSceneRef.current.updateDialogue(conversationData.initialMessage);
        if (conversationData.emotionState) {
          gameSceneRef.current.updateEmotion(conversationData.emotionState);
        }
      }

      setLoadingProgress(100);
      setLoadingMessage('완료!');

      // 짧은 딜레이 후 로딩 화면 제거
      setTimeout(() => {
        setLoading(false);
      }, 300);
    } catch (error) {
      console.error('Failed to initialize conversation:', error);
      alert('대화를 시작할 수 없습니다. 다시 시도해주세요.');
      navigate('/scenarios');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim() || sending) return;

    // Play message send sound
    soundManager.playMessageSend();

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setSending(true);
    setShowInputModal(false);

    // Show loading in game
    if (gameSceneRef.current) {
      gameSceneRef.current.showLoading();
    }

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
      // Convert messages to API format - 새로 추가한 사용자 메시지는 제외
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      console.log('📤 Sending message:', userMessage);
      console.log('📜 Conversation history length:', conversationHistory.length);

      // Send message and get AI response
      const response = await conversationAPI.sendMessage(
        conversationId,
        userMessage,
        conversationHistory,
        scenarioId
      );

      console.log('📥 Received AI response:', response.aiMessage);
      console.log('🔍 Current gameSceneRef:', gameSceneRef.current);

      // Update game scene FIRST before state update
      if (gameSceneRef.current) {
        console.log('🎮 Updating game dialogue with:', response.aiMessage.substring(0, 50));
        gameSceneRef.current.hideLoading();
        gameSceneRef.current.updateDialogue(response.aiMessage, 'NPC');
        console.log('✅ Game dialogue updated successfully');
      } else {
        console.error('❌ gameSceneRef.current is null!');
      }

      // Add AI response to messages AFTER game update
      const aiMsg = {
        role: 'assistant',
        content: response.aiMessage,
        timestamp: response.timestamp,
      };
      const updatedMessages = [...newMessages, aiMsg];
      setMessages(updatedMessages);

      // 대화 기록 업데이트
      if (gameSceneRef.current) {
        gameSceneRef.current.updateMessageHistory(updatedMessages);
      }

      // Update analysis if available
      if (response.analysis) {
        setAnalysis(response.analysis);
      }

      // Update emotion state
      if (response.emotionState) {
        setEmotionState(response.emotionState);
        if (gameSceneRef.current) {
          gameSceneRef.current.updateEmotion(response.emotionState);
        }
      }

      // Update star rating
      if (response.starRating) {
        setCurrentStarRating(response.starRating);
      }

      // Update message feedback
      if (response.messageFeedback) {
        setMessageFeedback(response.messageFeedback);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.');
      if (gameSceneRef.current) {
        gameSceneRef.current.hideLoading();
      }
    } finally {
      setSending(false);
    }
  };

  const handleGameReady = useCallback((scene) => {
    console.log('🎮 Game scene ready, initializing UI');
    console.log('🎮 Setting gameSceneRef to:', scene);
    gameSceneRef.current = scene;

    // 초기 메시지가 있으면 표시
    if (initialMessagesRef.current.length > 0) {
      console.log('📝 Setting initial dialogue');
      scene.updateDialogue(initialMessagesRef.current[initialMessagesRef.current.length - 1].content, 'NPC');
      // 대화 기록도 업데이트
      scene.updateMessageHistory(initialMessagesRef.current);
    }

    // 초기 감정 상태가 있으면 표시
    if (initialEmotionRef.current) {
      console.log('😊 Setting initial emotion state');
      scene.updateEmotion(initialEmotionRef.current);
    }

    console.log('✅ Game ready complete, gameSceneRef is now:', gameSceneRef.current);
  }, []);

  const handleSuggestionClick = (suggestionText) => {
    soundManager.playButtonClick();
    setInputMessage(suggestionText);
    setSuggestionUsageCount(prev => prev + 1);
  };

  const handleOpenInput = useCallback(async () => {
    setShowInputModal(true);

    // 선택지 제한을 초과했으면 선택지를 로드하지 않음
    if (suggestionUsageCount >= MAX_SUGGESTION_USES) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);

    try {
      // 선택지 가져오기
      const conversationHistory = messages.map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }));

      console.log('🔍 Requesting suggestions...', { scenarioId, historyLength: conversationHistory.length });
      const response = await conversationAPI.getSuggestions(conversationHistory, scenarioId);
      console.log('✅ Suggestions received:', response);
      setSuggestions(response.suggestions || []);
    } catch (error) {
      console.error('❌ Failed to get suggestions:', error);
      console.error('Error details:', error.response?.data || error.message);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, [messages, scenarioId, suggestionUsageCount]);

  const handleAnalyze = async () => {
    soundManager.playButtonClick();
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
      soundManager.playError();
      alert('분석에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleSaveConversation = () => {
    try {
      if (!analysis) {
        soundManager.playError();
        alert('먼저 분석을 실행해주세요.');
        return;
      }

      const conversationData = {
        conversationId,
        scenarioId,
        scenarioTitle: scenario.title,
        messages,
        analysis,
        finalScore: analysis.negotiationScore,
        duration: 0,
      };

      localStorageService.saveConversation(conversationData);
      soundManager.playSuccess();
      alert('대화가 저장되었습니다!');
      setShowAnalysis(false);
    } catch (error) {
      console.error('Failed to save conversation:', error);
      soundManager.playError();
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading || !scenario) {
    return (
      <div className="negotiation-page-phaser loading-screen">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2 className="loading-title">협상 준비 중</h2>
          <p className="loading-message">{loadingMessage}</p>

          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <span className="progress-text">{loadingProgress}%</span>
          </div>
        </div>
      </div>
    );
  }

  console.log('🎮 Rendering game page with scenario:', scenario.title);

  return (
    <div className="negotiation-page-phaser fullscreen">
      {/* 상단 UI 오버레이 */}
      <div className="game-ui-overlay">
        <button className="ui-button back-btn" onClick={() => navigate('/scenarios')}>
          ← 나가기
        </button>
        <button className="ui-button analyze-btn" onClick={handleAnalyze}>
          📊 분석
        </button>
      </div>

      {/* 실시간 피드백 패널 */}
      {messageFeedback && (
        <div className={`feedback-panel feedback-${messageFeedback.impact}`}>
          <div className="feedback-header">
            <span className="feedback-title">💬 메시지 평가</span>
            <button
              className="feedback-close"
              onClick={() => setMessageFeedback(null)}
            >
              ✕
            </button>
          </div>
          <div className="feedback-content">
            <div className={`feedback-rating feedback-rating-${messageFeedback.rating}`}>
              {messageFeedback.rating === 'excellent' && '⭐ 탁월'}
              {messageFeedback.rating === 'good' && '👍 좋음'}
              {messageFeedback.rating === 'fair' && '😐 보통'}
              {messageFeedback.rating === 'poor' && '⚠️ 미흡'}
            </div>
            <p className="feedback-text">{messageFeedback.feedback}</p>
          </div>
        </div>
      )}

      {/* 전체 화면 게임 캔버스 */}
      <div className="fullscreen-game-container">
        {scenario && !loading && (
          <PhaserGame
            scenario={scenario}
            onGameReady={handleGameReady}
            onInput={handleOpenInput}
            width={1400}
            height={900}
            key="phaser-game-instance"
          />
        )}
      </div>

      {/* 입력 모달 */}
      {showInputModal && (
        <div className="input-modal-overlay" onClick={() => setShowInputModal(false)}>
          <div className="input-modal" onClick={(e) => e.stopPropagation()}>
            <h3>💬 메시지 입력</h3>

            {/* AI 추천 선택지 */}
            {suggestionUsageCount >= MAX_SUGGESTION_USES ? (
              <div className="suggestions-info limit-reached">
                <p>🚫 선택지 사용 횟수를 모두 소진했습니다!</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  직접 메시지를 작성하여 협상 스킬을 향상시켜보세요.
                </p>
              </div>
            ) : loadingSuggestions ? (
              <div className="suggestions-loading">
                <div className="mini-spinner"></div>
                <p>AI가 추천을 생성하는 중...</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>최대 10초 소요될 수 있습니다</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="suggestions-section">
                <div className="suggestions-header">
                  <p className="suggestions-label">💡 AI 추천 응답:</p>
                  <p className="suggestions-usage">
                    남은 사용 횟수: <strong>{MAX_SUGGESTION_USES - suggestionUsageCount}/{MAX_SUGGESTION_USES}</strong>
                  </p>
                </div>
                <div className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="suggestion-button"
                      onClick={() => handleSuggestionClick(suggestion.text)}
                    >
                      <span className="suggestion-approach">{suggestion.approach}</span>
                      <span className="suggestion-text">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="suggestions-info">
                <p>💭 직접 메시지를 입력하거나, 잠시 후 다시 시도해주세요.</p>
                <p className="suggestions-usage" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  남은 선택지 사용 횟수: <strong>{MAX_SUGGESTION_USES - suggestionUsageCount}/{MAX_SUGGESTION_USES}</strong>
                </p>
              </div>
            )}

            <form onSubmit={handleSendMessage}>
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="협상 메시지를 입력하세요..."
                autoFocus
                rows={4}
                className="message-textarea"
              />
              <div className="modal-buttons">
                <button
                  type="submit"
                  disabled={sending || !inputMessage.trim()}
                  className="send-modal-button"
                >
                  {sending ? '⏳ 전송 중...' : '✉️ 전송하기'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowInputModal(false)}
                  className="cancel-button"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Analysis Modal */}
      {showAnalysis && analysis && (
        <div className="analysis-modal" onClick={() => setShowAnalysis(false)}>
          <div className="analysis-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowAnalysis(false)}>
              ✕
            </button>
            <h2>🎊 협상 결과</h2>

            {currentStarRating > 0 && (
              <div className="analysis-section rating-section">
                <h3>⭐ 종합 평가</h3>
                <StarRating rating={currentStarRating} size="large" />
              </div>
            )}

            <div className="analysis-section">
              <h3>📊 협상 점수</h3>
              <div className="score-display">
                <div className="score-circle">{analysis.negotiationScore}</div>
                <span>/ 100</span>
              </div>
            </div>

            {emotionState && (
              <div className="analysis-section">
                <h3>😊 최종 호감도</h3>
                <div className="final-rapport">
                  <div className="rapport-bar">
                    <div
                      className="rapport-fill"
                      style={{ width: `${emotionState.rapport}%` }}
                    />
                  </div>
                  <span className="rapport-number">{emotionState.rapport}/100</span>
                </div>
              </div>
            )}

            <div className="analysis-section">
              <h3>💪 강점</h3>
              <ul>
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="positive">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="analysis-section">
              <h3>⚠️ 약점</h3>
              <ul>
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index} className="negative">
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>

            <div className="analysis-section">
              <h3>💡 개선 제안</h3>
              <ul>
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>

            <div className="analysis-actions">
              <button className="save-button" onClick={handleSaveConversation}>
                💾 대화 저장
              </button>
              <button className="close-modal-button" onClick={() => setShowAnalysis(false)}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Achievement Toast */}
      {newAchievement && (
        <AchievementToast
          achievement={newAchievement}
          onClose={() => setNewAchievement(null)}
        />
      )}
    </div>
  );
}

export default NegotiationPagePhaser;
