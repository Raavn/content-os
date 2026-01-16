# Content OS — MVP Product Brief

## Purpose
Build a web-based Content OS that operationalizes an already-working AI writing system currently living in the CLI.  
The product’s role is **access, speed, and persistence**, not experimentation with prompts or quality invention.

This tool exists to turn structured thinking into publishable content with minimal friction.

---

## Core Value Proposition
> Paste a content brief, select a Brand (lens), click Generate, receive high-quality content that feels like a continuation of the author’s thinking.

---

## In-Scope Deliverables (MVP)

### 1. Blog Posts
- Long-form
- Markdown output
- Publish-ready or very close
- Generated using existing, proven prompts and style extrapolation

### 2. Social Posts (Threads)
- Not primary in MVP, but considered a near-term extension
- Derived from blog posts
- Generated using the same Brand lens and writing style

---

## Out of Scope (Explicitly)
- Feedback loops
- Engagement analytics
- Scoring or quality ratings
- Iteration UI
- Approval workflows
- Publishing integrations
- Image or multimodal content

---

## Core Workflow (60-Second Contract)

1. User logs into the tool
2. User pastes a **content brief** (typically a Markdown skeleton)
3. User selects a **Brand**
4. User clicks **Generate**
5. System generates content using:
   - Brand system prompt (lens)
   - Brand-specific writing style corpus
6. Output is displayed
7. User copies output and exits

> All inputs and outputs are persisted, even if the UI is minimal.

---

## Mental Model: Brand (First-Class Object)

A **Brand** represents a cognitive and tonal lens.

Each Brand includes:
- Brand name
- System prompt (lens)
- Associated writing style examples (Markdown corpus)
- Allowed deliverables (blog, threads)

### Initial Brands
1. **AI Operator**
   - Lens: calm AI usage, non-burnout engineering, grounded systems thinking
2. **Music / Innovation**
   - Lens: creativity without paralysis, AI sharpening (not replacing) musicianship

The product is **one tool with multiple Brands**, not multiple tools.

---

## Writing Style Extrapolation

Status: **Solved problem**

- Writing style is extrapolated from curated Markdown examples
- Style is **Brand-specific**, not global
- No automatic learning in MVP
- Canon examples are curated manually outside the UI
- Existing CLI logic is reused as-is

---

## Social Content Strategy (Conceptual)

- Blogs are the primary source of truth
- Social posts are generated from blog content
- Engagement feedback is collected externally (by the operator)
- Improved briefs lead to improved future generations

The system is designed as a **content engine**, not a one-off generator.

---

## Persistence Model (Conceptual)

Minimum objects persisted:
- Brand
- Content Brief
- Generation
  - Type (blog | threads)
  - Timestamp
  - Associated Brand

Visual persistence is optional in MVP; data persistence is mandatory.

---

## Guardrails & Quality Control

- Guardrails are enforced via prompt design
- No UI-level linting or validation in MVP
- Tone, constraints, and exclusions live in system prompts
- The operator remains the quality filter

---

## MVP Definition (Locked)

**MVP = Blog Generator with Brand System**

Capabilities:
- Define and persist Brands
- Select Brand at generation time
- Paste content brief
- Generate blog post
- Persist input and output
- Copy output

Threads generation follows immediately after MVP stabilization.

---

## Non-Goals
- General-purpose writing tool
- Prompt playground
- Content marketing platform
- Multi-user marketplace

---

## Product Identity
This is a **private, opinionated Content OS** designed for an operator with a strong voice and existing audience.

The tool should disappear once the brief is pasted and Generate is clicked.

---

## Readiness Check
The MVP is successful if:
1. A high-quality blog post can be generated with <2 minutes of UI interaction
2. Brand switching feels like mental context switching, not configuration
3. The tool never becomes the focus—the output does
