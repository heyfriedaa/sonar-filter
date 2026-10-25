# Sonar Prototype Style Guide

Design tokens and component conventions used in the SonarQube Cloud prototypes. Reuse the shared theme CSS variables in `src/index.css` for surfaces, text, borders, and interactive controls rather than hardcoding theme colors.

## Themes and shared controls

- Dark is the default theme. Light overrides the same `--sc-*` tokens through `:root[data-theme='light']` in `src/index.css`; native browser controls also use the corresponding `color-scheme`.
- Light theme follows the supplied platform reference: near-white canvas `#FCFCFD`, white surfaces, pale lavender borders `#cdd4ed` and dividers `#e4e7f4`, slate body text `#42465f`, muted blue metadata, and primary accents and issue titles `#596DD7`. Background/slate colors are visual approximations from the screenshot; the primary color and interaction colors below are explicitly specified.
- `TopNav` uses `src/assets/sonarqubecloud-blue.svg` for Light and the existing `SQ_Logo.svg` for Dark. Change only the logo asset and palette when switching themes, not the version layout or filter behavior.
- Open the V picker with Command+K and the V button, then click its gear icon to navigate to a separate **Settings** page within the picker. This page replaces the version list and shows a top-left back arrow beside Settings, a small **Theme** heading, and **Dark / Light** controls. The arrow returns to the versions list. Theme selection applies immediately across all versions without changing layout, filters, sorting, or issue selection. The choice lasts until page refresh.
- To reuse the design system in future work, use the existing `--sc-*` tokens; components inherit the selected theme automatically. The color table below lists the default dark values; light values are defined beside them in `src/index.css`.
- All native `input[type='checkbox']` elements share the UI in `src/index.css`. Both themes: unchecked is transparent with an outline; checked uses the theme's `--sc-accent` fill (blue/purple `#9DA9F3` in Dark, `#596DD7` in Light). Tick color uses `--sc-checkbox-tick`: dark/near-black `#1B212F` in Dark and white in Light. Keep native semantics, labels, keyboard behavior, visible focus, disabled states, and forced-colors support.
- Light compact quick-filter tabs: selected has white fill, `#C2CDE1` stroke and a subtle drop shadow; unselected has `#F0F2FA` fill with no visible stroke. Keep dimensions stable between states. Exception: facet V1’s Top issues tile retains its surface fill and accent-blue outline when selected; unselected removes the outline. Do not apply the compact tabs’ selected styling to that tile.
- Dark unselected quick-filter buttons/tiles use `#3D4359` fill and `#5F7295` for their count numbers; selected states remain unchanged. Light states are unaffected.
- Exploration without filter facet V1 and V2 quick-filter buttons (Top issues / Top 10 issues and All) use 10px top and bottom padding in both themes. Do not apply this spacing override to other versions.
- Light primary-disabled bulk action: `#F0F2FA` fill and `#A4ADC4` text. Secondary-disabled bulk action: transparent fill and `#C2CDE1` stroke, with muted text. Do not use opacity to fade these specified colors.
- Top issues and All display count badges: selected uses `#596DD7` fill with white text in Light, unselected uses `#E0E6F4` fill. Never add a count badge to Top 10 issues; preserve V2’s existing All count.
- Top issues uses the same orange filled Flame icon across versions. Assign to Agent uses the shared lucide Sparkles icon, not a robot.

## Color tokens

| Token | Value | Usage |
|---|---|---|
| `--sc-bg` | `#1B212F` | Content / canvas background |
| `--sc-surface` | `#292E41` | Top nav, sidebar, page hero, issue cards, dropdown chips |
| `--sc-surface-raised` | `#343B52` | Dropdown menus, hover fills, filter panel |
| `--sc-sidebar` | `#292E41` | Left nav background |
| `--sc-sidebar-active` | `#1B212F` | Selected sidebar item background |
| `--sc-border` | `#5B6B8D` | Strokes on all surfaces |
| `--sc-border-subtle` | `#3A4260` | Inner dividers |
| `--sc-text-headline` | `#FFFFFF` | Page headlines |
| `--sc-text-primary` | `#E0E6F4` | **All** body/nav/meta text — the default everywhere |
| `--sc-text-accent` | `#9DA9F3` | Selected nav items, issue titles (always bold) |
| `--sc-accent` | `#9DA9F3` | Primary accent: Upgrade button stroke, card hover stroke, checkboxes |
| `--sc-link` | `#6C99F4` | Inline links, focused inputs |
| `--sc-danger` | `#E84949` | Danger accents (rare — severity uses pills below) |
| `--sc-severity-category-bg` | `#3E303F` | Severity pill category segment |
| `--sc-severity-blocker-bg` | `#852A33` | Severity pill blocker segment |
| `--sc-severity-blocker-border` | `#A2262E` | Severity pill blocker stroke |

