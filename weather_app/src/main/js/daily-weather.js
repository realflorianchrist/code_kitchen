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

    render() {
        const pastWeatherList = document.getElementById('weather');

        const dailyWeatherItem = document.createElement('li');
        dailyWeatherItem.id = 'daily-weather';

        let currentTemperatureDiv;
        if (this.date === this.#getTodayDate()) {
            dailyWeatherItem.classList.add('today');
            currentTemperatureDiv = this.#createDivElement('current-temperature', `current temperature: ${this.currentTemperature}`);
        } else {
            currentTemperatureDiv = this.#createDivElement('current-temperature', '.');
        }

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

    #getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert, daher +1
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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