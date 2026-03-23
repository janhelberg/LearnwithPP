const games = ["catch", "colors", "count", "shapes", "spelling"];

const openGamesButton = document.getElementById("open-games");
const gamesPanel = document.getElementById("games-panel");
const gamesList = document.getElementById("games-list");

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
