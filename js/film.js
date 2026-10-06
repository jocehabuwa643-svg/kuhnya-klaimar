const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".dots button")];
const counter = document.querySelector(".count");
const prev = document.querySelector("[data-prev]");
const next = document.querySelector("[data-next]");
let index = 0;
let wheelLock = false;

function show(n) {
  index = Math.max(0, Math.min(slides.length - 1, n));
  slides.forEach((slide, i) => {
    const on = i === index;
    slide.classList.toggle("on", on);
    slide.setAttribute("aria-hidden", on ? "false" : "true");
    slide.scrollTop = 0;
  });
  dots.forEach((dot, i) => {
    if (i === index) dot.setAttribute("aria-current", "true");
    else dot.removeAttribute("aria-current");
  });
  counter.textContent = `0${index + 1} / 09`;
  prev.disabled = index === 0;
  next.disabled = index === slides.length - 1;
  document.querySelectorAll("video").forEach((video) => {
    video.pause();
  });
  document.querySelectorAll("[data-play]").forEach((button) => {
    button.hidden = false;
  });
}

document.querySelector(".dots").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  show(dots.indexOf(button));
});
prev.addEventListener("click", () => show(index - 1));
next.addEventListener("click", () => show(index + 1));

document.addEventListener("click", (event) => {
  const play = event.target.closest("[data-play]");
  if (play) {
    const video = play.parentElement.querySelector("video");
    const mute = play.parentElement.querySelector("[data-mute]");
    video.muted = mute.dataset.muted === "1";
    video.play().then(() => {
      play.hidden = true;
    }).catch(() => {
      play.textContent = "Схема, не обмер";
    });
  }
  const mute = event.target.closest("[data-mute]");
  if (mute) {
    const video = mute.parentElement.querySelector("video");
    const turningOff = mute.dataset.muted !== "1";
    mute.dataset.muted = turningOff ? "1" : "0";
    video.muted = turningOff;
    mute.textContent = turningOff ? "Звук" : "Без звука";
    mute.setAttribute("aria-pressed", turningOff ? "true" : "false");
  }
});

let origin = null;
const stage = document.querySelector(".stage");
stage.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button, a")) return;
  origin = { x: event.clientX, y: event.clientY };
});
stage.addEventListener("pointerup", (event) => {
  if (!origin) return;
  const dx = event.clientX - origin.x;
  const dy = event.clientY - origin.y;
  origin = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 48) return;
  if (Math.abs(dy) >= Math.abs(dx)) show(index + (dy < 0 ? 1 : -1));
  else show(index + (dx < 0 ? 1 : -1));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();
    show(index + 1);
  }
  if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    show(index - 1);
  }
});
window.addEventListener("wheel", (event) => {
  if (wheelLock || Math.abs(event.deltaY) < 28) return;
  wheelLock = true;
  show(index + (event.deltaY > 0 ? 1 : -1));
  window.setTimeout(() => {
    wheelLock = false;
  }, 700);
}, { passive: true });

show(0);
