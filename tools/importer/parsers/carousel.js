/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel.
 * Base block: carousel. Source: https://www.visitmyrtlebeach.com/
 * Selector: .component--related-content.slideshow
 * Generated: 2026-03-19
 *
 * Source DOM structure:
 *   .component--related-content.slideshow
 *     .slick-track > .slick-slide (multiple)
 *       article.node--article
 *         .image-wrapper img.media__element  — article image
 *         .title-wrapper .title a            — article title + link
 *
 * Target table (from block library):
 *   | Carousel            |              |
 *   | image               | title + link |
 *   | image               | title + link |
 *   ...per slide
 */
export default function parse(element, { document }) {
  // Select all slides — skip cloned slides from slick carousel
  const slides = element.querySelectorAll('.slick-slide:not(.slick-cloned) article, .views-row article');
  const seen = new Set();
  const cells = [];

  slides.forEach((article) => {
    // Extract image
    const img = article.querySelector('.image-wrapper img, img.media__element, img');
    // Extract title link
    const titleLink = article.querySelector('.title-wrapper .title a, .title-wrapper a, .field--name-field-display-title a');

    if (!titleLink) return;

    // Deduplicate by href (slick may duplicate slides)
    const href = titleLink.getAttribute('href') || titleLink.href;
    if (seen.has(href)) return;
    seen.add(href);

    // Build row: [image] | [title + link]
    const imageCell = img ? [img] : [];
    const contentCell = [];

    // Create heading with the article title
    const heading = document.createElement('h2');
    heading.textContent = titleLink.textContent.trim();
    contentCell.push(heading);

    // Add link as CTA
    const link = document.createElement('a');
    link.href = href;
    link.textContent = titleLink.textContent.trim();
    contentCell.push(link);

    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
