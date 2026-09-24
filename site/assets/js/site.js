/* Plain JavaScript. No third-party scripts, cookies, tracking or network APIs. */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const menu = $('#main-nav');
  const menuButton = $('.menu-toggle');
  const closeMenu = () => {
    if (!menu || !menuButton) return;
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
  };
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
  });
  menu?.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', closeMenu);
  $$('[data-year]').forEach(el => { el.textContent = String(new Date().getFullYear()); });

  // A colour mood board only; the swatches do not refer to a manufacturer's paint code.
  const stage = $('.palette-stage');
  $$('.palette-button').forEach(button => button.addEventListener('click', () => {
    const colour = button.dataset.colour;
    if (!stage || !['sage', 'clay', 'sand'].includes(colour)) return;
    stage.dataset.palette = colour;
    $$('[data-palette-name]').forEach(el => { el.textContent = colour; });
    $$('.palette-button').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
  }));

  // Copy the address, or provide an honest fallback if clipboard access is unavailable.
  $$('[data-copy-email]').forEach(button => button.addEventListener('click', async () => {
    const status = $('.copy-status', button.closest('.contact-method'));
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      status.textContent = 'Email address copied.';
    } catch {
      status.textContent = 'Please select and copy the email address above.';
    }
  }));

  const gallery = $('[data-gallery]');
  if (!gallery) return;
  const categoryNames = { interior: 'Interior decorating', exterior: 'Exterior decorating', detail: 'Wallpaper & detail' };
  const root = gallery.dataset.root || '';
  const limit = Number(gallery.dataset.limit) || Infinity;
  const source = Array.isArray(window.LETTS_GALLERY) ? window.LETTS_GALLERY : [];
  // Restrict image paths to local files. The gallery never injects author-supplied HTML.
  const validPath = path => typeof path === 'string' && /^assets\/images\/gallery\/[a-z0-9][a-z0-9._/-]*\.(?:webp|avif|jpe?g|png)$/i.test(path) && !path.includes('..');
  const photos = source.filter(item => item && validPath(item.src) &&
    typeof item.title === 'string' && item.title.trim() &&
    typeof item.alt === 'string' && item.alt.trim() && categoryNames[item.category]);
  const hasPhotos = photos.length > 0;
  const status = $('[data-gallery-status]');
  const count = $('[data-gallery-count]');
  const notice = $('[data-empty-notice]');
  const originalPlaceholders = [...gallery.children];
  let activeCategory = 'all';
  let visiblePhotos = [];
  let currentIndex = 0;
  let lastTrigger = null;
  const modal = $('.lightbox');
  const modalImage = $('.lightbox-image', modal);
  const modalCaption = $('#lightbox-caption', modal);
  const modalCount = $('.lightbox-count', modal);
  const previous = $('.lightbox-prev', modal);
  const next = $('.lightbox-next', modal);
  const close = $('.lightbox-close', modal);
  if (hasPhotos) {
    if (notice) notice.hidden = true;
    $$('[data-gallery-intro]').forEach(el => {
      el.textContent = 'A selection of interiors, exteriors and finishing touches. Take a closer look at our work.';
    });
  }
  function updateModal(index) {
    if (!visiblePhotos.length) return;
    currentIndex = (index + visiblePhotos.length) % visiblePhotos.length;
    const item = visiblePhotos[currentIndex];
    modalImage.src = root + item.src;
    modalImage.alt = item.alt;
    modalCaption.textContent = item.title;
    modalCount.textContent = `${currentIndex + 1} / ${visiblePhotos.length}`;
    previous.disabled = next.disabled = visiblePhotos.length < 2;
  }
  function openPhoto(index, trigger) {
    if (!modal?.showModal) {
      // Older browsers still get access to the photograph, without relying on popups.
      window.location.href = root + visiblePhotos[index].src;
      return;
    }
    lastTrigger = trigger;
    updateModal(index);
    modal.showModal();
    document.body.classList.add('modal-open');
    close.focus();
  }
  close?.addEventListener('click', () => modal.close());
  previous?.addEventListener('click', () => updateModal(currentIndex - 1));
  next?.addEventListener('click', () => updateModal(currentIndex + 1));
  modal?.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    modalImage.removeAttribute('src');
    lastTrigger?.focus();
  });
  modal?.addEventListener('click', event => {
    if (event.target !== modal) return;
    const rect = modal.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) modal.close();
  });
  modal?.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); updateModal(currentIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); updateModal(currentIndex + 1); }
  });
  modalImage?.addEventListener('error', () => {
    modalCaption.textContent = 'This photograph could not be loaded. Please try again later.';
  });
  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };
  function render() {
    if (!hasPhotos) {
      let shown = 0;
      originalPlaceholders.forEach(card => {
        card.hidden = activeCategory !== 'all' && card.dataset.category !== activeCategory;
        if (!card.hidden) shown++;
      });
      if (status) status.textContent = `${shown} gallery categories shown. Project photographs are coming soon.`;
      return;
    }
    visiblePhotos = photos.filter(item => activeCategory === 'all' || item.category === activeCategory).slice(0, limit);
    gallery.replaceChildren();
    visiblePhotos.forEach((item, index) => {
      const article = make('article', 'project-card');
      const button = make('button', 'project-open');
      button.type = 'button';
      button.setAttribute('aria-label', `View photograph: ${item.title}`);
      const imageWrap = make('span', 'project-image-wrap');
      const image = make('img', 'project-photo');
      image.alt = item.alt;
      image.loading = 'lazy';
      image.decoding = 'async';
      if (Number.isInteger(item.width) && item.width > 0) image.width = item.width;
      if (Number.isInteger(item.height) && item.height > 0) image.height = item.height;
      image.src = root + item.src;
      image.addEventListener('error', () => {
        image.hidden = true;
        imageWrap.append(make('span', 'project-load-error', 'Photograph temporarily unavailable.'));
        button.disabled = true;
      }, { once: true });
      const expand = make('span', 'photo-enlarge', '+');
      expand.setAttribute('aria-hidden', 'true');
      imageWrap.append(image, expand);
      const meta = make('div', 'project-meta');
      const text = make('div');
      text.append(make('span', 'project-kicker', categoryNames[item.category].toUpperCase()), make('h3', '', item.title));
      const number = make('span', 'project-number', String(index + 1).padStart(2, '0'));
      number.setAttribute('aria-hidden', 'true');
      meta.append(text, number);
      button.append(imageWrap);
      button.addEventListener('click', () => openPhoto(index, button));
      article.append(button, meta);
      gallery.append(article);
    });
    if (!visiblePhotos.length) gallery.append(make('p', 'gallery-no-results', 'No photographs in this category yet. Try another category or get in touch.'));
    const label = `${visiblePhotos.length} photograph${visiblePhotos.length === 1 ? '' : 's'}`;
    if (count) count.textContent = label;
    if (status) status.textContent = `${label} shown.`;
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    $$('[data-filter]').forEach(el => el.setAttribute('aria-pressed', String(el === button)));
    render();
  }));
  render();
})();
