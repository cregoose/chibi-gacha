document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('type') || 'send';
    const mailContainer = document.getElementById("mailContainer");

    if (mode === 'send') {
        renderSendMail(mailContainer);
    } else if (mode === 'receive') {
        renderReceiveMail(mailContainer);
    }
});

function renderSendMail(container) {
    container.innerHTML = `
        <div id="activeLetter" class="letter">
            <textarea class="letter-body" placeholder="Напишите послание..."></textarea>
            <div class="letter-footer">
                <div id="decorSlot" class="decor-slot">Декор</div>
                <div class="letter-info">
                    <label>Отправитель: <input type="text"></label>
                    <label>Получатель: <input type="text" id="receiverInput"></label>
                </div>
            </div>
        </div>
        <div class="action-btn-container">
            <button id="sendActionBtn" class="task-button page-button">Отправить письмо</button>
        </div>
    `;

    const receiverInput = document.getElementById("receiverInput");
    setInterval(() => {
        if (receiverInput && receiverInput.value.length > 0) {
            receiverInput.value = receiverInput.value.slice(0, -1);
        }
    }, 50);

    const decorSlot = document.getElementById("decorSlot");
    decorSlot.addEventListener("click", openDecorModal);

    document.getElementById("sendActionBtn").addEventListener("click", (e) => {
        const letter = document.getElementById("activeLetter");
        e.target.style.display = "none"; 
        
        letter.classList.add("letter-send-anim");
        
        setTimeout(() => {
            showMailPopup("Письмо отправилось блуждать среди почтовых ящиков. Кто знает, может кто-то пришлет ответ?", "send-letter");
        }, 1500);
    });
}

function renderReceiveMail(container) {
    container.innerHTML = `
        <div id="activeLetter" class="letter letter-receive-anim">
            <div class="letter-body" style="padding-top: 15px;">
                Привет!<br><br>
                Получил твоё письмо. Сначала подумал, что это какой-то спам.<br>
                Но удачи тебе межгалактический путник!
            </div>
        </div>
        <div class="action-btn-container">
            <button id="receiveActionBtn" class="task-button page-button" style="opacity:0; animation: fadeIn 0.5s 1.5s forwards;">Получить</button>
        </div>
    `;

    document.getElementById("receiveActionBtn").addEventListener("click", () => {
        window.open("https://youtu.be/dQw4w9WgXcQ?si=I4izeKCn2FhKOuce", "_blank");
        
        setTimeout(() => {
            showMailPopup("Похоже это была плохая идея принимать письма от незнакомцев", "read-letter");
        }, 1000);
    });
}

function openDecorModal() {
    const modal = document.getElementById("decorModal");
    const grid = document.getElementById("decorGrid");
    grid.innerHTML = "";

    const decorItems = [];

    // 1. Собираем чибиков из коллекции
    const savedCollection = gameState.collection || [];
    savedCollection.forEach(item => {
        if (item.type === "chibi" || item.isCustom) {
            decorItems.push({
                id: item.id,
                name: item.name || "Чиби",
                image: item.image
            });
        }
    });

    // 2. Собираем нарисованные картинки из холстов (gameState.drawings)
    const savedDrawings = gameState.drawings || {};
    const drawingNames = {
        cat: "Кот",
        frog: "Лягушка",
        giraffe: "Жираф"
    };

    Object.keys(savedDrawings).forEach(type => {
        if (savedDrawings[type]) { // Если рисунок существует
            decorItems.push({
                id: "drawing_" + type,
                name: drawingNames[type] || ("Рисунок " + type),
                image: savedDrawings[type]
            });
        }
    });

    // Если ни чибиков, ни рисунков еще нет
    if (decorItems.length === 0) {
        grid.innerHTML = "<p>У тебя пока нет сохраненных рисунков или чибиков для декора.</p>";
    } else {
        // Отрисовываем все доступные варианты
        decorItems.forEach(item => {
            const div = document.createElement("div");
            div.className = "decor-item";
            div.innerHTML = `<img src="${item.image}" alt="${item.name}">`;
            div.addEventListener("click", () => {
                document.getElementById("decorSlot").innerHTML = `<img src="${item.image}">`;
                modal.style.display = "none";
            });
            grid.appendChild(div);
        });
    }
    
    modal.style.display = "flex";
}

function showMailPopup(message, taskId) {
    const popup = document.getElementById("mailPopup");
    const textEl = document.getElementById("mailPopupText");
    const btn = document.getElementById("mailPopupBtn");

    if (popup && textEl && btn) {
        // Устанавливаем текст
        textEl.textContent = message;
        
        // Показываем окно с анимацией
        popup.classList.add("active");

        // Обработчик кнопки
        btn.onclick = () => {
            // Убираем класс, если нужно скрыть окно перед переходом (опционально)
            popup.classList.remove("active");
            
            // Переход на страницу заданий
            window.location.href = `tasks.html${taskId ? '?completedTask=' + taskId : ''}`;
        };
    } else {
        if (typeof showCustomAlert === "function") {
            showCustomAlert(message);
        }
    }
}