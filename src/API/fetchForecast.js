
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
  let tUnit = vars.preferred.temp; // = "celsius";
  let sUnit = vars.preferred.speed; // = "knots";
  let pUnit = vars.preferred.precip; // = "mm";
  let temperature = `temperature_unit=${tUnit}`;
  let precipitation = `precipitation_unit=${pUnit}`;
  let wind = `wind_speed_unit=${sUnit}`;
  let units = `${temperature}&${precipitation}&${wind}`;

    
    // vars.preferred.temp = "celsius";
    // vars.preferred.speed = "mph";
    // vars.preferred.speed = "kmh";
    // vars.preferred.precip = "mm";
    // vars.preferred.precip = "inch";

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