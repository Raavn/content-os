import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import fs from 'fs'
import path from 'path'

const MODEL = 'gemini-1.5-flash' // Using a stable model name

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

  const { text } = await generateText({
    model: google(MODEL),
    prompt,
  })

  return text
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

  const { text } = await generateText({
    model: google(MODEL),
    prompt,
  })

  return text
}
