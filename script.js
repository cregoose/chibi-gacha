const rollsElement = document.getElementById("rolls");
const rollButton = document.getElementById("rollButton");
const resultElement = document.getElementById("result");
const collectionElement = document.getElementById("collection");
const machineVisual = document.getElementById("machineVisual");

if (rollsElement) {
    rollsElement.textContent = gameState.rolls;
}

function roll() {
    if (gameState.rolls <= 0) {
        showCustomAlert("У тебя закончились крутки!");
        return;
    }

    rollButton.disabled = true;
    resultElement.innerHTML = `<div class="placeholder">?</div>`;
    machineVisual.classList.add("shake");

    setTimeout(() => {
        machineVisual.classList.remove("shake");
        resultElement.innerHTML = `<div class="spark">✨</div>`;

        setTimeout(() => {
            const droppedItem = getRandomItem();

            if (!droppedItem) {
                rollButton.disabled = false;
                return;
            }

            gameState.rolls--;
            gameState.totalRolls++;
            gameState.pityRolls = (gameState.pityRolls || 0) + 1;

            // Засчитываем прогресс заданий на крутки
            updateRollTasksProgress();

           // Проверка дубликатов
            const isDuplicate = droppedItem.type === "chibi_bundle"
                ? gameState.collection.some(item => item.sourceId === droppedItem.id)
                : gameState.collection.some(item => item.id === droppedItem.id);

            if (isDuplicate) {
                gameState.duplicateCount = (gameState.duplicateCount || 0) + 1;
                gameState.legendaryBonus += LEGENDARY_BONUS_PER_DUPLICATE;
            }

            // При выпадении легендарки СБРАСЫВАЕМ И БОНУС, И СЧЁТЧИК ПОВТОРЕК
            if (droppedItem.rarity === "legendary") {
                gameState.legendaryBonus = 0;
                gameState.duplicateCount = 0;
                gameState.pityRolls = 0;
            }

            if (!gameState.history) gameState.history = [];

            if (droppedItem.type === "chibi_bundle") {
                Object.values(droppedItem.equipped).forEach(itemId => {
                    if (!itemId) return;
                    const subItem = items.find(i => i.id === itemId);
                    if (subItem) {
                        const alreadyOwned = gameState.collection.some(c => c.id === subItem.id);
                        if (!alreadyOwned) {
                            gameState.collection.push({ ...subItem, isUnpacked: true });
                        }
                    }
                });

                const gachaChibi = {
                    id: "chibi_" + Date.now(),
                    sourceId: droppedItem.id,
                    name: droppedItem.name,
                    type: "chibi",
                    rarity: droppedItem.rarity,
                    image: droppedItem.image,
                    equipped: structuredClone(droppedItem.equipped),
                    fromGacha: true,
                    isCustom: false
                };

                gameState.collection.push(gachaChibi);
                gameState.history.push({
                    name: gachaChibi.name,
                    image: gachaChibi.image,
                    rarity: gachaChibi.rarity,
                    isCustom: false,
                    isUnpacked: false
                });
            } else {
                gameState.collection.push(droppedItem);
                gameState.history.push({
                    name: droppedItem.name,
                    image: droppedItem.image,
                    rarity: droppedItem.rarity,
                    isCustom: false,
                    isUnpacked: false
                });
            }

            saveGameState();

            rollsElement.textContent = gameState.rolls;
            resultElement.innerHTML = `
                <div class="item-result">
                    <img src="${droppedItem.image}" alt="${droppedItem.name}" class="result-img">
                    <h2>${droppedItem.name}</h2>
                    <p>${droppedItem.rarity}</p>
                </div>
            `;

            updateCollection();
            updateHistoryUI();
            updatePityUI();

            if (typeof renderDay === "function") {
                renderDay();
            }

            rollButton.disabled = false;
        }, 500);
    }, 700);
}

function updateCollection() {
    if (!collectionElement) return;
    collectionElement.innerHTML = "";

    const rollsOnly = gameState.collection.filter(item => !item.isCustom && !item.isUnpacked);
    const recentHistory = [...rollsOnly].slice(-10).reverse();

    if (recentHistory.length === 0) {
        collectionElement.textContent = "Пока здесь ничего нет...";
        return;
    }

    recentHistory.forEach(item => {
        const element = document.createElement("div");
        element.className = "collection-card";
        element.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="thumb-img">
            <span>${item.name} — ${item.rarity}</span>
        `;
        collectionElement.appendChild(element);
    });
}

function updateHistoryUI() {
    const historyContainer = document.getElementById("history-list");
    if (!historyContainer) return;

    historyContainer.innerHTML = "";

    const sourceList = gameState.history || gameState.collection;
    const visibleHistory = sourceList.filter(item => !item.isCustom && !item.isUnpacked);

    visibleHistory.forEach(item => {
        const el = document.createElement("div");
        el.className = "history-item";
        el.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <span>${item.name} — ${item.rarity}</span>
        `;
        historyContainer.appendChild(el);
    });
}

if (rollButton) {
    rollButton.addEventListener("click", roll);
}

if (collectionElement) {
    updateCollection();
}