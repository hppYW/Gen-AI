import Anthropic from '@anthropic-ai/sdk';

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
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
      const systemPrompt = this.buildSystemPrompt(scenario, npcProfile);

      const response = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        system: systemPrompt,
        messages: conversationHistory.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      });

      const aiMessage = response.content[0].text;

      return {
        message: aiMessage,
        analysis: await this.analyzeNegotiation(conversationHistory, aiMessage)
      };
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Build system prompt for the AI negotiator
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

자연스러운 한국어로 응답하세요. 협상자로서 행동하되, 교육적 가치를 제공하세요.`;
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
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 512,
        messages: [{
          role: 'user',
          content: analysisPrompt
        }]
      });

      const analysisText = response.content[0].text;
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        negotiationScore: 50,
        strengths: [],
        weaknesses: [],
        suggestions: [],
        tactics: []
      };
    } catch (error) {
      console.error('Analysis Error:', error);
      return null;
    }
  }
}

export default new ClaudeService();
