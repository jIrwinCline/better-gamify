/**
 * Optional, presentational actions-for-credits checklist.
 * Completion evidence and credit grants belong to the host application's server.
 */

const ACTION_STATUSES = new Set([
  "available",
  "pending",
  "awarded",
  "unavailable",
]);
const VARIANTS = new Set(["grid", "list", "compact"]);

/** Validate and snapshot display data; never infer completion from a click. */
export function normalizeActions(actions) {
  if (!Array.isArray(actions)) throw new TypeError("actions must be an array.");
  const ids = new Set();
  let totalReward = 0;
  return Object.freeze(
    actions.map((action, index) => {
      if (!action || typeof action !== "object") {
        throw new TypeError(`Action ${index} must be an object.`);
      }
      const { id, title, reward } = action;
      const description = action.description ?? "";
      const status = action.status ?? "available";
      if (typeof id !== "string" || !id.trim() || ids.has(id)) {
        throw new TypeError(
          `Action ${index} must have a unique, nonempty string id.`,
        );
      }
      if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof description !== "string"
      ) {
        throw new TypeError(
          `Action ${id} must have a title and a string description.`,
        );
      }
      if (!Number.isSafeInteger(reward) || reward < 0) {
        throw new TypeError(
          `Action ${id} reward must be a non-negative safe integer.`,
        );
      }
      totalReward += reward;
      if (!Number.isSafeInteger(totalReward)) {
        throw new RangeError("The total reward must be a safe integer.");
      }
      if (!ACTION_STATUSES.has(status)) {
        throw new TypeError(`Action ${id} has an unsupported status.`);
      }
      ids.add(id);
      return Object.freeze({
        id,
        title,
        description,
        reward,
        status,
        icon: typeof action.icon === "string" ? action.icon : "sparkle",
      });
    }),
  );
}

/** Summarize a normalized catalog. Unavailable actions are outside the denominator. */
export function summarizeActions(actions) {
  return actions.reduce(
    (summary, action) => {
      if (action.status !== "unavailable") summary.total += 1;
      if (action.status === "awarded") {
        summary.awarded += 1;
        summary.earned += action.reward;
      }
      return summary;
    },
    { total: 0, awarded: 0, earned: 0 },
  );
}

/** Text is kept separate from markup so client-supplied content is never HTML. */
export function actionButtonLabel(action, creditLabel = "credits") {
  if (action.status === "pending") return "Checking…";
  if (action.status === "awarded")
    return `+${action.reward.toLocaleString("en-US")} earned`;
  if (action.status === "unavailable") return "Unavailable";
  return `+${action.reward.toLocaleString("en-US")} ${creditLabel}`;
}

const ICONS = {
  sparkle: ["m12 3 2.7 6.3L21 12l-6.3 2.7L12 21l-2.7-6.3L3 12l6.3-2.7L12 3Z"],
  mail: ["M4 5h16v14H4z", "m4 6 8 6 8-6"],
  rocket: [
    "M12 15 9 12c2-6 7-8 12-9-1 5-3 10-9 12Z",
    "m9 12-4-1-2 5 6-1",
    "m12 15 1 4-5 2 1-6",
    "m5 18-2 3",
    "m15 9 0 .01",
  ],
  users: [
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",
    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
    "M22 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  share: [
    "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
    "m8.6 10.5 6.8-4",
    "m8.6 13.5 6.8 4",
  ],
  book: [
    "M12 6c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1Z",
    "M12 6v15",
  ],
  check: ["m5 12 4 4L19 6"],
  github: [
    "M9 19c-5 1-5-2-7-2",
    "M15 22v-4a3.5 3.5 0 0 0-1-3c3-.3 6-1.5 6-6a4.7 4.7 0 0 0-1.3-3.3A4.4 4.4 0 0 0 18.6 2S17.5 1.7 15 3a12.5 12.5 0 0 0-6 0C6.5 1.7 5.4 2 5.4 2a4.4 4.4 0 0 0-.1 3.7A4.7 4.7 0 0 0 4 9c0 4.5 3 5.7 6 6a3.5 3.5 0 0 0-1 3v4",
  ],
  discord: [
    "M8 5c-2 0-4 1-4 1L2 17c2 2 4 2 4 2l1-2",
    "M16 5c2 0 4 1 4 1l2 11c-2 2-4 2-4 2l-1-2",
    "M7 8c3-1 7-1 10 0",
    "M7 16c3 1 7 1 10 0",
    "M8 12h.01",
    "M16 12h.01",
  ],
  arrow: ["M4 12h16", "m14 6 6 6-6 6"],
};

