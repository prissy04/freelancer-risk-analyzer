# AI Freelancer Business Risk Analyzer

> **Live Demo:** https://freelancer-risk-analyzer.vercel.app
> **GitHub:** https://github.com/prissy04/freelancer-risk-analyzer
> **Stack:** React · Vite · Anthropic Claude API · Vercel

---

## The Problem

73 million freelancers in the US have no early warning system for business risks that are entirely predictable.

| Risk Pattern | Consequence |
|---|---|
| 70%+ income from one client | Income collapses when that client leaves |
| Too many active projects | Burnout, missed deadlines, damaged reputation |
| Net-30 or Net-60 payment terms | 30-60 day cash flow gaps with zero income buffer |
| Clients changing requirements mid-project | Skill gaps exposed, scope creep, unpaid rework |
| No pipeline of new leads | Income cliff when current projects end |

No such tool existed. I validated this gap by searching GitHub, Product Hunt, and every major AI tool directory before writing a single line of code.

---

## The Origin Story

My son is in high school and freelances as a graphic designer. I watched him burn out — too many projects, clients changing requirements mid-work, school deadlines colliding with client deadlines. I searched everywhere for a tool to help him see these risks early. Nothing existed. So I built it.

He was the first user. He read his results and said: *"Yeah, that's exactly what's been happening."* That was enough for me.

---

## Market Validation

| What I Searched | What I Found | Gap Confirmed |
|---|---|---|
| GitHub risk-analytics topic | Credit risk tools — nothing for freelancers | ✅ |
| GitHub freelancer-tools repos | Invoice tools — no risk assessment | ✅ |
| Product Hunt AI tools | Contract analyzers — different problem | ✅ |
| Enterprise burnout tools | Corporate tools — not freelancer self-assessment | ✅ |
| Upwork, Fiverr, Toptal | Client-side tools only | ✅ |

**Conclusion:** This specific tool did not exist anywhere as a standalone deployed product.

---

## What It Does

A freelancer answers 10 questions about their current business. Claude AI returns a color-coded risk report across 5 dimensions:

| Risk Dimension | What It Analyzes |
|---|---|
| Income Concentration Risk | How dependent are you on a single client? |
| Overcommitment and Burnout Risk | Are you taking on more than you can deliver? |
| Cash Flow Gap Risk | Will your payment terms leave you without income? |
| Skill Mismatch Risk | Are clients asking for skills you do not have? |
| Pipeline Health Risk | What happens when your current projects end? |

Each dimension returns a High, Medium or Low rating, a 2-sentence explanation specific to your answers, and one concrete action step.

**No data stored. No account required. Zero data retention by design.**

---

## Technical Architecture

User Browser connects to React + Vite Frontend which includes a 10-question self-assessment form, a rate limiter of 3 analyses per day via localStorage, and a color-coded risk report renderer. The frontend calls the Anthropic Claude API using the claude-haiku model, sending a structured JSON prompt and receiving a 5-category risk analysis with personalized responses referencing actual user inputs.

| Decision | Rationale |
|---|---|
| Claude Haiku model | Cheapest model at approximately $0.001 per analysis |
| No database | Zero privacy concerns, no GDPR overhead |
| localStorage rate limiting | Prevents abuse at zero server cost |
| Environment variables | API key never in code or version control |
| $20 per month spend cap | Hard ceiling prevents unexpected charges |

---

## Risk Management

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| API cost explosion | Medium | High | $20 per month hard cap in Anthropic console |
| API key exposed | Low | Critical | Environment variables only, .env in .gitignore |
| User abuse | Medium | High | 3 analyses per day per browser |
| Vercel billing | Low | High | Hobby plan — hard ceiling, no overages |
| API downtime | Low | Medium | Error handling with user-friendly message |

---

## Running Locally

```
git clone https://github.com/prissy04/freelancer-risk-analyzer
cd freelancer-risk-analyzer
npm install
```

Create a .env file with your Anthropic API key:

```
VITE_ANTHROPIC_API_KEY=your-key-here
```

Then run:

```
npm run dev
```

---

## What I Learned

**On product thinking:** Validating the gap before building was the most important step. Several ideas were ruled out through research before landing on this one.

**On technical decisions:** Choosing Claude Haiku over Sonnet reduced cost by 12x with no meaningful quality loss for structured analysis tasks.

**On risk management:** Every safeguard was built before the first public URL was shared. Managing known risks proactively is cheaper than responding after the fact.

**On prompt engineering:** The prompt instructs Claude to reference actual user answers — not return generic advice.

---

## Product Roadmap

- PDF report download
- Progress persistence across sessions
- Month-over-month risk score tracking
- Contextual resource suggestions per risk category
- Mobile-optimized layout
- Accessibility audit WCAG 2.1 AA

---

## Skills Demonstrated

AI Application Development · Anthropic Claude API · Prompt Engineering · React · Vite · API Security · Rate Limiting · Vercel Deployment · Market Research · Competitive Analysis · Risk Management · Technical Documentation

---

## About the Builder

**Prisca M** is a Technical Program Manager with experience at Microsoft, SAS, and MetLife.

This project demonstrates end-to-end problem-solving — from identifying a confirmed market gap through competitive research, to building and deploying a production AI application, to documenting it with enterprise-grade rigor.

- **LinkedIn:** https://linkedin.com/in/priscamanokore
- **GitHub:** https://github.com/prissy04
- **Live App:** https://freelancer-risk-analyzer.vercel.app

---

Built March 2026 · Open source · Free to use · No data stored
