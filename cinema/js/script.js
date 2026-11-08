const SOURCE_URL = "source/kino-hviezda.html";
const STORAGE_KEY = "cinema-program";
const DAY_NAMES = ["Pondelok", "Utorok", "Streda", "Štvrtok", "Piatok", "Sobota", "Nedeľa"];

// --- ЭЛЕМЕНТЫ DOM ---
const statusText = document.getElementById("status");
const refreshButton = document.getElementById("refresh");
const clearButton = document.getElementById("clear");
const tabs = document.getElementById("day-tabs");
const schedule = document.getElementById("schedule");

// --- ГЛОБАЛЬНОЕ СОСТОЯНИЕ ---
let program = [];
let selectedDay = 0;

// --- АСИНХРОННАЯ ЗАГРУЗКА ---
async function loadCinemaHtml() {
  const response = await fetch(SOURCE_URL);
  if (!response.ok) {
    throw new Error(`Stránku kina sa nepodarilo načítať (HTTP ${response.status}).`);
  }
  return response.text();
}

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---
function parseHtml(html) {
  return new DOMParser().parseFromString(html, "text/html");
}

function cleanText(text) {
  return text ? text.replace(/\s+/g, " ").trim() : "";
}

// Безопасное извлечение текста из дочернего элемента
function textOf(element, selector) {
  return cleanText(element.querySelector(selector)?.textContent ?? "");
}

function parsePrice(text) {
  if (!text) return null;
  const price = parseFloat(text.replace(",", "."));
  return Number.isNaN(price) ? null : price;
}

function getTodayIndex() {
  const todayName = DAY_NAMES[(new Date().getDay() + 6) % 7];
  const index = program.findIndex((day) => day.day === todayName);
  return index === -1 ? 0 : index;
}

// --- НАДЕЖНЫЙ ВАНИЛЬНЫЙ ПАРСЕР ---
function parseCinema(doc) {
  const days = [];
  for (const section of doc.querySelectorAll(".den")) {
    const heading = section.querySelector("h2");
    const screenings = [];
    
    for (const film of section.querySelectorAll(".film")) {
      const time = textOf(film, ".cas");
      const title = textOf(film, ".nazov");
      
      // Валидация: пропускаем сеанс, если нет времени или названия
      if (!time || !title) {
        console.warn("Skipping incomplete screening:", film);
        continue;
      }
      
      screenings.push({
        time,
        title,
        hall: textOf(film, ".sala"),
        price: parsePrice(textOf(film, ".cena")),
      });
    }
    
    days.push({
      day: cleanText(heading?.firstChild?.textContent),
      date: textOf(section, "h2 small"),
      screenings,
    });
  }
  return days;
}

// --- РЕНДЕРИНГ ИНТЕРФЕЙСА ---
function renderTabs() {
  if (!tabs) return;
  tabs.replaceChildren();
  program.forEach((day, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = day.day;
    button.setAttribute("aria-pressed", index === selectedDay);
    button.addEventListener("click", () => {
      selectedDay = index;
      render();
    });
    tabs.append(button);
  });
}

function renderDay() {
  if (!schedule) return;
  schedule.replaceChildren();
  const day = program[selectedDay];
  if (!day) return;

  const heading = document.createElement("h2");
  heading.textContent = `${day.day} ${day.date}`;
  schedule.append(heading);

  if (day.screenings.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Na tento deň nie je v programe žiadne predstavenie.";
    schedule.append(empty);
    return;
  }

  const list = document.createElement("ul");
  for (const screening of day.screenings) {
    const item = document.createElement("li");
    const price = screening.price === null ? "cena neuvedená" : `${screening.price.toFixed(2)} €`;
    item.textContent = `${screening.time} · ${screening.title} · ${screening.hall} · ${price}`;
    list.append(item);
  }
  schedule.append(list);
}

function render() {
  renderTabs();
  renderDay();
}

// --- РАБОТА С LOCALSTORAGE ---
function saveProgram(days) {
  const data = { savedAt: new Date().toISOString(), days };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadSavedProgram() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data) return null;
    
    const savedAt = new Date(data.savedAt);
    if (savedAt.toDateString() !== new Date().toDateString()) {
      return null; // Кэш устарел
    }
    return { savedAt, days: data.days };
  } catch (e) {
    return null;
  }
}

// --- ГЛАВНАЯ ЛОГИКА С ПОЛНОЙ ОБРАБОТКОЙ ОШИБОК ---
async function showProgram(forceRefresh = false) {
  const saved = forceRefresh ? null : loadSavedProgram();
  
  if (saved) {
    program = saved.days;
    if (statusText) {
      statusText.textContent = `Uložený program z ${saved.savedAt.toLocaleString("sk-SK")}.`;
    }
    selectedDay = getTodayIndex();
    render();
  } else {
    if (statusText) statusText.textContent = "Načítavam program…";
    if (refreshButton) refreshButton.disabled = true;
    
    // Вся ветка else обернута в try-catch-finally
    try {
      const html = await loadCinemaHtml();
      const doc = parseHtml(html);
      
      program = parseCinema(doc);
      
      // Проверка на изменение структуры (если ни один день не распарсился)
      if (program.length === 0) {
        throw new Error("Na stránke kina sa nenašiel program. Možno sa zmenila jej štruktúra.");
      }
      
      saveProgram(program);
      
      if (statusText) {
        statusText.textContent = `Program aktualizovaný ${new Date().toLocaleString("sk-SK")}.`;
      }
      selectedDay = getTodayIndex();
      render();
    } catch (error) {
      if (statusText) {
        statusText.textContent = error.message; // Выводим текст ошибки пользователю
      }
    } finally {
      if (refreshButton) refreshButton.disabled = false; // Кнопка всегда возвращается в рабочее состояние
    }
  }
}

// --- ОБРАБОТЧИКИ СОБЫТИЙ ---
if (refreshButton) {
  refreshButton.addEventListener("click", async () => {
    if (refreshButton.disabled) return;
    await showProgram(true);
  });
}

if (clearButton) {
  clearButton.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    program = [];
    selectedDay = 0;
    render();
    if (statusText) statusText.textContent = "Uložené dáta sú vymazané.";
  });
}

// --- СТАРТ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ ---
document.addEventListener("DOMContentLoaded", () => {
  showProgram();
});
