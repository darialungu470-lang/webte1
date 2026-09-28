const weatherUrl =
    "https://api.open-meteo.com/v1/forecast" +
    "?latitude=48.15" +
    "&longitude=17.11" +
    "&current=temperature_2m,wind_speed_10m" +
    "&timezone=auto";

    fetch(weatherUrl)
    .then(response => response.json())
    .then(data => {
        document.getElementById("weather").innerHTML =
        "Teplota: " + data.current.temperature_2m + " °C";

        document.getElementById("weather").innerHTML =
        "Teplota: " + data.current.temperature_2m + " °C<br>" +
        "Vietor: " + data.current.wind_speed_10m + " km/h";

        console.log(data);
    })
    .catch(error => {
        document.getElementById("weather").innerHTML =
            "Nepodarilo sa načítať počasie.";

        console.error(error);
    });

    