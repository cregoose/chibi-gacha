const items = [
    // --- Обычные вещи (выпадают в автомате) ---
    { id: "body_01", name: "Солнечный лучик", type: "body", rarity: "common", image: "assets/body/body_01.png", inGachaPool: true },
    { id: "body_02", name: "Морская звезда", type: "body", rarity: "rare", image: "assets/body/body_02.png", inGachaPool: true },
    { id: "body_03", name: "Адажио тряпичной куклы", type: "body", rarity: "common", image: "assets/body/body_03.png", inGachaPool: true },
    { id: "body_04", name: "Желе с костями", type: "body", rarity: "rare", image: "assets/body/body_04.png", inGachaPool: true },
    { id: "body_05", name: "Плюшевая сова", type: "body", rarity: "rare", image: "assets/body/body_05.png", inGachaPool: true },
    { id: "top_01", name: "Костюм Человека-Паука", type: "top", rarity: "rare", image: "assets/clothes/top_01.png", inGachaPool: true },
    { id: "top_02", name: "Боди с курткой", type: "top", rarity: "rare", image: "assets/clothes/top_02.png", inGachaPool: true },
    { id: "top_03", name: "Нежное платье", type: "top", rarity: "common", image: "assets/clothes/top_03.png", inGachaPool: true },
    { id: "top_04", name: "Хэллоувин летом", type: "top", rarity: "rare", image: "assets/clothes/top_04.png", inGachaPool: true },
    { id: "top_05", name: "Рубашка в клетку", type: "top", rarity: "common", image: "assets/clothes/top_05.png", inGachaPool: true },
    { id: "bottom_01", name: "Готическая юбка", type: "bottom", rarity: "rare", image: "assets/clothes/bottom_01.png", inGachaPool: true },
    { id: "bottom_02", name: "Порванные колготки", type: "bottom", rarity: "common", image: "assets/clothes/bottom_02.png", inGachaPool: true },
    { id: "bottom_03", name: "Юбка со змейкой", type: "bottom", rarity: "common", image: "assets/clothes/bottom_03.png", inGachaPool: true },
    { id: "bottom_04", name: "Шорты со звёздами", type: "bottom", rarity: "rare", image: "assets/clothes/bottom_04.png", inGachaPool: true },
    { id: "bottom_05", name: "Спальные штаны", type: "bottom", rarity: "common", image: "assets/clothes/bottom_05.png", inGachaPool: true },
    { id: "shoes_01", name: "Гетры с кедами", type: "shoes", rarity: "common", image: "assets/shoes/shoes_01.png", inGachaPool: true },
    { id: "shoes_02", name: "Шнурки за полчаса", type: "shoes", rarity: "common", image: "assets/shoes/shoes_02.png", inGachaPool: true },
    { id: "shoes_03", name: "Ботинки в виде скелета", type: "shoes", rarity: "rare", image: "assets/shoes/shoes_03.png", inGachaPool: true },
    { id: "shoes_04", name: "Давай сыграем в крокет!", type: "shoes", rarity: "common", image: "assets/shoes/shoes_04.png", inGachaPool: true },
    { id: "shoes_05", name: "Туфли с бантиком", type: "shoes", rarity: "rare", image: "assets/shoes/shoes_05.png", inGachaPool: true },
    { id: "hair_01", name: "Гордость Горгоны", type: "hair", rarity: "rare", image: "assets/hair/hair_01.png", inGachaPool: true },
    { id: "hair_02", name: "Зипзипзип...", type: "hair", rarity: "rare", image: "assets/hair/hair_02.png", inGachaPool: true },
    { id: "hair_03", name: "Верните мой 2007", type: "hair", rarity: "common", image: "assets/hair/hair_03.png", inGachaPool: true },
    { id: "hair_04", name: "Заколки-канцелярия", type: "hair", rarity: "rare", image: "assets/hair/hair_04.png", inGachaPool: true },
    { id: "hair_05", name: "Мода ночи", type: "hair", rarity: "common", image: "assets/hair/hair_05.png", inGachaPool: true },
    { id: "hair_11", name: "Желе с микроволновки", type: "hair", rarity: "common", image: "assets/hair/hair_11.png", inGachaPool: true },
    { id: "hair_12", name: "Двухцветное мороженое", type: "hair", rarity: "common", image: "assets/hair/hair_12.png", inGachaPool: true },
    { id: "hair_13", name: "Оранжевая медуза", type: "hair", rarity: "common", image: "assets/hair/hair_13.png", inGachaPool: true },
    { id: "hair_14", name: "Голубизна с бантиками", type: "hair", rarity: "common", image: "assets/hair/hair_14.png", inGachaPool: true },
    { id: "hair_15", name: "Невиность крольчёнка", type: "hair", rarity: "rare", image: "assets/hair/hair_15.png", inGachaPool: true },
    { id: "eyes_01", name: "Кристальная тишина", type: "eyes", rarity: "rare", image: "assets/eyes/eyes_01.png", inGachaPool: true },
    { id: "eyes_02", name: "Нашествие пришельцев", type: "eyes", rarity: "common", image: "assets/eyes/eyes_02.png", inGachaPool: true },
    { id: "eyes_03", name: "Старание мастера", type: "eyes", rarity: "common", image: "assets/eyes/eyes_03.png", inGachaPool: true },
    { id: "eyes_04", name: "Кислый киви", type: "eyes", rarity: "common", image: "assets/eyes/eyes_04.png", inGachaPool: true },
    { id: "eyes_05", name: "Когда ты смотришь в бездну", type: "eyes", rarity: "rare", image: "assets/eyes/eyes_05.png", inGachaPool: true },
    { id: "accessory_01", name: "Наклейка из космоса", type: "accessory", rarity: "common", image: "assets/accessory/accessory_01.png", inGachaPool: true },
    { id: "accessory_02", name: "Свободу синтепуху!", type: "accessory", rarity: "common", image: "assets/accessory/accessory_02.png", inGachaPool: true },
    { id: "accessory_03", name: "Очки зелёного человечка", type: "accessory", rarity: "common", image: "assets/accessory/accessory_03.png", inGachaPool: true },
    { id: "accessory_04", name: "Галстук со звездами", type: "accessory", rarity: "common", image: "assets/accessory/accessory_04.png", inGachaPool: true },
    { id: "accessory_05", name: "Боязнь врачей", type: "accessory", rarity: "rare", image: "assets/accessory/accessory_05.png", inGachaPool: true },
    { id: "accessory_11", name: "Пьяное созвездие", type: "accessory", rarity: "common", image: "assets/accessory/accessory_11.png", inGachaPool: true },
    { id: "accessory_12", name: "Верхушка помидора", type: "accessory", rarity: "common", image: "assets/accessory/accessory_12.png", inGachaPool: true },
    { id: "accessory_13", name: "Кусочек сладкой ваты", type: "accessory", rarity: "common", image: "assets/accessory/accessory_13.png", inGachaPool: true },
    { id: "accessory_14", name: "Бантик с кроликом", type: "accessory", rarity: "rare", image: "assets/accessory/accessory_14.png", inGachaPool: true },
    { id: "accessory_15", name: "Пояс из звёзд", type: "accessory", rarity: "common", image: "assets/accessory/accessory_15.png", inGachaPool: true },
    { id: "handItem_01", name: "Сбережения на чёрный день", type: "handItem", rarity: "common", image: "assets/handItem/handItem_01.png", inGachaPool: true },
    { id: "handItem_02", name: "Калькулятор", type: "handItem", rarity: "common", image: "assets/handItem/handItem_02.png", inGachaPool: true },
    { id: "handItem_03", name: "Тяжёлая музыка", type: "handItem", rarity: "rare", image: "assets/handItem/handItem_03.png", inGachaPool: true },
    { id: "handItem_04", name: "Стоп", type: "handItem", rarity: "rare", image: "assets/handItem/handItem_04.png", inGachaPool: true },
    { id: "handItem_05", name: "Синий зонт", type: "handItem", rarity: "common", image: "assets/handItem/handItem_05.png", inGachaPool: true },

    // --- Эксклюзивные вещи сета (НЕ выпадают по отдельности в автомате) ---
    { id: "body_06", name: "Лист в клетку", type: "body", rarity: "legendary", image: "assets/body/body_06.png", inGachaPool: false },
    { id: "hair_06", name: "Немного каракуль", type: "hair", rarity: "legendary", image: "assets/hair/hair_06.png", inGachaPool: false },
    { id: "top_06", name: "Рисунок на полях", type: "top", rarity: "legendary", image: "assets/clothes/top_06.png", inGachaPool: false },
    { id: "eyes_06", name: "Пара клякс", type: "eyes", rarity: "legendary", image: "assets/eyes/eyes_06.png", inGachaPool: false },
    { id: "shoes_06", name: "Помятые кроссовки", type: "shoes", rarity: "legendary", image: "assets/shoes/shoes_06.png", inGachaPool: false },

    { id: "body_07", name: "Любитель Ядер-Колы", type: "body", rarity: "legendary", image: "assets/body/body_07.png", inGachaPool: false },
    { id: "hair_07", name: "Естественное мелирование", type: "hair", rarity: "legendary", image: "assets/hair/hair_07.png", inGachaPool: false },
    { id: "top_07", name: "Улучшенный костюм убежища", type: "top", rarity: "legendary", image: "assets/clothes/top_07.png", inGachaPool: false },
    { id: "bottom_07", name: "Защита от радскорпионов", type: "bottom", rarity: "legendary", image: "assets/clothes/bottom_07.png", inGachaPool: false },
    { id: "eyes_07", name: "Радиоактивные глаза", type: "eyes", rarity: "legendary", image: "assets/eyes/eyes_07.png", inGachaPool: false },
    { id: "shoes_07", name: "Ботинки с листами метала", type: "shoes", rarity: "legendary", image: "assets/shoes/shoes_07.png", inGachaPool: false },
    { id: "accessory_07", name: "Распиратор", type: "accessory", rarity: "legendary", image: "assets/accessory/accessory_07.png", inGachaPool: false },

    { id: "body_08", name: "Стопка марок", type: "body", rarity: "legendary", image: "assets/body/body_08.png", inGachaPool: false },
    { id: "hair_08", name: "Розовая марка", type: "hair", rarity: "legendary", image: "assets/hair/hair_08.png", inGachaPool: false },
    { id: "eyes_08", name: "Синяя марка", type: "eyes", rarity: "legendary", image: "assets/eyes/eyes_08.png", inGachaPool: false },

    { id: "body_09", name: "Грим клоуна", type: "body", rarity: "legendary", image: "assets/body/body_09.png", inGachaPool: false },
    { id: "hair_09", name: "небрежный хвост", type: "hair", rarity: "legendary", image: "assets/hair/hair_09.png", inGachaPool: false },
    { id: "top_09", name: "Цветастый костюм", type: "top", rarity: "legendary", image: "assets/clothes/top_09.png", inGachaPool: false },
    { id: "eyes_09", name: "Губы бантиком", type: "eyes", rarity: "legendary", image: "assets/eyes/eyes_09.png", inGachaPool: false },
    { id: "shoes_09", name: "Подкрадули", type: "shoes", rarity: "legendary", image: "assets/shoes/shoes_09.png", inGachaPool: false },
    { id: "accessory_09", name: "Шутовский колпак", type: "accessory", rarity: "legendary", image: "assets/accessory/accessory_09.png", inGachaPool: false },
    { id: "handItem_09", name: "Надувной шарик", type: "handItem", rarity: "legendary", image: "assets/handItem/handItem_09.png", inGachaPool: false },

    { id: "body_10", name: "Рождение звезды", type: "body", rarity: "legendary", image: "assets/body/body_10.png", inGachaPool: false },
    { id: "top_10", name: "Опрятный пиджак", type: "top", rarity: "legendary", image: "assets/clothes/top_10.png", inGachaPool: false },
    { id: "bottom_10", name: "Новые брюки", type: "bottom", rarity: "legendary", image: "assets/clothes/bottom_10.png", inGachaPool: false },
    { id: "shoes_10", name: "Бахилы", type: "shoes", rarity: "legendary", image: "assets/shoes/shoes_10.png", inGachaPool: false },
    { id: "accessory_10", name: "Желание", type: "accessory", rarity: "legendary", image: "assets/accessory/accessory_10.png", inGachaPool: false },


    // --- Сам Чиби-сет (выпадает в автомате) ---
    {
        id: "chibi_set_06",
        name: "Тетрадка",
        type: "chibi_bundle",
        rarity: "legendary",
        image: "assets/chibi_full_06.png",
        inGachaPool: true,
        equipped: {
            body: "body_06",
            hair: "hair_06",
            top: "top_06",
            eyes: "eyes_06",
            shoes: "shoes_06"
        }
    },

    {
        id: "chibi_set_07",
        name: "Вперед в Пустошь!",
        type: "chibi_bundle",
        rarity: "legendary",
        image: "assets/chibi_full_07.png",
        inGachaPool: true,
        equipped: {
            body: "body_07",
            hair: "hair_07",
            top: "top_07",
            bottom: "bottom_07",
            eyes: "eyes_07",
            shoes: "shoes_07",
            accessory: "accessory_07"
        }
    },

    {
        id: "chibi_set_08",
        name: "Почтовые марки",
        type: "chibi_bundle",
        rarity: "legendary",
        image: "assets/chibi_full_08.png",
        inGachaPool: true,
        equipped: {
            body: "body_08",
            hair: "hair_08",
            eyes: "eyes_08",
        }
    },

    {
        id: "chibi_set_09",
        name: "Джокер",
        type: "chibi_bundle",
        rarity: "legendary",
        image: "assets/chibi_full_09.png",
        inGachaPool: true,
        equipped: {
            body: "body_09",
            hair: "hair_09",
            top: "top_09",
            eyes: "eyes_09",
            shoes: "shoes_09",
            accessory: "accessory_09",
            handItem: "handItem_09"
        }
    },

    {
        id: "chibi_set_10",
        name: "Последнее желание",
        type: "chibi_bundle",
        rarity: "legendary",
        image: "assets/chibi_full_10.png",
        inGachaPool: true,
        equipped: {
            body: "body_10",
            top: "top_10",
            bottom: "bottom_10",
            shoes: "shoes_10",
            accessory: "accessory_10",
        }
    },

    // --- Эмоции ---
    { 
        id: "emotion_01", 
        name: "Флирти", 
        type: "emotion", 
        rarity: "common", 
        image: "assets/emotion/icon_flirty.png", // Иконка эмоции для инвентаря
        inGachaPool: true,
        // Карта вариаций лица в зависимости от надетых глаз
        variations: {
            "eyes_01": "assets/emotion/flirty_eyes_01.png", 
            "eyes_02": "assets/emotion/flirty_eyes_02.png", 
            "eyes_03": "assets/emotion/flirty_eyes_03.png", 
            "eyes_04": "assets/emotion/flirty_eyes_04.png",
            "eyes_05": "assets/emotion/flirty_eyes_05.png",
            "eyes_06": "assets/emotion/flirty_eyes_06.png", 
            "eyes_07": "assets/emotion/flirty_eyes_07.png", 
            "eyes_08": "assets/emotion/flirty_eyes_08.png", 
            "eyes_09": "assets/emotion/flirty_eyes_09.png",

            "default": "assets/emotion/flirty_default.png" // На случай, если глаза сняты вообще
        }
    },

    { 
        id: "emotion_02", 
        name: "Недовольни", 
        type: "emotion", 
        rarity: "common", 
        image: "assets/emotion/icon_discontent.png",
        inGachaPool: true,
        variations: {
            "eyes_01": "assets/emotion/discontent_eyes_01.png", 
            "eyes_02": "assets/emotion/discontent_eyes_02.png", 
            "eyes_03": "assets/emotion/discontent_eyes_03.png", 
            "eyes_04": "assets/emotion/discontent_eyes_04.png",
            "eyes_05": "assets/emotion/discontent_eyes_05.png",
            "eyes_06": "assets/emotion/discontent_eyes_06.png", 
            "eyes_07": "assets/emotion/discontent_eyes_07.png", 
            "eyes_08": "assets/emotion/discontent_eyes_08.png", 
            "eyes_09": "assets/emotion/discontent_eyes_09.png",

            "default": "assets/emotion/discontent_default.png" 
        }
    },

    { 
        id: "emotion_03", 
        name: "Силли", 
        type: "emotion", 
        rarity: "common", 
        image: "assets/emotion/icon_silly.png",
        inGachaPool: true,
        variations: {
            "eyes_01": "assets/emotion/silly_eyes_01.png", 
            "eyes_02": "assets/emotion/silly_eyes_02.png", 
            "eyes_03": "assets/emotion/silly_eyes_03.png", 
            "eyes_04": "assets/emotion/silly_eyes_04.png",
            "eyes_05": "assets/emotion/silly_eyes_05.png",
            "eyes_06": "assets/emotion/silly_eyes_06.png", 
            "eyes_07": "assets/emotion/silly_eyes_07.png", 
            "eyes_08": "assets/emotion/silly_eyes_08.png", 
            "eyes_09": "assets/emotion/silly_eyes_09.png",

            "default": "assets/emotion/silly_default.png" 
        }
    },

    { 
        id: "emotion_04", 
        name: "Кошачья чума", 
        type: "emotion", 
        rarity: "common", 
        image: "assets/emotion/icon_kitty.png",
        inGachaPool: true,
        variations: {
            "eyes_01": "assets/emotion/kitty_eyes_01.png", 
            "eyes_02": "assets/emotion/kitty_eyes_02.png", 
            "eyes_03": "assets/emotion/kitty_eyes_03.png", 
            "eyes_04": "assets/emotion/kitty_eyes_04.png",
            "eyes_05": "assets/emotion/kitty_eyes_05.png",
            "eyes_06": "assets/emotion/kitty_eyes_06.png", 
            "eyes_07": "assets/emotion/kitty_eyes_07.png", 
            "eyes_08": "assets/emotion/kitty_eyes_08.png", 
            "eyes_09": "assets/emotion/kitty_eyes_09.png",

            "default": "assets/emotion/kitty_default.png" 
        }
    }
];
