/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero (large).
 * Base block: hero. Source: https://www.visitmyrtlebeach.com/
 * Selector: .component--hero-with-trending
 * Generated: 2026-03-19
 *
 * Source DOM structure:
 *   .component--hero-with-trending
 *     .video-wrapper video source[src]  — background video
 *     .logo-wrapper img                 — hero badge/logo image
 *     .field--name-field-hero-wt-featured-content article
 *       .image-wrapper img              — featured content image
 *       .title-wrapper a               — featured content title+link
 *
 * Target table (from block library):
 *   | Hero (large) |
 *   | bg image     |
 *   | heading + CTA|
 */
export default function parse(element, { document }) {
  // Extract background image — prefer the badge logo, fallback to featured image
  const badgeImg = element.querySelector('.logo-wrapper img');
  const featuredImg = element.querySelector('.field--name-field-hero-wt-featured-content .image-wrapper img, .image-wrapper img');
  const bgImage = badgeImg || featuredImg;

  // Extract featured content title and link
  const featuredLink = element.querySelector('.field--name-field-hero-wt-featured-content .title-wrapper a, .title-wrapper .field--name-field-display-title a');
  const featuredTitle = featuredLink ? featuredLink.textContent.trim() : '';

  // Build cells matching Hero block library structure:
  // Row 1: background image
  // Row 2: heading + optional CTA
  const cells = [];

  // Row 1: background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: content — heading + CTA link
  const contentCell = [];
  if (featuredTitle) {
    const heading = document.createElement('h1');
    heading.textContent = featuredTitle;
    contentCell.push(heading);
  }
  if (featuredLink) {
    const cta = document.createElement('a');
    cta.href = featuredLink.href;
    cta.textContent = featuredLink.textContent.trim();
    contentCell.push(cta);
  }
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero (large)', cells });
  element.replaceWith(block);
}
