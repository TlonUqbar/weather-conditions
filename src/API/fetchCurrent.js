import {DateTime} from "luxon";
import * as vars from "../../src/index.js";
import { extractData as extractWeatherData } from "../helpers/extractData.js";
import { populateCurrent } from "../DOM-Related/populate-dom.js";


export function fetchCurrent(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  let now;
  let currentWeather = {};
  let info = {};
  let temperature = `temperature_unit=${globalThis.preferred.temperature}`;
  let precipitation = `precipitation_unit=${globalThis.preferred.precip}`;
  let wind = `wind_speed_unit=${globalThis.preferred.speed}`;
  let units = `${temperature}&${precipitation}&${wind}`;
  

  console.log("var units: ", units);

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
      // console.log("added info;", info);
      localStorage.setItem("info", JSON.stringify(info));
    })
    .then( () => populateCurrent(currentWeather))
    .then( () => localStorage.setItem("currentWeather", JSON.stringify(currentWeather)) )
    .catch(error => console.log("error", error));
}