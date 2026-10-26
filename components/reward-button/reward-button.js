/** A host-controlled action button. A request is never evidence of a reward. */
const STATUSES = new Set(["ready", "pending", "earned", "error", "unavailable"]);

export function rewardButtonState(status = "ready", disabled = false) {
  const safeStatus = STATUSES.has(status) ? status : "unavailable";
  return Object.freeze({
    status: safeStatus,
    canRequest: !disabled && (safeStatus === "ready" || safeStatus === "error"),
    busy: safeStatus === "pending",
    feedback: {
      ready: "", pending: "Working…", earned: "Earned", error: "Try again", unavailable: "Unavailable",
    }[safeStatus],
  });
}

const styles = `
  :host { --_accent:var(--bg-accent,#bbf36b); --_surface:var(--bg-surface,#fff); --_text:var(--bg-text,#20251e); --_muted:var(--bg-muted,#5d6758); --_border:var(--bg-border,#dce3d5); --_radius:var(--bg-radius,12px); --_edge:color-mix(in srgb,var(--_accent) 65%,#25371a); display:inline-block; max-width:100%; color:var(--_text); font:inherit; }
  :host([theme="dark"]) { --_surface:var(--bg-surface,#20251e); --_text:var(--bg-text,#f1f5ec); --_muted:var(--bg-muted,#b4bdad); --_border:var(--bg-border,#414b38); }
  * { box-sizing:border-box; } [hidden] { display:none!important; }
  button { display:flex; align-items:center; justify-content:center; gap:14px; width:100%; min-height:48px; padding:13px 19px; border:1px solid var(--_edge); border-radius:var(--_radius); background:var(--_accent); color:var(--bg-on-accent,#1e2c0f); box-shadow:0 4px 0 var(--_edge); font:inherit; font-size:14px; font-weight:650; line-height:1.35; cursor:pointer; transition:transform 120ms ease,box-shadow 120ms ease; }
  button:focus-visible { outline:3px solid var(--_text); outline-offset:6px; }
  button:not([aria-disabled="true"]):hover { filter:brightness(1.025); }
  button:not([aria-disabled="true"]):active { transform:translateY(3px); box-shadow:0 1px 0 var(--_edge); }
  button[aria-disabled="true"] { cursor:default; }
  button[data-status="unavailable"], :host([disabled]) button { background:var(--_surface); color:var(--_muted); border-color:var(--_border); box-shadow:0 3px 0 var(--_border); }
  .copy { text-align:left; overflow-wrap:anywhere; min-width:0; }
  .reward { padding:4px 7px; border-radius:5px; background:rgb(0 0 0 / .07); font-size:11px; white-space:normal; overflow-wrap:anywhere; }
  .symbol { flex:none; width:18px; height:18px; }
  :host([variant="compact"]) button { min-height:38px; padding:8px 12px; font-size:12px; gap:9px; box-shadow:0 3px 0 var(--_edge); }
  :host([variant="outline"]) button { background:var(--_surface); color:var(--_text); border-color:var(--_border); box-shadow:0 3px 0 var(--_border); }
  :host([variant="outline"]) button:not([aria-disabled="true"]):active { box-shadow:0 1px 0 var(--_border); }
  .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; border:0; }
  @media(prefers-reduced-motion:reduce) { button { transition:none; } button:active { transform:none!important; } }
`;
const HTMLElementBase = globalThis.HTMLElement ?? class {};

export class RewardButton extends HTMLElementBase {
  static get observedAttributes() { return ["label", "reward-label", "status", "variant", "theme", "disabled"]; }
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = styles;
    this._button = document.createElement("button");
    this._button.type = "button";
    this._button.setAttribute("part", "button");
    this._symbol = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this._symbol.setAttribute("viewBox", "0 0 20 20");
    this._symbol.setAttribute("aria-hidden", "true");
    this._symbol.setAttribute("class", "symbol");
    this._path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this._path.setAttribute("fill", "none");
    this._path.setAttribute("stroke", "currentColor");
    this._path.setAttribute("stroke-width", "2");
    this._path.setAttribute("stroke-linecap", "round");
    this._path.setAttribute("stroke-linejoin", "round");
    this._symbol.append(this._path);
    this._copy = document.createElement("span");
    this._copy.className = "copy";
    this._copy.setAttribute("part", "label");
    this._reward = document.createElement("span");
    this._reward.className = "reward";
    this._reward.setAttribute("part", "reward");
    this._live = document.createElement("span");
    this._live.className = "sr-only";
    this._live.setAttribute("role", "status");
    this._live.setAttribute("aria-atomic", "true");
    this._button.append(this._symbol, this._copy, this._reward);
    this.shadowRoot.append(style, this._button, this._live);
    this._button.addEventListener("click", () => {
      if (!rewardButtonState(this.status, this.disabled).canRequest || this._dispatching) return;
      this._dispatching = true;
      try {
        this.dispatchEvent(new CustomEvent("reward-request", { bubbles: true, composed: true }));
      } finally { this._dispatching = false; }
    });
  }
  connectedCallback() {
    for (const key of ["label", "rewardLabel", "status", "disabled"]) {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        const value = this[key]; delete this[key]; this[key] = value;
      }
    }
    this._render();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this._render(name === "status");
  }
  get label() { return this.getAttribute("label") ?? "Complete action"; }
  set label(value) { this.setAttribute("label", String(value)); }
  get rewardLabel() { return this.getAttribute("reward-label") ?? ""; }
  set rewardLabel(value) { this.setAttribute("reward-label", String(value)); }
  get status() { return rewardButtonState(this.getAttribute("status") ?? "ready").status; }
  set status(value) {
    if (!STATUSES.has(value)) throw new TypeError("Unsupported reward button status.");
    this.setAttribute("status", value);
  }
  get disabled() { return this.hasAttribute("disabled"); }
  set disabled(value) { this.toggleAttribute("disabled", Boolean(value)); }
  _render(announce = false) {
    if (!this._button) return;
    const state = rewardButtonState(this.status, this.disabled);
    this._button.dataset.status = state.status;
    this._button.setAttribute("aria-disabled", String(!state.canRequest));
    this._button.setAttribute("aria-busy", String(state.busy));
    this._copy.textContent = state.feedback ? `${this.label} · ${state.feedback}` : this.label;
    this._reward.textContent = this.rewardLabel;
    this._reward.hidden = !this.rewardLabel;
    this._path.setAttribute("d", state.status === "earned" ? "m4 10 4 4 8-8" : state.busy ? "M10 3v7l4 2M5 4a7 7 0 1 0 10 0" : "M3 10h14m-5-5 5 5-5 5");
    if (announce) this._live.textContent = `${this.label}. ${state.feedback || "Ready"}.`;
  }
}
if (globalThis.customElements && !customElements.get("reward-button")) customElements.define("reward-button", RewardButton);