## Typography

- Font: system stack (`-apple-system, Segoe UI, Roboto, …`), base 14px / 1.4.
- Shared body scale across every version and both themes: `--sc-font-body: 14px` for regular text, navigation and controls; `--sc-font-meta: 13px` for metadata, badges and compact controls; `--sc-font-small: 12px` for small labels and count badges. This increases the previous 13/12/11px scale without changing headline sizes. Reuse these tokens rather than introducing smaller per-version body text.
- Headlines: `#FFFFFF`, ~20px, weight 600.
- Nav links (top + sidebar): `#E0E6F4`, 14px, weight 600. Selected state = `#9DA9F3` bold on `#1B212F`.
- Breadcrumbs: 13px, format `Org / Project / Page` — last segment is the current page (not a link).
- Issue titles: `#9DA9F3`, weight 700.

## Severity

Severity is shown with a filled-circle icon (see `SeverityIcon.jsx`):

| Severity | Icon | Circle bg | Glyph color |
|---|---|---|---|
| Blocker | minus | `#D98890` | white |
| High | chevron-up | `#E0A28A` | white |
| Medium | chevron-up | `#E8B8A4` | white |
| Low | chevron-down | `#E5D68F` | `#5C5426` |
| Info | i | `#9FC3E8` | `#29425F` |

## Shared issue-card UI (all versions)

- Every version renders the shared `IssueCard` component and uses the same `.severity-pill` and `.action-dropdown` styles from `src/App.css`; do not create version-specific badge or dropdown-trigger styles.
- Software quality and severity form a single segmented pill, such as `[Security | Medium]`. Apply the same rule to Security, Reliability, and Maintainability.
- The severity segment uses the solid severity color. The quality segment uses that exact color at **20% opacity** over the current surface (not 20% opacity on the text). A single 1px outer stroke surrounds both segments using the same solid severity color.
- Shared severity tokens in `src/index.css`: `--sc-severity-blocker: #a04b4b`, `--sc-severity-high: #b06a42`, `--sc-severity-medium: #97654a`, `--sc-severity-low: #8a7c4d`, and `--sc-severity-info: #5e7d9c`. The pill selects its token through `--issue-severity-color`; this drives both segment backgrounds and the enclosing stroke in Dark and Light themes.
- Status and assignee dropdown triggers are text with a chevron (and the existing assignee avatar where applicable): **no background fill or button border**, including hover. Keep them as functional buttons with visible keyboard focus. Dropdown menu surfaces are unchanged.

Branch analysis status chips: pass = `#5F7A52` bg / `#D3E8C4` check, fail = `#6E4552` bg / `#F0B7C0` ✕.

## Shared issue filtering and quick-filter behavior

**Version-specific exceptions: V2 - Bulk action (`exploration-v2`), Triaging and grouping (`triaging-v1`), and Moonshot (`moonshot-v1`) label their preset “Top 10 issues” and show the first 10 matching issues after sorting. Their All views are uncapped. V1 - Top Right (`exploration-v1`) and facet use “Top issues” with uncapped matching results. The shared preset criteria still apply.**

### Triaging and grouping V1

- Navigation: Top 10 issues on the left; Confirmed and Accepted as two contiguous buttons within one joined control; All at the far right. Status tabs show the number of issues moved into each group.
- Confirmed and Accepted groups start empty, independent of statuses in the mock data. Empty copy: “You haven't confirmed/accepted any issues here yet.”
- Selected issues use the floating bulk bar with **Move to** and a down chevron. Its options are **Confirmed** and **Accept** (the latter stores Accepted). Moving updates issue-card status and group counts and clears the selection. Moved issues leave the Top 10 queue, which replenishes with the next matching issues. All remains the full inventory, including moved issues with their new status.
- Group navigation uses the shared status-filter category and matching function. Status moves are session-only and isolated to the triaging version; other versions retain their existing issue data and behavior. Returning to triaging defaults to Top 10 without losing session moves.
- The move menu opens above the floating bar and dismisses on outside click or Escape. Use `.triage-move-picker .triage-move-menu` (higher specificity than `.filter-menu`) so shared `top` rules cannot override `top: auto` and the upward `bottom` anchor; give it an opaque theme surface and constrained scrollable height.

