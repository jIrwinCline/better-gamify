import "./components/action-credits/action-credits.js";

const $ = (id) => document.getElementById(id);
const demo = $("main-demo");
const initialActions = [
  {
    id: "verify-email",
    title: "Verify your email",
    description: "Keep your account safe and ready to go.",
    reward: 25,
    icon: "mail",
    status: "available",
  },
  {
    id: "first-project",
    title: "Create your first project",
    description: "Turn an idea into something you can use.",
    reward: 50,
    icon: "rocket",
    status: "available",
  },
  {
    id: "invite-teammate",
    title: "Bring a teammate along",
    description: "Earn credits when your teammate joins.",
    reward: 75,
    icon: "users",
    status: "available",
  },
];
let actions = structuredClone(initialActions);
let generation = 0;
let toastTimer;
const pendingTimers = new Set();
demo.heading = "Let’s get you started.";
demo.description = "A few small steps. A little extra room to create.";
demo.actions = actions;

function notify(message) {
  clearTimeout(toastTimer);
  $("toast").textContent = message;
  $("toast").classList.add("visible");
  toastTimer = setTimeout(() => $("toast").classList.remove("visible"), 3400);
}

// This is a sandbox simulation, never a production verification or credit service.
demo.addEventListener("action-request", ({ detail }) => {
  const action = actions.find((item) => item.id === detail.actionId);
  if (!action || action.status !== "available") return;
  action.status = "pending";
  demo.actions = actions;
  const startedGeneration = generation;
  const timer = setTimeout(() => {
    pendingTimers.delete(timer);
    if (startedGeneration !== generation) return;
    action.status = "awarded";
    demo.actions = actions;
    notify(`+${action.reward} demo credits. That’s a little more momentum.`);
  }, 850);
  pendingTimers.add(timer);
});

function returnToDemo() {
  demo.hidden = false;
  $("demo-complete").hidden = true;
}
demo.addEventListener("continue", () => {
  demo.hidden = true;
  $("demo-complete").hidden = false;
  $("return-demo").focus();
});
$("return-demo").addEventListener("click", () => {
  returnToDemo();
  demo.shadowRoot.querySelector("button:not(:disabled)")?.focus();
});
$("reset-demo").addEventListener("click", () => {
  generation += 1;
  for (const timer of pendingTimers) clearTimeout(timer);
  pendingTimers.clear();
  actions = structuredClone(initialActions);
  demo.actions = actions;
  returnToDemo();
  notify("Demo reset. Try another path.");
});

function selectTab(name, focus = false) {
  document.querySelectorAll("[data-tab]").forEach((button) => {
    const selected = button.dataset.tab === name;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
    $("panel-" + button.dataset.tab).hidden = !selected;
    if (selected && focus) button.focus();
  });
}
document.querySelectorAll("[data-tab]").forEach((button, index, all) => {
  button.addEventListener("click", () => selectTab(button.dataset.tab));
  button.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % all.length;
    if (event.key === "ArrowLeft") next = (index + all.length - 1) % all.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = all.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectTab(all[next].dataset.tab, true);
    }
  });
});

function setVariant(variant) {
  demo.variant = variant;
  $("demo-stage").dataset.variant = variant;
  $("demo-context").textContent = {
    grid: "Your app / Getting started",
    list: "Your app / Your next steps",
    compact: "Your app / Bonus credits",
  }[variant];
  document
    .querySelectorAll("[data-variant]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.variant === variant),
      ),
    );
  returnToDemo();
}
document
  .querySelectorAll("[data-variant]")
  .forEach((button) =>
    button.addEventListener("click", () => setVariant(button.dataset.variant)),
  );
document.querySelectorAll("[data-select-variant]").forEach((link) =>
  link.addEventListener("click", () => {
    selectTab("preview");
    setVariant(link.dataset.selectVariant);
  }),
);

$("demo-theme").addEventListener("click", () => {
  const theme = demo.getAttribute("theme") === "light" ? "dark" : "light";
  demo.setAttribute("theme", theme);
  $("demo-stage").dataset.demoTheme = theme;
  $("demo-theme").querySelector("span").textContent =
    theme === "light" ? "Light" : "Dark";
  $("demo-theme").setAttribute(
    "aria-label",
    `Switch demo to ${theme === "light" ? "dark" : "light"} theme`,
  );
});
function setPageTheme(theme) {
  document.documentElement.dataset.theme = theme;
  $("theme-toggle").setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} theme`,
  );
}
try {
  const saved = localStorage.getItem("game-ui.theme");
  if (saved === "light" || saved === "dark") setPageTheme(saved);
} catch {
  /* Preference storage is optional. */
}
$("theme-toggle").addEventListener("click", () => {
  const theme =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setPageTheme(theme);
  try {
    localStorage.setItem("game-ui.theme", theme);
  } catch {
    /* The current visit still works. */
  }
});

const integration = `import './action-credits.js';

const panel = document.querySelector('action-credits');
panel.variant = 'grid';
panel.heading = 'Let’s get you started.';

// Load actions from your authenticated application server.
panel.actions = await loadRewardActions();

panel.addEventListener('action-request', async ({ detail }) => {
  // Your app starts the action or checks its trusted evidence.
  // The server owns eligibility, reward amounts, and deduplication.
  await requestRewardAction(detail.actionId);
  panel.actions = await loadRewardActions();
});

panel.addEventListener('continue', () => {
  navigateToYourProduct();
});`;
$("integration-code").textContent = integration;
const copyState = new WeakMap();
async function copy(text, button, confirmation) {
  try {
    await navigator.clipboard.writeText(text);
    const previous = copyState.get(button);
    const original = previous?.original ?? button.textContent;
    if (previous) clearTimeout(previous.timer);
    button.textContent = "Copied ✓";
    const timer = setTimeout(() => {
      button.textContent = original;
      copyState.delete(button);
    }, 1600);
    copyState.set(button, { original, timer });
    notify(confirmation);
  } catch {
    notify("Copy is unavailable here. Select and copy the text directly.");
  }
}
$("copy-code").addEventListener("click", (event) =>
  copy(integration, event.currentTarget, "Integration example copied."),
);
$("copy-prompt").addEventListener("click", (event) =>
  copy(
    $("skill-prompt").textContent,
    event.currentTarget,
    "Skill prompt copied.",
  ),
);
$("open-install").addEventListener("click", () =>
  $("install-dialog").showModal(),
);
$("close-install").addEventListener("click", () => $("install-dialog").close());
$("install-dialog").addEventListener("click", (event) => {
  if (event.target === $("install-dialog")) {
    const rect = event.target.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      event.target.close();
  }
});

try {
  const response = await fetch("./project.json");
  if (response.ok) {
    const config = await response.json();
    document.querySelectorAll("[data-repo]").forEach((link) => {
      link.href = config.repositoryUrl;
    });
    document.querySelectorAll("[data-repo-path]").forEach((link) => {
      link.href = config.repositoryUrl + link.dataset.repoPath;
    });
  }
} catch {
  /* Static GitHub links remain functional if metadata is unavailable. */
}
