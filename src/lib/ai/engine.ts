import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import fs from 'fs'
import path from 'path'
import { anthropicGenerateText } from './anthropic'

const DEFAULT_GOOGLE_MODEL = 'gemini-1.5-flash'

function resolveAiProvider(): 'google' | 'anthropic' {
  const explicit = (process.env.AI_PROVIDER ?? '').toLowerCase()
  if (explicit === 'google' || explicit === 'anthropic') return explicit
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic'
  return 'google'
}

export type LlmUsageResult = {
  model: string
  inputTokens: number
  outputTokens: number
}

async function generateWithProvider(
  prompt: string,
  { maxTokens }: { maxTokens: number }
): Promise<{ text: string; usage: LlmUsageResult }> {
  const provider = resolveAiProvider()

  if (provider === 'anthropic') {
    const model = process.env.ANTHROPIC_MODEL || 'claude-opus-4-5-20251101'
    const { text, usage } = await anthropicGenerateText({ prompt, maxTokens, model })
    return {
      text,
      usage: {
        model,
        inputTokens: usage?.input_tokens ?? 0,
        outputTokens: usage?.output_tokens ?? 0,
      },
    }
  }

  const model = process.env.GOOGLE_MODEL || DEFAULT_GOOGLE_MODEL
  const { text, usage } = await generateText({
    model: google(model),
    prompt,
  })
  return {
    text,
    usage: {
      model,
      inputTokens: usage?.inputTokens ?? 0,
      outputTokens: usage?.outputTokens ?? 0,
    },
  }
}

export async function getStyleCorpus() {
  const corpusDir = path.join(process.cwd(), 'src/corpus')
  let combinedCorpus = ''

  const readDirRecursive = (dir: string) => {
    const files = fs.readdirSync(dir)
    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        readDirRecursive(filePath)
      } else if (file.endsWith('.md')) {
        const content = fs.readFileSync(filePath, 'utf-8')
        combinedCorpus += `\n--- FILE: ${file} ---\n${content}\n`
      }
    }
  }

  if (fs.existsSync(corpusDir)) {
    readDirRecursive(corpusDir)
  }

  return combinedCorpus
}

export async function generateBlog({
  brandName,
  systemPrompt,
  brief,
}: {
  brandName: string
  systemPrompt: string
  brief: string
}) {
  const styleCorpus = await getStyleCorpus()

  const prompt = `
You are a world-class content writer generating a blog post for the brand "${brandName}".

BRAND LENS:
${systemPrompt}

WRITING STYLE CORPUS (Use this to extrapolate tone, structure, and voice):
${styleCorpus}

CONTENT BRIEF:
${brief}

INSTRUCTIONS:
1. Generate a high-quality blog post (500-1000 words unless specified).
2. Follow the Brand Lens strictly.
3. Extrapolate the writing style (tone, sentence structure, formatting) from the provided corpus.
4. Output MUST be clean Markdown.
5. Include standard sections: Problem, Solution, Conclusion.
6. Suggest 2+ internal cross-links at the end.

OUTPUT (Markdown only):
`

  return generateWithProvider(prompt, { maxTokens: 4096 })
}

export async function generateThread({
  brandName,
  systemPrompt,
  blogContent,
}: {
  brandName: string
  systemPrompt: string
  blogContent: string
}) {
  const styleCorpus = await getStyleCorpus()

  const prompt = `
You are a social media expert generating a Twitter/X thread from a blog post for the brand "${brandName}".

BRAND LENS:
${systemPrompt}

WRITING STYLE CORPUS (Use this to extrapolate tone and voice):
${styleCorpus}

SOURCE BLOG CONTENT:
${blogContent}

INSTRUCTIONS:
1. Generate a compelling social post/thread based on the blog content.
2. Maintain the Brand Lens and style from the corpus.
3. Use a mix of educational, fun, or sales tone as appropriate.
4. Posts should be thumb-stopping and hook-driven.
5. Output MUST be clean Markdown.

OUTPUT (Markdown only):
`

  return generateWithProvider(prompt, { maxTokens: 1024 })
}
