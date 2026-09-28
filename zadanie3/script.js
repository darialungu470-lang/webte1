// ========================================
// 1. WEATHER API
// ========================================

//Bratislava
const weatherUrl =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=48.15" +
    "&longitude=17.11" +
    "&current=temperature_2m,wind_speed_10m,relative_humidity_2m,precipitation" +
    "&timezone=auto";

fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {

        document.getElementById("weather").innerHTML =
        "Teplota: " + data.current.temperature_2m + " °C<br>" +
        "Vietor: " + data.current.wind_speed_10m + " km<br>" +
        "Vlhkosť: " + data.current.relative_humidity_2m + " %<br>" +
        "Zrážky: " + data.current.precipitation + " mm<h>";


        console.log(data);
    })
    .catch(error => {
        document.getElementById("weather").innerHTML =
            "Nepodarilo sa načítať počasie.";

        console.error(error);
    });


// ========================================
// 2. LEAFLET MAP
// ========================================

    const map = L.map("map").setView(
        [48.151965, 17.072995],
        15
    );

    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
    ).addTo(map);

// ========================================
// 3. MARKER
// ========================================

// FEI
    L.marker([48.151965, 17.072995])
        .addTo(map)
        .bindPopup("FEI STU Bratislava")
        .openPopup();




// ========================================
// 4. Odessa = Poloha + Marker + Pocasie
// ========================================
const weatherOdessa =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=46.48" +
    "&longitude=30.72" +
    "&current=temperature_2m,wind_speed_10m,relative_humidity_2m,precipitation" +
    "&timezone=auto";

fetch(weatherOdessa)
    .then(response => response.json())
    .then(data => {

        const wetherOdessaText = "Teplota: " + data.current.temperature_2m + " °C<br>" +
        "Vietor: " + data.current.wind_speed_10m + " km<br>" +
        "Vlhkosť: " + data.current.relative_humidity_2m + " %<br>" +
        "Zrážky: " + data.current.precipitation + " mm<h>";

        L.marker([46.4825, 30.7233])
            .addTo(map)
            .bindPopup("Odessa<br>" + wetherOdessaText)
            .openPopup();


        console.log(data);
    })
    .catch(error => {

        console.error(error);
    });
    
