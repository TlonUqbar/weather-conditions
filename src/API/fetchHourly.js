import * as vars from "../../src/index.js";
import { extractData as extractWeatherData } from "../helpers/extractData.js";
import { populateHourly } from "../DOM-Related/populate-dom.js";

export function fetchHourly(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  // let units = `${vars.temperature}&${vars.precipitation}&${vars.wind}`;
  let hourlyWeather = {};
  let hour;
  // &current=is_day

  let temperature = `temperature_unit=${vars.preferred.temperature}`;
  let precipitation = `precipitation_unit=${vars.preferred.precip}`;
  let wind = `wind_speed_unit=${vars.preferred.speed}`;
  let units = `${temperature}&${precipitation}&${wind}`;

  console.log("vars: ", units);

  fetch(`${vars.weatherEndpoint}?${latitude}&${longitude}&${vars.hourly}&${units}&${timezone}&${vars.forecast}`, vars.requestOptions)
  .then( response => response.json())
  .then( (json) => hour = json )
  .then( () => hourlyWeather = extractWeatherData(hour, "hourly"))
  .then( () => populateHourly(hourlyWeather))
  .then( () => localStorage.setItem("hourlyWeather", JSON.stringify(hourlyWeather)) )
  .catch( error => console.log("error", error));
}
