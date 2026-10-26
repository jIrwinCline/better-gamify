/** Host-supplied progress only. This component never accumulates or awards XP. */
export function normalizeProgress(progress) {
  if (!progress || typeof progress !== "object") throw new TypeError("progress must be an object.");
  if (!Number.isSafeInteger(progress.value) || progress.value < 0) throw new TypeError("value must be a non-negative safe integer.");
  if (!Array.isArray(progress.levels) || !progress.levels.length) throw new TypeError("levels must be a nonempty array.");
  let previous = -1;
  const levels = Array.from(progress.levels, (level, index) => {
    if (!level || !Number.isSafeInteger(level.threshold) || level.threshold < 0 || level.threshold <= previous || (index === 0 && level.threshold !== 0)) {
      throw new TypeError("Level thresholds must strictly increase from zero using safe integers.");
    }
    if (typeof level.label !== "string" || !level.label.trim()) throw new TypeError("Each level requires a nonempty label.");
    previous = level.threshold;
    return Object.freeze({ threshold: level.threshold, label: level.label });
  });
  return Object.freeze({ value: progress.value, levels: Object.freeze(levels) });
}

/** Expects normalized data or null when unconfigured. Thresholds enter the new level. */
export function summarizeProgress(progress) {
  if (progress === null) return null;
  const { value, levels } = progress;
  let levelIndex = 0;
  for (let index = 1; index < levels.length && value >= levels[index].threshold; index++) levelIndex = index;
  const level = levels[levelIndex];
  const nextLevel = levels[levelIndex + 1] ?? null;
  const isMax = nextLevel === null;
  const intoLevel = value - level.threshold;
  const levelSpan = isMax ? 0 : nextLevel.threshold - level.threshold;
  return Object.freeze({ value, level, levelIndex, levelNumber: levelIndex + 1, nextLevel, intoLevel, levelSpan, remaining: isMax ? 0 : nextLevel.threshold - value, fraction: isMax ? 1 : intoLevel / levelSpan, isMax });
}

const styles = `
  :host { --_accent:var(--bg-accent,#507923); --_surface:var(--bg-surface,#fff); --_text:var(--bg-text,#20251e); --_muted:var(--bg-muted,#64705b); --_border:var(--bg-border,#e0e7da); --_radius:var(--bg-radius,16px); display:block; min-width:0; color:var(--_text); font:inherit; }
  :host([theme="dark"]) { --_accent:var(--bg-accent,#bbf36b); --_surface:var(--bg-surface,#20251e); --_text:var(--bg-text,#f1f5ec); --_muted:var(--bg-muted,#b4bdad); --_border:var(--bg-border,#414b38); }
  * { box-sizing:border-box; } [hidden] { display:none!important; }
  .panel { padding:23px; border:1px solid var(--_border); border-radius:var(--_radius); background:var(--_surface); }
  .top { display:flex; align-items:center; gap:15px; }
  .badge { display:grid; place-items:center; min-width:45px; height:45px; padding:0 10px; border:1px solid var(--_border); border-radius:12px; color:var(--_accent); font-size:20px; font-weight:750; font-variant-numeric:tabular-nums; }
  .identity { min-width:0; flex:1; }
  .eyebrow { margin:0 0 3px; color:var(--_muted); font-size:10px; font-weight:650; letter-spacing:.08em; text-transform:uppercase; }
  .level { margin:0; font-size:18px; font-weight:650; letter-spacing:-.025em; overflow-wrap:anywhere; }
  .value { margin:0; font-size:14px; font-weight:650; white-space:nowrap; font-variant-numeric:tabular-nums; }
  .track { position:relative; height:9px; margin:21px 0 11px; background:var(--_border); border-radius:20px; overflow:hidden; }
  .fill { height:100%; width:100%; transform-origin:left; transform:scaleX(var(--fraction,0)); background:var(--_accent); border-radius:20px; transition:transform 450ms cubic-bezier(.22,.8,.3,1); }
  .caption { margin:0; color:var(--_muted); font-size:12px; line-height:1.5; overflow-wrap:anywhere; }
  .ring { display:none; width:86px; height:86px; flex:none; transform:rotate(-90deg); }
  .ring circle { fill:none; stroke:var(--_border); stroke-width:7; }
  .ring .ring-fill { stroke:var(--_accent); stroke-linecap:round; stroke-dasharray:100; stroke-dashoffset:calc(100 - var(--fraction,0) * 100); transition:stroke-dashoffset 450ms ease; }
  :host([variant="compact"]) .panel { padding:14px 16px; }
  :host([variant="compact"]) .badge { min-width:30px; height:30px; border-radius:8px; font-size:14px; }
  :host([variant="compact"]) .level { font-size:14px; }
  :host([variant="compact"]) .eyebrow { display:none; }
  :host([variant="compact"]) .track { height:5px; margin:12px 0 7px; }
  :host([variant="compact"]) .value, :host([variant="compact"]) .caption { font-size:11px; }
  :host([variant="ring"]) .ring { display:block; }
  :host([variant="ring"]) .badge, :host([variant="ring"]) .track { display:none; }
  :host([variant="ring"]) .top { flex-wrap:wrap; }
  :host([variant="ring"]) .caption { margin-top:13px; }
  .top[hidden] ~ .caption { margin-top:0; }
  .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; border:0; }
  @media(max-width:400px) { .panel { padding:17px; } .top { gap:10px; flex-wrap:wrap; } .value { font-size:12px; } }
  @media(prefers-reduced-motion:reduce) { .fill,.ring .ring-fill { transition:none; } }
`;
const HTMLElementBase = globalThis.HTMLElement ?? class {};
const node = (tag, className) => { const item = document.createElement(tag); if (className) item.className = className; return item; };

