/* eslint-disable */
/* global WebImporter */

/**
 * Parser for card.
 * Base block: card (Author Kit local block, singular).
 * Source: https://www.visitmyrtlebeach.com/
 * Selectors:
 *   - .component--four-column-promo.up-3  (Quick Links, 3-up promos)
 *   - .component--four-column-promo.up-4  (Community cards, 14 items)
 *   - .component--related-events          (Upcoming Events, tabbed carousel)
 *   - .component--featured-places         (Food & Drink, Attractions, Hotels)
 * Generated: 2026-03-19
 *
 * Source DOM patterns:
 *
 * four-column-promo (.promo-item-wrapper):
 *   .promo-item > .image img             — promo image
 *   .promo-item > .content-text
 *     .promo-title                       — title
 *     .promo-subtitle                    — subtitle
 *     .description                       — description text
 *     .cta a                             — CTA link
 *
 * related-events (article.node--event-instance):
 *   .profile--img img                    — event image
 *   .profile--info
 *     .field--name-field-display-title h3 a — event title + link
 *     .start-date                          — date info
 *     .field--name-field-listing-venue      — venue
 *
 * featured-places (.views-row .node--profile):
 *   .profile--img img                    — place image
 *   .profile--info
 *     .field--name-field-display-title a  — place name + link
 *
 * Target table (from block library - Cards):
 *   | Card               |              |
 *   | image              | title + desc |
 *   | image              | title + desc |
 *   ...per card
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which card pattern
  const isPromo = element.querySelector('.promo-item-wrapper, .promo-item');
  const isEvents = element.classList.contains('component--related-events') ||
    element.querySelector('.view-related-events');
  const isFeaturedPlaces = element.classList.contains('component--featured-places') ||
    element.querySelector('.vmb-featured-places, .view-listing-level-places');

  if (isPromo) {
    // Four-column-promo pattern
    const promos = element.querySelectorAll('.slick-slide:not(.slick-cloned) .promo-item-wrapper, .promo-item-wrapper.field__item');
    const seen = new Set();

    promos.forEach((wrapper) => {
      const img = wrapper.querySelector('.image img, img.media__element, img');
      const title = wrapper.querySelector('.promo-title');
      const subtitle = wrapper.querySelector('.promo-subtitle');
      const desc = wrapper.querySelector('.description');
      const ctaLink = wrapper.querySelector('.cta a');

      // Deduplicate by title text
      const titleText = title ? title.textContent.trim() : '';
      if (seen.has(titleText) || !titleText) return;
      seen.add(titleText);

      const imageCell = img ? [img] : [];
      const contentCell = [];

      // Title as heading
      const heading = document.createElement('h3');
      heading.textContent = titleText;
      contentCell.push(heading);

      // Subtitle
      if (subtitle && subtitle.textContent.trim()) {
        const sub = document.createElement('p');
        sub.textContent = subtitle.textContent.trim();
        contentCell.push(sub);
      }

      // Description
      if (desc && desc.textContent.trim()) {
        const descP = document.createElement('p');
        descP.textContent = desc.textContent.trim();
        contentCell.push(descP);
      }

      // CTA link
      if (ctaLink) {
        const link = document.createElement('a');
        link.href = ctaLink.href || ctaLink.getAttribute('href');
        link.textContent = ctaLink.textContent.trim();
        contentCell.push(link);
      }

      cells.push([imageCell, contentCell]);
    });
  } else if (isEvents) {
    // Related events pattern
    const events = element.querySelectorAll('.slick-slide:not(.slick-cloned) article, .views-row article');
    const seen = new Set();

    events.forEach((article) => {
      const img = article.querySelector('.profile--img img, .field--name-field-listing-main-image img, img');
      const titleLink = article.querySelector('.field--name-field-display-title a, .field--name-field-display-title h3 a');
      const dateEl = article.querySelector('.start-date');
      const venueEl = article.querySelector('.field--name-field-listing-venue');

      if (!titleLink) return;
      const href = titleLink.getAttribute('href') || titleLink.href;
      if (seen.has(href)) return;
      seen.add(href);

      const imageCell = img ? [img] : [];
      const contentCell = [];

      // Event title as heading
      const heading = document.createElement('h3');
      heading.textContent = titleLink.textContent.trim();
      contentCell.push(heading);

      // Date and venue info
      if (dateEl && dateEl.textContent.trim()) {
        const dateP = document.createElement('p');
        dateP.textContent = dateEl.textContent.trim();
        contentCell.push(dateP);
      }
      if (venueEl && venueEl.textContent.trim()) {
        const venueP = document.createElement('p');
        venueP.textContent = venueEl.textContent.trim();
        contentCell.push(venueP);
      }

      // Link
      const link = document.createElement('a');
      link.href = href;
      link.textContent = titleLink.textContent.trim();
      contentCell.push(link);

      cells.push([imageCell, contentCell]);
    });
  } else if (isFeaturedPlaces) {
    // Featured places pattern
    const places = element.querySelectorAll('.views-row, .swiper-slide');
    const seen = new Set();

    places.forEach((row) => {
      const img = row.querySelector('.profile--img img, .field--name-field-listing-main-image-media img, img');
      const titleLink = row.querySelector('.field--name-field-display-title a, .profile--info a');

      if (!titleLink) return;
      const href = titleLink.getAttribute('href') || titleLink.href;
      if (seen.has(href)) return;
      seen.add(href);

      const imageCell = img ? [img] : [];
      const contentCell = [];

      // Place name as heading
      const heading = document.createElement('h3');
      heading.textContent = titleLink.textContent.trim();
      contentCell.push(heading);

      // Link
      const link = document.createElement('a');
      link.href = href;
      link.textContent = titleLink.textContent.trim();
      contentCell.push(link);

      cells.push([imageCell, contentCell]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'card', cells });
  element.replaceWith(block);
}
