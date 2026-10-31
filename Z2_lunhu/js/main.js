import { parseEatAndMeet } from "./parsers/eatandmeet.js";
import { parseFiitfood } from "./parsers/fiitfood.js";
import { parseRiviera } from "./parsers/riviera.js";




const CACHE_KEY = "eatandmeet-menu";

function getTodayDate() {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getCachedMenu() {
    try {
        const cached = localStorage.getItem(CACHE_KEY);

        if (!cached) {
            return null;
        }

        const data = JSON.parse(cached);

        if (data.date === getTodayDate()) {
            return data.menu;
        }
    } catch (error) {
        console.warn("Nepodarilo sa prečítať cache:", error);
    }

    return null;
}

function saveMenuToCache(menu) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            date: getTodayDate(),
            menu: menu
        }));
    } catch (error) {
        console.warn("Nepodarilo sa uložiť cache:", error);
    }
}







async function loadEatAndMeet(forceRefresh = false) {
    try {
        if (!forceRefresh) {
            const cachedMenu = getCachedMenu();

            if (cachedMenu) {
                displayMenu(cachedMenu);
                return;
            }
        }

        // 1. Načítame lokálny HTML súbor
        const response = await fetch("./data/eatandmeet.html");

        if (!response.ok) {
            throw new Error(`HTTP chyba: ${response.status}`);
        }

        // 2. Prevedieme odpoveď na text
        const html = await response.text();



        // 3. Z HTML textu vytvoríme DOM dokument
        const doc = new DOMParser().parseFromString(
            html,
            "text/html"
        );

        // 4. Spracujeme dokument naším parserom
        const result = parseEatAndMeet(doc);

        if (result.days.length === 0) {
            throw new Error("Parser nenašiel žiadne dni.");
        }

        saveMenuToCache(result);
        displayMenu(result);

        // 5. Zobrazíme výsledok
        displayMenu(result);


    } catch (error) {
        console.error("Nepodarilo sa načítať menu:", error);
        throw error;
    }
}






const FIITFOOD_CACHE_KEY = "fiitfood-menu";