export class XpMeter extends HTMLElementBase {
  static get observedAttributes() { return ["variant", "theme"]; }
  constructor() {
    super();
    this._progress = null;
    this.attachShadow({ mode: "open" });
    const style = node("style"); style.textContent = styles;
    this._panel = node("section", "panel"); this._panel.setAttribute("part", "panel");
    this._top = node("div", "top"); this._top.hidden = true;
    this._badge = node("div", "badge"); this._badge.setAttribute("aria-hidden", "true");
    this._badge.setAttribute("part", "level-badge");
    const identity = node("div", "identity");
    this._eyebrow = node("p", "eyebrow"); this._eyebrow.textContent = "Your level";
    this._level = node("h3", "level"); this._level.setAttribute("part", "level");
    identity.append(this._eyebrow, this._level);
    this._value = node("p", "value"); this._value.setAttribute("part", "value");
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    ring.setAttribute("class", "ring"); ring.setAttribute("viewBox", "0 0 100 100"); ring.setAttribute("aria-hidden", "true");
    for (const className of ["ring-track", "ring-fill"]) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "50"); circle.setAttribute("cy", "50"); circle.setAttribute("r", "43"); circle.setAttribute("pathLength", "100"); circle.setAttribute("class", className); ring.append(circle);
    }
    this._top.append(ring, this._badge, identity, this._value);
    this._track = node("div", "track"); this._track.setAttribute("aria-hidden", "true"); this._track.setAttribute("part", "track");
    this._track.hidden = true;
    this._fill = node("div", "fill"); this._fill.setAttribute("part", "fill"); this._track.append(this._fill);
    this._caption = node("p", "caption"); this._caption.setAttribute("part", "caption");
    this._accessibleProgress = node("div", "sr-only"); this._accessibleProgress.setAttribute("role", "progressbar"); this._accessibleProgress.setAttribute("aria-label", "Experience toward the next level");
    this._accessibleProgress.hidden = true;
    this._live = node("span", "sr-only"); this._live.setAttribute("role", "status"); this._live.setAttribute("aria-atomic", "true");
    this._panel.append(this._top, this._track, this._caption, this._accessibleProgress, this._live);
    this.shadowRoot.append(style, this._panel);
  }
  connectedCallback() {
    if (Object.prototype.hasOwnProperty.call(this, "progress")) { const value = this.progress; delete this.progress; this.progress = value; }
    this._render();
  }
  attributeChangedCallback() { this._render(); }
  get progress() { return this._progress; }
  set progress(value) {
    const normalized = normalizeProgress(value);
    const changed = JSON.stringify(normalized) !== JSON.stringify(this._progress);
    this._progress = normalized;
    this._render(changed);
  }
  _render(announce = false) {
    if (!this._panel) return;
    const summary = summarizeProgress(this._progress);
    this._top.hidden = !summary;
    this._track.hidden = !summary;
    this._accessibleProgress.hidden = !summary;
    if (!summary) {
      this._caption.textContent = "Progress is not available yet.";
      this._live.textContent = "";
      return;
    }
    const format = (value) => value.toLocaleString("en-US");
    this._panel.style.setProperty("--fraction", String(summary.fraction));
    this._badge.textContent = String(summary.levelNumber);
    this._level.textContent = summary.level.label;
    this._value.textContent = `${format(summary.value)} XP`;
    this._caption.textContent = summary.isMax ? "Highest level reached. Keep making progress." : `${format(summary.remaining)} XP to ${summary.nextLevel.label}`;
    this._accessibleProgress.setAttribute("aria-valuemin", "0");
    this._accessibleProgress.setAttribute("aria-valuemax", String(summary.isMax ? 1 : summary.levelSpan));
    this._accessibleProgress.setAttribute("aria-valuenow", String(summary.isMax ? 1 : summary.intoLevel));
    this._accessibleProgress.setAttribute("aria-valuetext", `${summary.level.label}. ${format(summary.value)} XP. ${this._caption.textContent}`);
    if (announce && this.isConnected) this._live.textContent = this._accessibleProgress.getAttribute("aria-valuetext");
  }
}
if (globalThis.customElements && !customElements.get("xp-meter")) customElements.define("xp-meter", XpMeter);
