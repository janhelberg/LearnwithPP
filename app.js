const games = ["catch", "colors", "count", "shapes", "spelling"];

const openGamesButton = document.getElementById("open-games");
const gamesPanel = document.getElementById("games-panel");
const gamesList = document.getElementById("games-list");
const installBanner = document.getElementById("install-banner");
const installBtn = document.getElementById("install-btn");
const installDismiss = document.getElementById("install-dismiss");
const installMsg = document.getElementById("install-msg");

let deferredPrompt = null;

// Catch native install prompt (Chrome/Edge — not Silk)
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installMsg.innerHTML = "Install <strong>Learn with PP</strong> as an app on this device.";
  installBtn.style.display = "inline-block";
  showInstallBanner();
});

installBtn.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      hideInstallBanner();
    }
    deferredPrompt = null;
  }
});

installDismiss.addEventListener("click", hideInstallBanner);

function showInstallBanner() {
  if (!sessionStorage.getItem("installDismissed")) {
    installBanner.classList.remove("hidden");
  }
}

function hideInstallBanner() {
  installBanner.classList.add("hidden");
  sessionStorage.setItem("installDismissed", "1");
}

// On Silk / browsers that never fire beforeinstallprompt,
// show manual instructions if not already installed (standalone check)
window.addEventListener("load", () => {
  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (!isStandalone && !deferredPrompt) {
    // Show manual "Add to Home Screen" instructions
    installBtn.style.display = "none";
    showInstallBanner();
  }
});


function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildGamesList() {
  gamesList.innerHTML = "";

  games.forEach((game) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.className = "game-link";
    link.href = `games/${game}/`;
    link.textContent = titleCase(game);
    link.setAttribute("aria-label", `Open ${titleCase(game)} game`);
    item.appendChild(link);
    gamesList.appendChild(item);
  });
}

openGamesButton.addEventListener("click", () => {
  const isHidden = gamesPanel.classList.toggle("hidden");
  openGamesButton.setAttribute("aria-expanded", String(!isHidden));
});

buildGamesList();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // Ignore registration errors for now.
    });
  });
}
