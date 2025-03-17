import "./styles.css";
import {DateTime} from "luxon";
import * as pDOM from "./DOM-Related/populate-dom.js";

const aqiEndpoint = "https://air-quality-api.open-meteo.com/v1/air-quality";
const weatherEndpoint = "https://api.open-meteo.com/v1/forecast";
const API_KEY = "MTQ2MmQyMTUwZTRkNDg3ZmEwNzE3ODA4MjI1ZjE4YzU=";
const requestOptions = { method: "GET", redirect: "follow", mode: "cors" };

let aqiCurrent = "current=european_aqi,us_aqi,pm10,pm2_5,uv_index";
let aqiHourly = "hourly=pm10,pm2_5,uv_index,european_aqi,us_aqi";
let aqiForecast = "forecast_days=1";
let current = 'current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m';
let daily = 'daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant';
let hourly = 'hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,visibility,wind_speed_10m,wind_direction_10m';
let temperature = 'temperature_unit=fahrenheit';
let precipitation = 'precipitation_unit=inch';
let wind = 'wind_speed_unit=mph';
let units = `${temperature}&${precipitation}&${wind}`;
// let timezone = 'timezone=America%2FLos_Angeles';
// let timezone = `timezone=${tz}`;
let tz;
let forecast4 = 'forecast_days=4';
let forecast = "forecast_days=1";
let token;
let datetime_dom = document.querySelector(".datetime");
let modal = document.querySelector("#myModal");
let search = document.querySelector("#myBtn");
let span = document.querySelector(".close");
let find = document.querySelector(".search");
let input = document.querySelector("input");
let is_day;



const user_settings = {
  "temperature": "",
  "humidty" : "",
  "wind_speed" : "",
  "precipitation" : "",
};
const USACA = {
  "temperature": "°F",
  "humidty" : "%",
  "wind_speed" : "mph",
  "precipitation" : "inch",
};
const defaults = {
  "temperature": "°C",
  "humidty" : "%",
  "wind_speed" : "km/h",
  "precipitation" : "mm",
 };




// let settings = (function setup(){
//   let tempUnit = "°F";
//   let humidityUnit = "%";
//   let windSpeedUnit = "mp/h";
//   function get
// })();



// const addMove = (row, column, player) => {
//   if (board[row][column].getToken() === "_") {
//     board[row][column].setToken(player);
//   } else {
//     return;
//   }
// }; 

// const TestObj = function() {

//   let tempUnits = "°F";

//   const getTempUnits = function(){ return tempUnits; };
//   const setTempUnits = function(value){ tempUnits = value;};

//   return{
//     getTempUnits, setTempUnits
//   };
// };

// console.log("testOBJ: ", TestObj);
// console.log("Attempting to directly access tempUnits: ", TestObj.tempUnits);
// console.log("Attempting to directly access tempUnits: ", TestObj.tempUnits =  "°K");
// console.log("Attempting to directly access tempUnits: ", TestObj.tempUnits);
// console.log("Getting tempUnits: ", TestObj.getTempUnits());
// console.log("Setting tempUnits to '°C': ", TestObj.setTempUnits("°C") );
// console.log("Getting new tempUnits: ", TestObj.getTempUnits());


if(document.readyState === "interactive"){ initialize(); } 

search.addEventListener("click", () => { modal.classList.add("show"); });
span.addEventListener("click", () => closeModal());
window.addEventListener("click", (e) => { if (e.target === modal){ closeModal(); }  });

find.addEventListener("click", () => {
  findLocation();
});

window.addEventListener("keydown", (e) => {
  switch(e.code){
    case "Enter" :
    case "NumpadEnter" : findLocation();
      break;
    case "Escape" : input.value = ""; 
      break;
    default : break;
  }
});


function findLocation(){
  if( input.value !== ""){
    let enc = new URLSearchParams({ input: input.value});
    enc = enc.get("input");
    switchLocations(enc);
  }
}

export function closeModal(){
  modal.classList.remove("show");
  document.querySelector(".info").classList.remove("hide");
  document.querySelectorAll(".result").forEach( (l) => { l.remove(); });
}

export function testLocation( testing ){
  // console.log("testing: ", testing );
  fetchCurrentWeather(testing);
  fetchDailyWeather(testing);
  fetchForecastWeather(testing);
  fetchHourlyWeather(testing);
  fetchAirQualityIndex(testing);

}

async function switchLocations(city){
  let location = await fetchGeoCodedLocation(city);
  pDOM.populatedGeoCoding(location);
  document.querySelector(".info").classList.add("hide");
}

