let currentDay = 0;

const previousDayButton = document.getElementById("previousDay");
const nextDayButton = document.getElementById("nextDay");
const dayTitle = document.getElementById("dayTitle");
const dailyRollsText = document.getElementById("dailyRollsText");
const tasksContainer = document.getElementById("tasksContainer");
const dayDots = document.getElementById("dayDots");

function renderDay() {
    const dayData = taskDays[currentDay];
    const isUnlocked = dayData.day <= (gameState.unlockedDay || 1);

    dayTitle.textContent = `День ${dayData.day}` + (isUnlocked ? "" : " 🔒");

    if (!isUnlocked) {
        dailyRollsText.textContent = `День заблокирован (Доступен день ${gameState.unlockedDay || 1})`;
    } else {
        if (gameState.claimedDailyRolls.includes(dayData.day)) {
            dailyRollsText.textContent = `Дневные крутки получены (${dayData.dailyRolls})`;
        } else {
            dailyRollsText.textContent = `Дневные крутки: ${dayData.dailyRolls}`;
        }
    }

    previousDayButton.disabled = currentDay === 0;
    nextDayButton.disabled = currentDay === taskDays.length - 1;

    renderTasks(dayData, isUnlocked);
    renderDayDots();
}

function renderTasks(dayData, isUnlocked) {
    tasksContainer.innerHTML = "";

    dayData.tasks.forEach(task => {
        const taskCard = document.createElement("div");
        taskCard.className = "task-card";

        const taskInfo = document.createElement("div");
        taskInfo.className = "task-info";
        taskInfo.innerHTML = `
            <h2>${task.title}</h2>
            <p>${task.description}</p>
            <p class="reward">Награда: ${task.reward} крутки</p>
        `;

        taskCard.appendChild(taskInfo);

        const taskButton = createTaskButton(task, isUnlocked);
        taskCard.appendChild(taskButton);

        tasksContainer.appendChild(taskCard);
    });
}

function createTaskButton(task, isUnlocked) {
    const isCompleted = gameState.completedTasks.includes(task.id);
    const isDrawingTask = ["draw-cat", "draw-frog", "draw-giraffe"].includes(task.id);

    // 1. День еще не наступил
    if (!isUnlocked) {
        const button = document.createElement("button");
        button.className = "task-button locked";
        button.textContent = "Заблокировано";
        button.disabled = true;
        return button;
    }

    // 2. Если задание УЖЕ выполнено
    if (isCompleted) {
        // Для холстов/рисунков оставляем кнопку активной и меняем текст
        if (isDrawingTask) {
            const button = document.createElement("button");
            button.className = "task-button page-button";
            button.textContent = "Изменить рисунок";
            button.addEventListener("click", () => {
                window.location.href = task.page;
            });
            return button;
        }

        // Для остальных обычных заданий — тусклая кнопка "Выполнено"
        const button = document.createElement("button");
        button.className = "task-button completed";
        button.textContent = "Выполнено";
        button.disabled = true;
        return button;
    }

    // 3. Страницы с холстами / рисунками и другими страницами (первое прохождение)
    if (task.type === "page") {
        const button = document.createElement("button");
        button.className = "task-button page-button"; 
        button.textContent = "Перейти";
        button.addEventListener("click", () => {
            window.location.href = task.page;
        });
        return button;
    }

    // 4. ПЕРЕХВАТ ЗАДАНИЯ С ШАРИКАМИ
    if (task.id === "pop-balloons") {
        const button = document.createElement("button");
        button.className = "task-button page-button";
        button.textContent = "Перейти к заданию";
        button.addEventListener("click", () => startBalloonMinigame(task));
        return button;
    }

    // 5. АВТО-ЗАДАНИЯ (Чибики, имя, аксессуары, PNG)
    if (task.type === "auto") {
        const button = document.createElement("button");
        button.className = "task-button page-button";
        button.textContent = "Перейти";
        button.addEventListener("click", () => {
            if (task.id === "save-chibi-png") {
                startChibiSaveTutorial();
                checkAndRunTutorialSteps();
            } else {
                window.location.href = "collection.html";
            }
        });
        return button;
    }

    // 6. Задания на крутки
    if (task.type === "roll") {
        const button = document.createElement("button");
        const progress = gameState.taskProgress?.rollTasks?.[task.id] || 0;
        const required = task.requiredRolls || 1;

        if (progress >= required) {
            button.className = "task-button page-button";
            button.textContent = "Забрать награду";
            button.disabled = false;
            button.addEventListener("click", () => claimRollTask(task));
        } else {
            button.className = "task-button incomplete";
            button.textContent = `${progress} / ${required}`;
            button.disabled = true;
        }
        return button;
    }

    // 7. Ручные задания
    if (task.type === "manual") {
        const button = document.createElement("button");
        button.className = "task-button page-button";
        button.textContent = "Выполнить";
        button.addEventListener("click", () => completeManualTask(task));
        return button;
    }

    // Резервная заглушка
    const button = document.createElement("button");
    button.className = "task-button incomplete";
    button.textContent = "Скоро";
    button.disabled = true;
    return button;
}

