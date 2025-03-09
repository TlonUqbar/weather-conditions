import {DateTime} from "luxon";
import * as test from "../index.js";

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
  let temp = document.createElement("div");
  let feels = document.createElement("div");
  let humid = document.createElement("div");
  let precip = document.createElement("div");
  let wmocode = document.createElement("div");
  let speed = document.createElement("div");
  let direction = document.createElement("div");
  let city  = document.createElement("div");
  let state = document.createElement("div");

  current_dom.innerHTML = "";
  temp.classList = ["temp fahrenheit "];
  feels.classList = ["feels fahrenheit "];
  humid.classList = ["percent"];
  precip.classList = ["inch"];
  wmocode.classList = ["code"];
  speed.classList = ["wind mph"];
  direction.classList = ["wind dir"];
  city.classList = ["city"];
  state.classList = ["state"];
  temp.textContent = currentWeather.temperature_2m;
  feels.textContent = "Feels: " + currentWeather.apparent_temperature;
  humid.textContent = currentWeather.relative_humidity_2m;
  precip.textContent = currentWeather.precipitation;
  wmocode.textContent = weatherCodeToForecast(currentWeather.weather_code, currentWeather.is_day);
  speed.textContent = currentWeather.wind_speed_10m;
  direction.textContent = degreesToCardinal(currentWeather.wind_direction_10m);
  city.textContent = currentWeather.name;
  state.textContent = `${currentWeather.state}, ${currentWeather.country}`;

  current_dom.append(city);
  current_dom.append(state);
  current_dom.append(temp);
  current_dom.append(feels);
  current_dom.append(wmocode);
  current_dom.append(humid);
  current_dom.append(precip);
  current_dom.append(speed);
  current_dom.append(direction);
}


export function populateDaily(dailyWeather){
  let daily_dom = document.querySelector(".daily");
  let sunup = DateTime.fromISO(dailyWeather.sunrise[0],{setZone: "true"}).toLocaleString(DateTime.TIME_SIMPLE);
  let sundown = DateTime.fromISO(dailyWeather.sunset[0],{setZone: "true"}).toLocaleString(DateTime.TIME_SIMPLE);
  let high = document.createElement("div");
  let low = document.createElement("div");
  let sunrise = document.createElement("div");
  let sunset = document.createElement("div");
  let precip = document.createElement("div");
  let speed = document.createElement("div");
  let direction = document.createElement("div");

  daily_dom.innerHTML = "";
  high.classList = ["high fahrenheit"];
  low.classList = ["low fahrenheit"];
  sunrise.classList = ["sun"];
  sunset.classList = ["sun"];
  precip.classList = ["pop percent"];
  speed.classList = ["wind mph"];
  direction.classList = ["wind mph"];
  high.innerHTML = "H: " + dailyWeather.temperature_2m_max[0];
  low.innerHTML = "L: " + dailyWeather.temperature_2m_min[0];
  sunrise.innerHTML = sunup;
  sunset.textContent = sundown;
  precip.innerHTML = dailyWeather.precipitation_probability_max[0];
  speed.innerHTML = dailyWeather.wind_speed_10m_max[0];  
  direction.innerHTML = dailyWeather.wind_direction_10m_dominant[0];

  daily_dom.append(high);
  daily_dom.append(low);
  daily_dom.append(sunrise);
  daily_dom.append(sunset);
  daily_dom.append(precip);
  daily_dom.append(speed);
  daily_dom.append(direction);
}


export function populateHourly(hourlyWeather){
  let hourly_dom = document.querySelector(".hourly");
  let thisHour = DateTime.now().hour;
  let temp = document.createElement("div");
  let feels = document.createElement("div");
  let humid = document.createElement("div");
  let wmocode = document.createElement("div");
  let visibility = document.createElement("div");
  let speed = document.createElement("div");
  let direction = document.createElement("div");

  hourly_dom.innerHTML = "";
  temp.classList = ["temp fahrenheit"];
  feels.classList = ["feels fahrenheit"];
  humid.classList = ["percent"];
  wmocode.classList = ["code"];
  visibility.classList = ["meter"];
  speed.classList = ["wind mph"];
  direction.classList = ["wind"];
  temp.textContent = hourlyWeather.temperature_2m[thisHour];
  feels.textContent = hourlyWeather.apparent_temperature[thisHour];
  humid.textContent = hourlyWeather.relative_humidity_2m[thisHour];
  wmocode.textContent = weatherCodeToForecast(hourlyWeather.weather_code[thisHour].toString(), hourlyWeather.is_day);
  visibility.textContent = hourlyWeather.visibility[thisHour];
  speed.textContent = hourlyWeather.wind_speed_10m[thisHour];
  direction.textContent = degreesToCardinal(hourlyWeather.wind_direction_10m[thisHour]);

  hourly_dom.append(temp);
  hourly_dom.append(feels);
  hourly_dom.append(humid);
  hourly_dom.append(wmocode);
  hourly_dom.append(visibility);
  hourly_dom.append(speed);
  hourly_dom.append(direction);
}