function initialize() {
  token = window.atob(API_KEY);
  let lsKeys = Object.keys(localStorage);

  // if( Object.keys(localStorage).includes("is_day") ) {

  // }

  datetime_dom.querySelector(".date").textContent = DateTime.now().toLocaleString(DateTime.DATE_MED);
  datetime_dom.querySelector(".time").textContent = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE);

  return ( !lsKeys.includes("initialLocation") ) ? firstTimeVisitor() : repeatVisitor();
}


async function firstTimeVisitor(){ fetchInitialGeoLocation(); }

async function repeatVisitor(){
    let currentWeather = JSON.parse(localStorage.getItem("currentWeather"));
    let dailyWeather = JSON.parse(localStorage.getItem("dailyWeather"));
    let forecastWeather = JSON.parse(localStorage.getItem("forecastWeather"));
    let hourlyWeather = JSON.parse(localStorage.getItem("hourlyWeather"));
    let airNow = JSON.parse(localStorage.getItem("aqi-now"));
    let airHour = JSON.parse(localStorage.getItem("aqi-hourly"));
    let dt = JSON.parse(localStorage.getItem("info")).is_day;
    console.log("daytime: ", dt );
    pDOM.populateCurrent(currentWeather);
    pDOM.populateDaily(dailyWeather);
    pDOM.populateHourly(hourlyWeather);
    pDOM.populateForecast(forecastWeather);
    pDOM.populateAQI(airNow, airHour);
}


async function fetchInitialGeoLocation(){
  let baseURL = "https://api.ipgeolocation.io/ipgeo";
  let apiKey = `apiKey=${token}`;
  let results;
  let startingLocation;
  let testSelection = {}  ;
  
  return await fetch(`${baseURL}?${apiKey}`, requestOptions)
    .then( (response) => response.json() )
    .then( (json) => results = json )
    .then( () => { startingLocation = extractIPGeoValues(results); testSelection = startingLocation; })
    .then( () => { 
      let initial = {};
      let info = {};
      
      if( Object.keys(localStorage).includes("initialLocation")){
        initial = JSON.parse(localStorage.getItem("initialLocation"));
      }

      initial = startingLocation; 
      info.location = initial;
    
      localStorage.setItem("initialLocation", JSON.stringify(initial)); 
      localStorage.setItem("info", JSON.stringify(info));
    })
    .then( () => fetchCurrentWeather(testSelection))
    .then( () => fetchDailyWeather(testSelection))
    .then( () => fetchForecastWeather(testSelection))
    .then( () => fetchHourlyWeather(testSelection))
    .then( () => fetchAirQualityIndex(testSelection) )
    .then( () => { return testSelection; })
    .catch( (error) => console.error(error) );
}


function extractIPGeoValues(results) {
  let geocoded = {};

  geocoded.city = results.city;
  geocoded.country = results.country_name;
  geocoded.country_code = results.country_code3;
  geocoded.state = results.state_prov;
  geocoded.postalcode = results.zipcode;
  geocoded.latitude = results.latitude;
  geocoded.longitude = results.longitude;
  geocoded.timezone = results.time_zone.name;

  return geocoded;
}


function fetchGeoCodedLocation(userLocation){
  let encodedLocation = userLocation.replace(/\W/g, '+');
  let baseURL = "https://geocoding-api.open-meteo.com/v1/search";
  let name = `name=${encodedLocation}`;
  let count = "count=10";
  let language = "language=en";
  let format = "format=json";
  let results;
  let listed = {};


  return fetch(`${baseURL}?${name}&${count}&${language}&${format}`, requestOptions)
    .then( (response) => response.json() )
    .then( (json) => { results = json; } )
    .then( () => { listed = extractGeoLocationValues(results); console.table(listed); return listed; } )
    .catch( (error) => console.error(error));
}


function extractGeoLocationValues (results) {
  let myKeys = ["name", "admin1", "country_code", "country", "timezone", "latitude", "longitude"];
  let rawResults = results.results;
  let list = [];

  if( rawResults && rawResults !== 'null' && rawResults !== 'undefined' ){
    rawResults.forEach( element => {
      let tempObj = {};

      Object.keys(element).forEach( (k) => {
        if( myKeys.includes(k) ) { tempObj[`${k}`] = `${element[`${k}`]}`;}
      });
      list.push(tempObj);
    });
    return list;
  } else { return "Location not found"; }
}


