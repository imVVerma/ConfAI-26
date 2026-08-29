# ConfAI 2026 Website — Content Segmentation & Handoff Tracker

**Purpose:** Break the full website content brief into independent, trackable modules so that (a) anyone can see what's been built vs. what's pending, and (b) work can be picked up by a different team member / AI agent session without re-reading the whole brief from scratch.

**How to use this doc**
- Each row is one buildable chunk (roughly "one prompt to the AI agent" in size).
- Update `Build Status` as work happens: `Not started` → `In progress` → `Built` → `Verified live`.
- Fill `Owner` + `Last touched` so the next person knows who to ask.
- Anything in `Open Items / Blockers` needs a decision or asset before that module can be finished — don't let the agent silently guess on these.
- Source line numbers refer to `Confai26_webcontent.txt` (the original content doc) so anyone can jump back to the exact wording.

---

## Page: HOME

| # | Module | Content Status | Source (lines) | Assets / Links Needed | Open Items / Blockers | Build Status | Owner | Last touched |
|---|--------|----------------|-----------------|------------------------|-------------------------|---------------|-------|----------------|
| H1 | Hero (title, theme, organizer, dates, venue, CTA) | Final text ready | 22–36 | None | None | Built | Cursor agent | 2026-08-29 — scaffold + Home hero only; gradient stand-in until hero photo exists |
| H2 | Conference Overview paragraph | Final — **verbatim, no edits allowed** | 38 | None | None | Built | Antigravity agent | 2026-08-29 — verbatim paragraph; plain `<section>/<p>` markup; CSS deferred to design phase |
| H3 | "Why Attend ConfAI 2026?" (4 bullets) | Final text ready | 40–48 | None | None | Built | Antigravity agent | 2026-08-29 — `<ul>/<li>/<h3>/<p>` structure; no icons/badges/cards per design-deferred constraint; 2-col grid at ≥768 px |
| H4 | Featured Keynote Speakers (6 speakers) | Final text + links ready | 50–62 | Speaker photos (not supplied — need to source/request) | Note required on-page: "Non-exhaustive list, more TBA"; hyperlinks must point to speaker's **org page**, not personal site (already matched in source) | Built | Antigravity agent | 2026-08-29 — all 6 org links verbatim; placeholder boxes with initials via `data-initials` + CSS `::after`; CSS comment marks exact swap-in point for real photos |
| H5 | "Who Should Attend?" (5 audience segments) | Final text ready | 64–74 | None | None | Built | Antigravity agent | 2026-08-29 — `<ul>/<li>/<h3>/<p>` structure matching H3 pattern; 2-col grid at ≥768 px |
| H6 | Program Snapshot / "What's in Store" (4 bullets) | Final text ready | 76–84 | None | None | Built | Antigravity agent | 2026-08-29 — same `<ul>/<li>/<h3>/<p>` pattern as H3/H5; 2-col grid at ≥768 px |
| H7 | Technical Program Committee — button + ~29-name list | Names final; **hyperlinks not included in brief** | 86–144 | Individual profile links + photos for each TPC member | ⚠️ Brief says "hyperlinks attached to names, please refer to them below" but no links are actually present in the text — need the source list with URLs from whoever owns this content | Not started | | |
| H8 | Track Details — 8 tracks (name, chairs w/ links, description) | Final text ready; chair links **not supplied** except overlap with TPC list | 149–236 | Hyperlinks for each track co-chair | Same link gap as H7 — chairs are a subset of the TPC list | Not started | | |
| H9 | Key Dates block (abstract deadline, notification, conference dates) | Final | 241–247 | None | None | Built | Antigravity agent | 2026-08-29 — `<ol>` (chronological order is meaningful); label+value spans per item; date-item rows stack vertically on mobile, flip to row layout at ≥768 px |
| H10 | Key Numbers block (speakers, presenters, students, attendees) | Final | 251–260 | None | None | Built | Antigravity agent | 2026-08-29 — `<dl>/<dt>/<dd>` (value+label pairs); heading assumed as "ConfAI 2026 By the Numbers" — **needs confirmation**; wrapping flex row; numbers sized via clamp only, no animation |
| H11 | "Relive ConfAI 2025" video embed | Final — video link supplied | 263–264 | Embed the YouTube link | None | Not started | | |
| H12 | Contact block (address, email, LinkedIn) | Final text | 266–271 | Google Maps embed of Plaksha campus | ⚠️ Explicitly flagged in brief as not yet added | Not started | | |

## Page: REGISTER

