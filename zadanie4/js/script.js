const HOTSPOTS = [
    {
        x: 37,
        y: 35,
        title: "Počítač",
        text: "Pracovná vec."
    },
    {
        x: 25,
        y: 65,
        title: "Kavička",
        text: "Káva, ktorá tečie v každom študentovi."
    },
    {
        x: 80,
        y: 80,
        title: "Knihy",
        text: "Reálna fantastika."
    }
];


function createHotspots() {
    const container = document.querySelector("#hotspots");

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