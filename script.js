/* =========================
   script.js (FULL FILE)
   ========================= */

// ---- Settings you should edit ----
const MET_DATE = new Date("2024-09-02T00:00:00+05:30"); // Sept 2, 2024 (India time)

// ✅ IMPORTANT: Paste the *exact* Drive share link you copied (do NOT remove anything)
// It may contain resourcekey=... which Android needs.
const ALBUM_URL = "https://drive.google.com/drive/folders/14hD-JV17sOe1avhsVTLbqN5JZt3GtfY8?usp=sharing";

const PASSCODE = "CAALINE";

// ---- Landing logic ----
const landing = document.getElementById("landing");
const main = document.getElementById("main");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const noHint = document.getElementById("noHint");

yesBtn?.addEventListener("click", () => {
  landing?.classList.remove("active");
  main?.classList.add("active");
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

noBtn?.addEventListener("pointerenter", () => {
  const dx = (Math.random() * 110) - 55;
  const dy = (Math.random() * 60) - 30;
  noBtn.style.transform = `translate(${dx}px, ${dy}px)`;
});

noBtn?.addEventListener("click", () => {
  if (noHint) noHint.textContent = noLines[noIndex++ % noLines.length];
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

  if (dEl) dEl.textContent = Number.isFinite(days) ? String(days) : "—";
  if (hEl) hEl.textContent = Number.isFinite(hours) ? String(hours) : "—";
  if (mEl) mEl.textContent = Number.isFinite(mins) ? String(mins) : "—";
  if (sEl) sEl.textContent = Number.isFinite(secs) ? String(secs) : "—";
}
setInterval(tick, 1000);
tick();

// ---- Modal ----
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const modalTitle = document.getElementById("modalTitle");
document.getElementById("closeModal")?.addEventListener("click", closeModal);

function openModal(title, html) {
  if (!modal || !modalTitle || !modalBody) return;
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.classList.add("show");
}

function closeModal() {
  if (!modal || !modalBody) return;
  modal.classList.remove("show");
  modalBody.innerHTML = "";
}

modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// ---- Helpers ----
function sanitizeUrl(url) {
  // Trim only; do NOT delete query params like resourcekey
  return String(url || "").trim();
}

function openUrlBestEffort(url) {
  const finalUrl = sanitizeUrl(url);

  // 1) Try opening new tab
  const win = window.open(finalUrl, "_blank", "noopener,noreferrer");

  // 2) If popup blocked, open same tab
  if (!win) {
    window.location.href = finalUrl;
    return { openedNewTab: false, finalUrl };
  }

  return { openedNewTab: true, finalUrl };
}

// ---- Album gating (keeps exact Drive link) ----
document.getElementById("openAlbumBtn")?.addEventListener("click", () => {
  const entered = prompt("Passcode (hint: something only you and I know 💗)");
  if (!entered) return;

  if (entered !== PASSCODE) {
    openModal("Oops 🙈", `<p class="muted">Wrong passcode. Try again, Emy 💗</p>`);
    return;
  }

  const url = sanitizeUrl(ALBUM_URL);

  if (!url) {
    openModal(
      "Album link missing",
      `<p class="muted">Set <b>ALBUM_URL</b> in <code>script.js</code>.</p>`
    );
    return;
  }

  // Open and also show a tap fallback link in case Android does something weird
  const res = openUrlBestEffort(url);

  openModal(
    "Our Album 📸",
    `<p class="muted">${res.openedNewTab ? "Opened the album in a new tab 💗" : "Opening the album now… 💗"}</p>
     <p class="muted small">If Android shows an error after choosing an account, your copied link likely contains a <b>resourcekey</b>. Re-copy the link from Drive and paste it exactly.</p>
     <p class="muted small">Backup tap link:</p>
     <p style="word-break:break-all">
       <a href="${res.finalUrl}" target="_blank" rel="noopener noreferrer">${res.finalUrl}</a>
     </p>`
  );
});

document.getElementById("howItWorksBtn")?.addEventListener("click", () => {
  openModal("How it works", `
    <div class="muted" style="line-height:1.6">
      <p><b>Photos are not stored on GitHub.</b> The site opens your Google Drive folder after passcode.</p>
      <p><b>Important on Android:</b> we must open the exact share link (including any <code>resourcekey</code> parameter).</p>
      <p><b>Sharing must be:</b> “Anyone with the link (Viewer)”</p>
    </div>
  `);
});

// ---- Cute hearts ----
const hearts = document.getElementById("hearts");
function spawnHeart() {
  if (!hearts) return;
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
