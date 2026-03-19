function setBackgroundFocus(img) {
  const { title } = img.dataset;
  if (!title?.includes('data-focal')) return;
  delete img.dataset.title;
  const [x, y] = title.split(':')[1].split(',');
  img.style.objectPosition = `${x}% ${y}%`;
}

function decorateBackground(bg) {
  const bgPic = bg.querySelector('picture');
  const bgImg = bgPic?.querySelector('img') || bg.querySelector('img');
  if (!bgImg) return;
  if (bgPic) setBackgroundFocus(bgImg);

  const vidLink = bgImg.closest('a[href*=".mp4"]');
  if (!vidLink) return;
  const poster = bgPic || bgImg;
  const video = document.createElement('video');
  video.src = vidLink.href;
  video.loop = true;
  video.muted = true;
  video.inert = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('preload', 'none');
  video.load();
  video.addEventListener('canplay', () => {
    video.play();
    poster.remove();
  });
  vidLink.parentElement.append(video, poster);
  vidLink.remove();
}

function decorateForeground(fg) {
  const { children } = fg;
  for (const [idx, child] of [...children].entries()) {
    const heading = child.querySelector('h1, h2, h3, h4, h5, h6');
    const text = heading || child.querySelector('p, a, ul');
    if (heading) {
      heading.classList.add('hero-heading');
      const detail = heading.previousElementSibling;
      if (detail) {
        detail.classList.add('hero-detail');
      }
    }
    // Determine foreground column types
    if (text) {
      child.classList.add('fg-text');
      if (idx === 0) {
        child.closest('.hero').classList.add('hero-text-start');
      } else {
        child.closest('.hero').classList.add('hero-text-end');
      }
    }
  }
}

function decorateBanner(el, rows) {
  const bg = rows.shift();
  bg.classList.add('hero-background');
  decorateBackground(bg);

  if (rows.length >= 2) {
    const badge = rows.shift();
    badge.classList.add('hero-badge');
  }

  if (rows.length) {
    const cta = rows.shift();
    cta.classList.add('hero-cta');
  }
}

export default async function init(el) {
  const rows = [...el.querySelectorAll(':scope > div')];

  if (el.classList.contains('banner')) {
    decorateBanner(el, rows);
    return;
  }

  const fg = rows.pop();
  fg.classList.add('hero-foreground');
  decorateForeground(fg);
  if (rows.length) {
    const bg = rows.pop();
    bg.classList.add('hero-background');
    decorateBackground(bg);
  }
}
