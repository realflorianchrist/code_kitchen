import {getUserLocation} from "./user-location.js";
import {fetchWeatherData} from "./weather-data.js";

const currentWeather = document.getElementById('current-weather');

getUserLocation()
    .then((coords) => {
        return fetchWeatherData(coords.latitude, coords.longitude);
    })
    .then((data) => {
        currentWeather.textContent = `current temperature: ${data.current.temperature_2m} ${data.current_units.temperature_2m}`;
    })
    .catch((error) => {
        console.error(`Failed to get user location: ${error.message}`);
    });


