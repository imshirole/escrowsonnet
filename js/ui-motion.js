/* Lightweight presentation motion. No transaction or application state is changed here. */
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('homepage-content')) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hero = document.querySelector('#homepage-content > section:first-child');
  if (hero && !reduce) {
    hero.querySelectorAll('.lg\\:col-span-7 > *, .lg\\:col-span-5').forEach(function (element, index) {
      element.classList.add('es-load-in');
      element.style.setProperty('--es-delay', (index * 70) + 'ms');
    });
  }
  var targets = document.querySelectorAll('#homepage-content > section:not(:first-child) > div');
  targets.forEach(function (element) { element.classList.add('es-reveal'); });
  if (reduce || !('IntersectionObserver' in window)) {
    targets.forEach(function (element) { element.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -24px' });
  targets.forEach(function (element) { observer.observe(element); });
});
