import { DateTime, Settings } from "luxon";
import "./assets/styles/styles.css";
import * as pDOM from "./pages/populate-dom.js";
import * as pref from "./utils/units.js";
import { geoCoding as fetchGeoCodedLocation }  from "./services/geoCoding.js";
import { fetchCurrent as fetchCurrentWeather } from "./services/fetchCurrent.js";
import { fetchDaily as fetchDailyWeather } from "./services/fetchDaily.js";
import { fetchForecast as fetchForecastWeather } from "./services/fetchForecast.js";
import { fetchHourly as fetchHourlyWeather } from "./services/fetchHourly.js";
import { fetchAQI as fetchAirQualityIndex } from "./services/fetchAQI.js";
import { fetchInitial as fetchInitialGeoLocation }  from "./services/fetchInitial.js";
import { modalResults as populatedGeoCoding } from "./partials/modalResults.js";


const API_KEY = "MTQ2MmQyMTUwZTRkNDg3ZmEwNzE3ODA4MjI1ZjE4YzU=";
export const aqiEndpoint = "https://air-quality-api.open-meteo.com/v1/air-quality";
export const weatherEndpoint = "https://api.open-meteo.com/v1/forecast";
export const requestOptions = { method: "GET", redirect: "follow", mode: "cors" };
export let aqiCurrent = "current=european_aqi,us_aqi,pm10,pm2_5,uv_index";
export let aqiHourly = "hourly=pm10,pm2_5,uv_index,european_aqi,us_aqi";
export let aqiForecast = "forecast_days=1";
export let current = 'current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m';
export let daily = 'daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant';
export let hourly = 'hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,visibility,wind_speed_10m,wind_direction_10m';
export let forecast4 = 'forecast_days=4';
export let forecast = "forecast_days=1";
export let token;

let modal = document.querySelector("#myModal");
let search = document.querySelector("#myBtn");
let settings = document.querySelector("#preferences");
let set = document.querySelector("#myBtn2");
let span = document.querySelector(".close");
let span2 = document.querySelector(".close2");
let find = document.querySelector(".search");
let input = document.querySelector("input");
let save = document.querySelector(".save");

if(document.readyState === "interactive"){ initialize(); } 

save.addEventListener("click", () => { savePrefs(); closeModal(); });
set.addEventListener("click", () => { settings.classList.add("show"); });
search.addEventListener("click", () => { modal.classList.add("show"); pDOM.searchedLocations(); });
span.addEventListener("click", () => closeModal());
span2.addEventListener("click", () => closeModal());
window.addEventListener("click", (e) => { if (e.target === modal || e.target === settings ){ closeModal(); }   });
find.addEventListener("click", () => { findLocation(); });

window.addEventListener("keydown", (e) => {
  switch(e.code){
    case "Enter" :
    case "NumpadEnter" : findLocation(); break;
    case "Escape" : input.value = ""; break;
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
  settings.classList.remove("show");
  document.querySelector(".info").classList.remove("hide");
  document.querySelector(".searches").classList.remove('hide');
  document.querySelectorAll(".result").forEach( (l) => { l.remove(); });
}


async function savePrefs(){
  let temp = document.querySelector("input[type='radio'][name=temp]:checked").value;
  let precip = document.querySelector("input[type='radio'][name=precip]:checked").value;
  let speed = document.querySelector("input[type='radio'][name=wind]:checked").value;
  let results = document.querySelector("#results").value;

  pref.setUnits(precip, speed, results);
  changeUnits(temp, precip, speed, results);
}


export function testLocation( location ){
  fetchCurrentWeather(location);
  fetchDailyWeather(location);
  fetchForecastWeather(location);
  fetchHourlyWeather(location);
  fetchAirQualityIndex(location);
  pDOM.searchedLocations();
}


async function switchLocations(city){
  let location = await fetchGeoCodedLocation(city);
  
  populatedGeoCoding(location);
  document.querySelector(".info").classList.add("hide");
}


function initialize() {
  token = window.atob(API_KEY);
  let lsKeys = Object.keys(localStorage);
  setRadios();

  return ( !lsKeys.includes("info") ) ? firstTimeVisitor() : repeatVisitor();
}


async function firstTimeVisitor(){ fetchInitialGeoLocation(); }


async function repeatVisitor(){
  let currentWeather = JSON.parse(localStorage.getItem("currentWeather"));
  let dailyWeather = JSON.parse(localStorage.getItem("dailyWeather"));
  let forecastWeather = JSON.parse(localStorage.getItem("forecastWeather"));
  let hourlyWeather = JSON.parse(localStorage.getItem("hourlyWeather"));
  let airNow = JSON.parse(localStorage.getItem("aqi-now"));
  let airHour = JSON.parse(localStorage.getItem("aqi-hourly"));
  // let searchedLocations = JSON.parse(localStorage.getItem("searchedLocations"));  
  let location = pref.getLocation();
  let timestamp = JSON.parse(localStorage.getItem('currentWeather')).time;
  let nextUpdate = DateTime.fromISO(timestamp).plus({minutes: 15}).toISO();
  let now = DateTime.local().toISO();

  console.log("now: ", now, " stamp: ", timestamp, " next: ", nextUpdate);
  // console.log("comparing to timestamp", timestamp <= now);
  // console.log("comparing to nextUpdate", nextUpdate <= now);


  if( nextUpdate <= now ){
    testLocation(location);
    // console.log("initiating update . . .");
  }

  pDOM.populateCurrent(currentWeather);
  pDOM.populateDaily(dailyWeather);
  pDOM.populateHourly(hourlyWeather);
  pDOM.populateForecast(forecastWeather);
  pDOM.populateAQI(airNow, airHour);
  // pDOM.searchedLocations();
}


function setRadios(){
  let units = pref.getUnits();
  let temp =  units.temperature;
  let precip = units.precipitation;
  let speed = units.wind;
  let results = units.results;

  switch (temp) {
    case 'celsius': document.querySelector('#celsius').checked = true; break;
    case 'fahrenheit': document.querySelector('#fahrenheit').checked = true; break;
    default: break;
  }

  switch (precip) {
    case 'mm': document.querySelector('#millimeter').checked = true; break;
    case 'inch': document.querySelector('#inch').checked = true; break;
    default: break;
  }

  switch (speed) {
    case "kmh": document.querySelector("#kmh").checked = true; break;
    case "mph": document.querySelector("#mph").checked = true; break;
    case "ms" : document.querySelector("#ms").checked = true; break;
    case "kn" : document.querySelector("#knots").checked = true; break;
    default: break;
  }

  document.querySelector('#results').value = results;
}


async function changeUnits(temp, precip, speed, results){
  let location = pref.getLocation();
  pref.setUnits(temp, precip, speed, results);

  fetchCurrentWeather(location);
  fetchDailyWeather(location);
  fetchForecastWeather(location);
  fetchHourlyWeather(location);
  fetchAirQualityIndex(location);
}

function clearStorage(){
  Object.keys(localStorage).forEach((key) => localStorage.removeItem(key));
  // or use localStorage.clear();
}
