var searchFormEl = document.querySelector('#search-form');
var searchFormBtn = document.querySelector('#form-button');

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

  for(let i = 0; i < 5; i++) {
    
    var weatherCard = document.createElement('div');
    weatherCard.classList.add('col');

    fiveCards.append(weatherCard);

    var dateEl = document.createElement('h4');
    dateEl.innerHTML =
    `Date ${i}`;

    var tempEl = document.createElement('p');
    tempEl.innerHTML =
    `temp`;

    var windEl = document.createElement('p');
    windEl.innerHTML =
    `wind`;

    var humidityEl = document.createElement('p');
    humidityEl.innerHTML =
    `humidity`;

    var weatherIcon = document.createElement('img');
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/w/${current.weather[0].icon}.png`);

    weatherCard.append(dateEl,tempEl,windEl,humidityEl,weatherIcon);
  }

}

function handleSearchFormSubmit(event) {
  event.preventDefault();

  var city = document.querySelector('#search-input').value;

  if (!city) {
    console.error('You need a search input value!');
    return;
  }
  
  printWeatherData(city);
}

searchFormEl.addEventListener('submit', handleSearchFormSubmit);

//function with button listener to search history items, loads for that city
