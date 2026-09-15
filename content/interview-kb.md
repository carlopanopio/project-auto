# Interview Knowledge Base — Carlo Panopio

Source of truth for the "Ask me anything" interview chatbot. The bot answers **only**
from this file. Facts pulled from `server/src/db/seed.js` are pre-filled; everything
marked `TODO` needs your answer in your own voice — first person, the way you'd say it
out loud in an interview. Short and specific beats polished and vague.

---

## 0. Positioning (the 30-second answer)

- **Headline:** Software engineer, 15+ years. Now: automation + integration work through AutomationHub.ph.
- **TODO — "Tell me about yourself."** Your own 4–6 sentence version:
  >

- **TODO — Who are you talking to?** Which of these should the bot optimise for?
  recruiters screening for a dev role / prospective automation clients / both?
  >

---

## 1. Career timeline (from seed.js)

| Period | Role | Org |
|---|---|---|
| 2011–2013 | .NET Developer | Energy sector |
| 2013–2018 | Software Test Engineer | Energy market sector |
| 2018–2023 | Software Design Specialist | Energy market sector (PH electricity market infra) |
| 2023–now | Software Engineer | Financial services |
| 2023–now | Freelance SW Engineer & Automation Specialist | AutomationHub.ph |

- **TODO — Why each move?** One line per transition (2013, 2018, 2023):
  >

- **TODO — The two 2023–present roles overlap.** How do you explain that to an
  interviewer (employed + freelance)? What's the honest framing?
  >

---

## 2. Energy market years (2011–2023 — the deepest chunk)

- **TODO** What did the Philippine electricity market system actually *do*, explained
  to a non-expert in 3 sentences?
  >

- **TODO** Highest-stakes bug or incident you were part of. What broke, what did you do,
  what changed afterwards?
  >

- **TODO** 5 years as a Test Engineer (2013–2018) — what does that give you that
  developers without a QA background don't have? Concrete example, not a platitude.
  >

- **TODO** "Regulated, high-availability environment" — what did that mean day to day?
  (release cadence, approvals, downtime windows, audits)
  >

- **TODO** Load testing: what tools, what scale, what did you find?
  >

---

## 3. Project deep-dives

### PayMongo → GoHighLevel bridge (Node.js, Railway, Docker, <3s, ~15h/wk saved)
- **TODO** Hardest technical part?
  >
- **TODO** How do you handle a webhook that fires twice (idempotency) and one that never
  arrives (retries / reconciliation)?
  >
- **TODO** Where did the "15h+ saved per week" and "₱0 reconciliation errors" numbers
  come from — measured how?
  >

### SmashMatch court queue manager (React, WebSockets, real-time)
- **TODO** Why WebSockets over polling here?
  >
- **TODO** Two staff act on the same court at the same second — what happens?
  >
- **TODO** "60% workload reduction" — measured how?
  >

### SnowPros (WordPress) & Playwithbella (Shopify)
- **TODO** What do these show that the Node/React work doesn't?
  >

---

## 4. Technical depth

- **TODO** Stack you'd pick today for a greenfield integration service, and why.
  >
- **TODO** n8n vs Make vs Zapier vs custom code — your actual decision rule.
  >
- **TODO** Something you believed about software 5 years ago that you've since changed
  your mind about.
  >
- **TODO** How do you test an automation that talks to three third-party APIs you
  don't control?
  >
- **TODO** Weakest area of your stack right now, and what you're doing about it.
  >

---

## 5. Working style & behavioural

- **TODO** Disagreed with a client or lead about an approach — what happened?
  >
- **TODO** A project that went badly. What actually went wrong, and your share of it.
  >
- **TODO** How do you scope and price freelance work when requirements are fuzzy?
  >
- **TODO** How do you work with AI tooling day to day? (You hold 4 Anthropic certs —
  interviewers will ask.)
  >
- **TODO** Remote/async: timezone, overlap hours, how you communicate.
  >

---

## 6. Logistics

- **TODO** Availability, engagement types (full-time / contract / project), rate range
  (or "on request"), location & work authorisation.
  >

---

## 7. Out of scope — the bot must decline these

Specific salary history, client names under NDA, personal/family details, opinions on
named people or companies, anything not in this file.

Fallback line when a question isn't covered:
> "That's not something I have on file — best to ask Carlo directly via the contact form."
