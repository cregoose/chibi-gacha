const editorCategories = [
    { id: "all", name: "Всё" },
    { id: "body", name: "Тело" },
    { id: "eyes", name: "Лицо" },
    { id: "emotion", name: "Эмоции" },
    { id: "top", name: "Верх" },
    { id: "bottom", name: "Низ" },
    { id: "shoes", name: "Обувь" },
    { id: "hair", name: "Волосы" },
    { id: "handItem", name: "Предмет в руках" },
    { id: "accessory", name: "Аксессуары" }
];

let selectedCategory = "all";
let selectedIndex = 0;
let activeEquipped = {};
let editingItem = null;
let isAnimating = false;

const emptyCollection = document.getElementById("emptyCollection");
const collectionCarousel = document.getElementById("collectionCarousel");
const leftItem = document.getElementById("leftItem");
const selectedItem = document.getElementById("selectedItem");
const rightItem = document.getElementById("rightItem");
const previousButton = document.getElementById("previousItem");
const nextButton = document.getElementById("nextItem");
const itemCounter = document.getElementById("itemCounter");

const characterEditor = document.getElementById("characterEditor");
const closeEditorButton = document.getElementById("closeEditor");
const saveEditorButton = document.getElementById("saveEditor");

function getUniqueItems() {
    if (!gameState || !gameState.collection) return [];

    // Фильтруем коллекцию перед отрисовкой
    const uniqueCollection = [];
    const seen = new Set();

    gameState.collection.forEach(item => {
        // Формируем ключ: ID предмета + его кастомное имя (если оно есть)
        // Если кастомного имени нет, используем пустую строку, чтобы базовые предметы склеились
        const itemKey = item.id + "_" + (item.customName || "");
        
        if (!seen.has(itemKey)) {
            seen.add(itemKey);
            uniqueCollection.push(item);
        }
    });

    return uniqueCollection;
}

function getCurrentItems() {
    return getUniqueItems();
}

function renderItem(container, item, className) {
    if (!container) return;
    container.innerHTML = "";
    if (!item) return;

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    image.className = className;
    container.appendChild(image);
}

function renderSelectedItem(container, item) {
    if (!container) return;
    container.innerHTML = "";
    if (!item) return;

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;
    image.className = "selected-item-image";
    container.appendChild(image);

    if (item.type === "chibi") {
        const nameContainer = document.createElement("div");
        nameContainer.className = "chibi-name-container";
        
        nameContainer.addEventListener("click", (e) => e.stopPropagation());

        const input = document.createElement("input");
        input.type = "text";
        input.className = "chibi-name-input";
        input.value = item.name || "Мой Чиби";
        input.placeholder = "Имя персонажа";

        input.addEventListener("input", (e) => {
            item.name = e.target.value.trim() || "Без имени";
            saveGameState();
            checkAndCompleteTask("name-chibi");
        });

        const pencil = document.createElement("span");
        pencil.className = "pencil-icon";
        pencil.textContent = "✎";

        nameContainer.appendChild(input);
        nameContainer.appendChild(pencil);
        container.appendChild(nameContainer);
    }
}

function updateCarousel() {
    const itemsList = getCurrentItems();

    if (itemsList.length === 0) {
        if (emptyCollection) emptyCollection.style.display = "block";
        if (collectionCarousel) collectionCarousel.style.display = "none";
        return;
    }

    if (emptyCollection) emptyCollection.style.display = "none";
    if (collectionCarousel) collectionCarousel.style.display = "block";

    if (selectedIndex >= itemsList.length) {
        selectedIndex = Math.max(0, itemsList.length - 1);
    }

    const currentItem = itemsList[selectedIndex];
    renderSelectedItem(selectedItem, currentItem);

    if (itemsList.length === 1) {
        if (leftItem) leftItem.innerHTML = "";
        if (rightItem) rightItem.innerHTML = "";
        if (previousButton) previousButton.style.display = "none";
        if (nextButton) nextButton.style.display = "none";
    } else if (itemsList.length === 2) {
        const otherIndex = (selectedIndex + 1) % 2;
        if (leftItem) leftItem.innerHTML = "";
        renderItem(rightItem, itemsList[otherIndex], "side-item-image");
        if (previousButton) previousButton.style.display = "block";
        if (nextButton) nextButton.style.display = "block";
    } else {
        const previousIndex = (selectedIndex - 1 + itemsList.length) % itemsList.length;
        const nextIndex = (selectedIndex + 1) % itemsList.length;
        renderItem(leftItem, itemsList[previousIndex], "side-item-image");
        renderItem(rightItem, itemsList[nextIndex], "side-item-image");
        if (previousButton) previousButton.style.display = "block";
        if (nextButton) nextButton.style.display = "block";
    }

    if (itemCounter) {
        itemCounter.textContent = `${selectedIndex + 1} / ${itemsList.length}`;
    }

    const oldBtn = document.getElementById("downloadChibiBtn");
    if (oldBtn) oldBtn.remove();

    const isChibi = currentItem && (currentItem.type === "chibi" || currentItem.isCustom);

    if (isChibi) {
        const dlBtn = document.createElement("button");
        dlBtn.id = "downloadChibiBtn";
        dlBtn.className = "task-button page-button"; 
        dlBtn.style.display = "block";
        dlBtn.style.margin = "15px auto 0 auto"; 
        dlBtn.textContent = "Скачать PNG";
        
        dlBtn.addEventListener("click", () => {
            const link = document.createElement('a');
            link.download = (currentItem.name || 'Мой_чибик') + '.png';
            link.href = currentItem.image; 
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            sessionStorage.removeItem("activeTutorial");
            sessionStorage.removeItem("tutorialStep");
            if (typeof hideTutorial === "function") hideTutorial();
            checkAndCompleteTask("save-chibi-png");
        });

        if (itemCounter) {
            itemCounter.parentNode.insertBefore(dlBtn, itemCounter.nextSibling);
        } else {
            document.body.appendChild(dlBtn); 
        }
    }

    // --- ПОШАГОВЫЙ ТУТОРИАЛ (БЕЗ ТЕКСТА) ---
    checkCollectionTutorial(isChibi);
}

