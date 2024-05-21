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
            let start = i * 24;
            let end = start + 24;
            let temperature_24_hours = data.hourly.temperature_2m.slice(start, end);

            new DailyWeather(
                data.current.temperature_2m,
                temperature_24_hours,
                data.daily.time[i],
                data.daily.sunrise[i],
                data.daily.sunset[i]
            ).render();
        }
    })
    .catch((error) => {
        console.error(`Failed to get user location: ${error.message}`);
    });
