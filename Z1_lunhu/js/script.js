/* ------------------------------------------
        DÁTUMY SEMESTRA
------------------------------------------ */

const SEMESTER_START = new Date(2026, 8, 14); // 21.09.2026
const SEMESTER_END = new Date(2026, 11, 14);   // 18.12.2026


/* ------------------------------------------
             HOTSPOTS
------------------------------------------ */

const HOTSPOTS = [
    {
        x: 38,
        y: 37,
        title: "Počítač",
        text: "Bez neho by som bola študentka informatiky asi len na papieri.",
        icon: "../icons/laptop.svg"
    },
    {
        x: 26,
        y: 67,
        title: "Kavička",
        text: "Palivo, bez ktorého moje študentské rána odmietajú spolupracovať.",
        icon: "../icons/coffee.svg"
    },
    {
        x: 80,
        y: 80,
        title: "Knihy",
        text: "Keď už neviem, čo ďalej, otvorím knihu a tvárim sa, že mám plán.",
        icon: "../icons/books.svg"
    },

    {
        x: 15,
        y: 59,
        title: "Cukrík",
        text: "Malá sladká odmena za veľké množstvo učenia.",
        icon: "../icons/sweet.svg"
    },

    {
        x: 62,
        y: 58,
        title: "Valerian",
        text: "Užívať podľa potreby, najmä počas skúškového. Predávkovanie nehrozí.",
        icon: "../icons/medicine.svg"
    },

    {
        x: 80,
        y: 52,
        title: "Mäkká hračka",
        text: "Môj chlpatý študijný parťák, ktorý nič nenaprogramuje, ale vždy je pri tom.",
        icon: "../icons/toy.svg"
    }
];


function createHotspots() {
    const container = document.querySelector("#hotspots");

    if (!container) { return; }

    HOTSPOTS.forEach(hotspot => {
        const element = document.createElement("div");

        element.className = "hotspot";

        element.style.setProperty("--x", hotspot.x + "%");
        element.style.setProperty("--y", hotspot.y + "%");

        element.innerHTML = `
            <button
                class="hotspot__dot"
                type="button"
                aria-label="${hotspot.title}">
                <img src="${hotspot.icon}" alt="Ikonka pre ${hotspot.title}" width="30" height="30">
            </button>

            <div class="hotspot__panel">
                <h2>${hotspot.title}</h2>
                <p>${hotspot.text}</p>
            </div>
        `;

        container.appendChild(element);
    });
}

createHotspots();


/* ------------------------------------------
             MENU TOGGLE
------------------------------------------ */

const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});


/* ------------------------------------------
             TIME AND DATE
------------------------------------------ */

// function updateCurrentTime() {
//     const now = new Date();

//     document.getElementById('current-time').innerHTML = now.toLocaleTimeString();
//     document.getElementById('current-date').innerHTML = now.toLocaleDateString();
// }

// updateCurrentTime();
// setInterval(updateCurrentTime, 1000);

function updateCurrentTime() { 
    const timeElement = document.getElementById("current-time"); 
    const dateElement = document.getElementById("current-date"); 
    
    // Ak stránka nemá hodiny a dátum, nič neurobíme. 
    if (!timeElement || !dateElement) { 
        return; 
    } 
    
    const now = new Date(); 
    
    timeElement.textContent = now.toLocaleTimeString("sk-SK"); 
    dateElement.textContent = now.toLocaleDateString("sk-SK"); 
} 

updateCurrentTime(); 
setInterval(updateCurrentTime, 1000);



/* ------------------------------------------
             Button of schedule
------------------------------------------ */

function setActiveButton(button) {
    document.querySelectorAll(".btn-schedule").forEach(element => {
        element.classList.remove("active");
    });

    button.classList.add("active");
}

function allClasses(button){
    setActiveButton(button);
    document.querySelectorAll("#practice, #lecture").forEach(element => element.style.display = "");
}

function onlyLectures(button){
    setActiveButton(button);
    allClasses(button);
    document.querySelectorAll("#practice").forEach(element => element.style.display = "none");
}

function onlyPractice(button){
    setActiveButton(button);
    allClasses(button);
    document.querySelectorAll("#lecture").forEach(element => element.style.display = "none");
}

/* ------------------------------------------
             Current class
------------------------------------------ */

