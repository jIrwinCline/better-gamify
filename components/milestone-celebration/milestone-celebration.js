/** A bounded presentation of a confirmed milestone; never a source of award truth. */
export function normalizeMilestone(event) {
  if (!event || typeof event !== "object") throw new TypeError("A milestone event is required.");
  for (const key of ["id", "title"]) {
    if (typeof event[key] !== "string" || !event[key].trim()) throw new TypeError(`Milestone ${key} must be nonempty text.`);
  }
  const description = event.description ?? "";
  const rewardLabel = event.rewardLabel ?? "";
  if (typeof description !== "string" || typeof rewardLabel !== "string") throw new TypeError("Milestone description and rewardLabel must be strings.");
  return Object.freeze({ id: event.id, title: event.title, description, rewardLabel });
}

/** Local presentation deduplication. This does not persist or authorize rewards. */
export class MilestoneHistory {
  constructor() { this._seen = new Set(); }
  accept(event) {
    const snapshot = normalizeMilestone(event);
    if (this._seen.has(snapshot.id)) return null;
    this._seen.add(snapshot.id);
    return snapshot;
  }
  reset() { this._seen.clear(); }
}

const styles = `
  :host { --_accent:var(--bg-accent,#507923); --_surface:var(--bg-surface,#fff); --_text:var(--bg-text,#20251e); --_muted:var(--bg-muted,#64705b); --_border:var(--bg-border,#dce3d5); --_radius:var(--bg-radius,18px); display:block; min-width:0; color:var(--_text); font:inherit; }
  :host([theme="dark"]) { --_accent:var(--bg-accent,#bbf36b); --_surface:var(--bg-surface,#20251e); --_text:var(--bg-text,#f1f5ec); --_muted:var(--bg-muted,#b4bdad); --_border:var(--bg-border,#414b38); }
  * { box-sizing:border-box; } [hidden] { display:none!important; }
  .panel { position:relative; padding:26px; border:1px solid var(--_border); border-radius:var(--_radius); background:var(--_surface); color:var(--_text); }
  .medallion { display:grid; place-items:center; width:52px; height:52px; margin:0 0 18px; border:1px solid var(--_border); border-radius:14px; color:var(--_accent); background:color-mix(in srgb,var(--_accent) 9%,var(--_surface)); }
  .star { width:29px; height:29px; }
  .eyebrow { margin:0 0 8px; color:var(--_accent); font-size:10px; font-weight:700; letter-spacing:.11em; text-transform:uppercase; }
  h3 { margin:0; font-size:24px; line-height:1.2; letter-spacing:-.035em; font-weight:650; overflow-wrap:anywhere; }
  .description { margin:11px 0 0; color:var(--_muted); font-size:13px; line-height:1.65; overflow-wrap:anywhere; }
  .reward { display:inline-block; margin-top:17px; padding:6px 9px; border:1px solid var(--_border); border-radius:6px; color:var(--_accent); font-size:12px; font-weight:650; overflow-wrap:anywhere; }
  .dismiss { position:absolute; inset:12px 12px auto auto; display:grid; place-items:center; width:36px; height:36px; padding:0; border:1px solid transparent; border-radius:8px; background:transparent; color:var(--_muted); font:inherit; font-size:23px; cursor:pointer; }
  .dismiss:hover { background:var(--_border); color:var(--_text); }
  .dismiss:focus-visible { outline:3px solid var(--_accent); outline-offset:3px; }
  dialog { width:min(440px,calc(100vw - 32px)); max-height:calc(100dvh - 32px); padding:0; border:0; border-radius:var(--_radius); background:var(--_surface); color:var(--_text); overflow:auto; box-shadow:0 24px 100px rgb(0 0 0 / .28); font:inherit; }
  dialog::backdrop { background:rgb(9 15 8 / .6); }
  dialog .panel { padding:34px; }
  dialog .medallion { width:64px; height:64px; margin-bottom:23px; }
  :host([variant="toast"]) .shell { position:fixed; z-index:1000; right:max(20px,env(safe-area-inset-right)); bottom:max(20px,env(safe-area-inset-bottom)); width:min(380px,calc(100vw - 40px)); max-height:calc(100dvh - 40px); overflow:auto; border-radius:var(--_radius); box-shadow:0 15px 60px rgb(0 0 0 / .22); }
  :host([variant="toast"]) .panel { padding:20px 54px 20px 20px; }
  :host([variant="toast"]) .medallion { width:36px; height:36px; margin-bottom:13px; border-radius:10px; }
  :host([variant="toast"]) .star { width:22px; height:22px; }
  :host([variant="toast"]) h3 { font-size:18px; }
  :host([variant="toast"]) .description { font-size:12px; }
  .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; border:0; }
`;
const HTMLElementBase = globalThis.HTMLElement ?? class {};
const node = (tag, className) => { const item = document.createElement(tag); if (className) item.className = className; return item; };

