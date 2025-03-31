
// import {DateTime} from "luxon";
import * as vars from "../../src/index.js";
import { extractData as extractWeatherData } from "../helpers/extractData.js";
import { populateForecast } from "../DOM-Related/populate-dom.js";

export function fetchForecast(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  let current ="current=is_day";
  let forecast;
  let forecastWeather = {};
  let temperature = `temperature_unit=${globalThis.preferred.temp}`;
  let precipitation = `precipitation_unit=${globalThis.preferred.precip}`;
  let wind = `wind_speed_unit=${globalThis.preferred.speed}`;
  let units = `${temperature}&${precipitation}&${wind}`;


  console.log("vars F: ", units);

  fetch(`${vars.weatherEndpoint}?${latitude}&${longitude}&${current}&${vars.daily}&${units}&${timezone}&${vars.forecast4}`, vars.requestOptions)
  .then(response => response.json())
  .then( (json) =>  forecast = json )
  // .then( () => console.log("Forecast: ", forecast))
  .then( () => forecastWeather = extractWeatherData(forecast, "daily") )
  .then( () => populateForecast(forecastWeather))
  .then( () => localStorage.setItem("forecastWeather", JSON.stringify(forecastWeather)))
  .catch( error => console.log("error", error));
}