function highlightCurrentClass() {
    const now = new Date();
    const day = now.getDay() === 0 ? 7 : now.getDay();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    // const day = 5; // Pondelok
    // const currentMinutes = 10 * 60; // 10:00

    const classes = document.querySelectorAll(
        ".table-schedule td[data-day][data-start][data-end]"
    );

    const message = document.querySelector("#schedule-message");

    if (!message) return;

    let currentClass = null;
    const upcomingClasses = [];

    // Odstránime predchádzajúce zvýraznenie
    classes.forEach(element => {
        element.classList.remove("current-class");

        const classDay = Number(element.dataset.day);
        const [startHour, startMinute] = element.dataset.start
            .split(":").map(Number);
        const [endHour, endMinute] = element.dataset.end
            .split(":").map(Number);

        const start = startHour * 60 + startMinute;
        const end = endHour * 60 + endMinute;

        const name = element.querySelector("span")?.textContent.trim()
            || "Predmet";

        // Ak predmet práve prebieha
        if (
            classDay === day &&
            currentMinutes >= start &&
            currentMinutes < end
        ) {
            currentClass = element;
        }

        // Vypočítame, koľko času zostáva do začiatku hodiny
        let daysUntil = (classDay - day + 7) % 7;

        if (daysUntil === 0 && start <= currentMinutes) {
            daysUntil = 7;
        }

        upcomingClasses.push({
            element,
            name,
            classDay,
            start,
            daysUntil
        });
    });

    if (currentClass) {
        currentClass.classList.add("current-class");

        const name = currentClass.querySelector("span")?.textContent.trim()
            || "Predmet";

        message.textContent = `Práve prebieha vyučovanie: ${name}.`;
        return;
    }

    // Najbližší budúci predmet
    upcomingClasses.sort((a, b) => {
        if (a.daysUntil !== b.daysUntil) {
            return a.daysUntil - b.daysUntil;
        }
        return a.start - b.start;
    });

    if (upcomingClasses.length === 0) {
        message.textContent = "V rozvrhu nie sú naplánované žiadne hodiny.";
        return;
    }

    const next = upcomingClasses[0];
    const dayNames = [
        "", "pondelok", "utorok", "stredu", "štvrtok",
        "piatok", "sobotu", "nedeľu"
    ];

    const time = `${String(Math.floor(next.start / 60)).padStart(2, "0")}:${String(next.start % 60).padStart(2, "0")}`;

    let dayText;

    if (next.daysUntil === 0) {
        dayText = "dnes";
    } else if (next.daysUntil === 1) {
        dayText = `zajtra (${dayNames[next.classDay]})`;
    } else {
        dayText = dayNames[next.classDay];
    }

    message.textContent =
        `Momentálne nemám vyučovanie. Najbližšia hodina: ${next.name}, ${dayText} o ${time}.`;
}

highlightCurrentClass();
setInterval(highlightCurrentClass, 30000);



/* ------------------------------------------
        PROGRESS BAR SEMESTRA
------------------------------------------ */

function updateSemesterProgress() {
    const today = new Date();

    // Porovnávame iba dátumy, nie aktuálne hodiny a minúty.
    today.setHours(0, 0, 0, 0);

    const start = new Date(SEMESTER_START);
    start.setHours(0, 0, 0, 0);

    const end = new Date(SEMESTER_END);
    end.setHours(0, 0, 0, 0);

    const schedule = document.getElementById("schedule-content");
    const progress = document.getElementById("semester-progress");
    const percentage = document.getElementById("semester-percentage");
    const fill = document.getElementById("semester-progress-fill");
    const bar = document.getElementById("semester-progress-bar");
    const message = document.getElementById("semester-message");
    const startDateText = document.getElementById("semester-start-date");
    const endDateText = document.getElementById("semester-end-date");


    // Ak stránka neobsahuje prvky rozvrhu a semestra,
    // funkciu ukončíme.
    if (
        !schedule || !progress || !message ||
        !percentage || !fill || !bar ||
        !startDateText || !endDateText
    ) {
        return;
    }


    startDateText.textContent = start.toLocaleDateString("sk-SK");
    endDateText.textContent = end.toLocaleDateString("sk-SK");


    // Kontrola, či sú dátumy správne.
    if (start >= end) {
        schedule.hidden = true;
        progress.hidden = true;
        message.textContent =
            "Chyba: dátum konca semestra musí byť po dátume začiatku.";
        return;
    }

    // Semester ešte nezačal.
    if (today < start) {
        schedule.hidden = true;
        progress.hidden = true;

        message.textContent =
            "Semester sa ešte nezačal. Začína sa " +
            start.toLocaleDateString("sk-SK") + ".";

        return;
    }

    // Semester sa už skončil.
    if (today > end) {
        schedule.hidden = true;
        progress.hidden = true;

        message.textContent =
            "Semester sa už skončil. Končil sa " +
            end.toLocaleDateString("sk-SK") + ".";

        return;
    }

    // Semester práve prebieha.
    schedule.hidden = false;
    progress.hidden = false;
    message.textContent = "";

    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = today.getTime() - start.getTime();

    const percent = Math.round(
        elapsedDuration / totalDuration * 100
    );

    percentage.textContent = percent + " %";
    fill.style.width = percent + "%";
    bar.setAttribute("aria-valuenow", percent);
}

