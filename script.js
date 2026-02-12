/* =========================
   script.js (FULL FILE)
   ========================= */

// ---- Settings you should edit ----
const MET_DATE = new Date("2024-09-02T00:00:00+05:30"); // Sept 2, 2024 (India time)

// ✅ Paste your FULL Drive folder share link here (no extra spaces)
const ALBUM_URL = "https://drive.google.com/drive/folders/8?usp=sharing";

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
const closeBtn = document.getElementById("closeModal");

closeBtn?.addEventListener("click", closeModal);

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
  if (!url) return "";
  // remove hidden spaces/newlines
  const cleaned = String(url).trim().replace(/\s+/g, "");
  return cleaned;
}

function isProbablyValidDriveFolder(url) {
  // Keep this loose on purpose since you may mask IDs
  const u = sanitizeUrl(url);
  return u.startsWith("https://drive.google.com/drive/folders/");
}

function openAlbumUrl(url) {
  const finalUrl = sanitizeUrl(url);

  // Try new tab first (best UX)
  const win = window.open(finalUrl, "_blank", "noopener,noreferrer");

  // If blocked (common on Android), fallback to same-tab navigation
  if (!win) {
    window.location.href = finalUrl;
    return { openedNewTab: false };
  }
  return { openedNewTab: true };
}

// ---- Album gating (works on Android + GitHub Pages) ----
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

  if (!url) {
    openModal(
      "Album link missing",
      `<p class="muted">ALBUM_URL is empty in <code>script.js</code>.</p>
       <p class="muted">Paste your Google Drive folder share link there.</p>`
    );
    return;
  }

  // Even if your ID is masked, don't block the user if it works.
  if (!isProbablyValidDriveFolder(url)) {
    openModal(
      "Check your link",
      `<p class="muted">This doesn’t look like a Drive folder link:</p>
       <p style="word-break:break-all"><code>${url}</code></p>
       <p class="muted">Still, I’ll try opening it. If it fails, re-copy the folder share link from Drive.</p>
       <div style="margin-top:12px" class="btn-row">
         <button class="btn primary" id="tryOpenAnyway">Open anyway</button>
       </div>`
    );

    // attach handler after modal renders
    setTimeout(() => {
      const btn = document.getElementById("tryOpenAnyway");
      btn?.addEventListener("click", () => {
        closeModal();
        openAlbumUrl(url);
      });
    }, 0);

    return;
  }

  // Open it (new tab if allowed, otherwise same tab)
  const result = openAlbumUrl(url);

  // Also provide a clickable fallback link in case popup blocked or user wants to tap
  openModal(
    "Our Album 📸",
    `<p class="muted">
       ${result.openedNewTab ? "Opened the album in a new tab 💗" : "Opening the album now… 💗"}
     </p>
     <p class="muted small">If nothing opened, tap the link below:</p>
     <p style="word-break:break-all">
       <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
     </p>`
  );
});

howBtn?.addEventListener("click", () => {
  openModal("How it works", `
    <div class="muted" style="line-height:1.6">
      <p><b>Photos are not stored on GitHub.</b> The site only opens your Google Drive folder link.</p>
      <p><b>After passcode:</b> we open the folder in a new tab (or same tab if popups are blocked).</p>
      <p><b>Sharing must be:</b> “Anyone with the link (Viewer)” or she must be logged into the permitted Google account.</p>
    </div>
  `);
});

// ---- Cute cartoon hearts ----
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
