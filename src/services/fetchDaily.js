import * as vars from "../index.js";
import { extractData as extractWeatherData } from "../utils/extractData.js";
import { populateDaily } from "../pages/populate-dom.js";
import { getUnits } from "../utils/units.js";

export function fetchDaily(userSelection){
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let timezone = `timezone=${userSelection.timezone}`;
  let setUnits = getUnits();
  let temperature = `temperature_unit=${setUnits.temperature}`;
  let precipitation = `precipitation_unit=${setUnits.precipitation}`;
  let wind = `wind_speed_unit=${setUnits.wind}`;
  let units = `${temperature}&${precipitation}&${wind}`;  
  let current ="current=is_day";
  let today;
  let dailyWeather = {};


  fetch(`${vars.weatherEndpoint}?${latitude}&${longitude}&${current}&${vars.daily}&${units}&${timezone}&${vars.forecast}`, vars.requestOptions)
  .then(response => response.json())
  .then( (json) =>  today = json )
  .then( () => dailyWeather = extractWeatherData(today, "daily") )
  .then( () => populateDaily(dailyWeather))
  .then( () => localStorage.setItem("dailyWeather", JSON.stringify(dailyWeather)))
  .catch( error => console.log("error", error));
}