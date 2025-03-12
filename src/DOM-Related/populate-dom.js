import {DateTime} from "luxon";
import * as test from "../index.js";
// import * as icons from "../assets/icons";

let thisHour = DateTime.now().hour;
let is_day;




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
  let icon = document.createElement("div");
  let speed = document.createElement("div");
  let direction = document.createElement("div");
  let location = document.createElement("div");
  let city  = document.createElement("div");
  let state = document.createElement("div");
  let datetime = document.createElement("div");
  let time = document.createElement("div");
  let date = document.createElement("div");
  let group1 = document.createElement("div");
  let group2 = document.createElement("div");
  let group3 = document.createElement("div"); 
  let group4 = document.createElement("div"); 
  let group5 = document.createElement("div"); 
  let group6 = document.createElement("div"); 

  let forecast = weatherCodeToForecast(currentWeather.weather_code, currentWeather.is_day);
  is_day = currentWeather.is_day;
  current_dom.innerHTML = "";

  group1.classList.add("cg1");
  group2.classList.add("cg2");
  group3.classList.add("cg3");
  group4.classList.add("cg4");
  group5.classList.add("cg5");
  group6.classList.add("cg6");
  datetime.classList.add("datetime");
  location.classList.add("location");
  date.classList.add("date");
  time.classList.add("time");
  current_dom.classList.add("simple-current");
  temp.classList = ["temp fahrenheit "];
  feels.classList = ["feels fahrenheit "];
  humid.classList = ["humid percent"];
  precip.classList = ["rain-total inch"];
  wmocode.classList.add("code");
  icon.classList = [`icon ${wmoToIcon(forecast)}`];
  speed.classList = ["c-wind mph"];
  direction.classList = ["c-wind dominant"];
  city.classList.add("city");
  state.classList.add("state");
  

  date.textContent = DateTime.now().toLocaleString(DateTime.DATE_MED);
  time.textContent = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE);
  temp.textContent = currentWeather.temperature_2m;
  feels.textContent = "Feels: " + currentWeather.apparent_temperature;
  humid.textContent = currentWeather.relative_humidity_2m;
  precip.textContent = currentWeather.precipitation;
  wmocode.textContent = forecast;
  icon.textContent = '';
  speed.textContent = currentWeather.wind_speed_10m;
  direction.textContent = degreesToCardinal(currentWeather.wind_direction_10m);
  city.textContent = currentWeather.name;
  state.textContent = `${currentWeather.state}, ${currentWeather.country}`;

  datetime.append(date);
  datetime.append(time);
  location.append(city);
  location.append(state);
  group1.append(location);
  group2.append(datetime);
  group3.append(temp);
  group3.append(feels);
  group4.append(icon);
  group4.append(wmocode);
  group5.append(humid);
  group5.append(precip);
  group6.append(speed);
  group6.append(direction);

  current_dom.append(group1);
  current_dom.append(group2);
  current_dom.append(group3);
  current_dom.append(group4);
  current_dom.append(group5);
  current_dom.append(group6);
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
  let uv = document.createElement("div");
  let group1 = document.createElement("div");
  let group2 = document.createElement("div");
  let group3 = document.createElement("div");
  let group4 = document.createElement("div");

  daily_dom .innerHTML = "";
  group1.classList.add("dg1");
  group2.classList.add("dg2");
  group3.classList.add("dg3");
  group4.classList.add("dg4");


  daily_dom.classList.add("simple-today");
  high.classList = ["high fahrenheit"];
  low.classList = ["low fahrenheit"];
  sunrise.classList = ["sunrise"];
  sunset.classList = ["sunset"];
  precip.classList = ["pop percent"];
  speed.classList = ["d-wind speed mph"];
  direction.classList = ["d-wind direction"];
  uv.classList = ["uv-index"];
  high.innerHTML = dailyWeather.temperature_2m_max[0];
  low.innerHTML = dailyWeather.temperature_2m_min[0];
  sunrise.innerHTML = sunup;
  sunset.textContent = sundown;
  precip.innerHTML = dailyWeather.precipitation_probability_max[0];
  speed.innerHTML = dailyWeather.wind_speed_10m_max[0];  
  direction.innerHTML = degreesToCardinal(dailyWeather.wind_direction_10m_dominant[0]);
  uv.textContent = dailyWeather.uv_index_max;



  group1.append(high);
  group1.append(low);
  daily_dom.append(group1);
  group2.append(sunrise);
  group2.append(sunset);
  daily_dom.append(group2);
  group3.append(uv);
  group3.append(precip);
  daily_dom.append(group3);
  group4.append(speed);
  group4.append(direction);
  daily_dom.append(group4);
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
  speed.classList = ["h-wind mph"];
  direction.classList = ["h-wind"];
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

// function isArray(what){ return Object.prototype.toString.call(what) === '[object Array]'; }

