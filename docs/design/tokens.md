# Design tokens

Source of truth: `src/app/globals.css` and `src/lib/motion.ts`.

| Semantic token | Light | Dark |
| --- | --- | --- |
| Background | `#FCFBFC` | `#171519` |
| Foreground | `#242128` | `#F0EDF1` |
| Primary | `#6A005F` | `#E6A0D9` |
| Primary foreground | `#FFFFFF` | `#2F0E29` |
| Secondary / accent | `#F4EBF2` | `#352530` |
| Secondary foreground | `#630359` | `#EDC2E4` |
| Card / surface | `#FFFFFF` | `#211D23` |
| Muted | `#F1EEF1` | `#242027` |
| Muted foreground | `#706873` | `#B5AAB9` |
| Border | `#E7E1E7` | `#3A323D` |
| Focus ring | `#8C227F` | `#E6A0D9` |

University starting reference: CMYK (50,100,0,40), user-provided web approximation `#6A005F`. The existing seal is preserved as the actual vector asset. Dark mode uses a lighter purple for legibility instead of a global color inversion.

| Foundation | Values and application |
| --- | --- |
| Typography | Self-hosted Inter Variable; Noto Sans SC Variable for Chinese; system fallbacks. Weight 400 body, 500/550 headings, 600/650 compact identity. |
| Display | 72px desktop identity; 50px mobile identity. Chinese name has its own smaller line on mobile. |
| Page title | 60px desktop; 46px mobile. Paper detail 49→34px. |
| Text | 15px UI, 17px article prose, 11–13px metadata. Prose line height 1.9. |
| Shell | Max 1200px. Desktop gutters 56px; tablet 28px; mobile 20px. |
| Reading | 720px prose body, separate 180px contents column; stacked contents on narrow screens. |
| Spacing | 4/8/12/16/20/24/32/40/48/64/74px. 74px between homepage modules, 52px on mobile. |
| Radius | 10px component, 16px gallery image, 12px mobile image, 18px detail cover. |
| Shadow | Subtle only for document/application screenshots and shadcn dialogs. No raised-card shadow animation. |
| Icons | Lucide only. 14–16px inline; 18–20px controls; 36px header control target. |
| Motion feedback | 180ms; general easing `(0.22,1,0.36,1)`. |
| Content reveal | 320ms; 15–17px local text travel; 1.035× image scale. |
| Layout | 360ms; Motion layout + `AnimatePresence`. |
| Shared image/title | 420ms; browser View Transition API; direct-route fallback. |
| Navigation | Motion spring stiffness 450, damping 38. |
| Theme | 220ms background/text/border transition. |
| Reduced motion | No shared-element movement, translation, or scale; immediate state feedback. |

Focus, hover, selected, disabled, empty, open/closed, light/dark, and coarse pointer states are covered by shared tokens and component styles. Research card bounds remain fixed during reveal. The mobile details/Paper links are visible without hover.
