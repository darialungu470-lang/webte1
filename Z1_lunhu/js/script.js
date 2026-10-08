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

function updateCurrentTime() {
    const now = new Date();

    document.getElementById('current-time').innerHTML = now.toLocaleTimeString();
    document.getElementById('current-date').innerHTML = now.toLocaleDateString();
}

updateCurrentTime();
setInterval(updateCurrentTime, 1000);
