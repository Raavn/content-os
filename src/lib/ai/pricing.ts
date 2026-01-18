export type LlmPricing = {
  input: number
  output: number
}

type PricingTable = Record<string, LlmPricing>

const FALLBACK_PRICING: PricingTable = {}

function normalizeKey(key: string) {
  return key.trim().toLowerCase()
}

export function getPricingTable() {
  const raw = process.env.LLM_PRICING_JSON || process.env.LLM_PRICING
  if (!raw) {
    return { table: FALLBACK_PRICING, configured: false }
  }

  try {
    const parsed = JSON.parse(raw) as PricingTable
    const table: PricingTable = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (!value) continue
      const input = typeof value.input === 'number' ? value.input : undefined
      const output = typeof value.output === 'number' ? value.output : undefined
      if (input === undefined || output === undefined) continue
      table[normalizeKey(key)] = { input, output }
    }

    return { table, configured: Object.keys(table).length > 0 }
  } catch {
    return { table: FALLBACK_PRICING, configured: false }
  }
}

export function resolvePricing(model: string, table: PricingTable) {
  const normalizedModel = normalizeKey(model)
  if (table[normalizedModel]) return table[normalizedModel]

  const match = Object.entries(table).find(([key]) => normalizedModel.includes(key))
  return match ? match[1] : null
}

export function calculateCost(model: string, inputTokens: number, outputTokens: number, table: PricingTable) {
  const pricing = resolvePricing(model, table)
  if (!pricing) return 0
  return inputTokens * pricing.input + outputTokens * pricing.output
}
