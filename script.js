/* =========================
   script.js (FULL FILE)
   ========================= */

const MET_DATE = new Date("2024-09-02T00:00:00+05:30");

// ✅ Paste your FULL Drive folder share link here
const ALBUM_URL = "https://drive.google.com/drive/folders/14hD-JV17sOe1avhsVTLbqN5JZt3GtfY8?usp=sharing";

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

// ---- Album gating (Drive folder => open new tab) ----
document.getElementById("openAlbumBtn").addEventListener("click", () => {
  const entered = prompt("Passcode (hint: something only you and I know 💗)");
  if (!entered) return;

  if (entered !== PASSCODE) {
    openModal("Oops 🙈", `<p class="muted">Wrong passcode. Try again, Emy 💗</p>`);
    return;
  }

  if (!ALBUM_URL || !ALBUM_URL.includes("/folders/")) {
    openModal(
      "Album link missing",
      `<p class="muted">Your Drive folder link is missing or incomplete.</p>
       <p class="muted">It should look like:</p>
       <p><code>https://drive.google.com/drive/folders/FOLDER_ID?usp=sharing</code></p>`
    );
    return;
  }

  // ✅ Most reliable: open the Drive folder in new tab
  const win = window.open(ALBUM_URL, "_blank", "noopener,noreferrer");

  if (!win) {
    openModal(
      "Pop-up blocked 🙈",
      `<p class="muted">Your browser blocked the album tab.</p>
       <p class="muted">Allow popups for this site, then tap “Open Album” again 💗</p>`
    );
    return;
  }

  openModal("Our Album 📸", `<p class="muted">Opened the album in a new tab 💗</p>`);
});

document.getElementById("howItWorksBtn").addEventListener("click", () => {
  openModal("How it works", `
    <div class="muted" style="line-height:1.6">
      <p><b>Photos are not stored on GitHub.</b> The site only opens your Google Drive folder link.</p>
      <p>Google Drive folders usually can’t be embedded, so we open it in a new tab after the passcode.</p>
      <p><b>Make sure sharing is:</b> “Anyone with the link (Viewer)”</p>
    </div>
  `);
});

// ---- Cute cartoon hearts ----
const hearts = document.getElementById("hearts");
function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";
  const size = 14 + Math.random() * 20;
  h.style.width = size + "px";
  h.style.height = size + "px";
  h.style.left = Math.random() * 100 + "vw";
  h.style.animationDuration = (7 + Math.random() * 7) + "s";
  hearts.appendChild(h);
  setTimeout(() => h.remove(), 16000);
}
setInterval(spawnHeart, 260);