function icon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.7");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  for (const pathData of Object.prototype.hasOwnProperty.call(ICONS, name)
    ? ICONS[name]
    : ICONS.sparkle) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    svg.append(path);
  }
  return svg;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const styles = `
  :host {
    --_accent: var(--ac-accent, #252c27);
    --_bg: var(--ac-bg, #ffffff);
    --_surface: var(--ac-surface, #fafbf9);
    --_text: var(--ac-text, #252c27);
    --_muted: var(--ac-muted, #6b746e);
    --_border: var(--ac-border, #e3e8e3);
    --_radius: var(--ac-radius, 12px);
    --_success: #26734c;
    --_success-bg: #edf8f1;
    --_success-border: #cce8d6;
    display: block; min-width: 0; color: var(--_text); font: inherit;
    -webkit-font-smoothing: antialiased;
  }
  :host([theme="dark"]) {
    --_accent: var(--ac-accent, #dcf3cc);
    --_bg: var(--ac-bg, #171c19);
    --_surface: var(--ac-surface, #1d2420);
    --_text: var(--ac-text, #edf3ec);
    --_muted: var(--ac-muted, #a5afa7);
    --_border: var(--ac-border, #343e36);
    --_success: #a7dfbd;
    --_success-bg: #223a2b;
    --_success-border: #355a43;
  }
  *, *::before, *::after { box-sizing: border-box; }
  [hidden] { display: none !important; }
  button { font: inherit; }
  button:focus-visible, .card:focus-visible {
    outline: 3px solid var(--_accent); outline-offset: 4px;
  }
  .panel { background: var(--_bg); padding: 28px; border-radius: var(--_radius); }
  .intro { display: flex; justify-content: space-between; gap: 20px; align-items: start; }
  h2 { margin: 0; font-size: clamp(20px, 3vw, 25px); letter-spacing: -.045em; font-weight: 600; line-height: 1.23; }
  .description { margin: 9px 0 0; font-size: 13px; color: var(--_muted); line-height: 1.65; }
  .optional { flex: none; font-size: 10px; line-height: 1; font-weight: 500; color: var(--_muted); padding: 7px 8px; border: 1px solid var(--_border); border-radius: 5px; letter-spacing: .025em; }
  .progress-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin: 24px 0 10px; font-size: 11px; color: var(--_muted); }
  .earned { color: var(--_success); font-weight: 600; }
  progress { display: block; width: 100%; height: 4px; border: 0; border-radius: 99px; overflow: hidden; background: var(--_border); accent-color: var(--_success); }
  progress::-webkit-progress-bar { background: var(--_border); }
  progress::-webkit-progress-value { background: var(--_success); border-radius: 99px; }
  progress::-moz-progress-bar { background: var(--_success); border-radius: 99px; }
  .actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin: 22px 0 0; padding: 0; list-style: none; }
  .card { display: flex; flex-direction: column; align-items: start; padding: 17px; border: 1px solid var(--_border); border-radius: var(--_radius); background: var(--_surface); min-width: 0; }
  .card[data-status="awarded"] { background: var(--_success-bg); border-color: var(--_success-border); }
  .icon { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; color: var(--_text); background: var(--_bg); border: 1px solid var(--_border); border-radius: 8px; margin-bottom: 14px; flex: none; }
  .icon svg { width: 16px; height: 16px; }
  .card[data-status="awarded"] .icon { color: var(--_success); border-color: var(--_success-border); background: transparent; }
  .copy { min-width: 0; flex: 1; }
  h3 { font-size: 12px; font-weight: 600; margin: 0; line-height: 1.5; overflow-wrap: anywhere; }
  .action-description { margin: 6px 0 0; font-size: 11px; color: var(--_muted); line-height: 1.65; overflow-wrap: anywhere; }
  .reward { display: inline-flex; align-items: center; justify-content: center; gap: 5px; min-height: 36px; max-width: 100%; margin: 14px 0 0; padding: 7px 10px; border: 1px solid var(--_border); border-radius: 7px; background: var(--_bg); color: var(--_text); font-size: 10px; font-weight: 600; cursor: pointer; line-height: 1.3; text-align: center; overflow-wrap: anywhere; }
  .reward:not(:disabled):hover { border-color: var(--_accent); }
  .reward:disabled { cursor: default; color: var(--_muted); }
  .reward svg { width: 12px; height: 12px; flex: none; }
  .card[data-status="awarded"] .reward { background: transparent; color: var(--_success); border-color: var(--_success-border); }
  .card[data-status="pending"] .reward { color: var(--_muted); }
  .card[data-status="unavailable"] .icon { color: var(--_muted); }
  .footer { margin-top: 24px; padding-top: 19px; border-top: 1px solid var(--_border); display: flex; justify-content: space-between; align-items: center; gap: 20px; }
  .footer-note { font-size: 11px; color: var(--_muted); line-height: 1.5; margin: 0; }
  .continue { display: inline-flex; align-items: center; justify-content: center; gap: 12px; padding: 11px 16px; min-height: 42px; border: 1px solid var(--_accent); border-radius: 8px; background: var(--_accent); color: var(--_bg); font-size: 12px; font-weight: 500; cursor: pointer; flex: none; }
  .continue:hover { filter: brightness(.94); }
  .continue svg { width: 14px; height: 14px; }
  .empty { margin: 24px 0; color: var(--_muted); font-size: 13px; line-height: 1.6; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
  :host([variant="list"]) .actions, :host([variant="compact"]) .actions { grid-template-columns: minmax(0, 1fr); }
  :host([variant="list"]) .card, :host([variant="compact"]) .card { flex-direction: row; align-items: center; gap: 14px; }
  :host([variant="list"]) .icon, :host([variant="compact"]) .icon { margin-bottom: 0; }
  :host([variant="list"]) .reward, :host([variant="compact"]) .reward { margin: 0; flex: none; max-width: 38%; }
  :host([variant="compact"]) .panel { padding: 20px; }
  :host([variant="compact"]) h2 { font-size: 19px; }
  :host([variant="compact"]) .description, :host([variant="compact"]) .action-description, :host([variant="compact"]) .optional, :host([variant="compact"]) .footer-note { display: none; }
  :host([variant="compact"]) .card { padding: 12px; }
  :host([variant="compact"]) .footer { justify-content: end; }
  @media (max-width: 700px) { .actions { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 440px) {
    .panel { padding: 20px; }
    .actions { grid-template-columns: minmax(0, 1fr); }
    .optional { display: none; }
    .footer { gap: 12px; }
    .footer-note { max-width: 160px; }
    .progress-row { align-items: start; font-size: 10px; }
    :host([variant="list"]) .card, :host([variant="compact"]) .card { gap: 10px; }
  }
`;

