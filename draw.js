const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

const brushSize = document.getElementById("brushSize");
const brushButton = document.getElementById("brushButton");
const eraserButton = document.getElementById("eraserButton");
const finishButton = document.getElementById("finishDrawing");
const colorButtons = document.querySelectorAll(".color-button");

let currentColor = "#5E604D";
let drawing = false;
let erasing = false;
let size = 10;

ctx.lineCap = "round";
ctx.lineJoin = "round";

// Загрузка старого рисунка
function loadSavedDrawing() {
    const savedDrawing = gameState.drawings[drawingType];
    if (!savedDrawing) return;

    const image = new Image();
    image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    image.src = savedDrawing;
}

loadSavedDrawing();

// Выбор цвета
colorButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentColor = button.dataset.color;
        erasing = false;

        colorButtons.forEach(colorButton => {
            colorButton.classList.remove("active");
        });

        button.classList.add("active");
    });
});

// Размер кисти
brushSize.addEventListener("input", () => {
    size = brushSize.value;
});

// Кисть
brushButton.addEventListener("click", () => {
    erasing = false;
});

// Ластик
eraserButton.addEventListener("click", () => {
    erasing = true;
});

// Получение точных координат для мыши и пальца (с учётом масштабирования canvas на телефоне)
function getCoords(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX = event.clientX;
    let clientY = event.clientY;

    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    }

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function startDrawing(event) {
    drawing = true;
    const coords = getCoords(event);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
}

function draw(event) {
    if (!drawing) return;

    const coords = getCoords(event);
    ctx.lineWidth = size;
    ctx.strokeStyle = erasing ? "#FFE9DA" : currentColor;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

// События мыши
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// Сенсорные события для телефонов (e.preventDefault убирает скролл страницы пальцем во время рисования)
canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    startDrawing(e);
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    draw(e);
}, { passive: false });

canvas.addEventListener("touchend", stopDrawing);
canvas.addEventListener("touchcancel", stopDrawing);

// Сохранение рисунка
function saveDrawing() {
    const imageData = canvas.toDataURL("image/png");
    gameState.drawings[drawingType] = imageData;
    saveGameState();
}

// Завершение задания
// Завершение / Перезапись рисунка
finishButton.addEventListener("click", () => {
    saveDrawing();

    // Функция возврата на страницу заданий после нажатия "ОК" во всплывающем окне
    const redirectOnConfirm = () => {
        const alertBtn = document.getElementById("customAlertBtn");
        if (alertBtn) {
            alertBtn.onclick = () => {
                window.location.href = "tasks.html";
            };
        } else {
            window.location.href = "tasks.html";
        }
    };

    // Если задание уже было выполнено ранее
    if (gameState.completedTasks.includes(taskId)) {
        showCustomAlert("Рисунок сохранён.");
        redirectOnConfirm();
        return;
    }

    // Первое выполнение
    gameState.rolls += 2;
    gameState.completedTasks.push(taskId);
    saveGameState();

    showCustomAlert("Задание выполнено. Получено 2 крутки!");
    redirectOnConfirm();
});