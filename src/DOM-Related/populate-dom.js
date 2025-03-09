import {DateTime} from "luxon";
import * as test from "../index.js";

let location_dom = document.querySelector(".location");
let thisHour = DateTime.now().hour;


export function populatedGeoCoding(obj) {
  let results_dom = document.querySelector(".results");

  results_dom.querySelectorAll(".result").forEach( (l) => l.remove() );

  if ( typeof obj != 'object') {
    let notFound  = document.createElement("div");
    notFound.classList = ["result not-found"];
    notFound.textContent = "Location not found. Check spelling.";
    results_dom.appendChild(notFound);
    return;
  }

  obj.forEach( (el, i) => {
    let doc  = document.createElement("div");
    doc.classList.add("result");  
    doc.textContent = `${el.name}, ${el.admin1}, ${el.country}`;
    doc.setAttribute("data-index", i);
    doc.addEventListener("click", () => {
      test.testLocation(el);
      test.closeModal();
    });
    results_dom.appendChild(doc);
  });
}


export function populateCurrent(currentWeather) {
  let current_dom = document.querySelector(".current");
  current_dom.querySelector(".temp-now").textContent = currentWeather.temperature_2m;
  current_dom.querySelector(".feels-now").textContent = currentWeather.apparent_temperature;
  current_dom.querySelector(".humidity-now").textContent = currentWeather.relative_humidity_2m;
  current_dom.querySelector(".precipitation-now").textContent = currentWeather.precipitation;
  current_dom.querySelector(".weather-code-now").textContent =  weatherCodeToForecast(currentWeather.weather_code, currentWeather.is_day);
  current_dom.querySelector(".wind-speed-now").textContent = currentWeather.wind_speed_10m;
  current_dom.querySelector(".wind-direction-now").textContent = degreesToCardinal(currentWeather.wind_direction_10m);
  location_dom.querySelector(".city").textContent =  currentWeather.name;
  location_dom.querySelector(".state-country").textContent = `${currentWeather.state}, ${currentWeather.country}`;
}


export function populateDaily(dailyWeather){
  let daily_dom = document.querySelector(".daily");
  let sunup = DateTime.fromISO(dailyWeather.sunrise[0],{setZone: "true"}).toLocaleString(DateTime.TIME_SIMPLE);
  let sundown = DateTime.fromISO(dailyWeather.sunset[0],{setZone: "true"}).toLocaleString(DateTime.TIME_SIMPLE);
  
  daily_dom.querySelector(".high").textContent = dailyWeather.temperature_2m_max[0];
  daily_dom.querySelector(".low").textContent = dailyWeather.temperature_2m_min[0];
  daily_dom.querySelector(".sunrise").textContent = sunup;
  daily_dom.querySelector(".sunset").textContent = sundown;
  daily_dom.querySelector(".pop-max").textContent = dailyWeather.temperature_2m_max[0];
  daily_dom.querySelector(".wind-speed-max").textContent = dailyWeather.wind_speed_10m_max[0];
  daily_dom.querySelector(".wind-direction-dominant").textContent = degreesToCardinal(dailyWeather.wind_direction_10m_dominant[0]);
}


export function populateHourly(hourlyWeather){
  let hourly_dom = document.querySelector(".hourly");
  let thisHour = DateTime.now().hour;

  hourly_dom.querySelector(".temp-hour").textContent = hourlyWeather.temperature_2m[thisHour];
  hourly_dom.querySelector(".feels-hour").textContent = hourlyWeather.apparent_temperature[thisHour];
  hourly_dom.querySelector(".humidity-hour").textContent = hourlyWeather.relative_humidity_2m[thisHour];
  hourly_dom.querySelector(".weather-code-hour").textContent = weatherCodeToForecast(hourlyWeather.weather_code[thisHour].toString(), hourlyWeather.is_day);
  hourly_dom.querySelector(".visibility-hour").textContent = hourlyWeather.visibility[thisHour];
  hourly_dom.querySelector(".wind-speed-hour").textContent = hourlyWeather.wind_speed_10m[thisHour];
  hourly_dom.querySelector(".wind-direction-hour").textContent = degreesToCardinal(hourlyWeather.wind_direction_10m[thisHour]);
}

export function populateAQI(now, hour){
  let aqiNow_dom = document.querySelector(".aqi-now");
  let aqiHourly_dom = document.querySelector(".aqi-hour");

  aqiNow_dom.querySelector(".us-aqi").textContent = "US: " + now.us_aqi;
  aqiNow_dom.querySelector(".eu-aqi").textContent = "EU:  " + now.european_aqi;
  aqiNow_dom.querySelector(".pm10").textContent = "PM10:  " + now.pm10;
  aqiNow_dom.querySelector(".pm2-5").textContent = "PM2.5: " + now.pm2_5;
  aqiNow_dom.querySelector(".uv-index").textContent = "UV: " + now.uv_index;
  aqiHourly_dom.querySelector(".us-aqi-hour").textContent = "US: " + hour.us_aqi[thisHour];
  aqiHourly_dom.querySelector(".eu-aqi-hour").textContent = "EU:  " + hour.european_aqi[thisHour];
  aqiHourly_dom.querySelector(".pm10-hour").textContent = "PM10:  " + hour.pm10[thisHour];
  aqiHourly_dom.querySelector(".pm2-5-hour").textContent = "PM2.5: " + hour.pm2_5[thisHour];
  aqiHourly_dom.querySelector(".uv-index-hour").textContent = "UV: " + hour.uv_index[thisHour];
}

export function degreesToCardinal( angle ){
	let directions = [ "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                    "S", "SSW", "SW", "WSW","W", "WNW", "NW", "NNW" ];
	let section = parseInt( angle/22.5 + 0.5 );

	section = section % 16;

	return directions[section];
}

export function weatherCodeToForecast(weather_code, is_day){
  let forecast;
  let codes = { "0" : ["Sunny", "Clear"], "1": ["Mostly Sunny",  "Mostly Clear"], "2": "Partly Cloudy",
              "3": "Cloudy", "45": " Foggy ", "48": " Rime Fog","51": " Light Drizzle", "53": " Drizzle",
              "55": " Heavy Drizzle", "56": " Light Freezing Drizzle", "57": " Freezing Drizzle",
              "61": " Light Rain", "63": " Rain", "65": " Heavy Rain", "66": " Light Freezing Rain",
              "67": " Freezing Rain", "71": " Light Snow", "73": " Snow", "75": " Heavy Snow", 
              "77": " Snow Grains", "80": " Light Showers", "81": " Showers", "82": " Heavy Showers",
              "85": " Light Snow Showers", "86": " Snow Showers", "95": " Thunderstorms",
              "96": " Light Thunderstorms With Hail", "99": " Thunderstorms With Hail", };

  if ( weather_code === "0" || weather_code === "1"){
    forecast = is_day === "1" ? codes[weather_code][0] : codes[weather_code][1];   
  } else {
    forecast = codes[weather_code];
  }
  return forecast;
}
