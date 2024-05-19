import {displayLoader, hideLoader} from "./loader.js";
import WeatherApiUrlBuilder from "./weather-api-url-builder.js";

export async function fetchWeatherData(latitude, longitude){
    displayLoader();

    const url = new WeatherApiUrlBuilder(latitude, longitude, true, true, true, 3).buildURL();

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();

    } catch (error) {
        console.error('Failed to fetch weather data:', error);
    } finally {
        hideLoader();
    }
}