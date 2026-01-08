// Lightweight global interaction helpers: ripple, reveal-on-scroll
export function initInteractions() {
  // Ripple effect: attach to elements with .ripple and .interactive
  document.addEventListener('pointerdown', (e) => {
    const target = (e.target as Element).closest?.('.ripple.interactive') as HTMLElement | null;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const d = Math.max(rect.width, rect.height) * 1.2;
    const x = e.clientX - rect.left - d / 2;
    const y = e.clientY - rect.top - d / 2;

    const span = document.createElement('span');
    span.className = 'ripple-effect';
    span.style.width = span.style.height = `${d}px`;
    span.style.left = `${x}px`;
    span.style.top = `${y}px`;
    target.appendChild(span);

    setTimeout(() => { span.remove(); }, 700);
  });

  // Reveal on scroll
  const reveals = new Set<Element>();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        reveals.delete(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .reveal-img').forEach((el, i) => {
    (el as HTMLElement).style.setProperty('--order', String(i));
    reveals.add(el);
    observer.observe(el);
  });

  // Make interactive elements focus/tap friendly: add touch-press class on touch devices
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouch) {
    document.querySelectorAll('.interactive').forEach((el) => el.classList.add('touch-press'));
  }

  return () => {
    observer.disconnect();
  };
}
