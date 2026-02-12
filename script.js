/* =========================/* =========================
   script.js (FULL FILE)
   ========================= */

// ---- Settings you should edit ----
const MET_DATE = new Date("2024-09-02T00:00:00+05:30"); // Sept 2, 2024 (India time)

// ✅ PASTE YOUR REAL DRIVE SHARE LINK HERE (exactly as copied from Drive)
// Example:
// const ALBUM_URL = "https://drive.google.com/drive/folders/1AbC...XYZ?usp=sharing&resourcekey=0-...";
// IMPORTANT: do NOT use the masked link in production.
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
  // Keep query parameters (resourcekey etc). Only trim whitespace.
  return String(url || "").trim();
}

function openUrlBestEffort(url) {
  const finalUrl = sanitizeUrl(url);

  // Try opening new tab first
  const win = window.open(finalUrl, "_blank", "noopener,noreferrer");

  // If popup blocked, open in same tab
  if (!win) {
    window.location.href = finalUrl;
    return { openedNewTab: false };
  }
  return { openedNewTab: true };
}

// ---- Album gating (no URL shown on page) ----
const openAlbumBtn = document.getElementById("openAlbumBtn");
const howBtn = document.getElementById("howItWorksBtn");

openAlbumBtn?.addEventListener("click", () => {
  const entered = prompt("Passcode (hint: something only you and I know 💗)");
  if (!entered) return;

  if (entered !== PASSCODE) {
    openModal("Oops 🙈", `<p class="muted">Wrong passcode. Try again, Emy 💗</p>`);
    return;
  }

  const url = sanitizeUrl(ALBUM_URL);

  if (!url || url.includes("PASTE_YOUR_REAL_DRIVE_FOLDER_LINK_HERE")) {
    openModal(
      "Album link not set",
      `<p class="muted">You haven’t pasted your real Drive folder link in <code>script.js</code> yet.</p>
       <p class="muted">Set <b>ALBUM_URL</b> to the exact “Copy link” URL from Drive (keep any <code>resourcekey</code> params).</p>`
    );
    return;
  }

  // Open it now (best effort)
  const res = openUrlBestEffort(url);

  // Show a backup button (NOT the URL)
  openModal(
    "Our Album 📸",
    `
      <p class="muted">${res.openedNewTab ? "Opened in a new tab 💗" : "Opening now… 💗"}</p>
      <p class="muted small">If it didn’t open, tap the button below:</p>
      <div class="btn-row" style="margin-top:12px">
        <button class="btn primary" id="openAlbumAgainBtn">Open Album</button>
        <button class="btn ghost" id="closeAfterBtn">Close</button>
      </div>
      <p class="muted small" style="margin-top:12px">
        (We don’t display the link here to keep it private.)
      </p>
    `
  );

  // Attach handlers after modal renders
  setTimeout(() => {
    document.getElementById("openAlbumAgainBtn")?.addEventListener("click", () => {
      openUrlBestEffort(url);
    });
    document.getElementById("closeAfterBtn")?.addEventListener("click", closeModal);
  }, 0);
});

howBtn?.addEventListener("click", () => {
  openModal("How it works", `
    <div class="muted" style="line-height:1.6">
      <p><b>Photos are not stored on GitHub.</b> The site opens your Google Drive folder after the passcode.</p>
      <p><b>Android note:</b> Use the exact Drive “Copy link” URL (don’t remove parameters like <code>resourcekey</code>).</p>
      <p>This passcode prompt is a “keep it private-ish” layer, not hardcore security.</p>
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


