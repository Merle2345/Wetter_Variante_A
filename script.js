function weatherEmoji(code) {

    if (code === 0) return "☀️";
    if (code <= 3) return "⛅";
    if (code <= 48) return "🌫️";
    if (code <= 67) return "🌧️";
    if (code <= 77) return "❄️";
    if (code <= 82) return "🌦️";
    if (code <= 99) return "⛈️";

    return "🌤️";
}

function setWeatherBackground(code) {

    document.body.classList.remove(
        "sunny",
        "cloudy",
        "foggy",
        "rainy",
        "snowy",
        "stormy"
    );

    if (code === 0) {
        document.body.classList.add("sunny");
    }
    else if (code <= 3) {
        document.body.classList.add("cloudy");
    }
    else if (code <= 48) {
        document.body.classList.add("foggy");
    }
    else if (code <= 67) {
        document.body.classList.add("rainy");
    }
    else if (code <= 77) {
        document.body.classList.add("snowy");
    }
    else {
        document.body.classList.add("stormy");
    }
}

function createWeatherEffects(code) {

    const container =
        document.getElementById("weatherEffects");

    if (!container) return;

    container.innerHTML = "";

    /* SONNE */

    if (code === 0) {

        const sun = document.createElement("div");

        sun.className = "sunray";

        container.appendChild(sun);

        return;
    }

    /* WOLKEN */

    if (code <= 3) {

        for (let i = 0; i < 5; i++) {

            const cloud =
                document.createElement("div");

            cloud.className = "cloud";
            cloud.textContent = "☁️";

            cloud.style.top =
                Math.random() * 300 + "px";

            cloud.style.animationDuration =
                (25 + Math.random() * 15) + "s";

            container.appendChild(cloud);
        }

        return;
    }

    /* NEBEL */

    if (code <= 48) {

        for (let i = 0; i < 4; i++) {

            const cloud =
                document.createElement("div");

            cloud.className = "cloud";
            cloud.textContent = "☁️";

            cloud.style.opacity = "0.15";
            cloud.style.top = (100 + i * 100) + "px";
            cloud.style.animationDuration = "40s";

            container.appendChild(cloud);
        }

        return;
    }

    /* REGEN */

    if (code <= 67) {

        for (let i = 0; i < 120; i++) {

            const drop =
                document.createElement("div");

            drop.className = "drop";

            drop.style.left =
                Math.random() * 100 + "%";

            drop.style.animationDuration =
                (0.5 + Math.random()) + "s";

            drop.style.opacity =
                Math.random();

            container.appendChild(drop);
        }

        return;
    }

    /* SCHNEE */

    if (code <= 77) {

        for (let i = 0; i < 70; i++) {

            const snow =
                document.createElement("div");

            snow.className = "snowflake";
            snow.textContent = "❄";

            snow.style.left =
                Math.random() * 100 + "%";

            snow.style.animationDuration =
                (5 + Math.random() * 5) + "s";

            snow.style.opacity =
                (0.5 + Math.random() * 0.5);

            container.appendChild(snow);
        }

        return;
    }

    /* GEWITTER */

    for (let i = 0; i < 150; i++) {

        const drop =
            document.createElement("div");

        drop.className = "drop";

        drop.style.left =
            Math.random() * 100 + "%";

        drop.style.animationDuration =
            (0.3 + Math.random() * 0.7) + "s";

        container.appendChild(drop);
    }
}

async function searchCity() {

    const cityInput =
        document.getElementById("cityInput");

    const city =
        cityInput.value.trim();

    if (!city) return;

    try {

        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=de&format=json`
        );

        const geoData =
            await geoResponse.json();

        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {
            alert("Stadt nicht gefunden.");
            return;
        }

        const location =
            geoData.results[0];

        loadWeather(
            location.latitude,
            location.longitude,
            location.name
        );

    } catch (error) {

        console.error(error);

        document.getElementById("update").textContent =
            "Fehler bei der Stadtsuche.";
    }
}

async function loadWeather(
    latitude,
    longitude,
    city
) {

    try {

        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&forecast_days=5&timezone=auto`
        );

        if (!response.ok) {
            throw new Error(
                "API konnte nicht geladen werden."
            );
        }

        const data =
            await response.json();

        const current =
            data.current;

        document.getElementById("city").textContent =
            city;

        document.getElementById("temp").textContent =
            Math.round(
                current.temperature_2m
            ) + "°C";

        document.getElementById("wind").textContent =
            Math.round(
                current.wind_speed_10m
            ) + " km/h";

        document.getElementById("humidity").textContent =
            current.relative_humidity_2m + " %";

        document.getElementById("sunrise").textContent =
            data.daily.sunrise[0]
            .substring(11, 16);

        document.getElementById("sunset").textContent =
            data.daily.sunset[0]
            .substring(11, 16);

        document.getElementById("emoji").textContent =
            weatherEmoji(
                current.weather_code
            );

        setWeatherBackground(
            current.weather_code
        );

        createWeatherEffects(
            current.weather_code
        );

        let forecastHTML = "";

        for (let i = 0; i < 5; i++) {

            const weekday =
                new Date(
                    data.daily.time[i]
                ).toLocaleDateString(
                    "de-DE",
                    {
                        weekday: "short"
                    }
                );

            forecastHTML += `
                <div class="forecast-day">
                    <h3>${weekday}</h3>

                    <div class="forecast-emoji">
                        ${weatherEmoji(
                            data.daily.weather_code[i]
                        )}
                    </div>

                    <div class="forecast-temp">
                        ${Math.round(
                            data.daily.temperature_2m_max[i]
                        )}°
                    </div>

                    <small>
                        ${Math.round(
                            data.daily.temperature_2m_min[i]
                        )}°
                    </small>
                </div>
            `;
        }

        document.getElementById(
            "forecast"
        ).innerHTML = forecastHTML;

        document.getElementById("update")
            .textContent =
            "Zuletzt aktualisiert: " +
            new Date().toLocaleTimeString(
                "de-DE"
            );

    } catch (error) {

        console.error(error);

        document.getElementById("update")
            .textContent =
            "Fehler beim Laden der Wetterdaten.";
    }
}

/* ENTER-TASTE */

document
.getElementById("cityInput")
.addEventListener(
    "keydown",
    function(event){

        if(event.key === "Enter"){
            searchCity();
        }

    }
);

/* ERSTER AUFRUF */

searchCity();

/* ALLE 5 MINUTEN AKTUALISIEREN */

setInterval(() => {

    searchCity();

}, 300000);