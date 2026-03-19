import { loadArea, setConfig } from './ak.js';

// TODO: Replace with your production hostname(s)
const hostnames = [];

const locales = {
  '': { lang: 'en' },
  '/de': { lang: 'de' },
  '/es': { lang: 'es' },
  '/fr': { lang: 'fr' },
  '/hi': { lang: 'hi' },
  '/ja': { lang: 'ja' },
  '/zh': { lang: 'zh' },
};

const linkBlocks = [
  { fragment: '/fragments/' },
  { schedule: '/schedules/' },
  { youtube: 'https://www.youtube' },
];

// Blocks with self-managed styles
const components = ['fragment', 'schedule'];

/**
 * Convert block tables to block divs (EDS table-to-block decoration).
 * Turns <table><tr><th>Block (variant)</th></tr>...</table>
 * into <div class="block variant"><div><div>...</div></div></div>
 */
function buildBlockDivs(main) {
  main.querySelectorAll('table').forEach((table) => {
    const th = table.querySelector('tr > th');
    if (!th) return;
    const [name, ...variants] = th.textContent.trim().split(/[,(]/);
    const blockName = name.trim().toLowerCase().replace(/\s+/g, '-');
    const block = document.createElement('div');
    const classes = [blockName];
    variants.forEach((v) => {
      const clean = v.replace(/[)]/g, '').trim().toLowerCase().replace(/\s+/g, '-');
      if (clean) classes.push(clean);
    });
    block.className = classes.join(' ');
    const rows = [...table.querySelectorAll(':scope > tbody > tr, :scope > tr')];
    rows.shift(); // remove header row
    rows.forEach((row) => {
      const rowDiv = document.createElement('div');
      [...row.children].forEach((cell) => {
        const cellDiv = document.createElement('div');
        cellDiv.append(...cell.childNodes);
        rowDiv.append(cellDiv);
      });
      block.append(rowDiv);
    });
    table.replaceWith(block);
  });
}

/**
 * Split main content on <hr> elements into section <div> wrappers.
 */
function buildSections(main) {
  const children = [...main.children];
  if (!children.length) return;
  let section = document.createElement('div');
  main.append(section);
  children.forEach((child) => {
    if (child.tagName === 'HR') {
      section = document.createElement('div');
      main.append(section);
      child.remove();
    } else {
      section.append(child);
    }
  });
}

// How to decorate an area before loading it
const decorateArea = ({ area = document }) => {
  const eagerLoad = (parent, selector) => {
    const img = parent.querySelector(selector);
    if (!img) return;
    img.removeAttribute('loading');
    img.fetchPriority = 'high';
  };

  eagerLoad(area, 'img');
};

export async function loadPage() {
  setConfig({ hostnames, locales, linkBlocks, components, decorateArea });
  const main = document.querySelector('main');
  if (main && !main.querySelector(':scope > div')) {
    buildBlockDivs(main);
    buildSections(main);
  }
  await loadArea();
}
await loadPage();

(function da() {
  const { searchParams } = new URL(window.location.href);
  const hasPreview = searchParams.has('dapreview');
  if (hasPreview) import('../tools/da/da.js').then((mod) => mod.default(loadPage));
  const hasQE = searchParams.has('quick-edit');
  if (hasQE) import('../tools/quick-edit/quick-edit.js').then((mod) => mod.default());
}());
