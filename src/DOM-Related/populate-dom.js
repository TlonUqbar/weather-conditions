import { DateTime, Settings } from "luxon";
import { iconHelper as wmoToIcon } from "../helpers/weatherIcons.js";
import { wmoHelper as weatherCodeToForecast } from "../helpers/weatherCodes.js";
import { windDirection as degreesToCardinal} from "../helpers/windDirection.js";
import { countryCodes } from "../helpers/country_codes.js"; 
import * as vars from "../index.js";

let thisHour = DateTime.now().hour;

function isDay() { return JSON.parse(localStorage.getItem("info")).is_day;}


export function populateCurrent(currentWeather) {

  let current_dom = document.querySelector(".current");
  let st = ( currentWeather.state !== undefined ) ? `${currentWeather.state}` : '';
  let cntry = ( currentWeather.country !== undefined ) ? currentWeather.country : countryCodes(currentWeather.country_code);
  let local = DateTime.local();
  let localTime = DateTime.now().toLocaleString(DateTime.TIME_SIMPLE);
  let localDate = DateTime.now().toLocaleString(DateTime.DATE_MED);
  let locationTime = DateTime.now().setZone(currentWeather.timezone);
  let tz = currentWeather.tz;

  let temp = addElement( "div", `temp ${tempClass()}`, currentWeather.temperature_2m);
  let feels = addElement( "div", `feels ${tempClass()}`, `Feels: ${currentWeather.apparent_temperature}`);  
  let humid = addElement( "div", "humid percent", currentWeather.relative_humidity_2m);
  let precip = addElement( "div", `rain-total ${precipClass()}`, currentWeather.precipitation);
  let wmocode = addElement( "div", "code", weatherCodeToForecast(currentWeather.weather_code, isDay()));
  let icon = addElement( "div", `icon ${wmoToIcon(weatherCodeToForecast(currentWeather.weather_code, isDay()) )}`, '');
  let speed = addElement( "div", `c-speed ${windClass()}`, currentWeather.wind_speed_10m);
  let direction = addElement( "div", "c-direction direction", currentWeather.wind_direction_10m);
  let cardinal = addElement( "span", "c-direction cardinal", degreesToCardinal(currentWeather.wind_direction_10m));
  let smIconH = addElement("div", "sm-humid");
  let smIconR = addElement("div", "sm-rain");
  let mdIconW = addElement("div", "md-wind");  
  let location = addElement( "div", "location");
  let city = addElement("div", "city", currentWeather.name, );
  let state = addElement("div", "state", `${st}, ${cntry}`);
  let datetime = addElement( "div", "datetime");
  let time = addElement("div", "time", localTime);
  let date = addElement("div", "date", localDate);  
  let group1 = addElement("div", "cg1");
  let group2 = addElement("div", "cg2");
  let group3 = addElement("div", "cg3");
  let group4 = addElement("div", "cg4");
  let group5 = addElement("div", "cg5");
  let group6 = addElement("div", "cg6");
  let time2;

  if( local.zoneName !== locationTime.zoneName ) {
    time2 =  addElement( "div", "regional-time", `(${locationTime.toLocaleString(DateTime.TIME_SIMPLE)} ${tz})`);
  }

  current_dom.innerHTML = ""; 
  current_dom.classList.add("simple-current");
  
  orderAppend(datetime, ...[date, time]);
  orderAppend(location, ...[city, state, time2]);
  orderAppend(group1, location);
  orderAppend(group2, datetime);
  orderAppend(group3, ...[temp, feels]);
  orderAppend(group4, ...[icon, wmocode]);
  orderAppend(group5, ...[smIconH, humid, smIconR, precip ]);
  orderAppend(group6, ...[mdIconW, speed, direction, cardinal]);
  orderAppend( current_dom, ...[group1, group2, group3, group4, group5, group6]);

}


