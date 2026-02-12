/* =========================
   script.js (FULL FILE)
   ========================= */

// ---- Settings you should edit ----
const MET_DATE = new Date("2024-09-02T00:00:00+05:30"); // Sept 2, 2024 (India time)
const ALBUM_URL = ""; // Paste your Google Photos shared album / Drive folder link here
const PASSCODE = "CAALINE";

// ---- Landing logic ----
const landing = document.getElementById("landing");
const main = document.getElementById("main");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const noHint = document.getElementById("noHint");

yesBtn.addEventListener("click", () => {
  landing.classList.remove("active");
  main.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const noLines = [
  "Okay but… are you sure? 😌",
  "Emy pleaseeee 😭💗",
  "That button is for decoration 😇",
  "Try the other one… just once 🙈",
  "Plot twist: ‘No’ is disabled in my heart 💘"
];
let noIndex = 0;

// Android-friendly: pointer events
noBtn.addEventListener("pointerenter", () => {
  const dx = (Math.random() * 110) - 55;
  const dy = (Math.random() * 60) - 30;
  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
});

noBtn.addEventListener("click", () => {
  noHint.textContent = noLines[noIndex++ % noLines.length];
});

// ---- Navigation ----
document.querySelectorAll(".navbtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const id = btn.dataset.go;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ---- Counter ----
const dEl = document.getElementById("days");
const hEl = document.getElementById("hours");
const mEl = document.getElementById("mins");
const sEl = document.getElementById("secs");

function tick() {
  const now = new Date();
  const diff = now - MET_DATE;

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  dEl.textContent = Number.isFinite(days) ? days : "—";
  hEl.textContent = Number.isFinite(hours) ? hours : "—";
  mEl.textContent = Number.isFinite(mins) ? mins : "—";
  sEl.textContent = Number.isFinite(secs) ? secs : "—";
}
setInterval(tick, 1000);
tick();

// ---- Modal ----
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const modalTitle = document.getElementById("modalTitle");
document.getElementById("closeModal").addEventListener("click", closeModal);

function openModal(title, html) {
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.classList.add("show");
}

function closeModal() {
  modal.classList.remove("show");
  modalBody.innerHTML = "";
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ---- Album gating (best-effort privacy) ----
document.getElementById("openAlbumBtn").addEventListener("click", () => {
  const entered = prompt("Passcode (hint: something only you and I know 💗)");
  if (!entered) return;

  if (entered === PASSCODE) {
    if (!ALBUM_URL) {
      openModal(
        "Album",
        `<p class="muted">You haven’t set the album link yet. Update <b>ALBUM_URL</b> in <code>script.js</code>.</p>`
      );
      return;
    }

    openModal("Our Album 📸", `<iframe src="${ALBUM_URL}" allow="autoplay"></iframe>`);
  } else {
    openModal("Oops 🙈", `<p class="muted">Wrong passcode. Try again, Emy 💗</p>`);
  }
});

document.getElementById("howItWorksBtn").addEventListener("click", () => {
  openModal("How it works", `
    <div class="muted" style="line-height:1.6">
      <p><b>Photos are not stored on GitHub.</b> The site only opens a private album link.</p>
      <p><b>Best convenience:</b> Google Photos shared album set to “Anyone with the link”.</p>
      <p><b>Best privacy:</b> Share only with her Google account — but it may require login and may not open nicely in an iframe.</p>
      <p>This passcode prompt is a “keep it private-ish” layer, not hardcore security.</p>
    </div>
  `);
});

// ---- Cute cartoon hearts ----
const hearts = document.getElementById("hearts");

function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";

  const size = 14 + Math.random() * 20; // 14..34
  h.style.width = size + "px";
  h.style.height = size + "px";

  h.style.left = Math.random() * 100 + "vw";
  h.style.animationDuration = (7 + Math.random() * 7) + "s";

  const tint = Math.floor(Math.random() * 3);
  if (tint === 1) {
    h.style.filter = "drop-shadow(0 10px 18px rgba(30,20,40,.14)) hue-rotate(35deg)";
  } else if (tint === 2) {
    h.style.filter = "drop-shadow(0 10px 18px rgba(30,20,40,.14)) hue-rotate(120deg)";
  }

  hearts.appendChild(h);
  setTimeout(() => h.remove(), 16000);
}

setInterval(spawnHeart, 260);