// Importing the pure helpers in Node does not require browser globals.
const HTMLElementBase = globalThis.HTMLElement ?? class {};

export class ActionCredits extends HTMLElementBase {
  static get observedAttributes() {
    return ["heading", "description", "variant", "credit-label", "theme"];
  }

  constructor() {
    super();
    this._actions = Object.freeze([]);
    this._cards = new Map();
    this._hasRendered = false;
    this.attachShadow({ mode: "open" });

    const style = element("style");
    style.textContent = styles;
    this._panel = element("section", "panel");
    this._panel.setAttribute("part", "panel");
    this._panel.setAttribute("aria-labelledby", "ac-heading");
    const intro = element("div", "intro");
    intro.setAttribute("part", "header");
    const introCopy = element("div");
    this._heading = element("h2");
    this._heading.id = "ac-heading";
    this._heading.setAttribute("part", "heading");
    this._description = element("p", "description");
    introCopy.append(this._heading, this._description);
    intro.append(introCopy, element("span", "optional", "OPTIONAL"));
    const progressRow = element("div", "progress-row");
    this._progressText = element("span");
    this._earned = element("span", "earned");
    progressRow.append(this._progressText, this._earned);
    this._progress = element("progress");
    this._progress.setAttribute("part", "progress");
    this._progress.setAttribute("aria-label", "Rewards earned");
    this._list = element("ul", "actions");
    this._list.setAttribute("part", "actions");
    this._empty = element(
      "p",
      "empty",
      "There are no rewards available right now. You’re ready to continue.",
    );
    const footer = element("div", "footer");
    footer.setAttribute("part", "footer");
    const continueButton = element("button", "continue", "Continue");
    continueButton.type = "button";
    continueButton.setAttribute("part", "continue-button");
    continueButton.append(icon("arrow"));
    continueButton.addEventListener("click", () => {
      this.dispatchEvent(
        new CustomEvent("continue", { bubbles: true, composed: true }),
      );
    });
    footer.append(
      element("p", "footer-note", "Go at your own pace. Come back anytime."),
      continueButton,
    );
    this._live = element("div", "sr-only");
    this._live.setAttribute("role", "status");
    this._live.setAttribute("aria-live", "polite");
    this._live.setAttribute("aria-atomic", "true");
    this._panel.append(
      intro,
      progressRow,
      this._progress,
      this._list,
      this._empty,
      footer,
      this._live,
    );
    this.shadowRoot.append(style, this._panel);
  }

