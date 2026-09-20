// --- Настройки и шансы гачи ---
const firstFiveRarities = ["rare", "legendary", "rare", "common", "rare"];
const BASE_LEGENDARY_CHANCE = 3;
const RARE_CHANCE = 37;
const DUPLICATE_CHANCE = 0.03;
const LEGENDARY_BONUS_PER_DUPLICATE = 3;

// --- Список дней и заданий ---
const taskDays = [
    {
        day: 1,
        dailyRolls: 10,
        tasks: [
            { id: "draw-cat", title: "Нарисуй кота", description: "Нарисуй любого кота на холсте.", reward: 2, type: "page", page: "draw-cat.html" },
            { id: "roll-once-day-1", title: "Сделай одну крутку", description: "Сделай хотя бы одну крутку.", reward: 1, type: "roll", requiredRolls: 1 },
            { id: "name-chibi", title: "Дай имя чибику", description: "Выбери одного чибика и дай ему имя.", reward: 1, type: "auto" }
        ]
    },
    {
        day: 2,
        dailyRolls: 5,
        tasks: [
            { id: "aiku-command", title: "Напиши одну команду Айку", description: "Напиши Айку любую команду.", reward: 2, type: "manual" },
            { id: "roll-once-day-2", title: "Сделай одну крутку", description: "Сделай хотя бы одну крутку.", reward: 1, type: "roll", requiredRolls: 1 },
            { id: "change-accessory", title: "Смени один аксессуар", description: "Поменяй аксессуар у чибика.", reward: 1, type: "auto" }
        ]
    },
    {
        day: 3,
        dailyRolls: 5,
        tasks: [
            { id: "save-chibi-png", title: "Сохрани одного чибика в PNG", description: "Сохрани созданного чибика в формате PNG.", reward: 2, type: "auto" },
            { id: "roll-once-day-3", title: "Сделай одну крутку", description: "Сделай хотя бы одну крутку.", reward: 1, type: "roll", requiredRolls: 1 },
            { id: "create-new-chibi", title: "Создай нового чиби", description: "Собери нового чибика.", reward: 1, type: "auto" }
        ]
    },
    {
        day: 4,
        dailyRolls: 5,
        tasks: [
            { id: "draw-frog", title: "Нарисуй лягушку", description: "Нарисуй любую лягушку на холсте.", reward: 2, type: "page", page: "draw-frog.html" },
            { id: "roll-once-day-4", title: "Сделай одну крутку", description: "Сделай хотя бы одну крутку.", reward: 1, type: "roll", requiredRolls: 1 },
            { id: "send-letter", title: "Отправь письмо", description: "Напиши и отправь письмо.", reward: 1, type: "page", page: "mail.html?type=send" }
        ]
    },
    {
        day: 5,
        dailyRolls: 5,
        tasks: [
            { id: "pop-balloons", title: "Лопни шарики", description: "Лопни все шарики за минуту.", reward: 2, type: "manual" },
            { id: "roll-once-day-5", title: "Сделай одну крутку", description: "Сделай хотя бы одну крутку.", reward: 1, type: "roll", requiredRolls: 1 },
            { id: "change-emotion", title: "Поменяй эмоцию чибику", description: "Выбери другую эмоцию.", reward: 1, type: "auto" }
        ]
    },
    {
        day: 6,
        dailyRolls: 5,
        tasks: [
            { id: "draw-giraffe", title: "Нарисуй жирафа", description: "Нарисуй жирафа на холсте.", reward: 2, type: "page", page: "draw-giraffe.html" },
            { id: "roll-once-day-6", title: "Сделай одну крутку", description: "Сделай хотя бы одну крутку.", reward: 1, type: "roll", requiredRolls: 1 },
            { id: "read-letter", title: "Прочитай письмо", description: "Открой полученное письмо.", reward: 1, type: "page", page: "mail.html?type=receive" }
        ]
    },
    {
        day: 7,
        dailyRolls: 10,
        tasks: [
            { id: "roll-ten-times", title: "Сделай 10 круток", description: "Сделай десять круток.", reward: 2, type: "roll", requiredRolls: 10 },
            { id: "roll-five-times", title: "Сделай 5 круток", description: "Сделай пять круток.", reward: 1, type: "roll", requiredRolls: 5 },
            { id: "roll-once-day-7", title: "Сделай одну крутку", description: "Сделай хотя бы одну крутку.", reward: 1, type: "roll", requiredRolls: 1 }
        ]
    }
];