| # | Module | Content Status | Source (lines) | Assets / Links Needed | Open Items / Blockers | Build Status | Owner | Last touched |
|---|--------|----------------|-----------------|------------------------|-------------------------|---------------|-------|----------------|
| R1 | Registration intro text | Final | 278 | None | None | Not started | | |
| R2 | Register CTA button | Copy/behavior known, destination not ready | 280 | Razorpay gateway **or** MS Form link | ⚠️ Blocker — "Gateway not yet created" per brief. Cannot fully build until this exists; can stub the button | Not started | | |
| R3 | Payment slabs table (5 tiers) | Final | 282–307 | None | None | Not started | | |
| R4 | Accommodation details | Final | 310 | None | None | Not started | | |

## Page: AGENDA

| # | Module | Content Status | Source (lines) | Assets / Links Needed | Open Items / Blockers | Build Status | Owner | Last touched |
|---|--------|----------------|-----------------|------------------------|-------------------------|---------------|-------|----------------|
| A1 | Agenda content | **Not in text brief** — referenced as a separate attachment | 314–316 | The actual agenda file/table | ⚠️ Brief only has a disclaimer note ("tentative, can be changed"); no agenda content itself provided yet | Not started | | |

## Page: SPONSORSHIP

| # | Module | Content Status | Source (lines) | Assets / Links Needed | Open Items / Blockers | Build Status | Owner | Last touched |
|---|--------|----------------|-----------------|------------------------|-------------------------|---------------|-------|----------------|
| S1 | "Partner With ConfAI 2026" intro paragraph | Final | 320 | None | None | Not started | | |
| S2 | Sponsorship tiers/buckets | Not finalized | 323–325 | `ConfAI 2026 Sponsorship Deck.pptx` content | ⚠️ Blocker — brief says to confirm final slabs with Khyati Sagar before publishing | Not started | | |
| S3 | Sponsorship inquiries contact | Final | 327 | None | None | Not started | | |

## Page: GALLERY

| # | Module | Content Status | Source (lines) | Assets / Links Needed | Open Items / Blockers | Build Status | Owner | Last touched |
|---|--------|----------------|-----------------|------------------------|-------------------------|---------------|-------|----------------|
| G1 | Image/Video gallery | Placeholder only | 329–333 | Real Google Drive folder link + selected images/videos | ⚠️ "Drive link" is a placeholder in the brief, not an actual URL | Not started | | |

## Page: FAQ & CONTACT

| # | Module | Content Status | Source (lines) | Assets / Links Needed | Open Items / Blockers | Build Status | Owner | Last touched |
|---|--------|----------------|-----------------|------------------------|-------------------------|---------------|-------|----------------|
| F1 | FAQ (8 Q&A pairs) | Final | 335–380 | None | None | Not started | | |
| F2 | Contact section (duplicate/consolidate with H12?) | Final text, same content as H12 | 266–271 | Same as H12 | Decide once: is Contact its own page section, or does FAQ page just reuse the Home footer contact block? | Not started | | |

## Nav items with no content yet

| # | Module | Content Status | Notes |
|---|--------|----------------|-------|
| N1 | Relive ConfAI 2025 (landing page) | Not drafted | Only the video embed (H11) exists; a full "Relive" page (photos, recap copy) isn't in the brief |
| N2 | Relive 2022 (dropdown) | Not drafted | No content in brief |
| N3 | Relive 2023 (dropdown) | Not drafted | No content in brief |

---

## Master blocker list (things someone needs to chase down before those modules can be finished)

1. **TPC member hyperlinks + photos** — list of ~29 names has no actual URLs attached (H7, H8)
2. **Track co-chair hyperlinks** — same gap, subset of #1 (H8)
3. **Registration payment gateway** — Razorpay or MS Form not yet live (R2)
4. **Google Maps embed** for Plaksha campus (H12)
5. **Agenda content** itself — only a disclaimer exists so far, not the schedule (A1)
6. **Sponsorship slabs confirmation** with Khyati Sagar (S2)
7. **Real Drive link + curated media** for the gallery (G1)
8. **Speaker/TPC photos** — not supplied in the text brief for anyone (H4, H7)
9. **Relive 2025 / 2022 / 2023 pages** — nav items exist, no content drafted (N1–N3)

## Suggested workflow for parallel work / handoffs

- Treat each row above as one unit of work you can hand to the AI agent as a self-contained prompt (it already has content status + source lines + open items, so no re-explaining needed).
- Before starting a session, skim the `Build Status` and `Open Items` columns for the module you're picking up.
- Before ending a session (limit hit, or handing off), update `Build Status`, `Owner`, `Last touched`, and jot anything the next person needs in a short note next to the row (e.g. "styled but nav link not wired yet").
- Keep the **Master blocker list** as the single place to check "can I actually finish this today" before starting a module that depends on missing info.
