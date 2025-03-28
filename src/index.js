import "./styles.css";
import {DateTime} from "luxon";
import * as pDOM from "./DOM-Related/populate-dom.js";
import { countryCodes } from "./helpers/country_codes.js"; 
import { geoCoding as fetchGeoCodedLocation }  from "./API/geoCoding";
import { fetchCurrent as fetchCurrentWeather } from "./API/fetchCurrent.js";
import { fetchDaily as fetchDailyWeather } from "./API/fetchDaily.js";
import { fetchForecast as fetchForecastWeather } from "./API/fetchForecast.js";
import { fetchHourly as fetchHourlyWeather } from "./API/fetchHourly.js";
import { fetchAQI as fetchAirQualityIndex } from "./API/fetchAQI.js";
import { fetchInitial as fetchInitialGeoLocation }  from "./API/fetchInitial.js";
import { modalResults as populatedGeoCoding } from "./partials/modalResults.js";

export const aqiEndpoint = "https://air-quality-api.open-meteo.com/v1/air-quality";
export const weatherEndpoint = "https://api.open-meteo.com/v1/forecast";
const API_KEY = "MTQ2MmQyMTUwZTRkNDg3ZmEwNzE3ODA4MjI1ZjE4YzU=";
export const requestOptions = { method: "GET", redirect: "follow", mode: "cors" };

let preferred = { 
  "temperature" : "celsius",
  "precipitation" : "mm", 
  "snow" : "inch", 
  "wind" : "kmh", 
  set temp(tUnit){ this.temperature = tUnit; },
  get temp() { return this.temperature; },
  set precip(pUnit){ this.precipitation = pUnit; },
  get precip() { return this.precipitation;},
  set speed(sUnit){ this.wind = sUnit; },
  get speed() { return this.wind;}
};

export let aqiCurrent = "current=european_aqi,us_aqi,pm10,pm2_5,uv_index";
export let aqiHourly = "hourly=pm10,pm2_5,uv_index,european_aqi,us_aqi";
export let aqiForecast = "forecast_days=1";
export let current = 'current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m';
export let daily = 'daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant';
export let hourly = 'hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,visibility,wind_speed_10m,wind_direction_10m';
export let temperature = `temperature_unit=${preferred.temp}`;
export let precipitation = `precipitation_unit=${preferred.precip}`;
export let wind = `wind_speed_unit=${preferred.speed}`;
// export let units = `${temperature}&${precipitation}&${wind}`;
// let timezone = 'timezone=America%2FLos_Angeles';
// let timezone = `timezone=${tz}`;
// let tz;
export let forecast4 = 'forecast_days=4';
export let forecast = "forecast_days=1";
export let token;

// let datetime_dom = document.querySelector(".datetime");
let modal = document.querySelector("#myModal");
let search = document.querySelector("#myBtn");
let span = document.querySelector(".close");
let find = document.querySelector(".search");
let input = document.querySelector("input");
// let is_day;
// let locationTime;


let unitsAPI = {
  "temperature": { "celsius":"°C", "fahrenheit": "°F"},
  "humidity" : "%",
  "wind_speed" : { "kilometers" : "km/h", "miles" : "mph", "meters" : "m/s", "knots" : "knots"}, 
  "precipitation": { "millimeters" : "mm", "inches" : "in" },
  "visibility": { "meters" : "m", "kilometers" : "km", "miles" :  "mi" }
};

export let searchResults = 20;




if(document.readyState === "interactive"){ initialize(); } 

search.addEventListener("click", () => { modal.classList.add("show"); });
span.addEventListener("click", () => closeModal());
window.addEventListener("click", (e) => { if (e.target === modal){ closeModal(); }  });

find.addEventListener("click", () => { findLocation(); });

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
  preferred.temp = "fahrenheit";
  // preferred.temp = "celsius";
  // preferred.speed = "mph";
  // preferred.speed = "km/h";
    // preferred.speed = "ms";
   preferred.speed = "kn";
  // preferred.precip = "mm";
  preferred.precip = "inch";
  console.log("tUnit2: ", preferred.temp);
  console.log("pUnit2: ", preferred.precip);
  console.log("sUnit2: ", preferred.speed);
  
  populatedGeoCoding(location);
  document.querySelector(".info").classList.add("hide");
}

function initialize() {
  token = window.atob(API_KEY);
  let lsKeys = Object.keys(localStorage);

  // preferred.temp = "fahrenheit";
  // preferred.temp = "celsius";
  // preferred.speed = "mph";
  // preferred.speed = "kmh";
  // preferred.speed = "ms";
  //  preferred.speed = "kn";
  // preferred.precip = "mm";
  // preferred.precip = "inch";

  console.log("tUnit: ", preferred.temp);
  console.log("pUnit: ", preferred.precip);
  console.log("sUnit: ", preferred.speed);

  //  47.5  0 9.1 - 59.5  0  9.2


  // datetime_dom.querySelector(".date").textContent = DateTime.now().toLocaleString(DateTime.DATE_MED);
  // datetime_dom.querySelector(".time").textContent = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE);

  // return ( !lsKeys.includes("initialLocation") ) ? firstTimeVisitor() : repeatVisitor();
  return ( !lsKeys.includes("info") ) ? firstTimeVisitor() : repeatVisitor();
}


async function firstTimeVisitor(){ fetchInitialGeoLocation(); console.log("First time visitor"); }

async function repeatVisitor(){
    console.log("Repeat visitor");
    let currentWeather = JSON.parse(localStorage.getItem("currentWeather"));
    let dailyWeather = JSON.parse(localStorage.getItem("dailyWeather"));
    let forecastWeather = JSON.parse(localStorage.getItem("forecastWeather"));
    let hourlyWeather = JSON.parse(localStorage.getItem("hourlyWeather"));
    let airNow = JSON.parse(localStorage.getItem("aqi-now"));
    let airHour = JSON.parse(localStorage.getItem("aqi-hourly"));
    // let dt = JSON.parse(localStorage.getItem("info")).is_day;
    // console.log("daytime: ", dt );

    pDOM.populateCurrent(currentWeather);
    pDOM.populateDaily(dailyWeather);
    pDOM.populateHourly(hourlyWeather);
    pDOM.populateForecast(forecastWeather);
    pDOM.populateAQI(airNow, airHour);
}



  

export { preferred };