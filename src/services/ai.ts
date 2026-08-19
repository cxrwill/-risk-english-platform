import type { FeedbackItem, ScoreMetrics, Scenario } from '../types'

/**
 * Mock AI response generator for the training platform.
 * In production, this would connect to WebLLM (local) or Cloudflare Workers proxy (cloud).
 */
export class AIClient {
  private static readonly DELAY_MS = 800

  static async generateResponse(
    userMessage: string,
    scenario: Scenario,
    conversationHistory: string[]
  ): Promise<{ text: string; feedback: FeedbackItem[]; score: ScoreMetrics }> {
    await this.sleep(this.DELAY_MS)

    const feedback = this.generateFeedback(userMessage, scenario)
    const score = this.calculateScore(userMessage, scenario, feedback)
    const response = this.generateAIResponse(userMessage, scenario, conversationHistory)

    return { text: response, feedback, score }
  }

  private static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private static generateFeedback(
    text: string,
    scenario: Scenario
  ): FeedbackItem[] {
    const feedback: FeedbackItem[] = []
    const lower = text.toLowerCase()

    // Check for expected keywords
    const missingKeywords = scenario.expectedKeywords.filter(
      (kw) => !lower.includes(kw.toLowerCase())
    )

    if (missingKeywords.length > 0 && missingKeywords.length < scenario.expectedKeywords.length) {
      feedback.push({
        id: crypto.randomUUID(),
        type: 'terminology',
        message: `Consider using the term "${missingKeywords[0]}" to strengthen your response.`,
        suggestion: `Try incorporating: "${missingKeywords[0]}"`,
      })
    }

    // Praise for key domain concepts
    if (lower.includes('3d secure') || lower.includes('liability shift')) {
      feedback.push({
        id: crypto.randomUUID(),
        type: 'praise',
        message: 'Excellent — referencing 3D Secure and liability shift demonstrates deep domain knowledge.',
      })
    }

    if (lower.includes('evidence') && lower.includes('documentation')) {
      feedback.push({
        id: crypto.randomUUID(),
        type: 'praise',
        message: 'Strong — emphasizing evidence and documentation is exactly what compliance teams look for.',
      })
    }

    // Generic grammar suggestion if response is very short
    if (text.split(/\s+/).length < 10) {
      feedback.push({
        id: crypto.randomUUID(),
        type: 'grammar',
        message: 'Your response is quite brief. Expand with specific details and professional phrasing.',
        suggestion: 'Use formal structures like "I would like to draw your attention to..." or "It is imperative that..."',
      })
    }

    return feedback
  }

  private static calculateScore(
    text: string,
    scenario: Scenario,
    feedback: FeedbackItem[]
  ): ScoreMetrics {
    const lower = text.toLowerCase()
    const keywordMatches = scenario.expectedKeywords.filter((kw) =>
      lower.includes(kw.toLowerCase())
    ).length
    const terminologyScore = Math.round(
      (keywordMatches / scenario.expectedKeywords.length) * 100
    )

    const praiseCount = feedback.filter((f) => f.type === 'praise').length
    const grammarCount = feedback.filter((f) => f.type === 'grammar').length
    const accuracyScore = Math.max(
      40,
      Math.round(100 - grammarCount * 15 + praiseCount * 10)
    )

    const wordCount = text.split(/\s+/).length
    const fluencyScore = Math.min(95, Math.max(40, wordCount * 2))

    const overall = Math.round(
      fluencyScore * 0.3 + accuracyScore * 0.35 + terminologyScore * 0.35
    )

    return {
      fluency: Math.min(100, fluencyScore),
      accuracy: Math.min(100, accuracyScore),
      terminology: Math.min(100, terminologyScore),
      overall: Math.min(100, overall),
    }
  }

