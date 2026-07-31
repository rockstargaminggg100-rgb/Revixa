# REVIXA COMPONENT GUIDELINES

Component interface standards, accessibility compliance, and reusable UI contracts.

## 1. Reusable Component Rules
- **No Duplicated Cards**: Every metric card or widget must derive structure from centralized CSS definitions in `style.css` and `app-shell.css`.
- **Keyboard Accessibility**: Modal overlays (`⌘K`, Decision Review) must trap focus and listen for `Escape`.
- **WCAG AAA Compliance**: Minimum contrast ratio of 7:1 for text on `--bg-warm-white` and `--bg-surface`.

---

## 2. Iconography Standards
- Standardized SVG icons or emoji glyphs with consistent 16px/24px sizing.
- Zero decorative iconography without semantic meaning.
