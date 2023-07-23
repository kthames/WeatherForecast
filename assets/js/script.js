var searchFormEl = document.querySelector('#search-form');
var searchFormBtn = document.querySelector('#form-button');
var searchHistory = document.querySelector('#search-history')

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var newCity = document.querySelector('#search-input').value;

  if (!newCity) {
    console.error('You need a search input value!');
    return;
  }

  var cities = readCitiesFromStorage();
  cities.unshift(newCity);
  saveCitiesToStorage(cities);

  printWeatherData(newCity);
  printSearchHistory(cities);
}//gets city from user input


searchHistory.addEventListener("click", function(event) {
    event.preventDefault();
    var element = event.target;

    var historyCity = element.innerHTML;
    console.log(historyCity);

    printWeatherData(historyCity);
})


function readCitiesFromStorage() {
  var cities = localStorage.getItem('cities');
  if (cities) {
    cities = JSON.parse(cities);
  } else {
    cities = [];
  }
  console.log(cities);
  return cities;
}//reads cities from storage

// Takes an array of projects and saves them in localStorage.
function saveCitiesToStorage(cities) {
  localStorage.setItem('cities', JSON.stringify(cities));
}

function printSearchHistory(cities) {
  //print so they are present at page load
  searchHistory.innerHTML = ""

  cities = cities.splice(0, 8);
  console.log(cities);

  for(let i = 0; i < cities.length; i++) {
    var buttonEl = document.createElement('button');
    buttonEl.classList.add('btn', 'btn-primary');
    buttonEl.setAttribute('type', 'button');
    buttonEl.innerHTML = `${cities[i]}`;

    searchHistory.append(buttonEl);
  }
}

async function printWeatherData(city) {

  let currentDay = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=imperial&q=${city}`; 

  let urlGetCity = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

  let current = await (await fetch(currentDay)).json();
  let forecast = await (await fetch(urlGetCity)).json();
  
  console.log(current, forecast);
  console.log(forecast[0].lat, forecast[0].lon);

  var lat = forecast[0].lat;
  var lon = forecast[0].lon;

  let urlFiveDays = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  let fiveDays = await (await fetch(urlFiveDays)).json();

  console.log(fiveDays);

  document.querySelector('.weather-cards').innerHTML = `
    <div class = "main-card">
      <h3>${city} (${new Date(current.dt*1000).toLocaleDateString()})</h3>
      <p>Temp: ${current.main.temp} °F</p>
      <p>Wind: ${current.wind.speed} MPH</p>
      <p>Humidity: ${current.main.humidity} %</p>
      <img src=${`https://openweathermap.org/img/w/${current.weather[0].icon}.png`}>
    </div>
    <h3>5-Day Forecast:</h3>
    <div class = "five-cards row"></div>`

    //for loop that skips through 8 index at a time for five days
  var fiveCards = document.querySelector('.five-cards');

  for(let i = 7; i < 40 ; i += 8) {
    
    var weatherCard = document.createElement('div');
    weatherCard.classList.add('col', 'fiveDayCard');
    console.log(i);

    fiveCards.append(weatherCard);

    var dateEl = document.createElement('h4');
    dateEl.innerHTML =
    `(${new Date((fiveDays.list[i].dt)*1000).toLocaleDateString()})`

    var tempEl = document.createElement('p');
    tempEl.innerHTML =
    `Temp: ${fiveDays.list[i].main.temp} °F `;

    var windEl = document.createElement('p');
    windEl.innerHTML =
    `Wind: ${fiveDays.list[i].wind.speed} MPH`;

    var humidityEl = document.createElement('p');
    humidityEl.innerHTML =
    `Humidity: ${fiveDays.list[i].main.humidity} %`;

    var weatherIcon = document.createElement('img');
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/w/${fiveDays.list[i].weather[0].icon}.png`);

    weatherCard.append(dateEl,tempEl,windEl,humidityEl,weatherIcon);
  }

}//prints selected city's weather data to DOM

function init() {
  var cities = readCitiesFromStorage();
  printSearchHistory(cities);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);
init();