import {DateTime} from "luxon";


let location_dom = document.querySelector(".location");


export function populateCurrent(currentWeather) {
  let current_dom = document.querySelector(".current");
  current_dom.querySelector(".temp-now").textContent = currentWeather.temperature_2m;
  current_dom.querySelector(".feels-now").textContent = currentWeather.apparent_temperature;
  current_dom.querySelector(".humidity-now").textContent = currentWeather.relative_humidity_2m;
  current_dom.querySelector(".precipitation-now").textContent = currentWeather.precipitation;
  current_dom.querySelector(".weather-code-now").textContent =  weatherCodeToForecast(currentWeather.weather_code, currentWeather.is_day);
  current_dom.querySelector(".wind-speed-now").textContent = currentWeather.wind_speed_10m;
  current_dom.querySelector(".wind-direction-now").textContent = degreesToCardinal(currentWeather.wind_direction_10m);
  location_dom.querySelector(".city").textContent =  currentWeather.name; //`${userSelection.name}`;
  location_dom.querySelector(".state-country").textContent = `${currentWeather.state}, ${currentWeather.country}` ; //  `${userSelection.admin1}, ${userSelection.country}`;
}


export function populateDaily(dailyWeather){
  let daily_dom = document.querySelector(".daily");
  let sunup = DateTime.fromISO(dailyWeather.sunrise[0],{setZone: "true"}).toLocaleString(DateTime.TIME_24_SIMPLE);
  let sundown = DateTime.fromISO(dailyWeather.sunset[0],{setZone: "true"}).toLocaleString(DateTime.TIME_24_SIMPLE);
  
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

  hourly_dom.querySelector(".temp-hour").textContent = hourlyWeather.temperature_2m[0];
  hourly_dom.querySelector(".feels-hour").textContent = hourlyWeather.apparent_temperature[0];
  hourly_dom.querySelector(".humidity-hour").textContent = hourlyWeather.relative_humidity_2m[0];
  hourly_dom.querySelector(".weather-code-hour").textContent = weatherCodeToForecast(hourlyWeather.weather_code[thisHour].toString(), hourlyWeather.is_day);
  hourly_dom.querySelector(".visibility-hour").textContent = hourlyWeather.visibility[0];
  hourly_dom.querySelector(".wind-speed-hour").textContent = hourlyWeather.wind_speed_10m[0];
  hourly_dom.querySelector(".wind-direction-hour").textContent = degreesToCardinal(hourlyWeather.wind_direction_10m[0]);

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
              "96": " Light Thunderstorms With Hail", "99": " Thunderstorms With Hail",
            };

  if ( weather_code === "0" || weather_code === "1"){
    forecast = is_day === "1" ? codes[weather_code][0] : codes[weather_code][1];   
  } else {
    forecast = codes[weather_code];
  }
  return forecast;
}
