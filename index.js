const apiKey = 'e93076854bdffea40764aa7836d3d4d4';

const city = document.getElementById("city");
const weatherElement = document.getElementById("weather");
const error = document.getElementById("error");

const units = 'metric';
const tempSymbol = units === 'metric' ? '°C' : '°F';

async function fetchWeather(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Clear previous output
    weatherElement.innerHTML = '';
    error.innerHTML = '';
    city.innerHTML = '';

    const cnt = 10;
    const cityInputtedByUser = document.getElementById('cityinput').value;

    if (!cityInputtedByUser.trim()) {
        error.innerHTML = "Please enter a city.";
        return;
    }

    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInputtedByUser}&appid=${apiKey}&units=${units}&cnt=${cnt}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Handle errors
        if (data.cod !== '200') {
            error.innerHTML = "Not a valid city. Please input another city.";
            return;
        }

        city.innerHTML = `Hourly Weather for ${data.city.name}`;

        data.list.forEach(hourlyWeatherData => {
            const hourlyWeatherDataDiv = createWeatherDescription(hourlyWeatherData);
            weatherElement.appendChild(hourlyWeatherDataDiv);
        });

    } catch (err) {
        console.error(err);
        error.innerHTML = "An error occurred while fetching the weather.";
    }
}

function convertToLocalTime(dt) {
    const date = new Date(dt * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours() % 12 || 12).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const period = date.getHours() >= 12 ? 'PM' : 'AM';

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${period}`;
}

function createWeatherDescription(weatherData) {
    const { main, dt } = weatherData;

    const description = document.createElement("div");
    description.className = "weather_description";

    const convertedDateAndTime = convertToLocalTime(dt);

    description.innerHTML = `${main.temp}${tempSymbol} - ${convertedDateAndTime.substring(10)} - ${convertedDateAndTime.substring(5, 10)}`;

    return description;
}