function claimRollTask(task) {
    if (gameState.completedTasks.includes(task.id)) return;

    gameState.completedTasks.push(task.id);
    gameState.rolls += task.reward;
    saveGameState();

    showCustomAlert(`Задание выполнено! Получено ${task.reward} крутка(и).`);
    renderDay();
}

function completeManualTask(task) {
    if (gameState.completedTasks.includes(task.id)) return;

    gameState.completedTasks.push(task.id);
    gameState.rolls += task.reward;
    saveGameState();

    showCustomAlert(`Задание выполнено. Получено ${task.reward} крутка(и).`);
    renderDay();
}

function renderDayDots() {
    dayDots.innerHTML = "";

    taskDays.forEach((day, index) => {
        const dot = document.createElement("button");
        dot.className = "day-dot";
        if (index === currentDay) dot.classList.add("active-day-dot");
        if (day.day > (gameState.unlockedDay || 1)) dot.classList.add("locked-day-dot");

        dot.textContent = day.day;
        dot.addEventListener("click", () => {
            currentDay = index;
            renderDay();
        });

        dayDots.appendChild(dot);
    });
}

previousDayButton.addEventListener("click", () => {
    if (currentDay > 0) {
        currentDay--;
        renderDay();
    }
});

nextDayButton.addEventListener("click", () => {
    if (currentDay < taskDays.length - 1) {
        currentDay++;
        renderDay();
    }
});

renderDay();

// Проверяет, открыт ли день задания и не выполнено ли оно еще
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

// Запуск затемнения и подсветки
function showTutorial(targetElement, text) {
    if (document.getElementById("tutorialOverlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "tutorialOverlay";
    overlay.className = "tutorial-overlay";
    
    const message = document.createElement("div");
    message.className = "tutorial-message";
    message.textContent = text;
    overlay.appendChild(message);

    document.body.appendChild(overlay);
    targetElement.classList.add("tutorial-highlight");

    // Если она кликнет мимо кнопки, туториал закроется сам (но можно убрать эту строку, если хочешь заставить нажать только на кнопку)
    overlay.addEventListener("click", hideTutorial);
}

function hideTutorial() {
    const overlay = document.getElementById("tutorialOverlay");
    if (overlay) overlay.remove();
    const highlighted = document.querySelectorAll(".tutorial-highlight");
    highlighted.forEach(el => el.classList.remove("tutorial-highlight"));
}

// --- МИНИ-ИГРА: ЛОПНИ ШАРИКИ ---
function startBalloonMinigame(task) {
    const overlay = document.createElement('div');
    overlay.className = 'balloon-overlay';
    document.body.appendChild(overlay);

    const timerEl = document.createElement('div');
    timerEl.className = 'balloon-timer';
    timerEl.textContent = '60';
    overlay.appendChild(timerEl);

    let timeLeft = 60;
    let balloonsCount = 50;
    
    // Цвета из твоей палитры
    const colors = ['#5E604D', '#ffffff', '#DB827F', '#ffb347', '#ffe66d', '#7bd389', '#6ec6ff', '#A19DA4', '#d291ff'];

    // Создаем 50 шариков
    for (let i = 0; i < balloonsCount; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Позиция
        const targetX = 5 + Math.random() * 80;
        const targetY = 35 + Math.random() * 55;
        
        balloon.style.left = targetX + 'vw';
        balloon.style.top = '-100px'; 
        
        overlay.appendChild(balloon);

        setTimeout(() => {
            balloon.style.top = targetY + 'vh';
        }, Math.random() * 1000); 

        // Лопаем по клику
        balloon.addEventListener('click', function() {
            this.remove();
            balloonsCount--;
            if (balloonsCount <= 0) {
                clearInterval(timerInterval);
                overlay.remove();
                checkAndCompleteTask(task.id); 
            }
        });
    }

    // Таймер
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            timerEl.style.color = '#DB827F'; 
            timerEl.style.transform = 'translateX(-50%) scale(1.1)'; 
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            overlay.remove();
            if (typeof showCustomAlert === "function") {
                showCustomAlert("Время вышло! Попробуй еще раз.");
            } else {
                alert("Время вышло! Попробуй еще раз.");
            }
        }
    }, 1000);
}
function checkAndRunTutorialSteps() {
    const activeTutorial = sessionStorage.getItem("activeTutorial");
    const step = sessionStorage.getItem("tutorialStep");

    if (activeTutorial === "save-chibi-png" && step === "nav-collection") {
        const navCollectionBtn = document.querySelector('a[href="collection.html"]');
        if (navCollectionBtn) {
            showTutorialStep(navCollectionBtn);
            navCollectionBtn.addEventListener("click", () => {
                sessionStorage.setItem("tutorialStep", "find-chibi");
            }, { once: true });
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const completedTask = urlParams.get("completedTask");
    
    if (completedTask) {
        // Начисляем награду и показываем окно награды уже на странице заданий
        if (typeof checkAndCompleteTask === "function") {
            checkAndCompleteTask(completedTask);
        }
        
        // Очищаем URL от параметров, чтобы при перезагрузке награда не срабатывала снова
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});