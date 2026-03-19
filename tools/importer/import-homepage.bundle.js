var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero.js
  function parse(element, { document }) {
    const cells = [];
    const videoEl = element.querySelector("video source[src], video[src]");
    const videoSrc = videoEl ? videoEl.getAttribute("src") || videoEl.src : null;
    const badgeImg = element.querySelector('[class*="logo"] img, .logo-wrapper img');
    if (videoSrc && badgeImg) {
      const posterImg = badgeImg.cloneNode(true);
      const vidLink = document.createElement("a");
      vidLink.href = videoSrc;
      vidLink.append(posterImg);
      cells.push([vidLink]);
    } else if (badgeImg) {
      cells.push([badgeImg.cloneNode(true)]);
    }
    if (badgeImg) {
      cells.push([badgeImg.cloneNode(true)]);
    }
    const featuredImg = element.querySelector(
      ".field--name-field-hero-wt-featured-content .image-wrapper img, .field--name-field-hero-wt-featured-content img"
    );
    const featuredLink = element.querySelector(
      ".field--name-field-hero-wt-featured-content .title-wrapper a, .field--name-field-hero-wt-featured-content a"
    );
    if (featuredImg || featuredLink) {
      const imageCell = featuredImg ? featuredImg.cloneNode(true) : "";
      const textCell = [];
      if (featuredLink) {
        const heading = document.createElement("h2");
        heading.textContent = featuredLink.textContent.trim();
        textCell.push(heading);
        const cta = document.createElement("a");
        cta.href = featuredLink.href;
        cta.textContent = featuredLink.textContent.trim();
        textCell.push(cta);
      }
      cells.push([imageCell, ...textCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero (banner)", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel.js
  function parse2(element, { document }) {
    const slides = element.querySelectorAll(".slick-slide:not(.slick-cloned) article, .views-row article");
    const seen = /* @__PURE__ */ new Set();
    const cells = [];
    slides.forEach((article) => {
      const img = article.querySelector(".image-wrapper img, img.media__element, img");
      const titleLink = article.querySelector(".title-wrapper .title a, .title-wrapper a, .field--name-field-display-title a");
      if (!titleLink) return;
      const href = titleLink.getAttribute("href") || titleLink.href;
      if (seen.has(href)) return;
      seen.add(href);
      const imageCell = img ? [img] : [];
      const contentCell = [];
      const heading = document.createElement("h2");
      heading.textContent = titleLink.textContent.trim();
      contentCell.push(heading);
      const link = document.createElement("a");
      link.href = href;
      link.textContent = titleLink.textContent.trim();
      contentCell.push(link);
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed.js
  function parse3(element, { document }) {
    const cells = [];
    const isBookingWidget = element.classList.contains("component--fuel-date-selector") || element.querySelector(".fuel-form, .fuel-date-selector");
    const isVideoGallery = element.classList.contains("component--videos-by-tag") || element.querySelector(".vmb-videos-large, .videos-by-tag-large");
    if (isBookingWidget) {
      const heading = element.querySelector(".title h2, h2");
      const description = element.querySelector(".description");
      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
      const bookingLink = document.createElement("a");
      bookingLink.href = "https://www.visitmyrtlebeach.com/hotels/";
      bookingLink.textContent = "https://www.visitmyrtlebeach.com/hotels/";
      contentCell.push(bookingLink);
      cells.push(contentCell);
    } else if (isVideoGallery) {
      const firstSlide = element.querySelector(".slick-slide:not(.slick-cloned), .slide-large-outer");
      const posterImg = firstSlide ? firstSlide.querySelector(".field--name-field-media-custom-thumb img, .slide-large-media img, img") : element.querySelector(".slide-large-media img, img");
      const videoTitle = firstSlide ? firstSlide.querySelector(".field--name-field-video-title") : element.querySelector(".field--name-field-video-title");
      const contentCell = [];
      if (posterImg) contentCell.push(posterImg);
      const videoLink = document.createElement("a");
      videoLink.href = "https://www.visitmyrtlebeach.com/videos/";
      videoLink.textContent = "https://www.visitmyrtlebeach.com/videos/";
      contentCell.push(videoLink);
      cells.push(contentCell);
    } else {
      const link = element.querySelector("a[href], iframe[src]");
      if (link) {
        const url = link.href || link.getAttribute("src");
        const embedLink = document.createElement("a");
        embedLink.href = url;
        embedLink.textContent = url;
        cells.push([embedLink]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "embed", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/card.js
  function parse4(element, { document }) {
    const cells = [];
    const isPromo = element.querySelector(".promo-item-wrapper, .promo-item");
    const isEvents = element.classList.contains("component--related-events") || element.querySelector(".view-related-events");
    const isFeaturedPlaces = element.classList.contains("component--featured-places") || element.querySelector(".vmb-featured-places, .view-listing-level-places");
    if (isPromo) {
      const promos = element.querySelectorAll(".slick-slide:not(.slick-cloned) .promo-item-wrapper, .promo-item-wrapper.field__item");
      const seen = /* @__PURE__ */ new Set();
      promos.forEach((wrapper) => {
        const img = wrapper.querySelector(".image img, img.media__element, img");
        const title = wrapper.querySelector(".promo-title");
        const subtitle = wrapper.querySelector(".promo-subtitle");
        const desc = wrapper.querySelector(".description");
        const ctaLink = wrapper.querySelector(".cta a");
        const titleText = title ? title.textContent.trim() : "";
        if (seen.has(titleText) || !titleText) return;
        seen.add(titleText);
        const imageCell = img ? [img] : [];
        const contentCell = [];
        const heading = document.createElement("h3");
        heading.textContent = titleText;
        contentCell.push(heading);
        if (subtitle && subtitle.textContent.trim()) {
          const sub = document.createElement("p");
          sub.textContent = subtitle.textContent.trim();
          contentCell.push(sub);
        }
        if (desc && desc.textContent.trim()) {
          const descP = document.createElement("p");
          descP.textContent = desc.textContent.trim();
          contentCell.push(descP);
        }
        if (ctaLink) {
          const link = document.createElement("a");
          link.href = ctaLink.href || ctaLink.getAttribute("href");
          link.textContent = ctaLink.textContent.trim();
          contentCell.push(link);
        }
        cells.push([imageCell, contentCell]);
      });
    } else if (isEvents) {
      const events = element.querySelectorAll(".slick-slide:not(.slick-cloned) article, .views-row article");
      const seen = /* @__PURE__ */ new Set();
      events.forEach((article) => {
        const img = article.querySelector(".profile--img img, .field--name-field-listing-main-image img, img");
        const titleLink = article.querySelector(".field--name-field-display-title a, .field--name-field-display-title h3 a");
        const dateEl = article.querySelector(".start-date");
        const venueEl = article.querySelector(".field--name-field-listing-venue");
        if (!titleLink) return;
        const href = titleLink.getAttribute("href") || titleLink.href;
        if (seen.has(href)) return;
        seen.add(href);
        const imageCell = img ? [img] : [];
        const contentCell = [];
        const heading = document.createElement("h3");
        heading.textContent = titleLink.textContent.trim();
        contentCell.push(heading);
        if (dateEl && dateEl.textContent.trim()) {
          const dateP = document.createElement("p");
          dateP.textContent = dateEl.textContent.trim();
          contentCell.push(dateP);
        }
        if (venueEl && venueEl.textContent.trim()) {
          const venueP = document.createElement("p");
          venueP.textContent = venueEl.textContent.trim();
          contentCell.push(venueP);
        }
        const link = document.createElement("a");
        link.href = href;
        link.textContent = titleLink.textContent.trim();
        contentCell.push(link);
        cells.push([imageCell, contentCell]);
      });
    } else if (isFeaturedPlaces) {
      const places = element.querySelectorAll(".views-row, .swiper-slide");
      const seen = /* @__PURE__ */ new Set();
      places.forEach((row) => {
        const img = row.querySelector(".profile--img img, .field--name-field-listing-main-image-media img, img");
        const titleLink = row.querySelector(".field--name-field-display-title a, .profile--info a");
        if (!titleLink) return;
        const href = titleLink.getAttribute("href") || titleLink.href;
        if (seen.has(href)) return;
        seen.add(href);
        const imageCell = img ? [img] : [];
        const contentCell = [];
        const heading = document.createElement("h3");
        heading.textContent = titleLink.textContent.trim();
        contentCell.push(heading);
        const link = document.createElement("a");
        link.href = href;
        link.textContent = titleLink.textContent.trim();
        contentCell.push(link);
        cells.push([imageCell, contentCell]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "card", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/visitmyrtlebeach-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [".scroll-wrapper"]);
      const heroButton = element.querySelector("#hero-button");
      if (heroButton) heroButton.remove();
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        "noscript",
        "link"
      ]);
      element.querySelectorAll("[data-history-node-id]").forEach((el) => {
        el.removeAttribute("data-history-node-id");
      });
    }
  }

  // tools/importer/transformers/visitmyrtlebeach-sections.js
  function transform2(hookName, element, payload) {
    if (hookName === "afterTransform") {
      const { document } = payload;
      const template = payload.template || {};
      const sections = template.sections || [];
      if (sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section) => {
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.parentNode.insertBefore(sectionMetadata, sectionEl.nextSibling);
        }
        if (section.id !== sections[0].id) {
          const hr = document.createElement("hr");
          sectionEl.parentNode.insertBefore(hr, sectionEl);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero": parse,
    "carousel": parse2,
    "embed": parse3,
    "card": parse4
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Visit Myrtle Beach homepage with hero, promotional content sections, and travel information",
    urls: [
      "https://www.visitmyrtlebeach.com/"
    ],
    blocks: [
      {
        name: "hero",
        instances: [".component--hero-with-trending"]
      },
      {
        name: "carousel",
        instances: [".component--related-content.slideshow"]
      },
      {
        name: "embed",
        instances: [".component--fuel-date-selector", ".component--videos-by-tag"]
      },
      {
        name: "card",
        instances: [
          ".component--four-column-promo.up-3",
          ".component--four-column-promo.up-4",
          ".component--related-events",
          ".component--featured-places:first-of-type",
          ".component--featured-places.untitled",
          ".component--featured-places.last-of-class"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero with Trending Badge",
        selector: ".component--hero-with-trending",
        style: null,
        blocks: ["hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Beach Buzz Carousel",
        selector: ".component--related-content.slideshow",
        style: null,
        blocks: ["carousel"],
        defaultContent: [".component--related-content.slideshow h2"]
      },
      {
        id: "section-3",
        name: "Booking Widget",
        selector: ".component--fuel-date-selector",
        style: null,
        blocks: ["embed"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Main Content / About",
        selector: ".component--main-content",
        style: null,
        blocks: [],
        defaultContent: [".component--main-content"]
      },
      {
        id: "section-5",
        name: "Quick Links Cards (3-up)",
        selector: ".component--four-column-promo.up-3",
        style: null,
        blocks: ["card"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "60 Miles Where You Belong",
        selector: [".component--custom-markup.full-width:nth-of-type(4)", ".component--four-column-promo.up-4"],
        style: "dark-teal",
        blocks: ["card"],
        defaultContent: [".component--custom-markup.full-width"]
      },
      {
        id: "section-7",
        name: "Video Gallery",
        selector: ".component--videos-by-tag",
        style: null,
        blocks: ["embed"],
        defaultContent: [".component--videos-by-tag h2"]
      },
      {
        id: "section-8",
        name: "Upcoming Events",
        selector: ".component--related-events",
        style: null,
        blocks: ["card"],
        defaultContent: [".component--related-events h2"]
      },
      {
        id: "section-9",
        name: "Food & Drink",
        selector: ".component--featured-places:first-of-type",
        style: null,
        blocks: ["card"],
        defaultContent: [".component--featured-places h2"]
      },
      {
        id: "section-10",
        name: "Attractions",
        selector: ".component--featured-places.untitled",
        style: null,
        blocks: ["card"],
        defaultContent: [".component--featured-places.untitled h2"]
      },
      {
        id: "section-11",
        name: "Hotels, Condos & Beach Homes",
        selector: ".component--featured-places.last-of-class",
        style: null,
        blocks: ["card"],
        defaultContent: [".component--featured-places.last-of-class h2"]
      },
      {
        id: "section-12",
        name: "Newsletter Signup",
        selector: ".component--promo",
        style: "coral",
        blocks: [],
        defaultContent: [".component--promo"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = {
      ...payload,
      template: PAGE_TEMPLATE
    };
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      main.querySelectorAll('img[src*="usbrowserspeed"], img[src*="dpmsrv"], img[src*="pixel"], img[src*="beacon"]').forEach((el) => el.remove());
      main.querySelectorAll('script, noscript, style, link[rel="stylesheet"]').forEach((el) => el.remove());
      const hr = document.createElement("hr");
      main.appendChild(hr);
      try {
        WebImporter.rules.createMetadata(main, document);
      } catch (e) {
        console.error("createMetadata:", e);
      }
      try {
        WebImporter.rules.transformBackgroundImages(main, document);
      } catch (e) {
        console.error("transformBackgroundImages:", e);
      }
      try {
        WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      } catch (e) {
        console.error("adjustImageUrls:", e);
      }
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