export function populateDaily(dailyWeather){
  let daily_dom = document.querySelector(".daily");
  let sunup = DateTime.fromISO(dailyWeather.sunrise[0],{setZone: "true"}).toLocaleString(DateTime.TIME_SIMPLE);
  let sundown = DateTime.fromISO(dailyWeather.sunset[0],{setZone: "true"}).toLocaleString(DateTime.TIME_SIMPLE);
  let high = addElement("div", `dl-high ${tempClass()}`, dailyWeather.temperature_2m_max[0] );
  let low = addElement("div", `dl-low ${tempClass()}`, dailyWeather.temperature_2m_min[0],);
  let sunrise = addElement("div", "dl-rise sunrise", sunup);
  let sunset  = addElement("div", "dl-set sunset", sundown);
  let precip = addElement("div", "dl-pop percent", dailyWeather.precipitation_probability_max[0]);
  let speed = addElement("div", `dl-speed ${windClass()}`, dailyWeather.wind_speed_10m_max[0]);
  let direction = addElement("div", "dl-direction direction", dailyWeather.wind_direction_10m_dominant[0]);
  let cardinal = addElement("div", "dl-direction cardinal", degreesToCardinal(dailyWeather.wind_direction_10m_dominant[0]));
  let uv = addElement("div", "dl-uv", dailyWeather.uv_index_max);
  let group1 = addElement("div", "dg1");
  let group2 = addElement("div", "dg2");
  let group3 = addElement("div", "dg3");
  let group4 = addElement("div", "dg4"); 
  let iconH = addElement("div", "md-icons md-high");
  let iconL = addElement("div", "md-icons md-low");
  let iconU = addElement("div", "md-icons md-sunrise");
  let iconD = addElement("div", "md-icons md-sunset");
  let iconI = addElement("div", "md-icons md-uv-index");
  let iconP = addElement("div", "md-icons md-pop");
  let iconS = addElement("div", "md-icons md-speed");
  let iconW = addElement("div", "md-icons md-direction");

  daily_dom .innerHTML = "";
  daily_dom.classList.add("simple-today");

  orderAppend(group1, ...[iconH, high, iconL, low]);
  orderAppend(group2, ...[iconU, sunrise, iconD, sunset]);
  orderAppend(group3, ...[iconI, uv, iconP, precip]);
  orderAppend(group4, ...[iconS, speed, iconW, direction, cardinal]);
  orderAppend(daily_dom, ...[group1, group2, group3, group4]);
}


export function populateHourly(hourlyWeather){
  let hourly_dom = document.querySelector(".hourly");
  let thisHour = DateTime.now().hour;
  let temp = addElement("div", `temp ${tempClass()}`, hourlyWeather.temperature_2m[thisHour]);
  let feels = addElement("div", `feels ${tempClass()}`, hourlyWeather.apparent_temperature[thisHour]);
  let humid = addElement("div", "percemt", hourlyWeather.relative_humidity_2m[thisHour]);
  let wmocode = addElement("div", "code ", weatherCodeToForecast(hourlyWeather.weather_code[thisHour].toString(), isDay()) );
  let visibility = addElement("div", "m", hourlyWeather.visibility[thisHour]);
  let speed = addElement("div", `h-wind ${windClass()}`, hourlyWeather.wind_speed_10m[thisHour]);
  let direction = addElement("div", "h-wind", degreesToCardinal(hourlyWeather.wind_direction_10m[thisHour]));

  hourly_dom.innerHTML = "";

  orderAppend( hourly_dom, ...[temp, feels, humid, wmocode, visibility, speed, direction]);
}

// function isArray(what){ return Object.prototype.toString.call(what) === '[object Array]'; }

