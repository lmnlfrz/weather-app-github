//format date( day,month,time no gmt )
function formatDate(date) {
  let hours = currentTime.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = currentTime.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let dayIndex = currentTime.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let year = currentTime.getFullYear();
  let daydate = currentTime.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Oct",
    "Nov",
    "Dec",
  ];
  let monthIndex = currentTime.getMonth();
  let day = days[dayIndex];
  let month = months[monthIndex];

  return `${day} ${daydate} ${month} ${year} ${hours}:${minutes}`;
}

//Next Days date
function formatNextDays(nextdayname) {
  let date = new Date(nextdayname);
  let dayIndex = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let daydate = date.getDate();
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Oct",
    "Nov",
    "Dec",
  ];
  let monthIndex = date.getMonth();
  let day = days[dayIndex];
  let month = months[monthIndex];

  return `${day} ${daydate} ${month}`;
}

//weather description,humidity,wind,temps
function displayWeather(response) {
  let temperatureElement = document.querySelector(".temperature");
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#country").innerHTML = response.data.sys.country;
  document.querySelector("#degree").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#humid").innerHTML = response.data.main.humidity;
  document.querySelector(".feels").innerHTML = Math.round(
    response.data.main.feels_like
  );
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;

  let iconElement = document.querySelector("#mainicon");

  iconElement.setAttribute("src", `icons/${response.data.weather[0].icon}.gif`);

  celciusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celciusTemperature);
}

// search location API
function searchLocation(position) {
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let unit = "metric";
  let apiKey = "5e495a0f30ae782754537f5c56c584c1";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
  Url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(Url).then(displayForecast);
}

//current location
function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}
let currentLocationBtn = document.querySelector("#btnLocation");
currentLocationBtn.addEventListener("click", getCurrentLocation);

//next days forecast,icons
function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;
  console.log(response.data);

  for (let index = 5; index < 22; index += 8) {
    forecast = response.data.list[index];
    /* console.log(forecast.weather[0].icon); */
    forecastElement.innerHTML += `<div class="col-2">
    <h5>
    ${formatNextDays(forecast.dt_txt)}
    </h5>
    <img class="forecast-icon"
      src= "icons/${forecast.weather[0].icon}.gif" />
 <div class="weather-forecast-temperature">
 <strong>Max:${Math.round(forecast.main.temp_max)}°</strong> Min:${Math.round(
      forecast.main.temp_min
    )}°
 </div>
 </div>`;
  }
}

//search city
function search(cityname) {
  let apiKey = "5e495a0f30ae782754537f5c56c584c1";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeather);
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function showCity(event) {
  event.preventDefault();
  let cityname = document.querySelector("#city-input").value;
  search(cityname);
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", showCity);

//date
let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

search("Miami");

//convert temperatures
function convertFah(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector(".temperature");
  celTemp.classList.remove("active");
  fahTemp.classList.add("active");

  let fahTemperature = (celciusTemperature * 9) / 5 + 32;
  /*  temperature = Number(temperature); */
  temperatureElement.innerHTML = Math.round(fahTemperature);
}

function convertCel(event) {
  event.preventDefault();
  celTemp.classList.add("active");
  fahTemp.classList.remove("active");
  let temperatureElement = document.querySelector(".temperature");
  /* temperature = Number(temperature); */
  temperatureElement.innerHTML = Math.round(celciusTemperature);
}
let celciusTemperature = null;
let fahTemp = document.querySelector(".fahrenheit");
fahTemp.addEventListener("click", convertFah);
let celTemp = document.querySelector(".celcius");
celTemp.addEventListener("click", convertCel);
