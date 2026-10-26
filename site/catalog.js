import './components/reward-button/reward-button.js';
import './components/xp-meter/xp-meter.js';
import './components/milestone-celebration/milestone-celebration.js';

const reward = document.getElementById('catalog-reward');
let rewardTimer;
reward.addEventListener('reward-request', () => {
  // Deliberate gallery simulation. A real host waits for its own service.
  reward.status = 'pending';
  rewardTimer = setTimeout(() => { reward.status = 'earned'; }, 800);
});
document.getElementById('catalog-reward-reset').addEventListener('click', () => {
  clearTimeout(rewardTimer);
  reward.status = 'ready';
});

const meter = document.getElementById('catalog-xp');
const levels = [
  { threshold: 0, label: 'Beginner' },
  { threshold: 100, label: 'Explorer' },
  { threshold: 250, label: 'Builder' },
  { threshold: 500, label: 'Expert' },
];
let xp = 180;
const addXP = document.getElementById('catalog-xp-add');
function renderXP() {
  meter.progress = { value: xp, levels };
  addXP.disabled = xp >= 500;
  addXP.textContent = xp >= 500 ? 'Top level reached' : 'Try +25 demo XP';
}
renderXP();
addXP.addEventListener('click', () => { xp = Math.min(500, xp + 25); renderXP(); });
document.getElementById('catalog-xp-reset').addEventListener('click', () => { xp = 180; renderXP(); });

const celebration = document.getElementById('catalog-celebration');
const placeholder = document.getElementById('catalog-celebration-placeholder');
celebration.addEventListener('milestone-dismiss', () => { placeholder.hidden = false; });
let celebrationId = 0;
document.getElementById('catalog-celebrate').addEventListener('click', () => {
  placeholder.hidden = true;
  celebration.celebrate({ id: `gallery-${++celebrationId}`, title: 'Your first small win.', description: 'An idea became something real.', rewardLabel: 'DEMO MILESTONE' });
});
document.getElementById('catalog-celebration-reset').addEventListener('click', () => {
  celebration.reset();
  placeholder.hidden = false;
});

document.querySelectorAll('[data-category]').forEach(button => {
  button.addEventListener('click', () => {
    const category = button.dataset.category;
    document.querySelectorAll('[data-category]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let visible = 0;
    document.querySelectorAll('[data-component-category]').forEach(card => {
      card.hidden = category !== 'all' && card.dataset.componentCategory !== category;
      if (!card.hidden) visible += 1;
    });
    document.getElementById('catalog-count').textContent = `${visible} components`;
  });
});
