
// import {DateTime} from "luxon";
import * as vars from "../index.js";
import { extractData as extractWeatherData } from "../utils/extractData.js";
import { getUnits } from "../utils/units.js";
import { populateForecast } from "../pages/populate-dom.js";

export function fetchForecast(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  let current ="current=is_day";
  let forecast;
  let forecastWeather = {};
  let setUnits = getUnits();
  let temperature = `temperature_unit=${setUnits.temperature}`;
  let precipitation = `precipitation_unit=${setUnits.precipitation}`;
  let wind = `wind_speed_unit=${setUnits.wind}`;
  let units = `${temperature}&${precipitation}&${wind}`;

  fetch(`${vars.weatherEndpoint}?${latitude}&${longitude}&${current}&${vars.daily}&${units}&${timezone}&${vars.forecast4}`, vars.requestOptions)
  .then(response => response.json())
  .then( (json) =>  forecast = json )
  .then( () => forecastWeather = extractWeatherData(forecast, "daily") )
  .then( () => populateForecast(forecastWeather))
  .then( () => localStorage.setItem("forecastWeather", JSON.stringify(forecastWeather)))
  .catch( error => console.log("error", error));
}