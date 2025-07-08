import * as vars from "../index.js";
import { extractData as extractWeatherData } from "../utils/extractData.js";
import { getUnits } from "../utils/units.js";
import { populateHourly } from "../pages/populate-dom.js";

export function fetchHourly(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  let hourlyWeather = {};
  let hour;
  let setUnits = getUnits();
  let temperature = `temperature_unit=${setUnits.temperature}`;
  let precipitation = `precipitation_unit=${setUnits.precipitation}`;
  let wind = `wind_speed_unit=${setUnits.wind}`;
  let units = `${temperature}&${precipitation}&${wind}`;

  fetch(`${vars.weatherEndpoint}?${latitude}&${longitude}&${vars.hourly}&${units}&${timezone}&${vars.forecast}`, vars.requestOptions)
  .then( response => response.json())
  .then( (json) => hour = json )
  .then( () => hourlyWeather = extractWeatherData(hour, "hourly"))
  .then( () => populateHourly(hourlyWeather))
  .then( () => localStorage.setItem("hourlyWeather", JSON.stringify(hourlyWeather)) )
  .catch( error => console.log("error", error));
}
