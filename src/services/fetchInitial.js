import * as vars from "../../src/index.js";
import { fetchCurrent as fetchCurrentWeather } from "./fetchCurrent.js";
import { fetchDaily as fetchDailyWeather } from "./fetchDaily.js"; 
import { fetchForecast as fetchForecastWeather } from "./fetchForecast.js";
import { fetchHourly as fetchHourlyWeather } from "./fetchHourly.js";
import { fetchAQI as fetchAirQualityIndex  } from "./fetchAQI.js";


export async function fetchInitial(){
  let baseURL = "https://api.ipgeolocation.io/ipgeo";
  let apiKey = `apiKey=${vars.token}`;
  let results;
  let startingLocation;
  let testSelection = {};
  
  return await fetch(`${baseURL}?${apiKey}`, vars.requestOptions)
    .then( (response) => response.json() )
    .then( (json) => results = json )
    // .then( () => console.log("raw", results) )
    .then( () => { startingLocation = extractIPGeoValues(results); testSelection = startingLocation; })
    .then( () => { 
      let initial = {};
      let info = {};
      
      initial = startingLocation; 
      info.location = initial;
    
      localStorage.setItem("initialLocation", JSON.stringify(initial)); 
      localStorage.setItem("info", JSON.stringify(info));
      localStorage.setItem("selectedLocation", JSON.stringify(initial));
    })
    .then( () => fetchCurrentWeather(testSelection))
    .then( () => fetchDailyWeather(testSelection))
    .then( () => fetchForecastWeather(testSelection))
    .then( () => fetchHourlyWeather(testSelection))
    .then( () => fetchAirQualityIndex(testSelection) )
    .then( () => { return testSelection; })
    .catch( (error) => console.error(error) );
}


function extractIPGeoValues(results) {
  let geocoded = {};

  geocoded.city = results.city;
  geocoded.country = results.country_name;
  geocoded.country_code = results.country_code2;
  geocoded.state = results.state_prov;
  geocoded.postalcode = results.zipcode;
  geocoded.latitude = results.latitude;
  geocoded.longitude = results.longitude;
  geocoded.timezone = results.time_zone.name;

  return geocoded;
}