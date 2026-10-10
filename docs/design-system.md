# SHUSH — warm editorial design

The site should feel like a place to spend time with the team: quiet, welcoming and composed, while retaining the real SHUSH identity. This system applies to Home, Premier, Roster, Creators, Drop, About, Matchday, loading and recovery screens.

## Palette and surfaces

| Role | Value | Use |
| --- | --- | --- |
| Canvas | `#15131a` | Warm charcoal page background |
| Surface | `#201d28` | Panels, forms and grouped content |
| Raised surface | `#292431` | Selected regions and secondary depth |
| Field | `#19161f` | Inputs and editable summaries |
| Text | `#f3eef4` | Warm white primary content |
| Secondary text | `#b9b0c3` | Descriptions, dates and supporting labels |
| Accent | `#c4afe9` | Lavender primary actions and key details |
| On accent | `#261c35` | Dark text on lavender buttons |
| Separator | `#403849` | Quiet structural boundaries |
| Control border | `#7e718e` | Interactive outlines |

Player portrait colours remain individual. YouTube and Backora retain restrained contextual accents. Large competing light/dark panels are replaced by a consistent surface family. Shadows are static and sparse; no animated background effects.

## Layout and hierarchy

- Shared content width: 78rem, centred; desktop gutters 2rem, mobile 1.25rem, with safe-area allowance.
- Shared spacing scale: 8, 16, 24, 32, 48, 64, 96px. Sections use a responsive 48–80px rhythm.
- Shared internal-page top offset and title scale keep page changes predictable.
- Manrope is used for headings and body. IBM Plex Mono is reserved for data and compact technical labels. The unused Space Grotesk webfont is removed.
- Page titles: responsive 44–72px desktop, 40–60px mobile; line height 1.15. Section headings: 32–52px, line height around 1.16. Body copy: 16px with generous line height.
- Text groups align to the same column. Closely related labels and values stay together; larger gaps separate independent tasks.
- Corners follow three sizes: approximately 10px for controls, 16px for small cards, 24px for major panels.

## Components

Primary actions use lavender with dark text. Secondary actions use quiet borders. Text links support navigation without competing with the main action. In particular, seven roster Tracker links remain available but no longer use seven primary-colour buttons; the selected player's main Tracker action has priority.

Navigation has a contained group and a clearly selected item. Player profiles use a calm information panel beside the real portrait. Premier separates individual jornadas and result records with consistent padding. Drop inputs and summary share the site palette. Creator cards, About panels and the footer use the same radius, typography and surface rules.

Keep existing focus outlines, minimum target sizes, semantic controls, responsive reflow and reduced-motion behaviour. Colour changes must pass the existing axe checks. Intentional visual changes require review of actual desktop and mobile screenshots before accepting baselines.

## References

The direction is a SHUSH design choice. Its grouping and hierarchy principles are informed by Nielsen Norman Group's [Visual Hierarchy in UX](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) and [Proximity Principle](https://www.nngroup.com/articles/gestalt-proximity/). These principles do not establish a subjective aesthetic as universally better; the published preview is the concrete design for review.
