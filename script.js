
/* =================================
   AFSO - MAIN GAME SYSTEM
================================= */

// PLAYER DATA

let player = {
    name: "Little Explorer",
    coins: 0,
    gamesPlayed: 0
};


// LOAD SAVED PLAYER

function loadPlayer() {
    try {
        const saved = JSON.parse(localStorage.getItem("afsoPlayer"));

        if (saved && typeof saved === "object") {
            player = {
                ...player,
                ...saved
            };
        }
    } catch (error) {
        console.error("Could not load player data:", error);
    }

    updateDashboard();
}


// SAVE PLAYER

function savePlayer() {
    localStorage.setItem("afsoPlayer", JSON.stringify(player));
}


// UPDATE DASHBOARD

function updateDashboard() {
    document.querySelector(".coin-button span").textContent = player.coins;
}


// =================================
// GAME NAVIGATION
// =================================

const gameScreen = document.getElementById("gameScreen");
const gamesSection = document.getElementById("games");
const rewardsSection = document.getElementById("rewards");

const gameButtons = document.querySelectorAll(".game-card button");

gameButtons.forEach((button, index) => {

    button.addEventListener("click", () => {

        const gameName = document.querySelectorAll(".game-card h3")[index].textContent;

        if (gameName === "Memory Match") {
            openMemoryGame();
        } else {
            alert(gameName + " is coming soon! 🚀");
        }

    });

});


// PLAY NOW BUTTON

document.querySelector(".play-button").addEventListener("click", () => {
    gamesSection.scrollIntoView({ behavior: "smooth" });
});


// =================================
// MEMORY MATCH GAME
// =================================

const animals = [
    "🐻",
    "🐸",
    "🦁",
    "🐵",
    "🐼",
    "🐰",
    "🐯",
    "🐶"
];

let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let gameActive = false;
let gameCoins = 0;
let gameMoves = 0;


// OPEN MEMORY GAME

function openMemoryGame() {

    gamesSection.hidden = true;
    rewardsSection.hidden = true;
    gameScreen.hidden = false;

    document.getElementById("currentGameTitle").textContent = "Memory Match";

    player.gamesPlayed++;
    savePlayer();

    startMemoryGame();

    gameScreen.scrollIntoView({ behavior: "smooth" });
}


// START GAME

function startMemoryGame() {

    const grid = document.getElementById("memoryGrid");

    grid.innerHTML = "";

    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;
    gameCoins = 0;
    gameMoves = 0;
    gameActive = true;

    updateGameScore();

    document.getElementById("gameMessage").textContent =
        "Find all 8 matching animal pairs! 🐻";

    // Duplicate and shuffle animals

    let cards = [...animals, ...animals];

    cards.sort(() => Math.random() - 0.5);

    // CREATE CARDS

    cards.forEach((animal, index) => {

        const card = document.createElement("button");

        card.className = "memory-card";
        card.type = "button";

        card.dataset.animal = animal;

        card.setAttribute("aria-label", "Hidden animal card " + (index + 1));

        card.innerHTML = `
            <span class="card-front">${animal}</span>
            <span class="card-back">❓</span>
        `;

        card.addEventListener("click", () => {
            flipCard(card);
        });

        grid.appendChild(card);

    });

}


// FLIP CARD

function flipCard(card) {

    if (!gameActive) return;

    if (lockBoard) return;

    if (card.classList.contains("flipped")) return;

    if (card.classList.contains("matched")) return;

    card.classList.add("flipped");

    if (!firstCard) {

        firstCard = card;

        return;

    }

    secondCard = card;

    gameMoves++;

    checkMatch();

}


// CHECK MATCH

function checkMatch() {

    const match = firstCard.dataset.animal === secondCard.dataset.animal;

    if (match) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.disabled = true;
        secondCard.disabled = true;

        matchedPairs++;

        gameCoins += 5;

        document.getElementById("gameMessage").textContent =
            "Amazing! You found a match! ⭐";

        resetCards();

        updateGameScore();

        if (matchedPairs === animals.length) {
            finishMemoryGame();
        }

    } else {

        lockBoard = true;

        document.getElementById("gameMessage").textContent =
            "Oops! Try again, little explorer! 💪";

        setTimeout(() => {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            resetCards();

            document.getElementById("gameMessage").textContent =
                "Keep going! You can do it! 🌈";

        }, 1000);

    }

}


// RESET CARDS

function resetCards() {

    firstCard = null;
    secondCard = null;
    lockBoard = false;

}


// UPDATE SCORE

function updateGameScore() {

    document.getElementById("gameCoins").textContent = gameCoins;

}


// FINISH GAME

function finishMemoryGame() {

    gameActive = false;

    player.coins += gameCoins;

    savePlayer();

    updateDashboard();

    document.getElementById("gameMessage").textContent =
        "🎉 YOU DID IT! All animals matched! +" + gameCoins + " coins!";

    setTimeout(() => {

        alert(
            "🏆 AMAZING WORK!\n\n" +
            "You completed Memory Match!\n" +
            "You earned " + gameCoins + " coins!\n\n" +
            "Keep exploring AFSO! 🚀"
        );

    }, 500);

}