function fetchCurrentWeather(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  let now;
  let currentWeather = {};
  let info = {};

  fetch(`${weatherEndpoint}?${latitude}&${longitude}&${current}&${units}&${timezone}&${forecast}`, requestOptions)
    .then(response => response.json())
    .then( (json) => now = json  )
    // .then( () => console.log("current results:", now ) )
    .then( () => currentWeather = extractWeatherData(now, "current") )
    .then( () => { 
      currentWeather.name = userSelection.city || userSelection.name; 
      currentWeather.state = userSelection.state || userSelection.admin1; 
      currentWeather.country = userSelection.country_name || userSelection.country;
    })    
    .then( () => {
      info = JSON.parse(localStorage.getItem("info"));
      info.is_day = currentWeather.is_day;
      info.updated = currentWeather.time;
      info.lastVisit = DateTime.now().set({millisecond: 0, second: 0}).toISO({includeOffset: false, suppressMilliseconds: true, suppressSeconds: true, format: 'extended'}).toString();
      // console.log("added info;", info);
      localStorage.setItem("info", JSON.stringify(info));
    })
    .then( () => pDOM.populateCurrent(currentWeather))
    .then( () => localStorage.setItem("currentWeather", JSON.stringify(currentWeather)) )
    .catch(error => console.log("error", error));
}

function fetchForecastWeather(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  let current ="current=is_day";
  let forecast;
  let forecastWeather = {};

  fetch(`${weatherEndpoint}?${latitude}&${longitude}&${current}&${daily}&${units}&${timezone}&${forecast4}`, requestOptions)
  .then(response => response.json())
  .then( (json) =>  forecast = json )
  // .then( () => console.log("Forecast: ", forecast))
  .then( () => forecastWeather = extractWeatherData(forecast, "daily") )
  .then( () => pDOM.populateForecast(forecastWeather))
  .then( () => localStorage.setItem("forecastWeather", JSON.stringify(forecastWeather)))
  .catch( error => console.log("error", error));
}

function fetchDailyWeather(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  let current ="current=is_day";
  let today;
  let dailyWeather = {};

  fetch(`${weatherEndpoint}?${latitude}&${longitude}&${current}&${daily}&${units}&${timezone}&${forecast}`, requestOptions)
  .then(response => response.json())
  .then( (json) =>  today = json )
  .then( () => dailyWeather = extractWeatherData(today, "daily") )
  .then( () => pDOM.populateDaily(dailyWeather))
  .then( () => localStorage.setItem("dailyWeather", JSON.stringify(dailyWeather)))
  .catch( error => console.log("error", error));
}

function fetchHourlyWeather(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  let hourlyWeather = {};
  let hour;
  // &current=is_day

  fetch(`${weatherEndpoint}?${latitude}&${longitude}&${hourly}&${units}&${timezone}&${forecast}`, requestOptions)
  .then( response => response.json())
  .then( (json) => hour = json )
  .then( () => hourlyWeather = extractWeatherData(hour, "hourly"))
  .then( () => pDOM.populateHourly(hourlyWeather))
  .then( () => localStorage.setItem("hourlyWeather", JSON.stringify(hourlyWeather)) )
  .catch( error => console.log("error", error));
}

function isArray(what){ return Object.prototype.toString.call(what) === '[object Array]'; }

function extractWeatherData(weather, section){
  const rawData = weather[`${section}`];
  let testObj = {};

  Object.keys(rawData).forEach( key => {
    if(isArray(rawData[key])) {
      testObj[`${key}`] = rawData[`${key}`];
    } else {
      testObj[`${key}`] = `${rawData[`${key}`]}`;
    }    
  });
  return testObj;
}
  

function fetchAirQualityIndex(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let aqi;
  let currentIndex = {};
  let hourlyIndex = {};

  fetch(`${aqiEndpoint}?${latitude}&${longitude}&${aqiCurrent}&${aqiHourly}&${aqiForecast}`, requestOptions)
    .then( (response) => response.json())
    .then( (json) => aqi = json)
    .then( () => currentIndex = extractWeatherData(aqi, "current"))
    .then( () => hourlyIndex = extractWeatherData(aqi, "hourly"))
    .then( () => localStorage.setItem("aqi-now", JSON.stringify(currentIndex)) )
    .then( () => localStorage.setItem("aqi-hourly", JSON.stringify(hourlyIndex)) )
    .then( () => pDOM.populateAQI(currentIndex, hourlyIndex) )
    .catch( error => console.log("error", error));
}