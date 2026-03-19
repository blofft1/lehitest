/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed.
 * Base block: embed. Source: https://www.visitmyrtlebeach.com/
 * Selectors: .component--fuel-date-selector, .component--videos-by-tag
 * Generated: 2026-03-19
 *
 * Source DOM structure (booking widget):
 *   .component--fuel-date-selector
 *     .title h2                          — "Book Your Myrtle Beach Stay"
 *     .description                       — descriptive text
 *     .fuel-form                         — interactive form (not authorable)
 *
 * Source DOM structure (video gallery):
 *   .component--videos-by-tag
 *     .slide-large-media button img      — video thumbnail/poster
 *     .field--name-field-video-title     — video title
 *     .field--name-field-video-description — video description
 *
 * Target table (from block library):
 *   | Embed          |
 *   | poster image   |
 *   | URL            |
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which type of embed this is
  const isBookingWidget = element.classList.contains('component--fuel-date-selector') ||
    element.querySelector('.fuel-form, .fuel-date-selector');
  const isVideoGallery = element.classList.contains('component--videos-by-tag') ||
    element.querySelector('.vmb-videos-large, .videos-by-tag-large');

  if (isBookingWidget) {
    // Booking widget — create embed with link to hotels/booking page
    const heading = element.querySelector('.title h2, h2');
    const description = element.querySelector('.description');
    const contentCell = [];

    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);

    // Create a link to the booking/hotels page as the embed URL
    const bookingLink = document.createElement('a');
    bookingLink.href = 'https://www.visitmyrtlebeach.com/hotels/';
    bookingLink.textContent = 'https://www.visitmyrtlebeach.com/hotels/';
    contentCell.push(bookingLink);

    cells.push(contentCell);
  } else if (isVideoGallery) {
    // Video gallery — extract first (main) video poster and info
    const firstSlide = element.querySelector('.slick-slide:not(.slick-cloned), .slide-large-outer');
    const posterImg = firstSlide
      ? firstSlide.querySelector('.field--name-field-media-custom-thumb img, .slide-large-media img, img')
      : element.querySelector('.slide-large-media img, img');

    const videoTitle = firstSlide
      ? firstSlide.querySelector('.field--name-field-video-title')
      : element.querySelector('.field--name-field-video-title');

    const contentCell = [];
    if (posterImg) contentCell.push(posterImg);

    // No direct video URL in DOM — use a placeholder link
    // The video content is loaded dynamically via Drupal media IDs
    const videoLink = document.createElement('a');
    videoLink.href = 'https://www.visitmyrtlebeach.com/videos/';
    videoLink.textContent = 'https://www.visitmyrtlebeach.com/videos/';
    contentCell.push(videoLink);

    cells.push(contentCell);
  } else {
    // Generic fallback — extract any link or iframe
    const link = element.querySelector('a[href], iframe[src]');
    if (link) {
      const url = link.href || link.getAttribute('src');
      const embedLink = document.createElement('a');
      embedLink.href = url;
      embedLink.textContent = url;
      cells.push([embedLink]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed', cells });
  element.replaceWith(block);
}