// =================================
// BACK TO GAMES
// =================================

document.getElementById("backToGames").addEventListener("click", () => {

    gameActive = false;

    gameScreen.hidden = true;
    gamesSection.hidden = false;
    rewardsSection.hidden = false;

    gamesSection.scrollIntoView({ behavior: "smooth" });

});


// =================================
// INITIALIZE AFSO
// =================================

loadPlayer();

console.log("🚀 AFSO Gaming World is ready!");

// AFSO WORLD NAVIGATION

function openWorld(worldName) {
    alert("Welcome to " + worldName + "! 🌍🚀");
}


function updateDashboard() {
    document.querySelector(".coin-button span").textContent = player.coins;

    document.querySelector(".profile-button").textContent = player.avatar || "🐻";

    document.getElementById("avatarDisplay").textContent = player.avatar || "🐻";

    document.getElementById("playerNameDisplay").textContent = player.name;

    document.getElementById("profileCoins").textContent = player.coins;

    document.getElementById("profileGames").textContent = player.gamesPlayed;

    document.getElementById("playerLevel").textContent =
        Math.floor(player.coins / 50) + 1;
}


// CHOOSE AVATAR
function chooseAvatar(avatar) {
    player.avatar = avatar;
    savePlayer();
    updateDashboard();
}


// SAVE PLAYER NAME
function savePlayerName() {
    const input = document.getElementById("playerNameInput");
    const name = input.value.trim();

    if (!name) {
        alert("Please enter your explorer name!");
        return;
    }

    player.name = name;
    savePlayer();
    updateDashboard();

    input.value = "";
    alert("Your explorer name has been saved! 🌟");
}

// ==============================
// AFSO ACHIEVEMENT SYSTEM
// ==============================

function updateAchievements() {

    const achievements = [
        {
            id: "firstGame",
            unlocked: player.gamesPlayed >= 1
        },
        {
            id: "coinMaster",
            unlocked: player.coins >= 50
        },
        {
            id: "memoryMaster",
            unlocked: player.memoryCompleted === true
        },
        {
            id: "superExplorer",
            unlocked: player.coins >= 100
        }
    ];

    achievements.forEach(achievement => {

        const card = document.getElementById(achievement.id);

        if (!card) return;

        const unlocked = achievement.unlocked;

        card.classList.toggle("unlocked", unlocked);

        const status = card.querySelector(".achievement-status");

        status.textContent = unlocked ? "🏆 UNLOCKED" : "🔒 LOCKED";

    });

}


// Check achievements whenever dashboard updates
const originalUpdateDashboard = updateDashboard;

updateDashboard = function() {
    originalUpdateDashboard();
    updateAchievements();
};
// AFSO DAILY CHALLENGES

let dailyChallenges = {
    date: new Date().toDateString(),
    play: false,
    memory: false,
    coins: false,
    memoryPairs: 0,
    coinsEarned: 0
};

function loadDailyChallenges() {
    const saved = localStorage.getItem("afsoDailyChallenges");

    if (saved) {
        dailyChallenges = JSON.parse(saved);
    }

    if (dailyChallenges.date !== new Date().toDateString()) {
        dailyChallenges = {
            date: new Date().toDateString(),
            play: false,
            memory: false,
            coins: false,
            memoryPairs: 0,
            coinsEarned: 0
        };
    }

    saveDailyChallenges();
    updateDailyChallenges();
}

function saveDailyChallenges() {
    localStorage.setItem(
        "afsoDailyChallenges",
        JSON.stringify(dailyChallenges)
    );
}

function updateDailyChallenges() {
    const challenges = [
        ["play", "dailyPlay", "dailyPlayStatus"],
        ["memory", "dailyMemory", "dailyMemoryStatus"],
        ["coins", "dailyCoins", "dailyCoinsStatus"]
    ];

    let completed = 0;

    challenges.forEach(([key, cardId, statusId]) => {
        const card = document.getElementById(cardId);
        const status = document.getElementById(statusId);

        if (dailyChallenges[key]) {
            completed++;
            card.classList.add("completed");
            status.textContent = "✅ COMPLETED";
        } else {
            card.classList.remove("completed");
            status.textContent = "NOT COMPLETED";
        }
    });

    document.getElementById("dailyCompleted").textContent = completed;
    document.getElementById("dailyProgressBar").style.width =
        (completed / 3 * 100) + "%";
}

function completeDailyChallenge(key, reward) {
    if (dailyChallenges[key]) return;

    dailyChallenges[key] = true;
    player.coins += reward;

    saveDailyChallenges();
    savePlayer();
    updateDashboard();
    updateDailyChallenges();
}

loadDailyChallenges();