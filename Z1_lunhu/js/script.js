/* ------------------------------------------
        SEMESTR DATE
------------------------------------------ */

const SEMESTER_START = new Date(2026, 8, 14); // 14.09.2026
const SEMESTER_END = new Date(2026, 11, 14);   // 14.12.2026


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

    // const day = 1; // Pondelok
    // const currentMinutes = 10 * 60; // 10:00

    const classes = document.querySelectorAll(
        ".table-schedule td[data-day][data-start][data-end]"
    );

    const message = document.querySelector("#schedule-message");

    if (!message) return;

    let currentClass = null;
    const upcomingClasses = [];

    // Remove the previous highlighting
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

        // If the course is currently in progress
        if (
            classDay === day &&
            currentMinutes >= start &&
            currentMinutes < end
        ) {
            currentClass = element;
        }

        // Calculate the time remaining until the start of the lesson
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

    // Next upcoming subject
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
        SEMESTR PROGRESS BAR
------------------------------------------ */

function updateSemesterProgress() {
    const today = new Date();

    // We are comparing only the dates, not the current hours and minutes.
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


    // If the page does not contain schedule and semester elements,
    // we terminate the function.
    if (
        !schedule || !progress || !message ||
        !percentage || !fill || !bar ||
        !startDateText || !endDateText
    ) {
        return;
    }


    startDateText.textContent = start.toLocaleDateString("sk-SK");
    endDateText.textContent = end.toLocaleDateString("sk-SK");


    // Check if the dates are correct.
    if (start >= end) {
        schedule.hidden = true;
        progress.hidden = true;
        message.textContent =
            "Chyba: dátum konca semestra musí byť po dátume začiatku.";
        return;
    }

    // The semester hasn't started yet.
    if (today < start) {
        schedule.hidden = true;
        progress.hidden = true;

        message.textContent =
            "Semester sa ešte nezačal. Začína sa " +
            start.toLocaleDateString("sk-SK") + ".";

        return;
    }

    // The semester has already ended.
    if (today > end) {
        schedule.hidden = true;
        progress.hidden = true;

        message.textContent =
            "Semester sa už skončil. Končil sa " +
            end.toLocaleDateString("sk-SK") + ".";

        return;
    }

    // The semester is currently underway.
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
                    Map
------------------------------------------ */

const mapElement = document.getElementById("map");


// Calculation of the distance between two points using the Haversine formula.
function haversineDistance(lat1, lon1, lat2, lon2) {
    // Earth's radius in meters.
    const earthRadius = 6371000;

    // Convert degrees to radians.
    const toRadians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);

    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    const a =
        Math.sin(deltaPhi / 2) ** 2 +
        Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(deltaLambda / 2) ** 2;

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return earthRadius * c;
}


