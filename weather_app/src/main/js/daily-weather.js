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
            currentTemperatureDiv = this.#createDivElement('current-temperature', `current temp: ${this.currentTemperature} °C`);
        } else {
            currentTemperatureDiv = this.#createDivElement('current-temperature', '');
        }

        const hourlyTemperatureCanvas = this.#createCanvasElement('hourly-temperature');
        this.#drawHourlyTemperature(hourlyTemperatureCanvas);
        const dateDiv = this.#createDivElement('date', `date: ${this.#getFormatedDate(this.date)}`);
        const sunriseDiv = this.#createDivElement('sunrise', `sunrise: ${this.#getFormatedTime(this.sunrise)}`);
        const sunsetDiv = this.#createDivElement('sunset', `sunset: ${this.#getFormatedTime(this.sunset)}`);

        dailyWeatherItem.appendChild(hourlyTemperatureCanvas);
        dailyWeatherItem.appendChild(currentTemperatureDiv);
        dailyWeatherItem.appendChild(dateDiv);
        dailyWeatherItem.appendChild(sunriseDiv);
        dailyWeatherItem.appendChild(sunsetDiv);

        pastWeatherList.appendChild(dailyWeatherItem);
    }

    #getTodayDate() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    #getFormatedDate(date) {
        const formatedDate = date.split('-');
        return `${formatedDate[2]}.${formatedDate[1]}.${formatedDate[0]}`;
    }

    #getFormatedTime(date) {
        const formatedTime = date.split('T');
        return `${formatedTime[1]} Uhr`;
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
        canvas.width = 1000;
        canvas.height = 1000;
        return canvas;
    }

    #drawHourlyTemperature(canvas) {
        if (!canvas.getContext) {
            console.error('Canvas is not supported in this browser.');
            return;
        }

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scaleFactor = 30;

        ctx.lineWidth = 5;
        ctx.strokeStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';

        // y-axe
        ctx.beginPath();
        ctx.moveTo(50, 0);
        ctx.lineTo(50, canvas.height);
        ctx.stroke();

        // x-axe
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 50);
        ctx.lineTo(canvas.width, canvas.height - 50);
        ctx.stroke();

        // weather
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - this.hourlyTemperature[0] * scaleFactor);
        for (let i = 1; i < this.hourlyTemperature.length; i++) {
            const yPos = canvas.height - this.hourlyTemperature[i] * scaleFactor;
            ctx.lineTo((i / this.hourlyTemperature.length) * canvas.width, yPos);
        }
        ctx.stroke();
    }
}