- Iteration structure: facet V1 uses the left filter panel and inline bulk actions; exploration V1 uses compact Top issues / All buttons above a divider and the facet-style inline bulk controls. Typography is fixed across versions: “Select issues for bulk actions”, the issue-list heading (including “Viewing top issues” and “Top issues”), and facet category headings use `--sc-issue-heading-size: 15px`, weight 700 and headline color, matching V1 Top Right’s Top issues headline. The inline issue count/effort summary uses `--sc-font-meta` (13px after the shared body-size increase), smaller than the 15px headings, and retains its existing text weights. Do not change these sizes without an explicit request. Facet panel width remains 250px (210px at viewport widths up to 1100px). Exploration V2 uses Top 10 / All and the floating bulk-action bar shown after selecting issues. Triaging/grouping uses the dedicated workflow described above.
- Inline bulk controls share select-all, Change, Assign to Agent, disabled states, and the refresh/count/effort summary. Do not show a duplicate subtitle select-all or floating bar in exploration V1.

- All prototype versions and experiments use the same advanced-filter/facet state and matching logic. Quick filters are presets of those filters, not separate issue lists or display limits.
- **Top issues** selects Software quality: **Security** and **Reliability**, plus Severity: **Blocker**, **High**, and **Medium**. Match either selected quality AND any selected severity. Show every matching issue; never cap results at 10 or label this preset “Top 10 issues”.
- **All / View all** clears the selected filters and displays all issues. Clear all filters has the same filtering effect.
- The facet version starts with the Top issues preset selected. Its selected facet rows and category counts must reflect the actual applied filters. Other layouts use the same state, including when switching versions or opening the advanced filter panel.
- Clicking Top issues replaces the current filters with its preset. Editing filters manually updates the results and preset active state; highlight Top issues only when the applied selections exactly match its preset. All is active only when no filters are selected.
- Default sorting is severity-first: **Blocker → High → Medium → Low → Info**. Missing severity levels are naturally skipped. Software quality is only a tie-breaker within a severity, never ahead of severity. Explicit Filename or Creation date sorting remains available in layouts with sorting controls.
- Issue totals and total effort summarize all currently matching issues, not a truncated subset. The Top issues tile summarizes its preset independently of custom filter edits.
- These filtering rules apply to With filter facet V1, Exploration without filter facet, and future triaging/grouping experiments; presentation can differ, but filtering must not diverge.

## Moonshot V1

- Reuse triaging/grouping logic, filters, Top 10 limit, severity ordering, empty states and floating Move to actions. Store moves per version so Moonshot and Triaging do not change each other's issue statuses.
- Email-client layout: replace project sidebar navigation in this version with issue folders (Top 10 issues, Confirmed, Accepted, All issues) on the left, the shared issue cards in the center, and a right-side details pane only when an issue is opened. Retain the top navigation and page hero.
- Folder navigation has no duplicate Issues heading. Labels are bold (700), using headline color (white in Dark, dark in Light). Confirmed uses CircleCheck; Accepted uses ShieldCheck. Hide count badges when zero. Add dividers before Confirmed and before All, never between Confirmed and Accepted.
- Every folder's issue-list page starts with the same 20px, weight-600 headline and consistent 20px bottom spacing, before any controls. Use the same content padding for populated and empty pages. These larger page headlines are scoped to Moonshot; other versions retain their shared 15px headings.
- Empty Moonshot pages show only the page headline, empty message and a primary filled **View top issues to fix** CTA that opens Top 10. Hide select-all controls, helper subtitles and floating bulk actions when there are no visible issues.
- Click a card's noninteractive area or its title button to open details. Checkboxes, status and assignee controls must not open the detail pane. Highlight the open card independently of bulk selection.
- `IssueDetails` shows the title, current status, Where is the issue / Why is this an issue / Activity / More info tabs, source preview and metadata. Source is explicitly illustrative prototype content, not the actual project source. Do not invent working IDE integrations or backend rule guidance.
- Back/close and Escape within the details pane close it and return focus to the issue title. Folder/version changes and bulk moves close the pane. Tabs support arrow-key, Home and End navigation.
- Use existing theme/typography tokens and shared severity pill UI. Columns scroll independently; narrow viewports allow horizontal workspace scrolling instead of hiding the details pane.

## Layout conventions

- Top nav: ~56px bar, logo ~48px tall, 4px vertical padding. Right side: outlined `Upgrade` (accent stroke), search, notifications (badge), help, plus, avatar.
- Sidebar: 240px, project header on top, grouped sections (Analysis / Reporting / Policies / Project) with 11px uppercase labels.
- Page hero: full-bleed `#292E41` strip with `#5B6B8D` bottom border; breadcrumbs + headline + branch selector, even 20px vertical padding, 4px between breadcrumbs and headline.
- Content column: max-width ~1012px, centered, 24px gutters.
- Cards: `#292E41` bg, `#5B6B8D` stroke, 8px radius; hover stroke → `#9DA9F3`.
- Dropdowns/menus: `#343B52` bg, `#5B6B8D` stroke, 8–10px radius, dark shadow; always close on outside mousedown.
