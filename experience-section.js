function initExperienceJourney() {
  const section = document.getElementById('experience');
  const viewport = document.getElementById('exp-sticky-viewport');
  const stage = document.getElementById('exp-horizontal-stage');
  if (!section || !viewport || !stage) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const panels = [...stage.querySelectorAll('.exp-panel')];
  const phase = document.getElementById('exp-hud-phase');
  const progressBar = document.getElementById('exp-hud-progress');
  const topTicker = document.getElementById('exp-ticker-top');
  const bottomTicker = document.getElementById('exp-ticker-bottom');
  const jumpButtons = [...section.querySelectorAll('.exp-jump-btn')];
  const phases = ['FOUNDATION & JOURNEY', 'SELF-DIRECTED LEARNING', 'GRAPHIC & MOTION'];

  let frame = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  let stageTravel = 0;
  let sectionTravel = 0;
  let isJumping = false;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (value) => value * value * (3 - 2 * value);

  function measure() {
    stageTravel = Math.max(0, stage.scrollWidth - viewport.clientWidth);
    sectionTravel = Math.max(1, section.offsetHeight - window.innerHeight);
    render();
  }

  function getProgress() {
    const rect = section.getBoundingClientRect();
    return clamp(-rect.top / sectionTravel);
  }

  function setChapter(chapter) {
    if (phase && phase.textContent !== phases[chapter]) phase.textContent = phases[chapter];
    jumpButtons.forEach((button) => {
      const active = (chapter === 1 && button.textContent.trim() === 'UI/UX') ||
        (chapter === 2 && button.textContent.trim() === 'GRAPHIC & MOTION');
      button.classList.toggle('bg-white/10', active);
      button.classList.toggle('border-white/20', active);
      button.classList.toggle('text-white', active);
      button.classList.toggle('border-white/5', !active);
      button.classList.toggle('text-neutral-500', !active);
    });
  }

  function render() {
    frame = 0;
    const actual = getProgress();
    if (!isJumping) targetProgress = actual;
    currentProgress += (targetProgress - currentProgress) * (reducedMotion.matches ? 1 : 0.12);
    if (Math.abs(targetProgress - currentProgress) < 0.001) currentProgress = targetProgress;

    if (reducedMotion.matches) {
      stage.style.transform = '';
      panels.forEach((panel) => {
        panel.style.opacity = '';
        panel.style.transform = '';
      });
      if (progressBar) progressBar.style.width = `${Math.round(actual * 100)}%`;
      return;
    }

    const p = currentProgress;
    const x = -stageTravel * p;
    stage.style.transform = `translate3d(${x}px, 0, 0)`;

    const center = window.innerWidth * 0.5;
    let activeChapter = 0;
    let nearestDistance = Infinity;
    panels.forEach((panel, index) => {
      const panelCenter = panel.offsetLeft + panel.offsetWidth / 2 + x;
      const distance = Math.abs(center - panelCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        activeChapter = index;
      }
      const visibility = clamp(1 - distance / (window.innerWidth * 0.95));
      panel.style.opacity = `${0.48 + visibility * 0.52}`;
      panel.style.transform = `translate3d(0, ${(1 - visibility) * 20}px, 0)`;
    });

    section.querySelectorAll('.exp-date-bg').forEach((date) => {
      const factor = Number(date.dataset.parallaxFactor) || 0.15;
      date.style.transform = `translate3d(${x * factor * -1}px, ${Math.sin(p * Math.PI * 2) * 12}px, 0)`;
    });
    if (topTicker) topTicker.style.transform = `translate3d(${-p * 9}vw, 0, 0)`;
    if (bottomTicker) bottomTicker.style.transform = `translate3d(${p * 9}vw, 0, 0)`;
    if (progressBar) progressBar.style.width = `${Math.round(p * 100)}%`;
    setChapter(activeChapter);

    if (Math.abs(targetProgress - currentProgress) > 0.001) frame = requestAnimationFrame(render);
  }

  function onScroll() {
    if (frame) return;
    frame = requestAnimationFrame(render);
  }

  function jumpTo(button) {
    const requested = clamp(Number(button.dataset.targetProgress) || 0);
    isJumping = true;
    targetProgress = requested;
    currentProgress = getProgress();
    const top = section.getBoundingClientRect().top + window.scrollY + requested * sectionTravel;
    window.scrollTo({ top, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    window.setTimeout(() => { isJumping = false; }, 1100);
    onScroll();
  }

  jumpButtons.forEach((button) => button.addEventListener('click', () => jumpTo(button)));
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  reducedMotion.addEventListener?.('change', measure);
  if ('ResizeObserver' in window) new ResizeObserver(measure).observe(viewport);
  measure();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initExperienceJourney, { once: true });
} else {
  initExperienceJourney();
}


