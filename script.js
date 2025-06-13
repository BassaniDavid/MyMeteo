const inputElement = document.getElementById("city");

inputElement.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevents the default action of entering a new line in some browsers
    getWeather();
    inputElement.value = "";
  }
});

function getWeather() {
  const apiKey = "82ffeaed069b610f02c849a0f761753a"; // API key for OpenWeatherMap
  const city = document.getElementById("city").value; // Get the value of the city input field
  if (!city) {
    alert("Please enter a city"); // Alert if no city is entered
    return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`; // URL for fetching the current weather data
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`; // URL for fetching the hourly forecast data

  fetch(currentWeatherUrl) // Fetch the current weather data from OpenWeatherMap API
    .then((response) => response.json()) // Convert the response to JSON format
    .then((data) => {
      displayWeather(data); // Call the function to display the weather information
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error); // Log any errors that occur during the fetch process
      alert("Error fetching weather data. Please try again later."); // Alert user if there's an error with the API call
    });

  fetch(forecastUrl) // Fetch the hourly forecast data from OpenWeatherMap API
    .then((response) => response.json()) // Convert the response to JSON format
    .then((data) => {
      displayHourlyForecast(data.list); // Call the function to display the hourly forecast information
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error); // Log any errors that occur during the fetch process
      alert("Error fetching hourly forecast data. Please try again later."); // Alert user if there's an error with the API call
    });
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div"); // Get the temperature div element
  const weatherinfoDiv = document.getElementById("weather-info"); // Get the weather info div element
  const weathericon = document.getElementById("weather-icon"); // Get the weather icon element
  const hourlyForecastDiv = document.getElementById("hourly-forecast"); // Get the hourly forecast div element

  // Clear any existing content in the elements
  weatherinfoDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";
  hourlyForecastDiv.innerHTML = "";

  if (data.cod === "404") {
    weatherinfoDiv.innerHTML = `<p>${data.message}</p>`; // Display an error message if the city is not found
  } else {
    const cityName = data.name; // Get the name of the city
    const temperature =
      Math.round(((data.main.temp - 273.15) * 10).toFixed(1)) / 10; // Convert the temperature from Kelvin to Celsius and round it to one decimal place
    const description = data.weather[0].description; // Get the weather description
    const iconCode = data.weather[0].icon; // Get the icon code for the weather condition
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`; // Construct the URL for the weather icon

    const temperatureHTML = `<p>${temperature}°C</p>`; // Create HTML string for displaying the temperature
    const weatherHTML = `
    <p>${cityName}</p>
    <p>${description}</p>`; // Create HTML string for displaying the city name and description

    tempDivInfo.innerHTML = temperatureHTML; // Set the inner HTML of the temperature div element
    weatherinfoDiv.innerHTML = weatherHTML; // Set the inner HTML of the weather info div element
    weathericon.src = iconUrl; // Set the source URL for the weather icon
    weathericon.alt = description; // Set the alternative text for the weather icon

    showImage(); // Call the function to display the weather icon
  }
}
function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast"); // Get the hourly forecast div element
  const next24Hours = hourlyData.slice(0, 8); // Get the first 8 items from the hourly data array to represent the next 24 hours
  next24Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000); // Convert the timestamp to a JavaScript Date object
    const hours = dateTime.getHours(); // Get the hour part of the date and time
    const temperature = Math.round(item.main.temp - 273.15); // Convert the temperature from Kelvin to Celsius and round it
    const iconCode = item.weather[0].icon; // Get the icon code for the weather condition
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // Construct the URL for the weather icon
    const hourlyItemHtml = `
        <div class="hourly-item">
            <p>${hours}:00</p>
            <img src="${iconUrl}" alt="Hourly Weather Icon" />
            <span>${temperature}°C</span>
        </div>
        `; // Create HTML string for displaying the hourly forecast item
    hourlyForecastDiv.innerHTML += hourlyItemHtml; // Append the HTML string to the inner HTML of the hourly forecast div element
  });
}

function showImage() {
  const weatherIcon = document.getElementById("weather-icon"); // Get the weather icon element
  weatherIcon.style.display = "block"; // Set the display style of the weather icon to block to make it visible
  inputElement.value = "";
}