function isArray(what){ return Object.prototype.toString.call(what) === '[object Array]'; }

export function populateForecast(forecastWeather){
  let forecast_dom = document.querySelector(".forecast");
  let days = [1, 2, 3];



  forecast_dom.innerHTML = "";


  days.forEach(day => {
    Object.keys(forecastWeather).forEach(
      key => {
        // console.log( forecastWeather[`${key}`][day]);
        // let sunup = 
        // let sundown = DateTime.fromISO(forecastWeather.sunset[0],{setZone: "true"}).toLocaleString(DateTime.TIME_SIMPLE);
        let high = document.createElement("div");
        let low = document.createElement("div");
        let sunrise = document.createElement("div");
        let sunset = document.createElement("div");
        let precip = document.createElement("div");
        let speed = document.createElement("div");
        let direction = document.createElement("div");
        let wmo = document.createElement("div"); 

        function sunup(day){
          return DateTime.fromISO(forecastWeather.sunrise[day],{setZone: "true"}).toLocaleString(DateTime.TIME_SIMPLE);
        }

        const sundown = (day) => {return DateTime.fromISO(forecastWeather.sunset[day],{setZone: "true"}).toLocaleString(DateTime.TIME_SIMPLE);};

        switch (key) {
          case "temperature_2m_max": 
            high.classList = ["high fahrenheit"];
            high.textContent = "H: " + forecastWeather.temperature_2m_max[day];
            forecast_dom.append(high);
            console.log(key); break;
          case "temperature_2m_min": 
            low.classList = ["low fahrenheit"];
            low.textContent = "L: " + forecastWeather.temperature_2m_min[day];
            forecast_dom.append(low);
            console.log(key); break;
          case "sunrise" : 
            sunrise.classList = ["sun"]; 
            sunrise.textContent = sunup(day);
            forecast_dom.append(sunrise);
            console.log(key); break;
          case "sunset" : 
            sunset.classList = ["sun"];
            sunset.textContent = sundown(day);
            forecast_dom.append(sunset);
            console.log(key); break;
          case "precipitation_probability_max" : 
            precip.classList = ["pop percent"];
            precip.textContent = forecastWeather.precipitation_probability_max[day];
            forecast_dom.append(precip);
            break;
          case "wind_speed_10m_max" : 
            speed.classList = ["wind mph"];
            speed.textContent = forecastWeather.wind_speed_10m_max[day];  
            forecast_dom.append(speed);
            break;
          case "wind_direction_10m_dominant" : 
            direction.classList = ["wind"];
            direction.textContent = degreesToCardinal(forecastWeather.wind_direction_10m_dominant[day]);
            forecast_dom.append(direction);
            break;
          case "weather_code" :
            wmo.classList = [""];
            wmo.textContent = weatherCodeToForecast(forecastWeather.weather_code[day], forecastWeather.is_day);
            forecast_dom.append(wmo);
            default : break;
        }
      });
  });


}

export function populateAQI(now, hour){
  let aqiNow_dom = document.querySelector(".aqi-now");
  let aqiHourly_dom = document.querySelector(".aqi-hour");
  let usn = document.createElement("div");
  let eun = document.createElement("div");
  let pm10n = document.createElement("div");
  let pm25n = document.createElement("div");
  let uvn = document.createElement("div");
  let ush = document.createElement("div");
  let euh = document.createElement("div");
  let pm10h = document.createElement("div");
  let pm25h = document.createElement("div");
  let uvh = document.createElement("div");

  aqiNow_dom.innerHTML = '';
  aqiHourly_dom.innerHTML = '';

  usn.classList = [""];
  eun.classList = [""];
  pm10n.classList = [""];
  pm25n.classList = [""];
  uvn.classList = [""];
  ush.classList = [""];
  euh.classList = [""];
  pm10h.classList = [""];
  pm25h.classList = [""];
  uvh.classList = [""];

  usn.textContent = "US: " + now.us_aqi;
  eun.textContent = "EU:  " + now.european_aqi;
  pm10n.textContent = "PM10:  " + now.pm10;
  pm25n.textContent = "PM2.5: " + now.pm2_5;
  uvn.textContent = "UV: " + now.uv_index;
  ush.textContent = "US: " + hour.us_aqi[thisHour];
  euh.textContent = "EU:  " + hour.european_aqi[thisHour];
  pm10h.textContent = "PM2.5: " + hour.pm2_5[thisHour];
  pm25h.textContent = "PM2.5: " + hour.pm2_5[thisHour];
  uvh.textContent = "UV: " + hour.uv_index[thisHour];

  aqiNow_dom.append(usn);
  aqiNow_dom.append(eun);
  aqiNow_dom.append(pm10n);
  aqiNow_dom.append(pm25n);
  aqiNow_dom.append(uvn);
  aqiHourly_dom.append(ush);
  aqiHourly_dom.append(euh);
  aqiHourly_dom.append(pm10h);
  aqiHourly_dom.append(pm25h);
  aqiHourly_dom.append(uvh);
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