updateSemesterProgress();


/* ------------------------------------------
                    Mapa
------------------------------------------ */

const mapElement = document.getElementById("map");

if (mapElement) { 
    const map = L.map("map").setView( 
        [48.151965, 17.072995], 
        14 
    );

    L.tileLayer( 
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png", 
        { 
            maxZoom: 19, 
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        } 
    ).addTo(map);

    const pointsList = document.getElementById("map-points-list");

    // Všetky vytvorené body uchovávame v poli. 
    const points = [];

    // Funkcia na pridanie bodu do mapy aj zoznamu. 
    function addPoint(name, lat, lng) { 
        const marker = L.marker([lat, lng]).addTo(map); 
        
        marker.bindPopup(`<strong>${name}</strong>`);

        const point = { 
            name: name, 
            lat: lat, 
            lng: lng, 
            marker: marker 
        };

        points.push(point);

        // Vytvoríme položku v zozname. 
        const option = document.createElement("option"); 
        option.value = points.length - 1; 
        option.textContent = name; 
        
        pointsList.appendChild(option); 
    }

    // Pôvodné pevné body. 
    addPoint("FEI STU – moja škola", 48.151965, 17.072995); 
    addPoint("Moje bydlisko", 48.1455, 17.1050);

    // Prvky na pridávanie nového miesta. 
    const pointNameInput = document.getElementById("new-point-name"); 
    const addPointButton = document.getElementById("add-point-button"); 
    const mapMessage = document.getElementById("map-message");

    // Súradnice miesta, na ktoré používateľ klikol. 
    let newPointLocation = null;

    // Kliknutie na mapu vyberie polohu nového miesta. 
    map.on("click", function (event) { 
        newPointLocation = event.latlng;

        mapMessage.textContent = "Poloha je vybraná. Zadaj názov miesta a klikni na Pridať miesto."; 
        
        pointNameInput.focus(); 
    });

    // Pridanie miesta po kliknutí na tlačidlo. 
    addPointButton.addEventListener("click", function () { 
        const name = pointNameInput.value.trim();

        if (newPointLocation === null) { 
            mapMessage.textContent = "Najprv klikni na miesto na mape."; 
            return; 
        }

        if (name === "") { 
            mapMessage.textContent = "Zadaj názov miesta."; 
            return; 
        }

        addPoint( name, newPointLocation.lat, newPointLocation.lng );

        mapMessage.textContent = "Miesto bolo pridané."; 
        pointNameInput.value = ""; 
        newPointLocation = null; 
    });


    // Výber bodu zo zoznamu. 
    pointsList.addEventListener("change", function () { 
        const index = Number(this.value);

        if (this.value === "" || !points[index]) { 
            return; 
        }

        const point = points[index];

        map.setView( 
            [point.lat, point.lng], 
            16 
        );

        point.marker.openPopup(); 
    }); 
}



// const map = L.map("map").setView(
//     [48.151965, 17.072995],
//     15
// );

// L.tileLayer(
//     "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
//     {
//         maxZoom: 19,
//         attribution:
//             '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     }
// ).addTo(map);

// // Markery
// // Škola – FEI STU
// L.marker([48.151965, 17.072995])
//     .addTo(map)
//     .bindPopup("<strong>FEI STU</strong><br>Moja škola");

// // Bydlisko – približná alebo fiktívna poloha
// L.marker([48.158611, 17.063889])
//     .addTo(map)
//     .bindPopup("<strong>Moje bydlisko</strong><br>Približná poloha")
//     .openPopup();