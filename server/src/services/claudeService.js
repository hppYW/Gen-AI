import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

class ClaudeService {
  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.error('❌ ANTHROPIC_API_KEY is not set in environment variables!');
      console.error('Please check your .env file in the server directory');
      throw new Error('ANTHROPIC_API_KEY is required');
    }

    console.log('✅ ClaudeService initialized with API key');

    this.client = new Anthropic({
      apiKey: apiKey,
    });
  }

  /**
   * Generate AI response for negotiation conversation
   * @param {Array} conversationHistory - Array of previous messages
   * @param {Object} scenario - Current negotiation scenario
   * @param {Object} npcProfile - NPC character profile
   * @returns {Object} AI response with message and analysis
   */
  async generateResponse(conversationHistory, scenario, npcProfile) {
    try {
      console.log('🤖 Generating response for conversation with', conversationHistory.length, 'messages');

      const systemPrompt = this.buildSystemPromptWithAnalysis(scenario, npcProfile);

      // If conversation history is empty, add initial greeting request
      const messages = conversationHistory.length === 0
        ? [{ role: 'user', content: '협상을 시작하는 인사말을 해주세요.' }]
        : conversationHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }));

      console.log('📨 Sending to Claude API with', messages.length, 'messages (with caching)');

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 2048,
        system: systemPrompt,
        messages
      });

      const responseText = response.content[0].text;
      console.log('✅ Claude API response received');
      console.log('📊 Cache stats:', {
        cacheCreationTokens: response.usage.cache_creation_input_tokens || 0,
        cacheReadTokens: response.usage.cache_read_input_tokens || 0,
        inputTokens: response.usage.input_tokens
      });

      // Parse JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);

          return {
            message: parsed.message || parsed.response || '응답을 생성할 수 없습니다.',
            analysis: {
              negotiationScore: parsed.negotiationScore || 50,
              strengths: parsed.strengths || [],
              weaknesses: parsed.weaknesses || [],
              suggestions: parsed.suggestions || [],
              tactics: parsed.tactics || []
            },
            emotionState: {
              rapport: parsed.rapport || 50,
              emotion: parsed.emotion || 'neutral',
              emotionReason: parsed.emotionReason || '',
              willingness: parsed.willingness || 70
            },
            messageFeedback: {
              rating: parsed.messageRating || 'fair',
              feedback: parsed.messageFeedback || '메시지를 전송했습니다.',
              impact: parsed.messageImpact || 'neutral'
            }
          };
        } catch (parseError) {
          console.error('❌ JSON Parse Error:', parseError);
        }
      }

      // Fallback: treat as plain text response
      console.warn('⚠️ No JSON found, using text response');
      return {
        message: responseText,
        analysis: {
          negotiationScore: 50,
          strengths: [],
          weaknesses: [],
          suggestions: [],
          tactics: []
        },
        emotionState: {
          rapport: 50,
          emotion: 'neutral',
          emotionReason: '분석 실패',
          willingness: 70
        },
        messageFeedback: {
          rating: 'fair',
          feedback: '메시지를 전송했습니다.',
          impact: 'neutral'
        }
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        type: error.type,
        error: error.error
      });
      throw new Error(`Failed to generate AI response: ${error.message}`);
    }
  }

  /**
   * Build system prompt with integrated analysis and prompt caching
   */
  buildSystemPromptWithAnalysis(scenario, npcProfile) {
    return [
      {
        type: 'text',
        text: `당신은 협상 시뮬레이션의 AI NPC입니다.

**시나리오**: ${scenario.title}
${scenario.description}

**당신의 역할**: ${npcProfile.role}
**성격**: ${npcProfile.personality}
**목표**: ${npcProfile.goals}
**제약사항**: ${npcProfile.constraints}

**협상 지침**:
1. 현실적이고 자연스러운 대화를 유지하세요
2. 당신의 역할과 목표에 충실하되, 유연하게 대응하세요
3. 사용자의 협상 전략을 시험하세요
4. 때로는 거부하거나, 반대 제안을 하세요
5. 적절한 타이밍에 양보하거나 강경해질 수 있습니다

**중요한 규칙**:
- 행동이나 표정 묘사를 절대 사용하지 마세요 (예: *고개를 끄덕이며*, *미소를 지으며* 같은 표현 금지)
- 순수하게 말로만 대화하세요
- 자연스러운 한국어로 간결하게 응답하세요
- 협상자로서 행동하되, 교육적 가치를 제공하세요`,
        cache_control: { type: 'ephemeral' }
      },
      {
        type: 'text',
        text: `
**응답 형식**:
반드시 다음 JSON 형식으로 응답하세요:

{
  "message": "NPC의 대화 응답 (자연스러운 한국어)",
  "rapport": 0-100 (호감도, 0=매우 적대적, 50=중립, 100=매우 우호적),
  "emotion": "happy|neutral|concerned|frustrated|angry",
  "emotionReason": "감정 상태 설명 (1-2문장)",
  "willingness": 0-100 (협상 의지),
  "negotiationScore": 0-100 (사용자의 협상 점수),
  "strengths": ["사용자의 강점1", "강점2"],
  "weaknesses": ["사용자의 약점1", "약점2"],
  "suggestions": ["개선사항1", "개선사항2"],
  "tactics": ["사용된 전략1", "전략2"],
  "messageRating": "excellent|good|fair|poor (사용자의 최근 메시지 평가)",
  "messageFeedback": "사용자 메시지에 대한 피드백 (1-2문장)",
  "messageImpact": "positive|neutral|negative (메시지의 협상 영향)"
}

**중요**:
- 오직 JSON만 출력하세요
- 마크다운 코드 블록 사용 금지
- 추가 설명 금지
- message는 자연스러운 대화문으로 작성`,
        cache_control: { type: 'ephemeral' }
      }
    ];
  }

  /**
   * Build system prompt for the AI negotiator (legacy - for suggestions)
   */
  buildSystemPrompt(scenario, npcProfile) {
    return `당신은 협상 시뮬레이션의 AI NPC입니다.

**시나리오**: ${scenario.title}
${scenario.description}

**당신의 역할**: ${npcProfile.role}
**성격**: ${npcProfile.personality}
**목표**: ${npcProfile.goals}
**제약사항**: ${npcProfile.constraints}

**협상 지침**:
1. 현실적이고 자연스러운 대화를 유지하세요
2. 당신의 역할과 목표에 충실하되, 유연하게 대응하세요
3. 사용자의 협상 전략을 시험하세요
4. 때로는 거부하거나, 반대 제안을 하세요
5. 적절한 타이밍에 양보하거나 강경해질 수 있습니다

**중요한 규칙**:
- 행동이나 표정 묘사를 절대 사용하지 마세요 (예: *고개를 끄덕이며*, *미소를 지으며* 같은 표현 금지)
- 순수하게 말로만 대화하세요
- 자연스러운 한국어로 간결하게 응답하세요
- 협상자로서 행동하되, 교육적 가치를 제공하세요`;
  }

  /**
   * Analyze NPC emotion and rapport level
   */
  async analyzeEmotion(conversationHistory, latestResponse) {
    try {
      const emotionPrompt = `다음 협상 대화에서 NPC의 감정 상태와 호감도를 분석하세요:

${conversationHistory.slice(-4).map((msg, i) => `${msg.role === 'user' ? '사용자' : 'NPC'}: ${msg.content}`).join('\n')}

NPC 최신 응답: ${latestResponse}

다음 형식의 JSON으로 분석하세요:
{
  "rapport": 0-100 (호감도, 0=매우 적대적, 50=중립, 100=매우 우호적),
  "emotion": "happy|neutral|concerned|frustrated|angry" 중 하나,
  "emotionReason": "감정 상태에 대한 간단한 설명",
  "willingness": 0-100 (협상 의지, 협상을 계속할 의지)
}`;

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: emotionPrompt
        }]
      });

      const emotionText = response.content[0].text;
      const jsonMatch = emotionText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('❌ JSON Parse Error in emotion analysis:', parseError);
          return {
            rapport: 50,
            emotion: 'neutral',
            emotionReason: '파싱 실패',
            willingness: 70
          };
        }
      }

      console.warn('⚠️ No JSON found in emotion response');
      return {
        rapport: 50,
        emotion: 'neutral',
        emotionReason: '대화 시작 단계',
        willingness: 70
      };
    } catch (error) {
      console.error('❌ Emotion Analysis Error:', error);
      return {
        rapport: 50,
        emotion: 'neutral',
        emotionReason: '분석 실패',
        willingness: 70
      };
    }
  }

  /**
   * Analyze negotiation performance
   */
  async analyzeNegotiation(conversationHistory, latestResponse) {
    try {
      const analysisPrompt = `다음 협상 대화를 분석하고 피드백을 제공하세요:

${conversationHistory.map((msg, i) => `${i % 2 === 0 ? '사용자' : 'AI'}: ${msg.content}`).join('\n')}

최신 응답: ${latestResponse}

다음 항목을 JSON 형식으로 분석하세요:
{
  "negotiationScore": 0-100 점수,
  "strengths": ["강점1", "강점2"],
  "weaknesses": ["약점1", "약점2"],
  "suggestions": ["개선사항1", "개선사항2"],
  "tactics": ["사용된 전략1", "사용된 전략2"]
}`;

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: analysisPrompt
        }]
      });

      const analysisText = response.content[0].text;
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('❌ JSON Parse Error in analysis:', parseError);
          return {
            negotiationScore: 50,
            strengths: [],
            weaknesses: [],
            suggestions: [],
            tactics: []
          };
        }
      }

      console.warn('⚠️ No JSON found in analysis response');
      return {
        negotiationScore: 50,
        strengths: [],
        weaknesses: [],
        suggestions: [],
        tactics: []
      };
    } catch (error) {
      console.error('❌ Analysis Error:', error);
      return {
        negotiationScore: 50,
        strengths: [],
        weaknesses: [],
        suggestions: [],
        tactics: []
      };
    }
  }

  /**
   * Generate suggested response choices for user
   */
  async generateSuggestions(conversationHistory, scenario, npcProfile) {
    try {
      const userMessages = conversationHistory.filter(msg => msg.role === 'user');
      const isFirstSuggestion = userMessages.length === 0;

      let suggestPrompt;

      if (isFirstSuggestion) {
        // 첫 번째 선택지: 시나리오에 맞는 일반적인 시작 대화
        suggestPrompt = `다음 협상 시나리오에서 사용자가 처음 할 수 있는 효과적인 시작 멘트 3가지를 추천하세요:

**시나리오**: ${scenario.title}
${scenario.description}

**상대방 역할**: ${npcProfile.role}
**상대방 성격**: ${npcProfile.personality}

**대화 히스토리**:
${conversationHistory.slice(-2).map((msg, i) => `${msg.role === 'user' ? '사용자' : 'NPC'}: ${msg.content}`).join('\n')}

시나리오의 목표와 상황에 맞는 자연스러운 시작 대화 3가지를 추천하세요.
각각 다른 접근 방식(우호적, 직접적, 탐색적 등)을 제시해주세요.`;
      } else {
        // 두 번째 이후: 사용자의 이전 대화 스타일 기반
        const userStyle = userMessages.map(msg => msg.content).join('\n');
        suggestPrompt = `다음은 진행 중인 협상 대화입니다:

**시나리오**: ${scenario.title}
**상대방 역할**: ${npcProfile.role}

**최근 대화 히스토리**:
${conversationHistory.slice(-6).map((msg, i) => `${msg.role === 'user' ? '사용자' : 'NPC'}: ${msg.content}`).join('\n')}

**사용자의 이전 대화들**:
${userStyle}

위 사용자의 대화 스타일, 어조, 협상 패턴을 분석하여, 사용자가 다음에 할 것 같은 자연스러운 응답 3가지를 추천하세요.
사용자가 지금까지 보여준 스타일을 유지하면서도 협상을 발전시킬 수 있는 응답을 제시해주세요.`;
      }

      suggestPrompt += `

반드시 아래 JSON 형식으로만 응답하세요. 각 text는 한 줄로 작성하고 줄바꿈을 포함하지 마세요:

{"suggestions":[{"text":"첫번째 추천 응답","approach":"접근방식1"},{"text":"두번째 추천 응답","approach":"접근방식2"},{"text":"세번째 추천 응답","approach":"접근방식3"}]}

중요한 규칙:
1. 오직 JSON만 출력하고 다른 텍스트나 설명을 절대 포함하지 마세요
2. 마크다운 코드 블록을 사용하지 마세요
3. 모든 문자열은 큰따옴표로 감싸기
4. text 필드에 줄바꿈을 절대 포함하지 마세요 (모든 응답은 한 줄로)
5. 마지막 항목 뒤에 쉼표 금지
6. approach는 간단하게 한 단어로 (예: "우호적", "직접적", "탐색적")`;

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 800,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: suggestPrompt
        }]
      });

      const suggestText = response.content[0].text;
      console.log('📝 Raw suggestion response:', suggestText);

      // 여러 방법으로 JSON 추출 및 정제 시도
      let parsed = null;

      // 1. 마크다운 코드 블록 제거
      let cleanedText = suggestText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

      // 2. JSON 블록 찾기
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        let jsonString = jsonMatch[0];

        try {
          parsed = JSON.parse(jsonString);
          console.log('✅ Parsed suggestions:', parsed);
          return parsed;
        } catch (parseError) {
          console.error('❌ JSON Parse Error:', parseError.message);
          console.error('Failed JSON string:', jsonString.substring(0, 400));

          // 강력한 JSON 정제 시도
          try {
            // 더 공격적인 정제
            const fixedJson = jsonString
              // 작은따옴표를 큰따옴표로
              .replace(/'/g, '"')
              // 줄바꿈을 공백으로 변경 (문자열 내부)
              .replace(/\n/g, ' ')
              .replace(/\r/g, '')
              // 연속된 공백을 하나로
              .replace(/\s+/g, ' ')
              // 마지막 쉼표 제거
              .replace(/,\s*}/g, '}')
              .replace(/,\s*]/g, ']')
              // 잘못된 이스케이프 시퀀스 제거
              .replace(/\\([^"\\\/bfnrt])/g, '$1');

            console.log('🔧 Attempting to fix JSON...');
            console.log('Fixed JSON preview:', fixedJson.substring(0, 300));

            parsed = JSON.parse(fixedJson);
            console.log('✅ Parsed suggestions (after aggressive fix):', parsed);
            return parsed;
          } catch (fixError) {
            console.error('❌ Aggressive fix attempt failed:', fixError.message);

            // 마지막 시도: 정규식으로 직접 추출
            try {
              const suggestions = [];
              // 더 관대한 정규식: 큰따옴표 안의 모든 내용 추출 (줄바꿈 포함)
              const textMatches = jsonString.matchAll(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/gs);
              const approachMatches = jsonString.matchAll(/"approach"\s*:\s*"((?:[^"\\]|\\.)*)"/gs);

              const texts = Array.from(textMatches).map(m => m[1].replace(/\s+/g, ' ').trim());
              const approaches = Array.from(approachMatches).map(m => m[1].replace(/\s+/g, ' ').trim());

              for (let i = 0; i < Math.min(texts.length, approaches.length, 3); i++) {
                if (texts[i] && approaches[i]) {
                  suggestions.push({
                    text: texts[i],
                    approach: approaches[i]
                  });
                }
              }

              if (suggestions.length > 0) {
                console.log('✅ Extracted suggestions via regex:', suggestions);
                return { suggestions };
              }
            } catch (regexError) {
              console.error('❌ Regex extraction failed:', regexError.message);
            }
          }
        }
      }

      // 파싱 실패 시 폴백
      console.warn('⚠️ Using fallback suggestions');
      return {
        suggestions: [
          { text: "그 점에 대해 좀 더 자세히 말씀해 주시겠어요?", approach: "탐색적" },
          { text: "제가 제안하고 싶은 것은...", approach: "제안적" },
          { text: "그 부분은 충분히 이해합니다.", approach: "공감적" }
        ]
      };
    } catch (error) {
      console.error('❌ Generate Suggestions Error:', error);
      // 에러 발생 시에도 폴백 제안 제공
      return {
        suggestions: [
          { text: "그 점에 대해 좀 더 자세히 말씀해 주시겠어요?", approach: "탐색적" },
          { text: "제가 제안하고 싶은 것은...", approach: "제안적" },
          { text: "그 부분은 충분히 이해합니다.", approach: "공감적" }
        ]
      };
    }
  }

  /**
   * Evaluate user's message quality
   */
  async evaluateMessage(userMessage, conversationHistory, scenario) {
    try {
      const evaluatePrompt = `다음 협상 대화에서 사용자의 최신 메시지를 평가하세요:

**시나리오**: ${scenario.title}

**대화 히스토리**:
${conversationHistory.slice(-4).map((msg, i) => `${msg.role === 'user' ? '사용자' : 'NPC'}: ${msg.content}`).join('\n')}

**평가할 사용자 메시지**: ${userMessage}

아래 JSON 형식으로만 응답하세요:

{
  "rating": "good",
  "feedback": "짧은 피드백 1-2문장",
  "impact": "positive"
}

규칙:
1. rating: excellent, good, fair, poor 중 하나
2. impact: positive, neutral, negative 중 하나
3. JSON만 출력 (설명, 마크다운 금지)
4. 큰따옴표 사용
5. 마지막 항목 뒤 쉼표 금지`;

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-5',
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: evaluatePrompt
        }]
      });

      const evalText = response.content[0].text;
      console.log('📝 Raw evaluation response:', evalText);

      // 마크다운 코드 블록 제거
      let cleanedText = evalText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          console.log('✅ Parsed evaluation:', parsed);
          return parsed;
        } catch (parseError) {
          console.error('❌ JSON Parse Error in evaluation:', parseError.message);
          console.error('Failed JSON string:', jsonMatch[0].substring(0, 200));

          // 수정 시도
          try {
            const fixedJson = jsonMatch[0]
              .replace(/'/g, '"')
              .replace(/,\s*}/g, '}');
            const parsed = JSON.parse(fixedJson);
            console.log('✅ Parsed evaluation (after fix):', parsed);
            return parsed;
          } catch (fixError) {
            console.error('❌ Fix attempt failed');
          }
        }
      }

      console.warn('⚠️ Using default evaluation');
      return {
        rating: 'fair',
        feedback: '메시지를 전송했습니다.',
        impact: 'neutral'
      };
    } catch (error) {
      console.error('❌ Evaluate Message Error:', error);
      return {
        rating: 'fair',
        feedback: '메시지를 전송했습니다.',
        impact: 'neutral'
      };
    }
  }
}


export default new ClaudeService();
