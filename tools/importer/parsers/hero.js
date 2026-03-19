/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero (banner).
 * Base block: hero. Source: https://www.visitmyrtlebeach.com/
 * Selector: .component--hero-with-trending
 * Generated: 2026-03-19
 *
 * Source DOM structure:
 *   .component--hero-with-trending
 *     video source[src] / .video-wrapper video  — background video
 *     [class*="logo"] img                       — hero badge/logo image
 *     .field--name-field-hero-wt-featured-content article
 *       .image-wrapper img                      — featured content image
 *       .title-wrapper a                        — featured content title+link
 *
 * Target table:
 *   | Hero (banner)                              |
 *   | [poster linked to .mp4]                    |  <- background video
 *   | [badge image]                              |  <- centered overlay
 *   | [featured image] | [heading + CTA link]    |  <- picture window card
 */
export default function parse(element, { document }) {
  const cells = [];

  // Row 1: background video — poster image linked to .mp4 URL
  const videoEl = element.querySelector('video source[src], video[src]');
  const videoSrc = videoEl
    ? (videoEl.getAttribute('src') || videoEl.src)
    : null;
  const badgeImg = element.querySelector('[class*="logo"] img, .logo-wrapper img');

  if (videoSrc && badgeImg) {
    // Use the badge image as the video poster, wrapped in an anchor to the .mp4
    const posterImg = badgeImg.cloneNode(true);
    const vidLink = document.createElement('a');
    vidLink.href = videoSrc;
    vidLink.append(posterImg);
    cells.push([vidLink]);
  } else if (badgeImg) {
    // No video found — just use the badge as background
    cells.push([badgeImg.cloneNode(true)]);
  }

  // Row 2: badge overlay image
  if (badgeImg) {
    cells.push([badgeImg.cloneNode(true)]);
  }

  // Row 3: featured content — image | heading + CTA link
  const featuredImg = element.querySelector(
    '.field--name-field-hero-wt-featured-content .image-wrapper img, '
    + '.field--name-field-hero-wt-featured-content img'
  );
  const featuredLink = element.querySelector(
    '.field--name-field-hero-wt-featured-content .title-wrapper a, '
    + '.field--name-field-hero-wt-featured-content a'
  );

  if (featuredImg || featuredLink) {
    const imageCell = featuredImg ? featuredImg.cloneNode(true) : '';
    const textCell = [];
    if (featuredLink) {
      const heading = document.createElement('h2');
      heading.textContent = featuredLink.textContent.trim();
      textCell.push(heading);
      const cta = document.createElement('a');
      cta.href = featuredLink.href;
      cta.textContent = featuredLink.textContent.trim();
      textCell.push(cta);
    }
    cells.push([imageCell, ...textCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero (banner)', cells });
  element.replaceWith(block);
}