  connectedCallback() {
    // Recover properties set before this custom element was registered.
    for (const name of [
      "actions",
      "heading",
      "description",
      "variant",
      "creditLabel",
    ]) {
      if (Object.prototype.hasOwnProperty.call(this, name)) {
        const value = this[name];
        delete this[name];
        this[name] = value;
      }
    }
    this._render();
  }

  attributeChangedCallback() {
    if (this._panel) this._render();
  }

  get actions() {
    return this._actions;
  }
  set actions(value) {
    const next = normalizeActions(value);
    const previous = this._actions;
    this._actions = next;
    this._render(previous);
  }
  get heading() {
    return this.getAttribute("heading") ?? "A little momentum goes a long way.";
  }
  set heading(value) {
    this.setAttribute("heading", String(value));
  }
  get description() {
    return (
      this.getAttribute("description") ??
      "Complete a few quick actions to earn extra credits for your account."
    );
  }
  set description(value) {
    this.setAttribute("description", String(value));
  }
  get variant() {
    const value = this.getAttribute("variant");
    return VARIANTS.has(value) ? value : "grid";
  }
  set variant(value) {
    this.setAttribute("variant", VARIANTS.has(value) ? value : "grid");
  }
  get creditLabel() {
    return this.getAttribute("credit-label") ?? "credits";
  }
  set creditLabel(value) {
    this.setAttribute("credit-label", String(value));
  }

