/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // GitHub-inspired color palette (Dark Mode)
        'gh-canvas': '#0d1117',
        'gh-canvas-subtle': '#161b22',
        'gh-border': '#30363d',
        'gh-border-muted': '#21262d',
        'gh-fg-default': '#e6edf3',
        'gh-fg-muted': '#7d8590',
        'gh-fg-subtle': '#6e7681',
        'gh-accent': '#2f81f7',
        'gh-accent-emphasis': '#1f6feb',
        'gh-success': '#3fb950',
        'gh-danger': '#f85149',
        'gh-warning': '#d29922',
        'gh-btn-bg': '#21262d',
        'gh-btn-hover': '#30363d',
        
        // Light Mode colors
        'light-canvas': '#ffffff',
        'light-canvas-subtle': 'rgba(175, 184, 193, 0.2)',
        'light-border': '#d0d7de',
        'light-border-muted': '#d8dee4',
        'light-fg-default': '#24292f',
        'light-fg-muted': '#57606a',
        'light-fg-subtle': '#6e7781',
        'light-accent': '#0969da',
        'light-accent-emphasis': '#0550ae',
        'light-success': '#1a7f37',
        'light-danger': '#cf222e',
        'light-warning': '#9a6700',
        'light-btn-bg': 'rgba(175, 184, 193, 0.2)',
        'light-btn-hover': 'rgba(175, 184, 193, 0.3)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Noto Sans', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
