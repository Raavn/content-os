import Anthropic from '@anthropic-ai/sdk'

let anthropicClient: Anthropic | null = null

export function getAnthropicClient() {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('Missing ANTHROPIC_API_KEY')
  }

  if (!anthropicClient) {
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }

  return anthropicClient
}

export async function anthropicGenerateText({
  prompt,
  system,
  maxTokens,
  model = 'claude-opus-4-5-20251101',
}: {
  prompt: string
  system?: string
  maxTokens: number
  model?: string
}) {
  const response = await getAnthropicClient().messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('\n')

  return {
    text,
    usage: response.usage,
  }
}