// --- Состояние игры ---
const defaultGameState = {
    rolls: 0,
    totalRolls: 0,
    pityRolls: 0,
    unlockedDay: 1,
    firstLoginTimestamp: null,
    collection: [],
    completedTasks: [],
    duplicateCount: 0,
    legendaryBonus: 0,
    equipped: {
        body: null,
        eyes: null,
        emotion: null,
        top: null,
        bottom: null,
        shoes: null,
        hair: null,
        handItem: null,
        accessory: null
    },
    claimedDailyRolls: [],
    drawings: {
        cat: null,
        frog: null,
        giraffe: null
    },
    taskProgress: {
        rollTasks: {}
    }
};

function loadGameState() {
    const savedGame = localStorage.getItem("chibiGachaSave");
    let state = structuredClone(defaultGameState);

    if (savedGame) {
        const parsed = JSON.parse(savedGame);
        state = {
            ...defaultGameState,
            ...parsed,
            unlockedDay: parsed.unlockedDay || 1,
            equipped: {
                ...defaultGameState.equipped,
                ...(parsed.equipped || {})
            },
            drawings: {
                ...defaultGameState.drawings,
                ...(parsed.drawings || {})
            },
            taskProgress: {
                ...defaultGameState.taskProgress,
                ...(parsed.taskProgress || {}),
                rollTasks: {
                    ...defaultGameState.taskProgress?.rollTasks,
                    ...(parsed.taskProgress?.rollTasks || {})
                }
            }
        };
    }

    return state;
}

let gameState = loadGameState();

function updatePityUI() {
    const pityFill = document.getElementById("pityFill");
    if (!pityFill) return; // Нужен только сам элемент закрашивания

    const duplicates = gameState.duplicateCount || 0;
    // Расчет на 20 повторок (100% ширины при 20 повторках)
    const fillPercent = Math.min((duplicates / 10) * 100, 100);
    pityFill.style.width = fillPercent + "%";

    // Опциональное обновление текста, если элементы есть на странице
    const pityCount = document.getElementById("pityCount");
    if (pityCount) pityCount.textContent = duplicates;

    const pityChance = document.getElementById("pityChance");
    if (pityChance) {
        const bonus = gameState.legendaryBonus || 0;
        pityChance.textContent = Math.min(BASE_LEGENDARY_CHANCE + bonus, 20);
    }
}

function updateUnlockedDay() {
    if (!gameState.firstLoginTimestamp) {
        gameState.firstLoginTimestamp = Date.now();
    }
    
    const firstDate = new Date(gameState.firstLoginTimestamp);
    firstDate.setHours(0, 0, 0, 0);
    
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    const diffTime = currentDate.getTime() - firstDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    gameState.unlockedDay = Math.max(1, diffDays + 1);
    saveGameState();
}

function checkAndClaimDailyRolls() {
    const currentUnlocked = gameState.unlockedDay || 1;
    let changed = false;

    taskDays.forEach(dayGroup => {
        if (dayGroup.day <= currentUnlocked && !gameState.claimedDailyRolls.includes(dayGroup.day)) {
            gameState.rolls += dayGroup.dailyRolls;
            gameState.claimedDailyRolls.push(dayGroup.day);
            changed = true;
        }
    });

    if (changed) {
        saveGameState();
    }
}

function saveGameState() {
    localStorage.setItem("chibiGachaSave", JSON.stringify(gameState));
}

function resetGameState() {
    gameState = structuredClone(defaultGameState);
    checkAndClaimDailyRolls();
    saveGameState();
    updatePityUI();
}

function setUnlockedDay(dayNumber) {
    gameState.unlockedDay = Math.max(1, dayNumber);
    checkAndClaimDailyRolls();
    saveGameState();
    if (typeof renderDay === "function") {
        renderDay();
    }
}

function unlockNextDay() {
    setUnlockedDay((gameState.unlockedDay || 1) + 1);
}

function updateRollTasksProgress() {
    const currentUnlocked = gameState.unlockedDay || 1;
    let progressChanged = false;

    taskDays.forEach(dayGroup => {
        if (dayGroup.day <= currentUnlocked) {
            dayGroup.tasks.forEach(task => {
                if (task.type === "roll" && !gameState.completedTasks.includes(task.id)) {
                    if (!gameState.taskProgress) gameState.taskProgress = { rollTasks: {} };
                    if (!gameState.taskProgress.rollTasks) gameState.taskProgress.rollTasks = {};

                    const current = gameState.taskProgress.rollTasks[task.id] || 0;
                    gameState.taskProgress.rollTasks[task.id] = current + 1;
                    progressChanged = true;
                }
            });
        }
    });

    if (progressChanged) {
        saveGameState();
    }
}

