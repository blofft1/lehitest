/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: visitmyrtlebeach cleanup.
 * Selectors from captured DOM (migration-work/cleaned.html).
 * Removes non-authorable site chrome and UI elements.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove hero scroll indicator (non-authorable UI element)
    // Found in captured DOM: <div class="scroll-wrapper"><span class="scroll-text">Scroll</span></div>
    WebImporter.DOMUtils.remove(element, ['.scroll-wrapper']);

    // Remove hero video pause button (non-authorable UI control)
    // Found in captured DOM: <button id="hero-button" class="hero-button" aria-label="Pause video">
    const heroButton = element.querySelector('#hero-button');
    if (heroButton) heroButton.remove();
  }

  if (hookName === H.after) {
    // Remove remaining non-authorable elements after block parsing
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      'noscript',
      'link',
    ]);

    // Remove tracking/analytics attributes from all elements
    element.querySelectorAll('[data-history-node-id]').forEach((el) => {
      el.removeAttribute('data-history-node-id');
    });
  }
}
