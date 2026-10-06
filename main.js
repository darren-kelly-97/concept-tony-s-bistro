document.documentElement.classList.add('js');

const runner = document.querySelector('.runner-stage');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (runner && !reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      runner.classList.add('is-extended');
      observer.disconnect();
    }
  }, { threshold: 0.15 });

  observer.observe(runner);
} else if (runner) {
  runner.classList.add('is-extended');
}

const guide = document.querySelector('[data-tray-guide]');

if (guide) {
  const input = guide.querySelector('[data-guest-count]');
  const result = guide.querySelector('[data-tray-result]');
  const error = guide.querySelector('[data-tray-error]');
  const estimates = guide.querySelector('[data-estimate-grid]');
  const halfCount = guide.querySelector('[data-half-count]');
  const fullCount = guide.querySelector('[data-full-count]');

  if (input && result && error && estimates && halfCount && fullCount) {
    input.disabled = false;

    const rangeText = (low, high) => low === high ? String(low) : `${low} to ${high}`;
    const trayText = (low, high, size) =>
      `${rangeText(low, high)} ${size} ${high === 1 ? 'tray' : 'trays'}`;

    const updateEstimate = () => {
      const raw = input.value.trim();

      if (raw === '') {
        input.removeAttribute('aria-invalid');
        error.textContent = '';
        estimates.hidden = true;
        result.textContent = 'Enter a guest count above to see a tray estimate.';
        return;
      }

      const guests = Number(raw);

      if (!/^[0-9]+$/.test(raw) || !Number.isSafeInteger(guests) || guests < 1) {
        input.setAttribute('aria-invalid', 'true');
        error.textContent = 'Enter a whole number of guests greater than 0.';
        estimates.hidden = true;
        result.textContent = '';
        return;
      }

      const halfLow = Math.ceil(guests / 8);
      const halfHigh = Math.ceil(guests / 6);
      const fullLow = Math.ceil(guests / 17);
      const fullHigh = Math.ceil(guests / 12);

      input.removeAttribute('aria-invalid');
      error.textContent = '';
      estimates.hidden = false;
      halfCount.textContent = rangeText(halfLow, halfHigh);
      fullCount.textContent = rangeText(fullLow, fullHigh);

      const roomNote = guests > 50
        ? ' The private party room holds up to 50 guests.'
        : '';

      result.textContent = `For ${guests} ${guests === 1 ? 'guest' : 'guests'}: ${trayText(halfLow, halfHigh, 'half')} or ${trayText(fullLow, fullHigh, 'full')}. These are estimates. Call to confirm your order.${roomNote}`;
    };

    input.addEventListener('input', updateEstimate);
    updateEstimate();
  }
}