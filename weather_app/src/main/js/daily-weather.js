export class DailyWeather {
    constructor(
        currentTemperature = '',
        hourlyTemperature = [],
        date = '',
        sunrise = '',
        sunset = ''
    ) {
        this.currentTemperature = currentTemperature;
        this.hourlyTemperature = hourlyTemperature;
        this.date = date;
        this.sunrise = sunrise;
        this.sunset = sunset;
    }

    render(containerId) {
        const pastWeatherList = document.createElement('ul');
        pastWeatherList.id = 'past-weather';

        const dailyWeatherItem = document.createElement('li');
        dailyWeatherItem.id = 'daily-weather';

        const currentTemperatureDiv = this.#createDivElement('current-temperature', `current temperature: ${this.currentTemperature}`);
        const hourlyTemperatureCanvas = this.#createCanvasElement('hourly-temperature');
        const dateDiv = this.#createDivElement('date', `date: ${this.date}`);
        const sunriseDiv = this.#createDivElement('sunrise', `sunrise: ${this.sunrise}`);
        const sunsetDiv = this.#createDivElement('sunset', `sunset: ${this.sunset}`);

        dailyWeatherItem.appendChild(currentTemperatureDiv);
        dailyWeatherItem.appendChild(hourlyTemperatureCanvas);
        dailyWeatherItem.appendChild(dateDiv);
        dailyWeatherItem.appendChild(sunriseDiv);
        dailyWeatherItem.appendChild(sunsetDiv);

        pastWeatherList.appendChild(dailyWeatherItem);
    }

    #createDivElement(id, textContent) {
        const div = document.createElement('div');
        div.id = id;
        div.textContent = textContent;
        return div;
    }

    #createCanvasElement(id) {
        const canvas = document.createElement('canvas');
        canvas.id = id;
        return canvas;
    }

}