import "./components/reward-button/reward-button.js";
import "./components/xp-meter/xp-meter.js";
import "./components/milestone-celebration/milestone-celebration.js";

const $ = (id) => document.getElementById(id);
const demo = $("primitive-demo");
const pattern = document.body.dataset.pattern;
const feedback = $("demo-feedback");
const announce = (message) => { feedback.textContent = message; };

document.querySelectorAll("[data-primitive-variant]").forEach((button) => {
  button.addEventListener("click", () => {
    demo.setAttribute("variant", button.dataset.primitiveVariant);
    document.querySelectorAll("[data-primitive-variant]").forEach((option) => {
      option.setAttribute("aria-pressed", String(option === button));
    });
  });
});

$("primitive-theme").addEventListener("click", () => {
  const theme = demo.getAttribute("theme") === "dark" ? "light" : "dark";
  demo.setAttribute("theme", theme);
  $("primitive-stage").dataset.demoTheme = theme;
  $("primitive-theme").textContent = theme === "dark" ? "Dark preview" : "Light preview";
  $("primitive-theme").setAttribute("aria-label", `Switch preview to ${theme === "dark" ? "light" : "dark"} theme`);
});

if (pattern === "reward-button") {
  let generation = 0;
  let pendingTimer;
  let failNext = false;
  const state = $("reward-state");
  const cancelPending = () => {
    generation += 1;
    clearTimeout(pendingTimer);
  };
  const setState = (value) => {
    demo.status = value;
    state.value = value;
  };
  const setFailure = (value) => {
    failNext = value;
    $("reward-failure").setAttribute("aria-pressed", String(value));
    $("reward-failure").textContent = value ? "Next attempt: fail" : "Next attempt: succeed";
  };
  demo.addEventListener("reward-request", () => {
    if (!["ready", "error"].includes(demo.status)) return;
    cancelPending();
    const requestGeneration = generation;
    const shouldFail = failNext;
    setFailure(false);
    setState("pending");
    announce("Demo check in progress. Reset cancels this simulated request.");
    pendingTimer = setTimeout(() => {
      if (requestGeneration !== generation) return;
      setState(shouldFail ? "error" : "earned");
      announce(shouldFail
        ? "Simulated connection error. Use the reward button to try again."
        : "Demo complete: +25 demo XP. No account balance changed.");
    }, 850);
  });
  state.addEventListener("change", () => {
    cancelPending();
    setState(state.value);
    announce(`Previewing the ${state.value} state. This control changes presentation only.`);
  });
  $("reward-failure").addEventListener("click", () => setFailure(!failNext));
  $("primitive-reset").addEventListener("click", () => {
    cancelPending();
    setState("ready");
    setFailure(false);
    announce("Demo reset. Try the button, or make the next attempt fail.");
  });
}

if (pattern === "xp-meter") {
  const levels = [
    { threshold: 0, label: "Beginner" },
    { threshold: 100, label: "Explorer" },
    { threshold: 250, label: "Builder" },
    { threshold: 500, label: "Expert" },
  ];
  let value = 180;
  const showProgress = (next, message) => {
    value = Math.max(0, Math.min(500, next));
    demo.progress = { value, levels };
    const level = levels.filter((item) => item.threshold <= value).at(-1);
    announce(`${message} ${value} demo XP · ${level.label}.`);
    $("xp-add").disabled = value === 500;
    $("xp-subtract").disabled = value === 0;
    $("xp-max").disabled = value === 500;
  };
  showProgress(value, "Starting at");
  $("xp-add").addEventListener("click", () => showProgress(value + 75, "Progress updated:"));
  $("xp-subtract").addEventListener("click", () => showProgress(value - 50, "Correction applied:"));
  $("xp-max").addEventListener("click", () => showProgress(500, "Highest level reached:"));
  $("primitive-reset").addEventListener("click", () => showProgress(180, "Demo reset:"));
}

if (pattern === "milestone-celebration") {
  let sequence = 0;
  let lastEvent;
  const placeholder = $("celebration-placeholder");
  const syncPlaceholder = () => {
    const variant = demo.getAttribute("variant");
    placeholder.hidden = demo.visible && variant === "inline";
    placeholder.querySelector("p").textContent = demo.visible
      ? variant === "toast" ? "A little win, beside your work." : "A moment worth pausing for."
      : "Your next small win goes here.";
    placeholder.querySelector("small").textContent = demo.visible
      ? variant === "toast" ? "The toast appears at the edge of this page." : "Dismiss the dialog to keep exploring."
      : "Select a new demo milestone to try it.";
  };
  demo.addEventListener("milestone-dismiss", syncPlaceholder);
  document.querySelectorAll("[data-primitive-variant]").forEach((button) => {
    button.addEventListener("click", syncPlaceholder);
  });
  $("celebration-new").addEventListener("click", () => {
    sequence += 1;
    lastEvent = {
      id: `demo-milestone-${sequence}`,
      title: "A little win. A big step.",
      description: "Your first project is ready to share.",
      rewardLabel: "+25 demo XP",
    };
    const shown = demo.celebrate(lastEvent);
    syncPlaceholder();
    $("celebration-replay").disabled = false;
    announce(shown ? `Demo event ${sequence} shown. Replay it to test duplicate suppression.` : "This demo event was already shown.");
  });
  $("celebration-replay").addEventListener("click", () => {
    if (!lastEvent) return;
    const shown = demo.celebrate(lastEvent);
    announce(shown ? "Demo event shown." : "Repeat ignored: this event ID has already been celebrated in this component.");
  });
  $("celebration-dismiss").addEventListener("click", () => {
    demo.dismiss();
    syncPlaceholder();
    announce("Celebration dismissed. Replaying the same event still does not show it again.");
  });
  $("primitive-reset").addEventListener("click", () => {
    demo.reset();
    sequence = 0;
    lastEvent = undefined;
    syncPlaceholder();
    $("celebration-replay").disabled = true;
    announce("Demo reset. Event history is cleared for this component.");
  });
}

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  let timer;
  const original = button.textContent;
  button.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText($(button.dataset.copyTarget).textContent);
      clearTimeout(timer);
      button.textContent = "Copied ✓";
      timer = setTimeout(() => { button.textContent = original; }, 1800);
      announce("Copied. The example is ready to adapt to your app.");
    } catch {
      announce("Copy is unavailable here. Select and copy the example text directly.");
    }
  });
});
