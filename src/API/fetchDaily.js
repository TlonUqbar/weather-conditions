// import {DateTime} from "luxon";
import * as vars from "../../src/index.js";
import { extractData as extractWeatherData } from "../helpers/extractData.js";
import { populateDaily } from "../DOM-Related/populate-dom.js";

export function fetchDaily(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  // let units = `${vars.temperature}&${vars.precipitation}&${vars.wind}`;
  let temperature = `temperature_unit=${globalThis.preferred.temperature}`;
  let precipitation = `precipitation_unit=${globalThis.preferred.precip}`;
  let wind = `wind_speed_unit=${globalThis.preferred.speed}`;
  let units = `${temperature}&${precipitation}&${wind}`;  
  let current ="current=is_day";
  let today;
  let dailyWeather = {};


  
  console.log("vars D: ", units);

  fetch(`${vars.weatherEndpoint}?${latitude}&${longitude}&${current}&${vars.daily}&${units}&${timezone}&${vars.forecast}`, vars.requestOptions)
  .then(response => response.json())
  .then( (json) =>  today = json )
  .then( () => dailyWeather = extractWeatherData(today, "daily") )
  .then( () => populateDaily(dailyWeather))
  .then( () => localStorage.setItem("dailyWeather", JSON.stringify(dailyWeather)))
  .catch( error => console.log("error", error));
}