if (mapElement) { 

    const emptyState = document.getElementById("map-empty-state");
    
    const map = L.map("map").setView( 
        [48.151965, 17.072995], 
        14 
    );

    // Adjust the map rendering when the window is resized.
    window.addEventListener("resize", function () {
        map.invalidateSize();
    });

    L.tileLayer( 
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png", 
        { 
            maxZoom: 19, 
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        } 
    ).addTo(map);

    const pointsList = document.getElementById("map-points-list");

    // We store all created points in an array.
    const points = [];

    // Checks whether the user has added at least one custom location.
    function updateEmptyState() {
        const hasUserPoints = points.some(function (point) {
            return point.removable;
        });

        if (emptyState) {
            emptyState.hidden = hasUserPoints;
        }
    }


    const STORAGE_KEY = "map-user-points";

    // Saves custom points to localStorage.
    function saveUserPoints() {
        const userPoints = points
            .filter(function (point) {
                return point.removable;
            })
            .map(function (point) {
                return {
                    name: point.name,
                    lat: point.lat,
                    lng: point.lng
                };
            });

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(userPoints)
        );
    }

    // Loads custom points after the page opens.
    function loadUserPoints() {
        try {
            const savedPoints = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            if (!Array.isArray(savedPoints)) {
                return;
            }

            savedPoints.forEach(function (point) {
                if (
                    point &&
                    typeof point.name === "string" &&
                    Number.isFinite(point.lat) &&
                    Number.isFinite(point.lng)
                ) {
                    addPoint(
                        point.name,
                        point.lat,
                        point.lng,
                        true
                    );
                }
            });
        } catch (error) {
            console.error("Nepodarilo sa načítať uložené miesta:", error);
        }
    }


    // Function to add a point to both the map and the list.
    function addPoint(name, lat, lng, removable = false) { 
        const marker = L.marker([lat, lng]).addTo(map); 
        
        marker.bindPopup(`<strong>${name}</strong>`);

        const point = { 
            name: name, 
            lat: lat, 
            lng: lng, 
            marker: marker,
            removable: removable
        };

        points.push(point);

        // We create an item in the list.
        const option = document.createElement("option"); 
        option.value = points.length - 1; 
        option.textContent = name; 
        
        pointsList.appendChild(option); 
        updateEmptyState();
    }

    // Original fixed points. 
    addPoint("FEI STU – moja škola", 48.151965, 17.072995); 
    addPoint("Moje bydlisko", 48.1455, 17.1050);

    // Restore custom locations from localStorage.
    loadUserPoints();

    // Elements for adding a new location.
    const pointNameInput = document.getElementById("new-point-name"); 
    const addPointButton = document.getElementById("add-point-button"); 
    const mapMessage = document.getElementById("map-message");

    // Súradnice miesta, na ktoré používateľ klikol. 
    let newPointLocation = null;

    // Coordinates of the location the user clicked on. 
    map.on("click", function (event) { 
        newPointLocation = event.latlng;

        mapMessage.textContent = "Poloha je vybraná. Zadaj názov miesta a klikni na Pridať miesto."; 
        
        pointNameInput.focus(); 
    });

    // Adding a location after clicking the button.
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

        addPoint( name, newPointLocation.lat, newPointLocation.lng, true );
        saveUserPoints();
        updateDistanceOptions();

        mapMessage.textContent = "Miesto bolo pridané."; 
        pointNameInput.value = ""; 
        newPointLocation = null; 
    });


    // Selecting a point from the list. 
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

    // Button to remove the selected point.
    const removePointButton = document.getElementById("remove-point-button");

    // The button is activated only when a custom point is selected.
    pointsList.addEventListener("change", function () {
        const index = Number(this.value);
        const point = points[index];

        removePointButton.disabled = !point || !point.removable;
    });


    // Removing the point from both the map and the list.
    removePointButton.addEventListener("click", function () {
        const index = Number(pointsList.value);
        const point = points[index];

        if (!point || !point.removable) {
            return;
        }

        // Remove the marker from the map.
        map.removeLayer(point.marker);

        // Remove the item from the list.
        pointsList.remove(index + 1);

        // Remove the point from the array.
        points.splice(index, 1);
        saveUserPoints();

        // Updating the values ​​in the list.
        Array.from(pointsList.options).forEach(function (option, i) {
            if (i > 0) {
                option.value = i - 1;
            }
        });

        // We will revert the selection to the initial option.
        pointsList.value = "";
        removePointButton.disabled = true;

        updateDistanceOptions();
        updateEmptyState();
    });


    // Destination selection and distance display.
    const distanceFrom = document.getElementById("distance-from");
    const distanceTo = document.getElementById("distance-to");
    const distanceResult = document.getElementById("distance-result");

    let distanceLine = null;

    // We populate both selections with all locations.
    function updateDistanceOptions() {
        const previousFrom = distanceFrom.value;
        const previousTo = distanceTo.value;

        [distanceFrom, distanceTo].forEach(function (select) {
            select.replaceChildren();

            const placeholder = document.createElement("option");
            placeholder.value = "";
            placeholder.textContent = "Vyber miesto";
            select.appendChild(placeholder);

            points.forEach(function (point, index) {
                const option = document.createElement("option");
                option.value = index;
                option.textContent = point.name;
                select.appendChild(option);
            });
        });

        // We will preserve the selection if the given location still exists.
        if (previousFrom !== "" && points[Number(previousFrom)]) {
            distanceFrom.value = previousFrom;
        }

        if (previousTo !== "" && points[Number(previousTo)]) {
            distanceTo.value = previousTo;
        }
    }

    // We calculate the distance between two selected points.
    function showDistance() {
        const fromIndex = distanceFrom.value;
        const toIndex = distanceTo.value;

        if (
            fromIndex === "" ||
            toIndex === "" ||
            !points[fromIndex] ||
            !points[toIndex]
        ) {
            distanceResult.textContent =
                "Vyber dve miesta a zobrazí sa vzdialenosť.";

            if (distanceLine) {
                map.removeLayer(distanceLine);
                distanceLine = null;
            }

            return;
        }

        if (fromIndex === toIndex) {
            distanceResult.textContent =
                "Vyber dve rôzne miesta.";

            if (distanceLine) {
                map.removeLayer(distanceLine);
                distanceLine = null;
            }

            return;
        }

        const from = points[fromIndex];
        const to = points[toIndex];

        const distance = haversineDistance(
            from.lat,
            from.lng,
            to.lat,
            to.lng
        );

        distanceResult.textContent =
            "Vzdialenosť medzi miestami „" +
            from.name + "“ a „" + to.name + "“ je " +
            (distance / 1000).toLocaleString("sk-SK", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }) + " km.";

        // Remove the old connector.
        if (distanceLine) {
            map.removeLayer(distanceLine);
        }

        // Draw a new connecting line.
        distanceLine = L.polyline(
            [
                [from.lat, from.lng],
                [to.lat, to.lng]
            ],
            {
                color: "#b52565",
                weight: 4,
                dashArray: "8, 8"
            }
        ).addTo(map);

        map.fitBounds(distanceLine.getBounds(), {
            padding: [30, 30]
        });
    }

    distanceFrom.addEventListener("change", showDistance);
    distanceTo.addEventListener("change", showDistance);

    // Prvé naplnenie výberov.
    updateDistanceOptions();
    updateEmptyState();
}

