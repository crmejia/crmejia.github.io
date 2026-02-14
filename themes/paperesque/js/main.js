import anchorizeHeadings from "./anchorizeHeadings.js";
import enableFloatingFootnotes from "./floatingFootnotes.js";
import { docReady } from "./utils.js";

enableFloatingFootnotes();
anchorizeHeadings();

// automatically close dropdown links if the user scrolls
docReady(() => {
  const menu = document.getElementById('right-links-details');
  menu.addEventListener('toggle', (_event) => {
    if (menu.open) {
      document.addEventListener('scroll', (_event) => {
        menu.open = false;
      }, {once: true});
    }
  })
});

// theme-color meta tag helpers
function updateThemeColorMeta(theme) {
  const metaLight = document.querySelector('meta[name="theme-color"][data-tag=light]');
  const metaDark = document.querySelector('meta[name="theme-color"][data-tag=dark]');
  if (theme === 'dark') {
    metaLight.setAttribute('content', '#09090B');
    metaDark.setAttribute('content', '#09090B');
  } else {
    metaLight.setAttribute('content', '#18181B');
    metaDark.setAttribute('content', '#09090B');
  }
}

// theme toggle button + OS preference listener
docReady(() => {
  const btn = document.getElementById('theme-toggle');
  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    document.documentElement.style.colorScheme = next === 'dark' ? 'dark' : '';
    localStorage.setItem('theme', next);
    updateThemeColorMeta(next);
  });

  // follow OS changes when user hasn't set an explicit preference
  window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const t = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', t);
      document.documentElement.style.colorScheme = t === 'dark' ? 'dark' : '';
      updateThemeColorMeta(t);
    }
  });

  // set initial meta theme-color
  updateThemeColorMeta(document.documentElement.getAttribute('data-theme'));
});
