import {getUserLocation} from "./user-location.js";
import {fetchWeatherData} from "./weather-data.js";
import {DailyWeather} from "./daily-weather.js";

const currentTemperature = document.getElementById('current-temperature');

getUserLocation()
    .then((coords) => {
        return fetchWeatherData(coords.latitude, coords.longitude);
    })
    .then((data) => {
        console.log(data);

        for (const day in data.daily.time) {
            new DailyWeather(
                data.current.temperature_2m,
                [],

            )
        }

        currentTemperature.textContent = `current temperature: ${data.current.temperature_2m} ${data.current_units.temperature_2m}`;
    })
    .catch((error) => {
        console.error(`Failed to get user location: ${error.message}`);
    });
