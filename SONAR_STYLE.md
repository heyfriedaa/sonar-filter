# Sonar Prototype Style Guide

Design tokens and component conventions used in the SonarQube Cloud dark-theme prototypes. All colors live as CSS variables in `src/index.css` — reuse them rather than hardcoding hex values.

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
- Headlines: `#FFFFFF`, ~20px, weight 600.
- Nav links (top + sidebar): `#E0E6F4`, 13px, weight 600. Selected state = `#9DA9F3` bold on `#1B212F`.
- Breadcrumbs: 12px, format `Org / Project / Page` — last segment is the current page (not a link).
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

Security issues also use a segmented pill: `[Security | Blocker]` — category segment `#3E303F`, value `#852A33`, pill stroke `#A2262E`.

Branch analysis status chips: pass = `#5F7A52` bg / `#D3E8C4` check, fail = `#6E4552` bg / `#F0B7C0` ✕.

## Layout conventions

- Top nav: ~56px bar, logo ~48px tall, 4px vertical padding. Right side: outlined `Upgrade` (accent stroke), search, notifications (badge), help, plus, avatar.
- Sidebar: 240px, project header on top, grouped sections (Analysis / Reporting / Policies / Project) with 11px uppercase labels.
- Page hero: full-bleed `#292E41` strip with `#5B6B8D` bottom border; breadcrumbs + headline + branch selector, even 20px vertical padding, 4px between breadcrumbs and headline.
- Content column: max-width ~1012px, centered, 24px gutters.
- Cards: `#292E41` bg, `#5B6B8D` stroke, 8px radius; hover stroke → `#9DA9F3`.
- Dropdowns/menus: `#343B52` bg, `#5B6B8D` stroke, 8–10px radius, dark shadow; always close on outside mousedown.