// --- Логика генерации предметов ---
function getRandomRarity() {
    if (gameState.totalRolls < firstFiveRarities.length) {
        return firstFiveRarities[gameState.totalRolls];
    }

    // Проверка условий гаранта: 35 круток ИЛИ 10 повторок
    if ((gameState.pityRolls || 0) >= 35 || (gameState.duplicateCount || 0) >= 10) {
        return "legendary";
    }

    const legendaryChance = Math.min(
        BASE_LEGENDARY_CHANCE + (gameState.legendaryBonus || 0),
        20
    );
    const rareChance = RARE_CHANCE;
    const random = Math.random() * 100;

    if (random < legendaryChance) return "legendary";
    if (random < legendaryChance + rareChance) return "rare";
    return "common";
}

function getOwnedItemsByRarity(rarity) {
    const pool = items.filter(item => item.inGachaPool !== false && item.rarity === rarity);
    return pool.filter(poolItem => {
        if (poolItem.type === "chibi_bundle") {
            return gameState.collection.some(collectionItem => collectionItem.sourceId === poolItem.id);
        }
        return gameState.collection.some(collectionItem => collectionItem.id === poolItem.id);
    });
}

function getNewItemsByRarity(rarity) {
    const pool = items.filter(item => item.inGachaPool !== false && item.rarity === rarity);
    return pool.filter(poolItem => {
        if (poolItem.type === "chibi_bundle") {
            return !gameState.collection.some(collectionItem => collectionItem.sourceId === poolItem.id);
        }
        return !gameState.collection.some(collectionItem => collectionItem.id === poolItem.id);
    });
}

function getRandomItem() {
    const rarity = getRandomRarity();
    const pool = items.filter(item => item.inGachaPool !== false && item.rarity === rarity);

    if (pool.length === 0) {
        console.error(`Нет предметов редкости ${rarity}`);
        return null;
    }

    const ownedItems = getOwnedItemsByRarity(rarity);
    const newItems = getNewItemsByRarity(rarity);

    if (Math.random() < DUPLICATE_CHANCE && ownedItems.length > 0) {
        return ownedItems[Math.floor(Math.random() * ownedItems.length)];
    }

    if (newItems.length > 0) {
        return newItems[Math.floor(Math.random() * newItems.length)];
    }

    return pool[Math.floor(Math.random() * pool.length)];
}

function showCustomAlert(message) {
    let overlay = document.getElementById("customAlertOverlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "customAlertOverlay";
        overlay.className = "custom-modal-overlay";
        overlay.innerHTML = `
            <div class="custom-modal-box">
                <p id="customAlertText"></p>
                <button id="customAlertBtn">ОК</button>
            </div>
        `;
        document.body.appendChild(overlay);

        const btn = overlay.querySelector("#customAlertBtn");
        btn.addEventListener("click", () => {
            overlay.classList.remove("active");
        });
    }

    document.getElementById("customAlertText").textContent = message;
    overlay.classList.add("active");
}

function checkAndCompleteTask(taskId) {
    let taskDayNumber = 1;
    let targetTask = null;

    for (const dayGroup of taskDays) {
        const found = dayGroup.tasks.find(t => t.id === taskId);
        if (found) {
            taskDayNumber = dayGroup.day;
            targetTask = found;
            break;
        }
    }

    if (!targetTask) return false;
    if (gameState.completedTasks.includes(taskId)) return false;
    if ((gameState.unlockedDay || 1) < taskDayNumber) return false;

    gameState.completedTasks.push(taskId);
    gameState.rolls += targetTask.reward;
    saveGameState();

    showCustomAlert(`Задание "${targetTask.title}" выполнено! Получено ${targetTask.reward} крутки.`);
    
    if (typeof renderDay === "function") {
        renderDay();
    }

    return true;
}

function isTaskAvailableAndIncomplete(taskId) {
    if (gameState.completedTasks.includes(taskId)) return false;
    let taskDayNumber = 1;
    for (const dayGroup of taskDays) {
        if (dayGroup.tasks.some(t => t.id === taskId)) {
            taskDayNumber = dayGroup.day;
            break;
        }
    }
    return (gameState.unlockedDay || 1) >= taskDayNumber;
}

function showTutorialStep(targetElement) {
    hideTutorial();
    if (!targetElement) return;

    const overlay = document.createElement("div");
    overlay.id = "tutorialOverlay";
    overlay.className = "tutorial-overlay";

    document.body.appendChild(overlay);
    targetElement.classList.add("tutorial-highlight");
}

function hideTutorial() {
    const overlay = document.getElementById("tutorialOverlay");
    if (overlay) overlay.remove();
    document.querySelectorAll(".tutorial-highlight").forEach(el => {
        el.classList.remove("tutorial-highlight");
    });
}

function startChibiSaveTutorial() {
    sessionStorage.setItem("activeTutorial", "save-chibi-png");
    sessionStorage.setItem("tutorialStep", "nav-collection");
}

// --- Инициализация при старте страницы ---
updateUnlockedDay();
checkAndClaimDailyRolls();
updatePityUI();