  private static generateAIResponse(
    _userMessage: string,
    scenario: Scenario,
    history: string[]
  ): string {
    const historyCount = history.length

    const responses: Record<string, string[]> = {
      compliance: [
        "I appreciate your preliminary response, but I need more specificity. Can you elaborate on how exactly 3D Secure 2.0 implementation will address the root cause? What's your timeline for deployment, and how will you measure effectiveness?",
        "That's a partial explanation. Let me press further — Visa's VFMP requires documented remediation. Have you submitted a formal TC40 fraud report? What specific metrics will you track to demonstrate improvement over the next 90 days?",
        "I hear you, but the chargeback rate has remained elevated for three months. What additional controls are you implementing beyond AVS and CVV? How will you differentiate between card-not-present fraud and friendly fraud in your monitoring?",
        "Your remediation plan mentions enhanced monitoring. Can you quantify that? What's your target chargeback rate, and what specific tools or procedures will achieve it? I need measurable milestones.",
        "Very well. Let me note your commitment to implementing real-time fraud scoring. When do you expect full deployment, and will you be participating in Visa's Fraud Observance Network for shared intelligence?",
      ],
      representment: [
        "I've reviewed your evidence package. While the device fingerprint is useful, it doesn't conclusively prove the cardholder authorized the transaction. Can you provide email confirmation or IP geolocation data that ties the purchase to the cardholder's known location?",
        "The proof of delivery shows a signature, but the signature doesn't match the cardholder's name. Can you provide additional verification — perhaps a photo ID match or delivery address confirmation against the billing address on file?",
        "I notice you're claiming this was a legitimate subscription purchase, but the cardholder states they never received cancellation confirmation. Do you have system logs showing the cancellation request and your response timeline?",
        "Your representment mentions prior clean transactions, but the cardholder disputes this specific charge. Can you show the complete transaction history for this cardholder, including any prior chargebacks or disputes?",
        "The evidence you've provided is incomplete for a four-thousand-two-hundred dollar claim. Visa requires compelling evidence for amounts above five hundred dollars. Do you have the cardholder's written authorization, or can you produce communication records showing they acknowledged the charge?",
      ],
      rdr: [
        "A ninety-nine percent reduction sounds impressive, but what's the catch? Are there any monthly fees, setup costs, or minimum transaction volume requirements? I need to understand the total cost of ownership.",
        "I'm concerned about automatic refunds. What if a legitimate customer disputes a charge they actually made? Won't RDR refund them automatically, costing you money on valid transactions?",
        "How does RDR interact with our existing fraud screening tools? Will it complement our current systems, or could it create conflicts in dispute handling?",
        "Tell me more about the rule engine. Can we customize the auto-refund thresholds? What if we want to set different rules for different product categories or customer segments?",
        "What happens if RDR doesn't prevent a chargeback? Do we still go through the standard dispute process, or is RDR the final step? I need to understand the full workflow.",
      ],
      mastercom: [
        "You've explained the basic concept, but I'm still unclear on the timeline. When exactly does Mastercard notify us, and how much time do we have to respond before the dispute escalates?",
        "What are the specific consequences if we choose not to participate? Are there financial penalties, or is it purely a reputational risk with the card network?",
        "How does the data sharing work in Collaboration? What information do we share with the issuing bank, and what protections are in place for our merchant's sensitive data?",
        "Can you walk me through a real example? If a customer disputes a transaction, what does the Collaboration process look like from notification to resolution?",
        "I've heard that merchants who participate in Collaboration tend to have lower overall chargeback rates. Is there published data supporting that claim? What benchmarks should I expect?",
      ],
      'friendly-fraud': [
        "That's a good start, but I want to dig deeper. Can you walk me through a specific case where you identified friendly fraud? What were the red flags, and what evidence did you present to the issuer?",
        "You mentioned purchase regression patterns. How do you distinguish between a customer who genuinely forgot a purchase and one who is deliberately filing a fraudulent dispute?",
        "What role does email confirmation play in your investigation? If a customer claims they never received order confirmation, how do you verify the communication trail?",
        "Can you explain your process for analyzing shipping and tracking data? How do you use delivery confirmation to counter friendly fraud claims?",
        "I'm interested in your preventive measures. What tools or strategies do you recommend merchants implement to reduce friendly fraud before it becomes a chargeback problem?",
      ],
    }

    const scenarioResponses = responses[scenario.id] || responses['compliance']
    const index = Math.min(historyCount, scenarioResponses.length - 1)
    return scenarioResponses[index]
  }
}

/**
 * Streaming version for SSE-like responses
 */
export class StreamingAIClient {
  static async *streamResponse(
    userMessage: string,
    scenario: Scenario,
    history: string[]
  ): AsyncGenerator<string, void, unknown> {
    const { text } = await AIClient.generateResponse(userMessage, scenario, history)
    const words = text.split(/\s+/)
    for (const word of words) {
      yield word + ' '
      await new Promise((r) => setTimeout(r, 30 + Math.random() * 50))
    }
  }
}