export function populateForecast(forecastWeather){
  let forecast_dom = document.querySelector(".forecast");
  let days = [0, 1, 2, 3];

  forecast_dom.innerHTML = "";
  forecast_dom.classList.add("simple-forecast");

  days.forEach(day => {
    let days = document.createElement("div");
    days.classList = [`simple-day-${day}`];
    forecast_dom.append(days);
    Object.keys(forecastWeather).sort().forEach(
      key => {
        // const sunup = (day) => { return DateTime.fromISO(forecastWeather.sunrise[day]).toLocaleString(DateTime.TIME_SIMPLE); };
        // const sundown = (day) => {return DateTime.fromISO(forecastWeather.sunset[day]).toLocaleString(DateTime.TIME_SIMPLE);};
        const weekday = (day) => {return DateTime.fromISO(forecastWeather.time[day]).weekdayLong;};
        let time = addElement("div", "grp zeroth", weekday(day));
        let icon = addElement("div", `first sm-icon ${wmoToIcon(weatherCodeToForecast(forecastWeather.weather_code[day], 1) )}`);
        let wmo = addElement("div", "second sm-wmo", weatherCodeToForecast(forecastWeather.weather_code[day], 1)); 
        let high = addElement("div", "grp third");
        let low = addElement("div", "grp fourth");
        // let sunrise = addElement("div", "grp fifth");
        // let sunset = addElement("div", "grp sixth");
        let uv = addElement("div", "grp seventh");
        let precip = addElement("div", "grp eighth");
        // let speed = addElement("div", "grp ninth");
        // let direction = addElement("div", "grp tenth");

        switch (key) {
          case "temperature_2m_max": {
            let icon = addElement("div", "icons sm-high");
            let value = addElement("div", `fc-high ${tempClass()}`, forecastWeather.temperature_2m_max[day]);

            orderAppend(high, ...[icon, value]);
            days.append(high);
              break;
            }
          case "temperature_2m_min": {
            let icon = addElement("div", "icons sm-low");
            let value = addElement("div",`fc-low ${tempClass()}`, forecastWeather.temperature_2m_min[day]);

            orderAppend(low, ...[icon, value]);
            days.append(low);
              break;
            }
          // case "sunrise" : {
          //   let icon = addElement("div", "icons sm-sunrise");
          //   let value = addElement("div", "fc-sunrise", sunup(day));
            
          //   orderAppend(sunrise, ...[icon, value]);
          //   days.append(sunrise);
          //     break;
          //   }
          // case "sunset" : {
          //   let icon = addElement("div", "icons sm-sunset");
          //   let value = addElement("div", "fc-sunset", sundown(day));

          //   orderAppend(sunset, ...[icon, value]);
          //   days.append(sunset);
          //     break;
          //   }
          case "precipitation_probability_max" : {
            let icon = addElement("div", "icons sm-pop");
            let value = addElement("div", "fc-pop percent", forecastWeather.precipitation_probability_max[day]);

            orderAppend(precip, ...[icon, value]);
            days.append(precip);
              break;
            }
          // case "wind_speed_10m_max" : {
          //   let icon = addElement("div", "icons sm-speed");
          //   let value = addElement("div", "fc-speed mph", forecastWeather.wind_speed_10m_max[day]);

          //   orderAppend(speed, ...[icon, value]);
          //   days.append(speed);
          //     break;
          //   }
          // case "wind_direction_10m_dominant" : {
          //   let icon = addElement("div", "icons sm-direction");
          //   let value = addElement("div", "fc-direction wind", degreesToCardinal(forecastWeather.wind_direction_10m_dominant[day]));

          //   orderAppend(direction, ...[icon, value]);
          //   days.append(direction);
          //     break;
          //   }
          case "weather_code" : 
            orderAppend(days, ...[wmo, icon]);
              break;
  
          case "uv_index_max" : {
            let icon = addElement("div", "icons sm-uv-index");
            let value = addElement("div", "fc-uv-index", forecastWeather.uv_index_max[day]);

            orderAppend(uv, ...[icon, value]);
            days.append(uv);
              break;
            }
          case "time" :
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



function tempClass(){
  return (vars.preferred.temp === "fahrenheit") ? "fahrenheit" : "celsius";
}

function precipClass(){
  return (vars.preferred.precip === "inch") ? "inch" : "mm";
}

function windClass(){
  switch( vars.preferred.wind ) {
    case "mph" : return "mph"; 
    case "kmh" : return "kmh";
    case "ms" : return "ms";
    case "kn" : return "kn";
    default:  break;
  }
}


function addElement( element, classes, value){
  let temp = document.createElement(element);
  temp.classList = classes;
  if (value !== ''){ temp.textContent = value; }
  return temp;
}


function orderAppend(parentElement, ...list){
  list.forEach( (element) => {
    parentElement.append(element);
  });
}