export function populateForecast(forecastWeather, is_day){
  let forecast_dom = document.querySelector(".forecast");
  let days = [1, 2, 3];
  console.log("forcast object", forecastWeather);  
  forecast_dom.innerHTML = "";
  forecast_dom.classList.add("simple-forecast");

  days.forEach(day => {
    let days = document.createElement("div");
    days.classList = [`simple-day-${day}`];
    forecast_dom.append(days);
    Object.keys(forecastWeather).sort().forEach(
      key => {
        let high = document.createElement("div");
        let low = document.createElement("div");
        let sunrise = document.createElement("div");
        let sunset = document.createElement("div");
        let precip = document.createElement("div");
        let speed = document.createElement("div");
        let direction = document.createElement("div");
        let wmo = document.createElement("div"); 
        let icon = document.createElement("div");
        let uvi = document.createElement("div");
        let time = document.createElement("div");
        const sunup = (day) => { return DateTime.fromISO(forecastWeather.sunrise[day]).toLocaleString(DateTime.TIME_SIMPLE); };
        const sundown = (day) => {return DateTime.fromISO(forecastWeather.sunset[day]).toLocaleString(DateTime.TIME_SIMPLE);};
        const weekday = (day) => {return DateTime.fromISO(forecastWeather.time[day]).weekdayLong;};


        switch (key) {
          case "temperature_2m_max": 
            high.classList = ["high fahrenheit"];
            high.textContent = forecastWeather.temperature_2m_max[day];
            days.append(high);
              break;
          case "temperature_2m_min": 
            low.classList = ["low fahrenheit"];
            low.textContent = forecastWeather.temperature_2m_min[day];
            days.append(low);
              break;
          // case "sunrise" : 
          //   sunrise.classList = ["sunrise"]; 
          //   sunrise.textContent = sunup(day);
          //   days.append(sunrise);
          //     break;
          // case "sunset" : 
          //   sunset.classList = ["sunset"];
          //   sunset.textContent = sundown(day);
          //   days.append(sunset);
          //     break;
          case "precipitation_probability_max" : 
            precip.classList = ["pop percent"];
            precip.textContent = forecastWeather.precipitation_probability_max[day];
            days.append(precip);
              break;
          // case "wind_speed_10m_max" : 
          //   speed.classList = ["speed mph"];
          //   speed.textContent = forecastWeather.wind_speed_10m_max[day];  
          //   days.append(speed);
          //     break;
          // case "wind_direction_10m_dominant" : 
          //   direction.classList = ["direction wind"];
          //   direction.textContent = degreesToCardinal(forecastWeather.wind_direction_10m_dominant[day]);
          //   days.append(direction);
          //     break;
          case "weather_code" :
            wmo.classList = ["wmo"];
            wmo.textContent = weatherCodeToForecast(forecastWeather.weather_code[day], is_day);
            days.append(wmo);
            icon.classList = [`icon ${wmoToIcon(weatherCodeToForecast(forecastWeather.weather_code[day], is_day) )}`];
            icon.textContent = '';
            days.append(icon);
              break;
          
          case "uv_index_max" :
            uvi.classList = ["uv-index"];
            uvi.textContent = forecastWeather.uv_index_max[day];
            days.append(uvi);
              break;
          case "time" :
            time.classList = ["day-forecast"];
            time.textContent = weekday(day);
            days.append(time);
              break;
            default : 
              // console.log(key);  
            break;
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
              "3": "Cloudy", "45": "Foggy ", "48": "Rime Fog","51": "Light Drizzle", "53": "Drizzle",
              "55": "Heavy Drizzle", "56": "Light Freezing Drizzle", "57": "Freezing Drizzle",
              "61": "Light Rain", "63": "Rain", "65": "Heavy Rain", "66": "Light Freezing Rain",
              "67": "Freezing Rain", "71": "Light Snow", "73": "Snow", "75": "Heavy Snow", 
              "77": "Snow Grains", "80": "Light Showers", "81": "Showers", "82": "Heavy Showers",
              "85": "Light Snow Showers", "86": "Snow Showers", "95": "Thunderstorms",
              "96": "Light Thunderstorms With Hail", "99": "Thunderstorms With Hail", };

  if ( weather_code === "0" || weather_code === "1"){
    forecast = is_day === "1" ? codes[weather_code][0] : codes[weather_code][1];   
  } else {
    forecast = codes[weather_code];
  }
  return forecast;
}


export function wmoToIcon(forecast){
  let codes = { 
    "Sunny" : "sunny", 
    "Clear" : "clear", 
    "Mostly Sunny" : "mostly-sunny", 
    "Mostly Clear" : "mostly-clear", 
    "Partly Cloudy" : "partly-cloudy",
    "Cloudy" : "cloudy",
    "Foggy " : "foggy",
    "Rime Fog" : "rime",
    "Light Drizzle" : "light-drizzle",
    "Drizzle" : "drizzle",
    "Heavy Drizzle" : "heavy-drizzle",
    "Light Freezing Drizzle" : "light-freezing-drizzle",
    "Freezing Drizzle" : "freezing-drizzle",
    "Light Rain" : "light-rain",
    "Rain" : "rain",
    "Heavy Rain" : "heavy-rain",
    "Light Freezing Rain" : "light-freezing-rain",
    "Freezing Rain" : "freezing-rain",
    "Light Snow" : "light-snow",
    "Snow" : "snow",
    "Heavy Snow" : "heavy-snow",
    "Snow Grains" : "snow-grains",
    "Light Showers" : "light-showers",
    "Showers" : "showers",
    "Heavy Showers" : "heavy-showers",
    "Light Snow Showers" : "light-snow-showers",
    "Snow Showers" : "snow-showers",
    "Thunderstorms" : "thunderstorms",
    "Light Thunderstorms With Hail" : "light-thunderstorms-hail",
    "Thunderstorms With Hail" : "thunderstorms-hail",
   };

  return codes[forecast];
}