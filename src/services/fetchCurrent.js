import {DateTime} from "luxon";
import * as vars from "../index.js";
import { extractData as extractWeatherData } from "../utils/extractData.js";
import { populateCurrent } from "../pages/populate-dom.js";
import { getUnits } from "../utils/units.js";



export function fetchCurrent(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  let now;
  let currentWeather = {};
  let info = {};
  let setUnits = getUnits();
// console.log("current units", setUnits.wind);
  let temperature = `temperature_unit=${setUnits.temperature}`;
  let precipitation = `precipitation_unit=${setUnits.precipitation}`;
  let wind = `wind_speed_unit=${setUnits.wind}`;
  let units = `${temperature}&${precipitation}&${wind}`;

  console.log("current units", setUnits);

  fetch(`${vars.weatherEndpoint}?${latitude}&${longitude}&${vars.current}&${units}&${timezone}&${vars.forecast}`, vars.requestOptions)
    .then(response => response.json())
    .then( (json) => now = json  )
    .then( () => console.log("current results:", now ) )
    .then( () => currentWeather = extractWeatherData(now, "current") )
    .then( () => { 
      currentWeather.name = userSelection.city || userSelection.name; 
      currentWeather.state = userSelection.state || userSelection.admin1; 
      currentWeather.country = userSelection.country_name || userSelection.country;
      currentWeather.country_code = userSelection.country_code || userSelection.country_code2; 
      currentWeather.timezone = userSelection.timezone || userSelection.time_zone.name;
      currentWeather.tz = now.timezone_abbreviation;
      localStorage.setItem("currentLocation", currentWeather.name);
    })    
    .then( () => {
      info = JSON.parse(localStorage.getItem("info"));
      info.is_day = currentWeather.is_day;
      info.updated = currentWeather.time;
      info.lastVisit = DateTime.now().set({millisecond: 0, second: 0}).toISO({includeOffset: false, suppressMilliseconds: true, suppressSeconds: true, format: 'extended'}).toString();
      localStorage.setItem("info", JSON.stringify(info));
    })
    .then( () => populateCurrent(currentWeather))
    .then( () => localStorage.setItem("currentWeather", JSON.stringify(currentWeather)) )
    .catch(error => console.log("error", error));
}