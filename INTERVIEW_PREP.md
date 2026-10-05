# Interview Prep

Four tabs: **Interviewers**, **Questions for me**, **Questions to ask**, **Notes**.

---

## Interviewers

| Name | Role | What to know / tailor |
|---|---|---|
| | | |
| | | |

---

## Questions for me

### About myself

**"Why are you leaving Sonar?"**

- **If small company:**
  > Nothing negative about Sonar — it's a good company with smart people. But decisions often needed a lot of alignment before anything got built, and I prefer to prototype early so people can react to something real. I'm looking for a place where that's the normal way of working.

- **If big company:**
  > Sonar taught me that prototypes are the fastest way to create alignment — and at a bigger company, that skill matters even more. I want to work at scale, where there are more teams to align, more users to learn from, and more surface area for design to have an impact.

  *Never frame it as "big company culture wasn't a fit" — that invites doubt about whether theirs will be either. Anchor the answer in scale and impact, not in escaping Sonar.*

### Why [the company]

- 
- 

### About [the company]

- Product:
- Competitors:
- Recent news / launches:

### Way of working

**1. High-level workflow with AI**

1. **Frame the problem** — work with product to define the problem and what we need to validate.
2. **Prototype before polishing** — sketch, then turn it into a clickable flow with Claude Code. At Sonar, 2–3 hours instead of a few days. Build only the riskiest part, not the whole product.
3. **Test it** — put the working prototype in front of stakeholders or users; they react to real behaviour, not static screens.
4. **Decide** — keep what works, cut what doesn't; commit to a direction with evidence.
5. **Design and ship properly** — refine the chosen direction and hand off to engineers. The prototype is for learning, not production code.

**2. How I set it up (technical)**

1. **Start with the foundation** — if there's a design system, connect it through MCP so the prototype uses real components, tokens, and patterns. If not, set up a basic foundation first (colours, type, spacing, core components).
2. **Prompt the interaction** — describe the flow, states, and behaviour through prompts; start from a sketch and iterate in small steps.
3. **Run it locally** — npm + React + Vite; instant reloads make live iteration during reviews fast.
4. **Host it so others can open it** — GitHub Pages, or internal hosting/staging/preview deployments if the company has them.
5. **Share and collect feedback** — send the link; stakeholders click through the real flow instead of looking at screenshots.

**3. Example — Sonar Issues page filter**

- **Situation** — Issues page is the 2nd most visited page; the filter panel dominated the screen but only 0.3% of sessions used it; bulk actions were used ~4x more but were buried; enterprise customers complained about noise and support got repeat tickets.
- **Task** — lead designer on the squad; find a direction to help developers triage fast; many stakeholders involved; design system team was changing filter patterns simultaneously.
- **Action** — framed what to validate with the PM; analysed usage data; sketched, then skipped Figma and built a working POC in Claude Code and Cursor; worked in parallel with engineers; kept version history to show stakeholders what changed and why.
- **Result** — validated the direction in days not weeks; filter panel became secondary; bulk actions easier to reach; roughly halved the visual noise.
- **What was still slow** — stakeholder feedback took a lot of admin; Figma MCP wasn't reliable enough yet so I shared screenshots per flow state; a strong design system made the prototype fast — without one it would take much longer.

### Salary expectations

- 

### Notice period

- 

---

## Questions to ask

- 
- 
- 

---

## Notes

- 