function checkCollectionTutorial(isChibi) {
    const activeTutorial = sessionStorage.getItem("activeTutorial");
    if (activeTutorial !== "save-chibi-png") return;

    if (typeof hideTutorial === "function") hideTutorial();

    if (isChibi) {
        sessionStorage.setItem("tutorialStep", "download-png");
        const dlBtn = document.getElementById("downloadChibiBtn");
        if (dlBtn && typeof showTutorialStep === "function") {
            showTutorialStep(dlBtn);
        }
    } else {
        sessionStorage.setItem("tutorialStep", "find-chibi");
        if (nextButton && nextButton.style.display !== "none" && typeof showTutorialStep === "function") {
            showTutorialStep(nextButton);
        } else if (previousButton && previousButton.style.display !== "none" && typeof showTutorialStep === "function") {
            showTutorialStep(previousButton);
        }
    }
}

function changeItem(direction) {
    const itemsList = getCurrentItems();
    if (itemsList.length <= 1 || isAnimating) return;

    isAnimating = true;
    const carouselContainer = document.querySelector(".carousel-items");
    const animClass = direction === "next" ? "slide-left" : "slide-right";

    if (carouselContainer) carouselContainer.classList.add(animClass);

    setTimeout(() => {
        if (direction === "next") {
            selectedIndex = (selectedIndex + 1) % itemsList.length;
        } else {
            selectedIndex = (selectedIndex - 1 + itemsList.length) % itemsList.length;
        }
        updateCarousel();

        if (carouselContainer) carouselContainer.classList.remove(animClass);
        isAnimating = false;
    }, 220);
}

function nextItem() { changeItem("next"); }
function previousItem() { changeItem("prev"); }

function openEditor() {
    if (!characterEditor) return;

    const ownedItems = getUniqueItems();
    const currentItem = ownedItems[selectedIndex];

    if (!currentItem || (currentItem.type !== "body" && currentItem.type !== "chibi")) {
        return;
    }

    editingItem = currentItem;

    if (currentItem.type === "chibi") {
        activeEquipped = structuredClone(currentItem.equipped || {});
    } else {
        activeEquipped = {
            body: currentItem.id,
            eyes: null,
            emotion: null,
            top: null,
            bottom: null,
            shoes: null,
            hair: null,
            handItem: null,
            accessory: null
        };
    }

    characterEditor.classList.add("editor-open");
    renderCategories();
    renderEditorItems();
    renderCharacter();
}

function renderCategories() {
    const categoriesElement = document.getElementById("editorCategories");
    if (!categoriesElement) return;

    categoriesElement.innerHTML = "";
    editorCategories.forEach(category => {
        const button = document.createElement("button");
        button.textContent = category.name;
        button.className = "category-button";

        if (category.id === selectedCategory) {
            button.classList.add("active-category");
        }

        button.addEventListener("click", () => {
            selectedCategory = category.id;
            renderCategories();
            renderEditorItems();
        });

        categoriesElement.appendChild(button);
    });
}

