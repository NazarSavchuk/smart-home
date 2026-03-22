# DreamHouse — Smart Home App

## Зміни і доповнення

### Нові класи моделей (`js/models/`)

| Клас | Файл | ООП-можливості |
|------|------|----------------|
| `Device` | `Device.js` | Базовий клас, методи `turnOn/Off/toggle/getInfo` |
| `Light extends Device` | `Light.js` | Private fields, getters/setters з валідацією, 3 режими |
| **`TV extends Device`** | `TV.js` | **Розширений компонент** — private fields, канали, гучність, mute, input, пошук, додавання/видалення каналів |
| `Blinds extends Device` | `Blinds.js` | Private fields, позиція (%), нахил (°), preset presets |
| `Camera extends Device` | `Camera.js` | Режими (idle/monitoring/recording/motion-detect), роздільна здатність, нічне бачення, симуляція руху |

### TV — розширений компонент (вимога 5)
- `setVolume(0-100)` — гучність з валідацією
- `toggleMute()` — вимкнути/увімкнути звук
- `nextChannel()` / `prevChannel()` — перемикання каналів
- `goToChannel(number)` — перехід на конкретний канал
- `searchChannels(query)` — пошук за назвою або номером
- `setInput(input)` — HDMI 1/2, USB, TV Antenna
- `addChannel(number, name)` — додати канал
- `removeChannel(number)` — видалити канал
- 10 початкових каналів

### Модальне вікно налаштувань
Кнопка **Settings** на картці відкриває панель:
- **TV**: канали, гучність, пошук, вхід, додавання каналів
- **Blinds**: слайдер позиції, preset-кнопки, нахил, візуалізація жалюзі
- **Camera**: режим, роздільна здатність, нічне бачення, статус запису, симуляція руху
- **Light**: яскравість, колір (color picker), режим (normal/night/party)

### Підключення CSS
Додай в `index.html` у `<head>`:
```html
<link rel="stylesheet" href="css/modal.css" />
```

## Файлова структура
```
smart-home/
├── index.html
├── css/
│   ├── styles.css       (оригінальний)
│   └── modal.css        (НОВИЙ — модалка і панелі)
└── js/
    ├── main.js          (оновлений)
    ├── core/
    │   └── SmartHome.js (оновлений)
    ├── models/
    │   ├── Device.js    (оновлений)
    │   ├── Light.js     (оновлений)
    │   ├── TV.js        (НОВИЙ)
    │   ├── Blinds.js    (НОВИЙ)
    │   └── Camera.js    (НОВИЙ)
    └── components/
        └── CustomSelect.js (без змін)
```
