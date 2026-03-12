/**
 * Brew Loyalty — Theme
 *
 * This is the single file to customize for your brand.
 * Change colors, border radii, and spacing here — every screen
 * in the app imports from this file rather than using hardcoded values.
 *
 * Self-hosters: start here. Change `primary` and `accent` to match
 * your brand and you're 80% of the way to a fully branded app.
 */

export const theme = {
  colors: {
    // ── Brand ─────────────────────────────────────────────────
    // These are the two values most owners will want to change.
    primary: '#1a1a1a',           // main brand color (buttons, cards, headers)
    primaryForeground: '#ffffff', // text/icons on top of primary

    accent: '#2d7d46',            // points, success states, perk checkmarks
    accentForeground: '#ffffff',

    // ── Layout ────────────────────────────────────────────────
    background: '#fafaf8',        // screen background
    surface: '#ffffff',           // card and input backgrounds
    surfaceDisabled: '#f0f0ee',   // disabled button backgrounds

    // ── Text ──────────────────────────────────────────────────
    textPrimary: '#1a1a1a',
    textSecondary: '#666666',
    textMuted: '#888888',
    textFaint: '#aaaaaa',
    textPlaceholder: '#999999',

    // ── Borders ───────────────────────────────────────────────
    border: '#eeeeee',
    borderInput: '#dddddd',

    // ── Semantic ──────────────────────────────────────────────
    error: '#e53e3e',
  },

  radius: {
    xs: 6,   // small badges
    sm: 8,   // inline buttons, tags
    md: 12,  // cards, inputs
    lg: 16,  // large cards, point display
    button: 14, // primary action buttons
  },

  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
} as const

export type Theme = typeof theme
