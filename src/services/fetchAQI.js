import * as vars from "../../src/index.js";
import { extractData as extractWeatherData } from "../utils/extractData.js";
import { populateAQI } from "../pages/populate-dom.js";

export function fetchAQI(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  // let timezone = `timezone=${userSelection.timezone}`;
  let aqi;
  let currentIndex = {};
  let hourlyIndex = {};

  fetch(`${vars.aqiEndpoint}?${latitude}&${longitude}&${vars.aqiCurrent}&${vars.aqiHourly}&${vars.aqiForecast}`, vars.requestOptions)
    .then( (response) => response.json())
    .then( (json) => aqi = json)
    .then( () => currentIndex = extractWeatherData(aqi, "current"))
    .then( () => hourlyIndex = extractWeatherData(aqi, "hourly"))
    // .then( () => { console.table(hourlyIndex ); console.log("\n\n"); console.table(currentIndex ); } )
    .then( () => localStorage.setItem("aqi-now", JSON.stringify(currentIndex)) )
    .then( () => localStorage.setItem("aqi-hourly", JSON.stringify(hourlyIndex)) )
    .then( () => populateAQI(currentIndex, hourlyIndex) )
    .catch( error => console.log("error", error));
}