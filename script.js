
const locationInput = document.getElementById('location-input');
const searchBtn = document.getElementById('search-btn');
const detectedLocationBtn = document.getElementById('detected-location');
const locationImgText = document.getElementById('location-image-text');

const currentWeatherImg = document.getElementById('current-weather-img');
const currentWeatherDes = document.getElementById('current-weather-des');
const currentTemp = document.getElementById('current-temp');
const currentWind = document.getElementById('current-wind');
const currentHumidity = document.getElementById('humidity');
const currentDate = document.getElementById('current-date');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const forecastDiv = document.getElementById('forecastDiv');

const week = ['Sun','Mon','Tue','Wed', 'Thu','Fri','Sat'];
const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
const houstonLonLat = [-95.358421, 29.749907];
const apiKey = 'ee759a30a9b8bfdc78fd32c59d9d8abc';
const lngLatSearch = [];




async function getWeather(longLat) {
    try {
        const weatherPromise = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${longLat[1]}&lon=${longLat[0]}&appid=${apiKey}`);
        const weatherData = await weatherPromise.json();
        const currentDateTime = new Date(weatherData.dt *1000);
        currentTemp.textContent = kelvinToFahr(weatherData.main.temp) + "°";
        currentWind.textContent = Math.round((weatherData.wind.speed*2.2369) * 10) / 10 + " mph";
        currentDate.textContent = `${week[currentDateTime.getDay()]} ${getMonthDate(weatherData.dt)} ${currentDateTime.getFullYear()}`;
        currentHumidity.textContent = weatherData.main.humidity + "%";
        currentWeatherDes.textContent = weatherData.weather[0].description.toUpperCase();
        currentWeatherImg.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;

        //get unix time format to dateTime format for sunset and sunrise
        const sunriseDateTime = new Date(weatherData.sys.sunrise*1000);
        const sunsetDateTime = new Date(weatherData.sys.sunset*1000);
        sunrise.textContent = `${formattedTime(sunriseDateTime)}AM`;
        sunset.textContent = `${formattedTime(sunsetDateTime)}PM`;
    } catch (error) {
        console.log(error)
    }
}

async function getForecast(longLat){
 try {
    const forecastPromise = await fetch (`https://api.openweathermap.org/data/2.5/forecast?lat=${longLat[1]}&lon=${longLat[0]}&appid=${apiKey}&units=imperial`);
    const forecastObject = await forecastPromise.json();
    const forecastData = forecastObject.list;

    const forecastHTML = [];

    for (let i = 0; i < forecastData.length; i++) {
        const eachElement = `<div class="d-flex flex-column me-5">
        <img class="" src="http://openweathermap.org/img/wn/${forecastData[i].weather[0].icon}@2x.png" alt="" width="40" height="40">
        <p style="color: #000d63;">${forecastData[i].main.temp.toString().substr(0,2)}°</p>
        <p>${forecastData[i].dt_txt.substr(10,6)}</p>
        <h5>${getMonthDate(forecastData[i].dt)}</h5>
        </div>`;
        forecastHTML.push(eachElement);
    }
    forecastDiv.innerHTML = forecastHTML.join('');
 } catch (error) {
    
 }
}

function getMonthDate(unixDateTime){
    const dateTimeOject = new Date(unixDateTime * 1000);
    const month = dateTimeOject.getMonth();
    const date = dateTimeOject.getDate();
    return `${monthArr[month]} ${date}`;
}



function kelvinToFahr(temp){
    return Math.floor(1.8*(temp-273)+32);
}

function formattedTime(dateTime){
    var minutes = "0" + dateTime.getHours();

    var seconds = "0" + dateTime.getMinutes();


    return minutes.substr(-2) + ':' + seconds.substr(-2);
}



window.addEventListener('DOMContentLoaded', (e) => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((loc) => {
            lngLatSearch[0] = loc.coords.longitude;
            lngLatSearch[1] = loc.coords.latitude;
            getWeather(lngLatSearch);
            getForecast(lngLatSearch);
        })
    }else{
        lngLatSearch[0] = -95.358421;
        lngLatSearch[1] = 29.749907;
        getWeather(lngLatSearch);
        getForecast(lngLatSearch);

    }
    
});


function initMap(){
    autocomplete = new  google.maps.places.Autocomplete(locationInput, 
    {
        componentRestrictions: {'country': ['us']},
        fields: ['geometry','name','address_components'],
        types: ['geocode']
    })

    autocomplete.addListener('place_changed', () => {
        const location = autocomplete.getPlace();
        lngLatSearch[0] = location.geometry.location.lng();
        lngLatSearch[1] = location.geometry.location.lat();

    })
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        locationImgText.textContent = location.name;
        getWeather(lngLatSearch);
        getForecast(lngLatSearch);
    })

}
initMap();


