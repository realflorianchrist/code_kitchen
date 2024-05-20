import {getUserLocation} from "./user-location.js";
import {fetchWeatherData} from "./weather-data.js";
import {DailyWeather} from "./daily-weather.js";

getUserLocation()
    .then((coords) => {
        return fetchWeatherData(coords.latitude, coords.longitude);
    })
    .then((data) => {
        console.log(data);

        for (let i = 0; i < data.daily.time.length; i++) {
            new DailyWeather(
                data.current.temperature_2m,
                [],
                data.daily.time[i],
                data.daily.sunrise[i],
                data.daily.sunset[i]
            ).render();
        }
    })
    .catch((error) => {
        console.error(`Failed to get user location: ${error.message}`);
    });