function renderEditorItems() {
    const editorItems = document.getElementById("editorItems");
    if (!editorItems) return;

    editorItems.innerHTML = "";
    const ownedItems = getUniqueItems();

    const categoryItems = selectedCategory === "all" 
        ? ownedItems.filter(item => item.type !== "chibi") 
        : ownedItems.filter(item => item.type === selectedCategory);

    if (categoryItems.length === 0) {
        editorItems.innerHTML = `<p class="no-items">В этой категории пока ничего нет.</p>`;
        return;
    }

    categoryItems.forEach(item => {
        const itemButton = document.createElement("button");
        itemButton.className = "editor-item-card";
        if (activeEquipped[item.type] === item.id) {
            itemButton.classList.add("equipped");
        }

        itemButton.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <span>${item.name}</span>
        `;
        itemButton.addEventListener("click", () => equipItem(item));
        editorItems.appendChild(itemButton);
    });
}

function equipItem(item) {
    if (activeEquipped[item.type] === item.id) {
        if (item.type !== "body") {
            activeEquipped[item.type] = null;
        }
    } else {
        activeEquipped[item.type] = item.id;

        if (item.type === "accessory") {
            checkAndCompleteTask("change-accessory");
        }
        if (item.type === "emotion") {
            checkAndCompleteTask("change-emotion");
        }
    }

    renderEditorItems();
    renderCharacter();
}

function renderCharacter() {
    const preview = document.getElementById("characterPreview");
    if (!preview) return;

    preview.innerHTML = "";
    const layerOrder = ["handItem", "body", "eyes", "emotion", "top", "bottom", "shoes", "hair", "accessory"];

    layerOrder.forEach(layer => {
        // Базовые глаза прячем, если надета эмоция
        if (layer === "eyes" && activeEquipped.emotion) {
            return;
        }

        const equippedId = activeEquipped[layer];
        if (!equippedId) return;

        const item = items.find(i => i.id === equippedId) || gameState.collection.find(i => i.id === equippedId);
        if (!item) return;

        const image = document.createElement("img");
        image.alt = item.name;
        image.className = `character-layer layer-${layer}`;

        // --- ЛОГИКА ПОДМЕНЫ ЭМОЦИЙ ---
        if (layer === "emotion") {
            const currentEyesId = activeEquipped["eyes"];
            
            // Проверяем, есть ли вариация под надетые глаза
            if (item.variations && currentEyesId && item.variations[currentEyesId]) {
                image.src = item.variations[currentEyesId];
            } 
            // Если глаз нет, берем дефолтное лицо
            else if (item.variations && item.variations["default"]) {
                image.src = item.variations["default"];
            } 
            // Иначе (ошибка настройки) выводим базовую иконку
            else {
                image.src = item.image;
            }
        } else {
            image.src = item.image;
        }

        preview.appendChild(image);
    });
}

async function createChibiSnapshot(equippedState) {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");

    const layerOrder = ["handItem", "body", "eyes", "emotion", "top", "bottom", "shoes", "hair", "accessory"];

    for (const layer of layerOrder) {
        if (layer === "eyes" && equippedState.emotion) continue;
        const equippedId = equippedState[layer];
        if (!equippedId) continue;

        const item = items.find(i => i.id === equippedId) || gameState.collection.find(i => i.id === equippedId);
        if (!item) continue;

        // --- ЛОГИКА ПОДМЕНЫ ЭМОЦИЙ ДЛЯ СКРИНШОТА ---
        let imageSrc = item.image;

        if (layer === "emotion") {
            const currentEyesId = equippedState["eyes"];
            if (item.variations && currentEyesId && item.variations[currentEyesId]) {
                imageSrc = item.variations[currentEyesId];
            } else if (item.variations && item.variations["default"]) {
                imageSrc = item.variations["default"];
            }
        }

        await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve();
            };
            img.onerror = resolve;
            img.src = imageSrc;
        });
    }

    return canvas.toDataURL("image/png");
}

async function saveOutfit() {
    if (!editingItem) return;

    saveEditorButton.disabled = true;
    saveEditorButton.textContent = "Сохранение...";

    const snapshotImage = await createChibiSnapshot(activeEquipped);

    if (editingItem.type === "chibi") {
        editingItem.equipped = structuredClone(activeEquipped);
        editingItem.image = snapshotImage;
    } else {
        const newChibi = {
            id: "chibi_" + Date.now(),
            name: "Мой Чиби",
            type: "chibi",
            rarity: editingItem.rarity || "common",
            image: snapshotImage,
            equipped: structuredClone(activeEquipped),
            isCustom: true
        };
        gameState.collection.push(newChibi);
        selectedIndex = getUniqueItems().length - 1;

        checkAndCompleteTask("create-new-chibi");
    }

    saveGameState();

    if (characterEditor) {
        characterEditor.classList.remove("editor-open");
    }

    saveEditorButton.disabled = false;
    saveEditorButton.textContent = "Сохранить";

    updateCarousel();
}

if (nextButton) nextButton.addEventListener("click", nextItem);
if (previousButton) previousButton.addEventListener("click", previousItem);
if (leftItem) leftItem.addEventListener("click", previousItem);
if (rightItem) rightItem.addEventListener("click", nextItem);
if (selectedItem) selectedItem.addEventListener("click", openEditor);

if (closeEditorButton) {
    closeEditorButton.addEventListener("click", () => {
        if (characterEditor) characterEditor.classList.remove("editor-open");
    });
}

if (saveEditorButton) {
    saveEditorButton.addEventListener("click", saveOutfit);
}

updateCarousel();

// --- Поддержка свайпов пальцем для мобильных устройств ---
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const carouselElement = document.querySelector(".carousel-items") || collectionCarousel;

if (carouselElement) {
    carouselElement.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    carouselElement.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
            nextItem();
        } else {
            previousItem();
        }
    }
}