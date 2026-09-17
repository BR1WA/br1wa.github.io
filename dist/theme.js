// Apply the saved palette before the page paints; new visitors start in dark mode.
(() => {
  const key = 'portfolio-theme';
  let theme = 'dark';
  try { const saved = localStorage.getItem(key); if (saved === 'light' || saved === 'dark') theme = saved; } catch {}
  function apply(value) {
    theme = value;
    document.documentElement.dataset.theme = value;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#11151c' : '#f7f8fa');
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      const next = value === 'dark' ? 'light' : 'dark';
      button.setAttribute('aria-label', `Switch to ${next} theme`);
      button.title = `Switch to ${next} theme`;
      button.querySelector('[data-theme-label]').textContent = next === 'light' ? 'Light' : 'Dark';
    });
  }
  apply(theme);
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => {
        apply(theme === 'dark' ? 'light' : 'dark');
        try { localStorage.setItem(key, theme); } catch {}
      });
    });
    apply(theme);
  });
  addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply(event.newValue === 'light' ? 'light' : 'dark');
  });
})();
