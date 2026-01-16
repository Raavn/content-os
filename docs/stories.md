# User Stories: Blog & Social Content Engine

This document outlines the epics and stories required to migrate and operationalize the AI-driven content creation from the manual `@ai-operator` system into the `content-os` platform.

## Epic 1: Brand System (Identity & Tonal Context)
*A Brand is the cognitive lens through which content is generated. It encapsulates the system prompt and the writing style corpus.*

### Story 1.1: Define Brand Identity
**As an** Operator,
**I want to** define multiple Brands with distinct system prompts (lenses),
**So that** I can switch between different voices (e.g., "AI Operator" vs. "Music/Innovation") seamlessly.
*   **Acceptance Criteria:**
    *   Ability to store a "Brand Name".
    *   Ability to store a "System Prompt" (The Lens).
    *   Brand selection is available at generation time.

### Story 1.2: Manage Writing Style Corpus
**As an** Operator,
**I want to** maintain a single, global set of Markdown writing examples,
**So that** the model can extrapolate my specific tone and structure across all brands.
*   **Acceptance Criteria:**
    *   Support for multiple Markdown files in a shared style corpus.
    *   Style extrapolation logic uses these examples during generation regardless of the selected brand.

---

## Epic 2: Content Engine (The Long-Form Pillar)
*The core engine for turning structured thinking (briefs) into publishable content.*

### Story 2.1: Content Brief Input
**As an** Operator,
**I want to** paste a Markdown content brief (skeleton) into a simple UI,
**So that** I can provide the raw material for a generation.
*   **Acceptance Criteria:**
    *   Markdown-friendly text area for the brief.
    *   Validation that a brief is present before generation.

### Story 2.2: Content Generation
**As an** Operator,
**I want to** generate full content based on a brief and a selected Brand,
**So that** I receive high-quality long-form content (default 500-1000 words unless specified).
*   **Acceptance Criteria:**
    *   Single-click "Generate" action.
    *   Markdown output following the standard template (frontmatter, Problem, Solution, Conclusion).
    *   Tone calibration against the global style corpus.

### Story 2.3: Persistent Generation History
**As an** Operator,
**I want** every input brief and output post to be persisted,
**So that** I never lose a generation and can refer back to my thinking.
*   **Acceptance Criteria:**
    *   Records include Brand, Brief, Output, and Timestamp.
    *   Ability to view a log of previous generations.

---

## Epic 3: Social Content Engine (The Distribution)
*The derivative engine for creating engagement-ready content for social platforms (Threads).*

### Story 3.1: Derive Social Posts from Content
**As an** Operator,
**I want to** generate social media posts directly from generated content,
**So that** I don't have to re-read and summarize the content manually.
*   **Acceptance Criteria:**
    *   Input for social generation is the blog content.
    *   Maintains the same Brand lens and tone.

### Story 3.2: Social Post Generation
**As an** Operator,
**I want to** generate a social post from the content,
**So that** I can distribute my message across social platforms.
*   **Acceptance Criteria:**
    *   Supports generating posts one at a time.
    *   Output follows the `post_<slug>.md` naming convention.

### Story 3.3: Content Mix (Templates)
**As an** Operator,
**I want** the social generator to follow a predefined mix of "Educational", "Fun", and "Sales" templates,
**So that** my feed remains balanced and engaging.
*   **Acceptance Criteria:**
    *   Logic to alternate between post types (e.g., 10 edu/fun, 1 sales, repeat).
    *   Posts are "thumb-stopping," hook-driven, and scannable (<10s reading time).

---

## Epic 4: Quality & Portability
*Ensuring the system is reliable and outputs are ready for external use.*

### Story 4.1: Cross-Linking & SEO
**As an** Operator,
**I want** generated blog posts to include suggestions for cross-links to other posts,
**So that** I can build internal SEO authority easily.
*   **Acceptance Criteria:**
    *   System suggests 2+ cross-links based on existing generation history.

### Story 4.2: Markdown-First Export
**As an** Operator,
**I want to** easily copy or export the generated output as a clean Markdown file,
**So that** I can publish it to my site or social tools immediately.
*   **Acceptance Criteria:**
    *   "Copy to Clipboard" button for both Content and Social outputs.
