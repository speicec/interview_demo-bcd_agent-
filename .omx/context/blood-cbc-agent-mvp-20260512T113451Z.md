Task statement:
Build an MVP for a medical blood routine analysis agent.

Desired outcome:
User can paste JSON-format CBC data into a frontend, pass schema validation, trigger an agent analysis of medical indicators, and view compliant medical reminders in a clean medical UI.

Stated solution:
1. Frontend JSON paste input with schema validation.
2. Agent analysis of indicators and compliant reminder rendering.
3. UI styled for medical use with white, blue, and green theme.
4. Recommend the fastest MVP tech stack.

Probable intent hypothesis:
The user wants the fastest credible demo that feels medically appropriate, reduces invalid input risk, and can explain common CBC abnormalities without overclaiming as a diagnostic system.

Known facts / evidence:
- Repository is currently greenfield and effectively empty except for .git.
- The task explicitly requires JSON schema validation before analysis.
- The task explicitly requires front-end presentation of analysis results.
- The task explicitly requires a medical-style theme using white, blue, and green.
- The task explicitly asks for the fastest MVP technical implementation path.

Constraints:
- Prefer MVP speed.
- No existing codebase constraints are currently present.
- Medical output must stay compliant and framed as reminders/risk prompts, not definitive diagnosis.

Unknowns / open questions:
- Who the primary user is (patient, clinician, sales demo, internal operator).
- Whether analysis should be rules-only, LLM-only, or hybrid.
- Whether the agent must call a live model or can be mocked/local for MVP.
- Which CBC fields are mandatory in the input schema.
- Required language for UI and analysis output.
- Whether data persistence, auth, audit log, or export is needed.

Decision-boundary unknowns:
- What stack OMX may choose without further confirmation.
- Whether OMX may define the minimal indicator set and reminder style.
- Whether OMX may exclude backend persistence/auth from MVP.

Likely codebase touchpoints:
- Frontend app shell and page layout.
- JSON schema definition and validation layer.
- Analysis engine / agent route.
- Prompting / guardrail logic for medical reminders.
- Result cards / alert display components.