  _createCard(actionId) {
    const card = element("li", "card");
    card.tabIndex = -1;
    card.setAttribute("part", "card");
    const badge = element("div", "icon");
    badge.setAttribute("part", "icon");
    const copy = element("div", "copy");
    const title = element("h3");
    const description = element("p", "action-description");
    copy.append(title, description);
    const button = element("button", "reward");
    button.type = "button";
    button.setAttribute("part", "action-button");
    button.addEventListener("click", () => {
      // Check the latest state even if a host dispatches a synthetic click.
      if (
        this._actions.find((action) => action.id === actionId)?.status !==
        "available"
      )
        return;
      this.dispatchEvent(
        new CustomEvent("action-request", {
          detail: Object.freeze({ actionId }),
          bubbles: true,
          composed: true,
        }),
      );
    });
    card.append(badge, copy, button);
    return { card, badge, title, description, button };
  }

  _render(previous = this._actions) {
    if (!this._panel) return;
    const focused = this.shadowRoot.activeElement;
    const summary = summarizeActions(this._actions);
    this._heading.textContent = this.heading;
    this._description.textContent = this.description;
    this._description.hidden = !this.description;
    this._progressText.textContent = `${summary.awarded} of ${summary.total} rewards earned`;
    this._earned.textContent = `+${summary.earned.toLocaleString("en-US")} ${this.creditLabel} earned`;
    this._progress.max = Math.max(1, summary.total);
    this._progress.value = summary.awarded;
    this._progress.setAttribute(
      "aria-valuetext",
      this._progressText.textContent,
    );
    this._empty.hidden = this._actions.length > 0;
    this._list.hidden = this._actions.length === 0;

    const activeIds = new Set(this._actions.map((action) => action.id));
    for (const [id, entry] of this._cards) {
      if (!activeIds.has(id)) {
        if (entry.card.contains(focused))
          this._panel.querySelector(".continue").focus({ preventScroll: true });
        entry.card.remove();
        this._cards.delete(id);
      }
    }

    this._actions.forEach((action, index) => {
      let entry = this._cards.get(action.id);
      if (!entry) {
        entry = this._createCard(action.id);
        this._cards.set(action.id, entry);
      }
      const { card, badge, title, description, button } = entry;
      card.dataset.status = action.status;
      card.setAttribute(
        "aria-label",
        `${action.title}. ${actionButtonLabel(action, this.creditLabel)}`,
      );
      card.setAttribute("aria-busy", String(action.status === "pending"));
      title.textContent = action.title;
      description.textContent = action.description;
      description.hidden = !action.description;
      const iconName = action.status === "awarded" ? "check" : action.icon;
      if (entry.iconName !== iconName) {
        badge.replaceChildren(icon(iconName));
        entry.iconName = iconName;
      }
      const label = actionButtonLabel(action, this.creditLabel);
      if (button.textContent !== label) button.textContent = label;
      button.setAttribute("aria-label", `${action.title}: ${label}`);
      button.disabled = action.status !== "available";

      // Keyed nodes keep keyboard focus and event handlers through host updates.
      if (this._list.children[index] !== card)
        this._list.insertBefore(card, this._list.children[index] ?? null);
      if (focused === button)
        (button.disabled ? card : button).focus({ preventScroll: true });
      else if (focused === card) card.focus({ preventScroll: true });
    });

    if (this._hasRendered) {
      const previousById = new Map(
        previous.map((action) => [action.id, action]),
      );
      const changes = this._actions.filter(
        (action) => previousById.get(action.id)?.status !== action.status,
      );
      if (changes.length) {
        this._live.textContent = changes
          .map((action) => {
            if (action.status === "awarded")
              return `${action.title}: ${action.reward.toLocaleString("en-US")} ${this.creditLabel} earned.`;
            if (action.status === "pending")
              return `${action.title}: checking completion.`;
            if (action.status === "unavailable")
              return `${action.title}: unavailable.`;
            return `${action.title}: available.`;
          })
          .join(" ");
      }
    }
    this._hasRendered = true;
  }
}

if (
  globalThis.customElements &&
  !globalThis.customElements.get("action-credits")
) {
  globalThis.customElements.define("action-credits", ActionCredits);
}
