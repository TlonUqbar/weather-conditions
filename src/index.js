
// import { init } from "es-module-lexer";
import "./styles.css";
import {DateTime} from "luxon";
import * as pDOM from "./DOM-Related/populate-dom.js";

let choice = document.querySelectorAll(".btn");


choice.forEach( (item) => {
  item.addEventListener("click", (e) => changeLocations(e) ); 
});

 
async function changeLocations(e) {
  e.preventDefault();
  e.stopPropagation();
  let newCity = e.target.getAttribute('data-choice');

  let location = await fetchGeoCodingData(newCity);
  console.log("gps", location);

  fetchCurrentWeather(location);
  fetchDailyWeather(location);
  fetchHourlyWeather(location);
}


const weatherEndpoint = "https://api.open-meteo.com/v1/forecast";
let current = 'current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m';
let daily = 'daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant';
let hourly = 'hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,visibility,wind_speed_10m,wind_direction_10m';
let temperature = 'temperature_unit=fahrenheit';
let precipitation = 'precipitation_unit=inch';
let wind = 'wind_speed_unit=mph';
let units = `${temperature}&${precipitation}&${wind}`;
let timezone = 'timezone=America%2FLos_Angeles';
let forecast4 = 'forecast_days=4';
let forecast = "forecast_days=1";


let datetime_dom = document.querySelector(".datetime");

const API_KEY = "MTQ2MmQyMTUwZTRkNDg3ZmEwNzE3ODA4MjI1ZjE4YzU=";
let token;


const requestOptions = {
  method: "GET",
  redirect: "follow",
  mode: "cors"
};


if(document.readyState === "interactive"){
  initialize();
} 


function initialize() {
  token = window.atob(API_KEY);
  let lsKeys = Object.keys(localStorage);

  datetime_dom.querySelector(".date").textContent = DateTime.now().toLocaleString(DateTime.DATE_MED);
  datetime_dom.querySelector(".time").textContent = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE);

  return ( !lsKeys.includes("initialLocation") ) ? firstTimeVisitor() : repeatVisitor();
}


async function firstTimeVisitor(){
  fetchInitialGeoLocation();
  console.log("First Time");
}

async function repeatVisitor(){
  console.log("NOT First Time");

    let currentWeather = JSON.parse(localStorage.getItem("currentWeather"));
    let dailyWeather = JSON.parse(localStorage.getItem("dailyWeather"));
    let hourlyWeather = JSON.parse(localStorage.getItem("hourlyWeather"));
    pDOM.populateCurrent(currentWeather, "current");
    pDOM.populateDaily(dailyWeather, "daily");
    pDOM.populateHourly(hourlyWeather, "hourly");
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
    // .then( () => testSelection = startingLocation )
    .then( () => { 
      let initial = {};
      let lastVisit = DateTime.now();
      
      if( Object.keys(localStorage).includes("initialLocation")){
        initial = JSON.parse(localStorage.getItem("initialLocation"));
      }

      initial = startingLocation; 
      localStorage.setItem("initialLocation", JSON.stringify(initial)); 
      localStorage.setItem("lastVisit", JSON.stringify(lastVisit)); 
      
    })
    .then( () => fetchCurrentWeather(testSelection))
    .then( () => fetchDailyWeather(testSelection))
    .then( () => fetchHourlyWeather(testSelection))
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



function fetchGeoCodingData(userLocation){
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
    .then( (json) => { results = json; console.log("results: ", results); } )
    .then( () => { 
      listed = extractGeoLocationValues(results); 
      let myObj = listed[0];
      console.log("listed : ", myObj); 
      return myObj;
    })
    .catch( (error) => console.error(error));
}



function extractGeoLocationValues (results) {
  let myKeys = ["name", "admin1", "country_code", "country", "timezone", "latitude", "longitude"];
  let rawResults = results.results;
  let list = [];

  rawResults.forEach( element => {
    let tempObj = {};

    Object.keys(element).forEach( (k) => {
      if( myKeys.includes(k) ) {
        tempObj[`${k}`] = `${element[`${k}`]}`;
      }
    });
    list.push(tempObj);
  });

  return list;
}



function fetchCurrentWeather(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let now;
  let currentWeather = {};


  fetch(`${weatherEndpoint}?${latitude}&${longitude}&${current}&${units}&${timezone}&${forecast4}`, requestOptions)
    .then(response => response.json())
    .then( (json) => now = json)
    .then( () => { currentWeather = extractWeatherData(now, "current"); })
    // .then( () => console.log("CURRENT WEATHER!!! ", currentWeather))
    .then( () => { console.log("currentWeather city and state additions: ", userSelection.city, userSelection.state, userSelection); })
    .then( () => { 
      currentWeather.name = userSelection.city || userSelection.name; 
      currentWeather.state = userSelection.state || userSelection.admin1; 
      currentWeather.country = userSelection.country_name || userSelection.country;
    })    
    .then( () => pDOM.populateCurrent(currentWeather))
    .then( () => { localStorage.setItem("currentWeather", JSON.stringify(currentWeather)); })
    .catch(error => console.log("error", error));
}

function fetchDailyWeather(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let today;
  let dailyWeather = {};


  fetch(`${weatherEndpoint}?${latitude}&${longitude}&${daily}&${units}&${timezone}&${forecast}`, requestOptions)
  .then(response => response.json())
  .then( (json) =>  today = json )
  .then( () => dailyWeather = extractWeatherData(today, "daily") )
  // .then( () => console.log("DAILY WEATHER!!! ", dailyWeather))
  .then( () =>  pDOM.populateDaily(dailyWeather))
  .then( () => { localStorage.setItem("dailyWeather", JSON.stringify(dailyWeather)); })
  .catch( error => console.log("error", error));
}

function fetchHourlyWeather(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let hourlyWeather = {};
  let hour;
  let is_day;


  fetch(`${weatherEndpoint}?${latitude}&${longitude}&${hourly}&${units}&${timezone}&${forecast}&current=is_day`, requestOptions)
  .then( response => response.json())
  .then( (json) => hour = json)
  .then( () => hourlyWeather = extractWeatherData(hour, "hourly"))
  .then( () => hourlyWeather.is_day = hour.current.is_day )
  // .then( () => console.log("HOURLYWEATHER!!! ", hourlyWeather))
  .then( () =>  pDOM.populateHourly(hourlyWeather, is_day))
  .then( () => {localStorage.setItem("hourlyWeather", JSON.stringify(hourlyWeather)); })
  .catch( error => console.log("error", error));

}


function isArray(what) {
  return Object.prototype.toString.call(what) === '[object Array]';
}



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
  