async function loadFiitfood(forceRefresh = false) {
    try {
        // Skúsime načítať dnešné uložené menu
        if (!forceRefresh) {
            const cached = localStorage.getItem(FIITFOOD_CACHE_KEY);

            if (cached) {
                const data = JSON.parse(cached);

                if (data.date === getTodayDate()) {
                    displayMenu(data.menu);
                    return;
                }
            }
        }

        // Ak cache neexistuje, načítame HTML
        const response = await fetch("./data/fiitfood.html");

        if (!response.ok) {
            throw new Error(`HTTP chyba: ${response.status}`);
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        const result = parseFiitfood(doc);

        if (result.days.length === 0) {
            throw new Error("FIITFOOD: parser nenašiel žiadne dni.");
        }

        // Uložíme menu do localStorage
        localStorage.setItem(
            FIITFOOD_CACHE_KEY,
            JSON.stringify({
                date: getTodayDate(),
                menu: result
            })
        );

        displayMenu(result);

    } catch (error) {
        console.error("Chyba pri načítaní FIITFOOD:", error);
        throw error;
    }
}






const RIVIERA_CACHE_KEY = "riviera-menu";

async function loadRiviera(forceRefresh = false) {
    try {
        if (!forceRefresh) {
            const cached = localStorage.getItem(RIVIERA_CACHE_KEY);

            if (cached) {
                const data = JSON.parse(cached);

                if (data.date === getTodayDate()) {
                    displayMenu(data.menu);
                    return;
                }
            }
        }

        const response = await fetch("./data/riviera.html");

        if (!response.ok) {
            throw new Error(`HTTP chyba: ${response.status}`);
        }

        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        const result = parseRiviera(doc);

        if (result.days.length === 0) {
            throw new Error("Riviera: parser nenašiel žiadne dni.");
        }

        localStorage.setItem(
            RIVIERA_CACHE_KEY,
            JSON.stringify({
                date: getTodayDate(),
                menu: result
            })
        );

        displayMenu(result);

    } catch (error) {
        console.error("Chyba pri načítaní Riviera:", error);
        throw error;
    }
}









function formatMenuDate(dateString) {
    if (!dateString) return "";

    const match = dateString.match(
        /^(\d{1,2})\.\s*(\d{1,2})\.(?:\s*(\d{4}))?$/
    );

    if (!match) return dateString;

    const day = match[1].padStart(2, "0");
    const month = match[2].padStart(2, "0");
    const year = match[3];

    return year
        ? `${day}. ${month}. ${year}`
        : `${day}. ${month}.`;
}











function displayMenu(data) {
    const container = document.getElementById("menu-container");

    container.innerHTML = "";



    
    const hasMeals = data.days?.some(day =>
        Array.isArray(day.meals) && day.meals.length > 0
    );

    if (!hasMeals && !data.businessMenu) {
        const message = document.createElement("p");

        message.classList.add("empty-menu");
        message.textContent =
            "Pre túto reštauráciu momentálne nemáme dostupný jedálny lístok.";

        container.appendChild(message);

        document.getElementById("day-buttons").replaceChildren();

        return;
    }


    


    if (data.businessMenu) {
        const business = data.businessMenu;

        const card = document.createElement("article");
        card.classList.add("meal-card", "business-menu");

        const heading = document.createElement("h3");
        heading.textContent = "Business menu – celý týždeň";

        const soup = document.createElement("p");
        soup.textContent = `Polievka: ${business.soup}`;

        const meal = document.createElement("p");
        meal.textContent = `Hlavné jedlo: ${business.name}`;

        const details = document.createElement("p");
        details.textContent = business.details;

        const price = document.createElement("p");
        price.classList.add("meal-price");
        price.textContent = `Cena menu: ${business.price}`;

        card.append(heading, soup, meal, details, price);
        container.appendChild(card);
    }





    const buttonsContainer = document.getElementById("day-buttons");
    buttonsContainer.replaceChildren();

    function setActiveButton(activeButton) {
        const buttons = buttonsContainer.querySelectorAll("button");

        buttons.forEach(button => {
            const isActive = button === activeButton;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }

    const allButton = document.createElement("button");

    allButton.type = "button";
    allButton.textContent = "Celý týždeň";

    allButton.addEventListener("click", () => {
        const sections = container.querySelectorAll("section");

        sections.forEach(section => {
            section.hidden = false;
        });

        setActiveButton(allButton);
    });

    buttonsContainer.appendChild(allButton);

    data.days.forEach((day, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.textContent = day.day;



        const today = dayjs();

        const dateMatch = day.date?.match(
            /^(\d{1,2})\.\s*(\d{1,2})\.(?:\s*(\d{4}))?$/
        );

        let isToday = false;

        if (dateMatch) {
            const dayNumber = Number(dateMatch[1]);
            const monthNumber = Number(dateMatch[2]);
            
            const year = dateMatch[3] ? Number(dateMatch[3]) : today.year();

            isToday =
                dayNumber === today.date() &&
                monthNumber === today.month() + 1 &&
                year === today.year();
        } else if (!day.date) {
            isToday = index === (today.day() + 6) % 7;
        }

        if (isToday) {
            button.classList.add("today");
            button.setAttribute("aria-label", `${day.day} – dnes`);
        }



        button.addEventListener("click", () => {
            const sections = container.querySelectorAll("section");

            sections.forEach((section, sectionIndex) => {
                section.hidden = sectionIndex !== index;
            });

            setActiveButton(button);
        });

        buttonsContainer.appendChild(button);
    });

    data.days.forEach((day, index) => {
        const daySection = document.createElement("section");
        daySection.classList.add("day-section");

        daySection.hidden = index !== 0;

        const heading = document.createElement("h3");
        heading.textContent = day.day;
        daySection.appendChild(heading);

        if (day.date) {
            const date = document.createElement("p");
            date.classList.add("day-date");
            date.textContent = formatMenuDate(day.date);

            daySection.appendChild(date);
        }

        if (day.price) {
                const menuPrice = document.createElement("p");
                menuPrice.classList.add("day-menu-price");
                menuPrice.textContent = `Cena denného menu: ${day.price}`;
                daySection.appendChild(menuPrice);
            }


        const mealsGrid = document.createElement("div");
        mealsGrid.classList.add("meals-grid");

        day.meals.forEach(meal => {
            const mealElement = document.createElement("div");
            mealElement.classList.add("meal-card");

            const name = document.createElement("p");
            name.textContent = `${meal.type}: ${meal.name}`;

            
            const price = document.createElement("p");
            price.classList.add("meal-price");

            if (data.restaurant === "Riviera") {
                price.textContent = `Cena denného menu: ${meal.price}`;
            } else {
                price.textContent = `Bežná cena: ${meal.price}`;
            }

            mealElement.appendChild(name);

            if (meal.price && meal.price !== day.price) {
                const price = document.createElement("p");
                price.classList.add("meal-price");
                price.textContent = `Cena jedla: ${meal.price}`;

                mealElement.appendChild(price);
            }

            
            if (meal.weight) {
                const weight = document.createElement("p");
                weight.classList.add("meal-weight");
                weight.textContent = `Hmotnosť: ${meal.weight}`;

                mealElement.appendChild(weight);
            }


            // Dotovaná cena
            if (meal.subsidizedPrice) {
                const subsidizedPrice = document.createElement("p");

                subsidizedPrice.classList.add("meal-subsidized-price");
                subsidizedPrice.textContent =
                    `Dotovaná cena: ${meal.subsidizedPrice}`;

                mealElement.appendChild(subsidizedPrice);
            }


            // Alergény zobrazíme iba vtedy, ak sú dostupné
            if (meal.allergens) {
                const allergens = document.createElement("p");

                allergens.classList.add("meal-allergens");
                allergens.textContent = `Alergény: ${meal.allergens}`;

                mealElement.appendChild(allergens);
            }

            mealsGrid.appendChild(mealElement);

        });

        daySection.appendChild(mealsGrid);

        container.appendChild(daySection);
    });

    
    const dayButtons = buttonsContainer.querySelectorAll("button");


    const today = dayjs();

    // Pondelok = 0, utorok = 1, ..., nedeľa = 6
    const todayIndex = (today.day() + 6) % 7;

    const currentDay = today.format("DD");
    const currentMonth = today.format("MM");
    const currentYear = today.format("YYYY");

    const matchingIndex = data.days.findIndex(day => {
        if (!day.date) return false;

        const match = day.date.match(
            /^(\d{1,2})\.\s*(\d{1,2})\.(?:\s*(\d{4}))?$/
        );

        if (!match) return false;

        const dayNumber = match[1].padStart(2, "0");
        const monthNumber = match[2].padStart(2, "0");
        const year = match[3];

        return dayNumber === currentDay &&
            monthNumber === currentMonth &&
            (!year || year === currentYear);
    });

    const selectedIndex = matchingIndex >= 0
        ? matchingIndex
        : data.days.some(day => day.date)
            ? -1
            : todayIndex;

    if (selectedIndex >= 0 && dayButtons[selectedIndex + 1]) {
        dayButtons[selectedIndex + 1].click();
    } else {
        dayButtons[0].click();
    }
}

const refreshButton = document.getElementById("refresh-menu");
const menuStatus = document.getElementById("menu-status");

refreshButton.addEventListener("click", async () => {
    refreshButton.disabled = true;
    menuStatus.textContent = "Obnovujem jedálny lístok...";

    try {
        const selectedRestaurant = document.getElementById("restaurant-select").value;

        if (selectedRestaurant === "eatandmeet") {
            await loadEatAndMeet(true);
        } else if (selectedRestaurant === "fiitfood") {
            await loadFiitfood(true);
        } else if (selectedRestaurant === "riviera") {
            await loadRiviera(true);
        }

        menuStatus.textContent = "Jedálny lístok bol znovu načítaný.";
    } catch (error) {
        menuStatus.textContent = "Nepodarilo sa obnoviť menu.";
    } finally {
        refreshButton.disabled = false;
    }
});

const clearCacheButton = document.getElementById("clear-cache");


clearCacheButton.addEventListener("click", () => {
    try {
        const selectedRestaurant =
            document.getElementById("restaurant-select").value;

        if (selectedRestaurant === "eatandmeet") {
            localStorage.removeItem(CACHE_KEY);
        } else if (selectedRestaurant === "fiitfood") {
            localStorage.removeItem(FIITFOOD_CACHE_KEY);
        } else if (selectedRestaurant === "riviera") {
            localStorage.removeItem(RIVIERA_CACHE_KEY);
        }

        menuStatus.textContent =
            "Uložené údaje vybranej reštaurácie boli vymazané.";


    } catch (error) {
        menuStatus.textContent =
            "Nepodarilo sa vymazať uložené údaje.";

        console.error("Chyba pri vymazaní cache:", error);
    }
});


loadEatAndMeet().catch(error => {
    console.error("CHYBA PRI SPUSTENÍ:", error);
});





const restaurantSelect = document.getElementById("restaurant-select");


restaurantSelect.addEventListener("change", async () => {
    const selectedRestaurant = restaurantSelect.value;
    const container = document.getElementById("menu-container");
    const dayButtons = document.getElementById("day-buttons");

    restaurantSelect.disabled = true;
    menuStatus.textContent = "Načítavam jedálny lístok...";
    container.replaceChildren();
    dayButtons.replaceChildren();

    try {
        if (selectedRestaurant === "eatandmeet") {
            await loadEatAndMeet();
        } else if (selectedRestaurant === "fiitfood") {
            await loadFiitfood();
        } else if (selectedRestaurant === "riviera") {
            await loadRiviera();
        }

        menuStatus.textContent = "";
    } catch (error) {
        console.error("Chyba pri prepínaní reštaurácie:", error);
        menuStatus.textContent = "Nepodarilo sa načítať jedálny lístok.";
    } finally {
        restaurantSelect.disabled = false;
    }
});
