/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroParser from './parsers/hero.js';
import carouselParser from './parsers/carousel.js';
import embedParser from './parsers/embed.js';
import cardParser from './parsers/card.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/visitmyrtlebeach-cleanup.js';
import sectionsTransformer from './transformers/visitmyrtlebeach-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero': heroParser,
  'carousel': carouselParser,
  'embed': embedParser,
  'card': cardParser,
};

// PAGE TEMPLATE CONFIGURATION — embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Visit Myrtle Beach homepage with hero, promotional content sections, and travel information',
  urls: [
    'https://www.visitmyrtlebeach.com/',
  ],
  blocks: [
    {
      name: 'hero',
      instances: ['.component--hero-with-trending'],
    },
    {
      name: 'carousel',
      instances: ['.component--related-content.slideshow'],
    },
    {
      name: 'embed',
      instances: ['.component--fuel-date-selector', '.component--videos-by-tag'],
    },
    {
      name: 'card',
      instances: [
        '.component--four-column-promo.up-3',
        '.component--four-column-promo.up-4',
        '.component--related-events',
        '.component--featured-places:first-of-type',
        '.component--featured-places.untitled',
        '.component--featured-places.last-of-class',
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero with Trending Badge',
      selector: '.component--hero-with-trending',
      style: null,
      blocks: ['hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Beach Buzz Carousel',
      selector: '.component--related-content.slideshow',
      style: null,
      blocks: ['carousel'],
      defaultContent: ['.component--related-content.slideshow h2'],
    },
    {
      id: 'section-3',
      name: 'Booking Widget',
      selector: '.component--fuel-date-selector',
      style: null,
      blocks: ['embed'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Main Content / About',
      selector: '.component--main-content',
      style: null,
      blocks: [],
      defaultContent: ['.component--main-content'],
    },
    {
      id: 'section-5',
      name: 'Quick Links Cards (3-up)',
      selector: '.component--four-column-promo.up-3',
      style: null,
      blocks: ['card'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: '60 Miles Where You Belong',
      selector: ['.component--custom-markup.full-width:nth-of-type(4)', '.component--four-column-promo.up-4'],
      style: 'dark-teal',
      blocks: ['card'],
      defaultContent: ['.component--custom-markup.full-width'],
    },
    {
      id: 'section-7',
      name: 'Video Gallery',
      selector: '.component--videos-by-tag',
      style: null,
      blocks: ['embed'],
      defaultContent: ['.component--videos-by-tag h2'],
    },
    {
      id: 'section-8',
      name: 'Upcoming Events',
      selector: '.component--related-events',
      style: null,
      blocks: ['card'],
      defaultContent: ['.component--related-events h2'],
    },
    {
      id: 'section-9',
      name: 'Food & Drink',
      selector: '.component--featured-places:first-of-type',
      style: null,
      blocks: ['card'],
      defaultContent: ['.component--featured-places h2'],
    },
    {
      id: 'section-10',
      name: 'Attractions',
      selector: '.component--featured-places.untitled',
      style: null,
      blocks: ['card'],
      defaultContent: ['.component--featured-places.untitled h2'],
    },
    {
      id: 'section-11',
      name: 'Hotels, Condos & Beach Homes',
      selector: '.component--featured-places.last-of-class',
      style: null,
      blocks: ['card'],
      defaultContent: ['.component--featured-places.last-of-class h2'],
    },
    {
      id: 'section-12',
      name: 'Newsletter Signup',
      selector: '.component--promo',
      style: 'coral',
      blocks: [],
      defaultContent: ['.component--promo'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT
export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 4.5. Remove tracking pixels and beacons that break regex in adjustImageUrls
    main.querySelectorAll('img[src*="usbrowserspeed"], img[src*="dpmsrv"], img[src*="pixel"], img[src*="beacon"]').forEach((el) => el.remove());
    main.querySelectorAll('script, noscript, style, link[rel="stylesheet"]').forEach((el) => el.remove());

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    try { WebImporter.rules.createMetadata(main, document); } catch (e) { console.error('createMetadata:', e); }
    try { WebImporter.rules.transformBackgroundImages(main, document); } catch (e) { console.error('transformBackgroundImages:', e); }
    try { WebImporter.rules.adjustImageUrls(main, url, params.originalURL); } catch (e) { console.error('adjustImageUrls:', e); }

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
