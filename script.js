const inputElement = document.getElementById("city");
const savedCity = localStorage.getItem("selectedCity");

document.addEventListener("DOMContentLoaded", function () {
  const savedCity = getCityFromLocalStorage();
  if (savedCity) {
    inputElement.value = savedCity;
  }
});

// Funzione per salvare la città nel Local Storage
function saveCityToLocalStorage(city) {
  localStorage.setItem("selectedCity", city);
}

// Funzione per ottenere la città dal Local Storage
function getCityFromLocalStorage() {
  return localStorage.getItem("selectedCity");
}

inputElement.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Impedisce l'azione predefinita di inserimento di una nuova riga in alcuni browser.
    getWeather();
    inputElement.value = "";
  }
});

function getWeather() {
  const apiKey = "82ffeaed069b610f02c849a0f761753a"; // API key da OpenWeatherMap
  const city = document.getElementById("city").value; // Ottenere il valore del campo di input city
  if (!city) {
    alert("Please enter a city"); // Avviso se non è stata inserita alcuna città
    return;
  }
  if (city) {
    saveCityToLocalStorage(city); // Salva la città nel Local Storage
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`; // URL per il recupero dei dati meteo attuali
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`; // URL per il recupero dei dati di previsione oraria

  fetch(currentWeatherUrl) // Recuperare i dati meteo attuali da OpenWeatherMap API
    .then((response) => response.json()) // Convertire la risposta in formato JSON
    .then((data) => {
      displayWeather(data); // Richiamare la funzione per visualizzare le informazioni meteo
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error); // Registra tutti gli errori che si verificano durante il processo di recupero.
      alert("Error fetching weather data. Please try again later."); // Avvisare l'utente se c'è un errore nella chiamata API
    });

  fetch(forecastUrl) // Recuperare i dati delle previsioni orarie da OpenWeatherMap API
    .then((response) => response.json()) // Convertire la risposta in formato JSON
    .then((data) => {
      displayHourlyForecast(data.list); // Richiamare la funzione per visualizzare le informazioni di previsione oraria
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error); // Registra tutti gli errori che si verificano durante il processo di recupero.
      alert("Error fetching hourly forecast data. Please try again later."); // Avvisare l'utente se c'è un errore nella chiamata API
    });
}

function displayWeather(data) {
  const tempDivInfo = document.getElementById("temp-div"); // Ottenere l'elemento div della temperatura
  const weatherinfoDiv = document.getElementById("weather-info"); // Ottenere l'elemento div delle informazioni meteo
  const weathericon = document.getElementById("weather-icon"); // Ottenere l'elemento icona del meteo
  const hourlyForecastDiv = document.getElementById("hourly-forecast"); // Ottenere l'elemento div delle previsioni orarie

  // Cancellare il contenuto esistente negli elementi
  weatherinfoDiv.innerHTML = "";
  tempDivInfo.innerHTML = "";
  hourlyForecastDiv.innerHTML = "";

  if (data.cod === "404") {
    weatherinfoDiv.innerHTML = `<p>${data.message}</p>`; // Visualizzare un messaggio di errore se la città non viene trovata
  } else {
    const cityName = data.name; // Ottenere il nome della città
    const temperature =
      Math.round(((data.main.temp - 273.15) * 10).toFixed(1)) / 10; // Convertire la temperatura da Kelvin a Celsius e arrotondarla a un decimale.
    const description = data.weather[0].description; // Ottenere la descrizione del tempo
    const iconCode = data.weather[0].icon; // Ottenere il codice dell'icona per la condizione meteorologica
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`; // Costruire l'URL dell'icona del meteo

    const temperatureHTML = `<p>${temperature}°C</p>`; // Creare una stringa HTML per visualizzare la temperatura
    const weatherHTML = `
    <p>${cityName}</p>
    <p>${description}</p>`; // Creare una stringa HTML per visualizzare il nome della città e la sua descrizione

    tempDivInfo.innerHTML = temperatureHTML; // Impostare l'HTML dell'elemento div temperatura
    weatherinfoDiv.innerHTML = weatherHTML; // Impostare l'HTML dell'elemento div Info meteo
    weathericon.src = iconUrl; // Impostare l'URL di origine per l'icona del meteo
    weathericon.alt = description; // Impostare il testo alternativo per l'icona del meteo

    showImage(); // Richiamare la funzione per visualizzare l'icona del meteo
  }
}
function displayHourlyForecast(hourlyData) {
  const hourlyForecastDiv = document.getElementById("hourly-forecast"); // Ottenere l'elemento div delle previsioni orarie
  const next24Hours = hourlyData.slice(0, 8); // Ottenere i primi 8 elementi dall'array di dati orari per rappresentare le 24 ore successive
  next24Hours.forEach((item) => {
    const dateTime = new Date(item.dt * 1000); // Convertire il timestamp in un oggetto JavaScript Date
    const hours = dateTime.getHours(); // Ottenere la parte oraria della data e dell'ora
    const temperature = Math.round(item.main.temp - 273.15); // Convertire la temperatura da Kelvin a Celsius e arrotondarla
    const iconCode = item.weather[0].icon; // Ottenere il codice dell'icona per la condizione meteorologica
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`; // Costruire l'URL dell'icona del meteo
    const hourlyItemHtml = `
        <div class="hourly-item">
            <p>${hours}:00</p>
            <img src="${iconUrl}" alt="Hourly Weather Icon" />
            <span>${temperature}°C</span>
        </div>
        `; // Creare una stringa HTML per visualizzare la voce di previsione oraria
    hourlyForecastDiv.innerHTML += hourlyItemHtml; // Aggiungere la stringa HTML all'HTML interno dell'elemento div "previsioni orarie".
  });
}

function showImage() {
  const weatherIcon = document.getElementById("weather-icon"); // Ottenere l'elemento icona del meteo
  weatherIcon.style.display = "block"; // Impostare lo stile di visualizzazione dell'icona del meteo su blocco, per renderla visibile.
  inputElement.value = "";
}

if (savedCity) {
  fetchWeatherData(savedCity);
}

function fetchWeatherData() {
  const apiKey = "82ffeaed069b610f02c849a0f761753a"; // API key per OpenWeatherMap
  const city = savedCity;

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`; // URL per il recupero dei dati meteo attuali
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`; // URL per il recupero dei dati di previsione oraria

  fetch(currentWeatherUrl) // Recuperare i dati meteo attuali da OpenWeatherMap API
    .then((response) => response.json()) // Convertire la risposta in formato JSON
    .then((data) => {
      displayWeather(data); // Richiamare la funzione per visualizzare le informazioni meteo
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error); // Registra tutti gli errori che si verificano durante il processo di recupero.
      alert("Error fetching weather data. Please try again later."); // Avvisare l'utente se c'è un errore nella chiamata API
    });

  fetch(forecastUrl) // Recuperare i dati delle previsioni orarie da OpenWeatherMap API
    .then((response) => response.json()) // Convertire la risposta in formato JSON
    .then((data) => {
      displayHourlyForecast(data.list); // Richiamare la funzione per visualizzare le informazioni sulle previsioni orarie
    })
    .catch((error) => {
      console.error("Error fetching hourly forecast data:", error); // Registra tutti gli errori che si verificano durante il processo di recupero.
      alert("Error fetching hourly forecast data. Please try again later."); // Avvisare l'utente se c'è un errore nella chiamata API
    });
}