export class MilestoneCelebration extends HTMLElementBase {
  static get observedAttributes() { return ["variant", "theme"]; }
  constructor() {
    super();
    this._history = new MilestoneHistory();
    this._current = null;
    this._visible = false;
    this._animations = [];
    this.attachShadow({ mode: "open" });
    const style = node("style"); style.textContent = styles;
    this._shell = node("div", "shell"); this._shell.hidden = true;
    this._dialog = node("dialog"); this._dialog.setAttribute("part", "dialog");
    this._dialog.setAttribute("aria-labelledby", "milestone-title");
    this._dialog.setAttribute("aria-describedby", "milestone-description");
    this._panel = node("section", "panel"); this._panel.setAttribute("part", "panel");
    this._panel.setAttribute("aria-labelledby", "milestone-title");
    this._medallion = node("div", "medallion"); this._medallion.setAttribute("aria-hidden", "true"); this._medallion.setAttribute("part", "icon");
    const star = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    star.setAttribute("class", "star"); star.setAttribute("viewBox", "0 0 24 24"); star.setAttribute("fill", "currentColor");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M10 2h4v4h4v4h4v4h-4v4h-4v4h-4v-4H6v-4H2v-4h4V6h4z");
    star.append(path); this._medallion.append(star);
    this._eyebrow = node("p", "eyebrow"); this._eyebrow.textContent = "Milestone unlocked";
    this._title = node("h3"); this._title.id = "milestone-title"; this._title.setAttribute("part", "title");
    this._description = node("p", "description"); this._description.id = "milestone-description"; this._description.setAttribute("part", "description");
    this._reward = node("span", "reward"); this._reward.setAttribute("part", "reward");
    this._dismiss = node("button", "dismiss"); this._dismiss.type = "button"; this._dismiss.textContent = "×"; this._dismiss.setAttribute("aria-label", "Dismiss celebration"); this._dismiss.setAttribute("part", "dismiss-button");
    this._dismiss.addEventListener("click", () => this.dismiss());
    this._panel.append(this._medallion, this._eyebrow, this._title, this._description, this._reward, this._dismiss);
    this._shell.append(this._panel);
    this._live = node("span", "sr-only"); this._live.setAttribute("role", "status"); this._live.setAttribute("aria-atomic", "true");
    this.shadowRoot.append(style, this._shell, this._dialog, this._live);
    this._dialog.addEventListener("cancel", (event) => { event.preventDefault(); this.dismiss(); });
    this._dialog.addEventListener("close", () => {
      if (this._visible && this._mode === "dialog" && !this._dialog.open) this.dismiss();
    });
  }
  connectedCallback() { this._render(); }
  disconnectedCallback() {
    this._stopAnimation();
    if (this._dialog.open) this._dialog.close();
    this._visible = false;
  }
  attributeChangedCallback() { this._render(); }
  get visible() { return this._visible; }
  celebrate(event) {
    const snapshot = this._history.accept(event);
    if (!snapshot) return false;
    this._current = snapshot;
    this._visible = true;
    this._render();
    this._live.textContent = this._mode === "dialog" ? "" : [snapshot.title, snapshot.description, snapshot.rewardLabel].filter(Boolean).join(". ");
    this._animate();
    return true;
  }
  dismiss() {
    if (!this._visible) return;
    const id = this._current?.id;
    this._visible = false;
    this._stopAnimation();
    this._render();
    this._live.textContent = "";
    this.dispatchEvent(new CustomEvent("milestone-dismiss", { detail: { id }, bubbles: true, composed: true }));
  }
  reset() {
    this._history.reset();
    this._visible = false;
    this._current = null;
    this._stopAnimation();
    this._render();
    this._live.textContent = "";
  }
  _render() {
    if (!this._panel) return;
    this._mode = this.getAttribute("variant") === "dialog" ? "dialog" : "inline";
    if (this._mode !== "dialog" && this._dialog.open) this._dialog.close();
    const container = this._mode === "dialog" ? this._dialog : this._shell;
    if (this._panel.parentNode !== container) container.append(this._panel);
    this._shell.hidden = !this._visible || this._mode === "dialog";
    if (this._current) {
      this._title.textContent = this._current.title;
      this._description.textContent = this._current.description;
      this._description.hidden = !this._current.description;
      this._reward.textContent = this._current.rewardLabel;
      this._reward.hidden = !this._current.rewardLabel;
      if (this._current.description) this._dialog.setAttribute("aria-describedby", "milestone-description");
      else this._dialog.removeAttribute("aria-describedby");
    }
    if (this._mode === "dialog" && this._visible && this.isConnected && !this._dialog.open) this._dialog.showModal();
    if (!this._visible && this._dialog.open) this._dialog.close();
  }
  _stopAnimation() { for (const animation of this._animations) animation.cancel(); this._animations = []; }
  _animate() {
    this._stopAnimation();
    if (!this.isConnected || globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !this._panel.animate) return;
    this._animations = [
      this._panel.animate([{ opacity: .7, transform: "translateY(8px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 280, easing: "ease-out" }),
      this._medallion.animate([{ transform: "scale(.8) rotate(-8deg)" }, { transform: "scale(1.08) rotate(3deg)", offset: .65 }, { transform: "scale(1) rotate(0)" }], { duration: 480, easing: "ease-out" }),
    ];
  }
}
if (globalThis.customElements && !customElements.get("milestone-celebration")) customElements.define("milestone-celebration", MilestoneCelebration);
