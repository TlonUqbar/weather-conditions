import { DateTime, Settings } from "luxon";
import { iconHelper as wmoToIcon } from "../utils/weatherIcons.js";
import { wmoHelper as weatherCodeToForecast } from "../utils/weatherCodes.js";
import { windDirection as degreesToCardinal} from "../utils/windDirection.js";
import { countryCodes } from "../utils/country_codes.js"; 
import { getUnits } from "../utils/units.js";
import { closeModal, testLocation } from "../index.js";
import { updateMaxSide, updateMinSide } from "../utils/sliders.js";


let thisHour = DateTime.now().hour;


function isDay(val="") {
  if( val === '' ){ 
    return JSON.parse(localStorage.getItem("info")).is_day;
  } else {
    let hour = parseInt(val);
    let rise = DateTime.fromISO(JSON.parse(localStorage.getItem("forecastWeather")).sunrise[0]).hour;
    let set = DateTime.fromISO(JSON.parse(localStorage.getItem("forecastWeather")).sunset[0]).hour;
    let daytime = ( hour > rise && hour <= set ) ? "1" : "0";
    return daytime;
  }
}


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
  let mdIconW = addElement('div', 'md-compass');  
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
  let time2 = addElement( "div", "regional-time", `(${locationTime.toLocaleString(DateTime.TIME_SIMPLE)} ${tz})`);
  let order = [];

  mdIconW.style.transform = 'rotate(' + currentWeather.wind_direction_10m + 'deg)';
  order = ( local.zoneName != locationTime.zoneName) ? [city, state, time2] : [city, state];

  current_dom.innerHTML = ""; 
  current_dom.classList.add("simple-current");
  
  orderAppend(datetime, ...[date, time]);
  orderAppend(location, ...order);
  orderAppend(group1, location);
  orderAppend(group2, datetime);
  orderAppend(group3, ...[temp, feels]);
  orderAppend(group4, ...[icon, wmocode]);
  orderAppend(group5, ...[smIconH, humid, smIconR, precip ]);
  orderAppend(group6, ...[mdIconW, speed, direction, cardinal]);
  orderAppend( current_dom, ...[group1, group2, group3, group4, group5, group6]);

}


export function populateDaily(dailyWeather){
  let daily_dom = document.querySelector('.daily');
  let sunup = DateTime.fromISO(dailyWeather.sunrise[0], {setZone: 'true'}).toLocaleString(DateTime.TIME_SIMPLE);
  let sundown = DateTime.fromISO(dailyWeather.sunset[0], {setZone: 'true'}).toLocaleString(DateTime.TIME_SIMPLE);
  // let high = addElement("div", `dl-high ${tempClass()}`, dailyWeather.temperature_2m_max[0] );
  // let low = addElement("div", `dl-low ${tempClass()}`, dailyWeather.temperature_2m_min[0],);
  let highTemp = parseInt(dailyWeather.temperature_2m_max[0]);
  let lowTemp = parseInt(dailyWeather.temperature_2m_min[0]);
  let high = addElement('div', `dl-high`, highTemp);
  let low = addElement('div', `dl-low`, lowTemp);
  let sunrise = addElement('div', 'dl-rise sunrise', sunup);
  let sunset = addElement('div', 'dl-set sunset', sundown);
  let precip = addElement('div','dl-pop percent', dailyWeather.precipitation_probability_max[0] );
  let speed = addElement('div', `dl-speed ${windClass()}`, dailyWeather.wind_speed_10m_max[0]);
  let direction = addElement('div', 'dl-direction direction', dailyWeather.wind_direction_10m_dominant[0] );
  let cardinal = addElement('div', 'dl-direction cardinal', degreesToCardinal(dailyWeather.wind_direction_10m_dominant[0]) );
  let uv = addElement('div', 'dl-uv', parseInt(dailyWeather.uv_index_max));
  let group1 = addElement('div', 'dg1');
  let group2 = addElement('div', 'dg2');
  let group3 = addElement('div', 'dg3');
  let group4 = addElement('div', 'dg4');
  // let iconH = addElement("div", "md-icons md-high");
  // let iconL = addElement("div", "md-icons md-low");
  let iconU = addElement('div', 'md-icons md-sunrise');
  let iconD = addElement('div', 'md-icons md-sunset');
  let iconI = addElement('div', 'md-icons md-uv-index');
  let iconP = addElement('div', 'md-icons md-pop');
  let iconS = addElement('div', 'md-icons md-speed');
  // let iconW = addElement("div", "md-icons md-direction");

  let uvAttrs = {min: 0, max: 11, step: 1, value: dailyWeather.uv_index_max[0], type: "range", disabled: true};
  let rainAttrs = {min: 0, max: 100, step: 1, value: dailyWeather.precipitation_probability_max[0], type: "range", disabled: true};
  let iconW = addElement('div', 'md-icons md-dir');
  let rainMeter = addElement2("input", 'rain-meter', '', rainAttrs);
  let uvMeter = addElement2('input', 'uv-meter', '', uvAttrs);
  let val = parseInt(dailyWeather.uv_index_max);
  let colr = sliderThumbColor(val);
  let sliders = createSliders(group1, lowTemp, highTemp);

  uvMeter.style.setProperty('--slider-color', `${colr}`);
  iconW.style.transform = `rotate(${dailyWeather.wind_direction_10m_dominant[0]}deg)`;
  daily_dom.innerHTML = '';
  daily_dom.classList.add('simple-today');

  orderAppend(group1, ...[low, sliders, high]);
  orderAppend(group2, ...[iconU, sunrise, iconD, sunset]);
  orderAppend(group3, ...[iconI, uvMeter, uv, iconP, rainMeter, precip]);
  orderAppend(group4, ...[iconS, speed, iconW, direction, cardinal]);
  orderAppend(daily_dom, ...[group1, group2, group3, group4]);
}


export function populateHourly(hourlyWeather){
  let hourly_dom = document.querySelector(".hourly");
  let slots = hourlyWeather.time;
  hourly_dom.innerHTML = "";

  slots.forEach(  (key, index, slots) => {
    let day = (index > 12) ? `${(index) - 12}`  : `${index}`;
    if ( index === 0 || index === 12 ) day = "12"; 
  
    let hours = addElement("div", "hours" );
    let daytime = (index < 12) ? "day" : "night";
    let hour = addElement("div", `hour ${daytime}`, day);
    let getIcon = wmoToIcon(weatherCodeToForecast(hourlyWeather.weather_code[index].toString(), isDay(index)) );
    let icon = addElement("div", `icon hr-icon ${getIcon}`);
    let temp = addElement("div", 'hTemp', parseInt(hourlyWeather.temperature_2m[index]));
    
    if (getIcon === "partly-cloudy" && isDay(index) === "0") icon.classList = 'icon hr-icon partly-cloudy-night';
    if( index ===  DateTime.fromISO(JSON.parse(localStorage.getItem("currentWeather")).time).hour ) hours.classList.add("thisHour");

    orderAppend( hours, ...[hour, icon, temp]);
    orderAppend(hourly_dom, ...[hours]);
  });
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
        // let wmo = addElement("div", "second sm-wmo", weatherCodeToForecast(forecastWeather.weather_code[day], 1)); 
        let ranges = addElement("div", "grp-slide third");
        // let low = addElement("div", "grp fourth");
        // let sunrise = addElement("div", "grp fifth");
        // let sunset = addElement("div", "grp sixth");
        let uv = addElement("div", "grp seventh");
        let precip = addElement("div", "grp eighth");
        // let speed = addElement("div", "grp ninth");
        // let direction = addElement("div", "grp tenth");
        

        switch (key) {
          case "temperature_2m_max": {
            // let icon = addElement("div", "icons sm-high");
            let highTemp = parseInt(forecastWeather.temperature_2m_max[day]);
            let lowTemp = parseInt(forecastWeather.temperature_2m_min[day]);
            let high = addElement("div", `sl-high`, highTemp);
            let low = addElement("div",`sl-low`, lowTemp);

            let sliders = createSliders(ranges, lowTemp, highTemp);
            orderAppend(ranges, ...[low, sliders, high]);

            // orderAppend(high, ...[icon, value]);
            days.append(ranges);
              break;
            }
          // case "temperature_2m_min": {
          //   let icon = addElement("div", "icons sm-low");
          //   let value = addElement("div",`fc-low ${tempClass()}`, forecastWeather.temperature_2m_min[day]);

          //   orderAppend(low, ...[icon, value]);
          //   days.append(low);
          //     break;
          //   }
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
            let rainAttrs = {min: 0, max: 100, step: 1, value: forecastWeather.precipitation_probability_max[0], type: "range", disabled: true};
            let rainMeter = addElement2("input", 'rain-meter', '', rainAttrs);
            let value = addElement("div", "fc-pop percent", forecastWeather.precipitation_probability_max[day]);

            orderAppend(precip, ...[icon, rainMeter, value]);
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
            // orderAppend(days, ...[wmo, icon]);
            orderAppend(days, ...[icon]);
              break;
  
          case "uv_index_max" : {
            let icon = addElement("div", "icons sm-uv-index");
            let uvAttrs = {min: 0, max: 11, step: 1, value: forecastWeather.uv_index_max[day], type: "range", disabled: true};
            let uvMeter = addElement2("input", "uv-meter", "", uvAttrs);
            let uvVal = parseInt(forecastWeather.uv_index_max[day]);
            let value = addElement("div", "fc-uv-index", uvVal);
            let colr = sliderThumbColor(uvVal);

            uvMeter.style.setProperty('--slider-color', `${colr}`);

            orderAppend(uv, ...[icon, uvMeter, value]);
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
  // let aqiNow_dom = document.querySelector(".aqi-now");
  let aqiHourly_dom = document.querySelector(".aqi-hour");

  aqiHourly_dom.innerHTML = '';
  
  let slots = hour.time;

  slots.forEach(  (key, index, slots) => {
    let day = (index > 12) ? `${(index) - 12}`  : `${index}`;
    if ( index === 0 || index === 12 ) day = "12"; 

    let hrs = addElement("div", "hours" );
    let daytime = (index < 12) ? "day" : "night";
    let hr = addElement("div", `hour ${daytime}`, day);
    let aqiVal = addElement("div", `aqi-val aqi-icon ${aqiLevel(hour.us_aqi[index])}`, parseInt(hour.us_aqi[index]));
    let uv = addElement("div", `uvi uv-icon ${uvLevel(hour.uv_index[index])}`, parseInt(hour.uv_index[index]));

    if( index ===  DateTime.fromISO(JSON.parse(localStorage.getItem("currentWeather")).time).hour ) hrs.classList.add("thisHour");
  
    orderAppend(hrs, ...[hr, aqiVal, uv]);
    orderAppend(aqiHourly_dom, ...[hrs]);
    
  });
  // let usn = addElement("div", '', `US: ${now.us_aqi}`);
  // let eun = addElement("div", "", `EU: ${now.european_aqi}`);
  // let pm10n = addElement("div", "", `PM10: ${now.pm10}`);
  // let pm25n = addElement("div", "", `PM2.5: ${now.pm2_5}`);
  // let uvn = addElement("div", "", `UV: ${now.uv_index}`);
  // let ush = addElement("div", "", `US: ${now.us_aqi[thisHour]}`);
  // let euh = addElement("div", '', `EU: ${now.european_aqi[thisHour]}`);
  // let pm10h = addElement("div", "", `PM10:  ${hour.pm10[thisHour]}`);
  // let pm25h = addElement("div", "", `PM2.5:  ${hour.pm2_5[thisHour]}`);
  // let uvh = addElement("div", "", now.uv_index[thisHour] );

  // aqiNow_dom.innerHTML = '';
  // aqiHourly_dom.innerHTML = '';

  // orderAppend(aqiNow_dom, ...[usn, eun, pm10n, pm25n, uvn]);
  // orderAppend(aqiHourly_dom, ...[ush, euh, pm10h,pm25h, uvh]);
  // location.reload();
}


export function searchedLocations(){
  let searches = document.querySelector(".searches");
  let searchedLocations = JSON.parse(localStorage.getItem('searchedLocations'));
  
  searches.querySelectorAll('.places').forEach((l) => l.remove());

  if (searchedLocations === undefined || searchedLocations === null) return; 

  searchedLocations.forEach((location, i) => {
    let place = document.createElement('div');
    let state = ( location.admin1 === undefined ) ? '' : `, ${location.admin1}`;
    let country = ( location.country === undefined ) ? countryCodes(location.country_code) : location.country;

    place.classList.add('places');
    place.textContent = `${location.name}${state}, ${country}`;
    place.setAttribute('data-index', i);
    place.addEventListener("click", () => {
      testLocation(location);
      localStorage.setItem('selectedLocation', JSON.stringify(location));
      closeModal();
    });
    searches.append(place);
  });
  
}


function tempClass(){
  let setUnits = getUnits();
  return (setUnits.temperature === "fahrenheit") ? "fahrenheit" : "celsius";
}


function precipClass(){
  let setUnits = getUnits();
  return (setUnits.precipitation === "inch") ? "inch" : "mm";
}


function windClass(){
  let setUnits = getUnits();
  switch( setUnits.wind ) {
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

function addElement2( element, classes, value, attrs2){
  let temp = document.createElement(element);
  temp.classList = classes;
  if (value !== ''){ temp.textContent = value; }
  if (attrs2 !== "" ){ 
    Object.keys(attrs2).forEach((key) => { temp.setAttribute(key, attrs2[key]); });
  }
  return temp;
}

function orderAppend(parentElement, ...list){
  list.forEach( (element) => {
    parentElement.append(element);
  });
}

function createSliders(target, low, high){
  let range = addElement('div', 'range');
  let slider = addElement('div', 'range-slider');
  let rngLo = addElement('div', 'range-low');
  let rngMd = addElement('div', 'range-middle');
  let rngHi = addElement('div', 'range-high');
  let input = addElement('div', 'range-input');
  let minAttrs = {min: 0, max: 100, step: 1, value: "30", type: "range", disabled: true};
  let maxAttrs = {min: 0, max: 100, step: 1, value: "70", type: "range", disabled: true};
  let min = addElement2('input', 'min', '', minAttrs);
  let max = addElement2('input', 'max', '', maxAttrs);


  orderAppend(slider, ...[rngLo, rngMd, rngHi]);
  orderAppend(input, ...[min, max]);
  orderAppend(range, ...[slider, input]);

  updateMaxSide(range, high);
  updateMinSide(range, low);

  return range;
}




function sliderThumbColor(value){
  let colr = "#fff";
  switch (value) {
    case 0:
    case 1:
    case 2: colr = '#289500';
      break;
    case 3:
    case 4:
    case 5: colr = '#f7e400';
      break;
    case 6:
    case 7: colr = '#f85900';
      break;
    case 8:
    case 9:
    case 10: colr = '#d80010';
      break;
    case 11: colr = '#6b49c8';
      break;
    default: break;
  }
  return colr;
}

function aqiLevel(value){
  let level;
  
  if ( value <= 50){ 
    level = "good";
  } else if ( value > 50 && value <= 100){
    level = "moderate";
  } else if ( value > 100 && value <= 150){
    level = "sensitive";
  } else if ( value > 150 && value <= 200){
    level = "unhealthy";
  } else if ( value > 200 && value <= 300){
    level = "very-unhealthy";
  } else if ( value > 301 ){
    level = "hazardous";
  }

  return level;
}

function uvLevel(value){
  let level;
  value = parseInt(value);
  
  if ( value <= 3){ 
    level = "low";
  } else if ( value > 3 && value <= 5){
    level = "moderate";
  } else if ( value > 5 && value <= 8){
    level = "high";
  } else if ( value > 8 && value <= 10){
    level = "very-high";
  } else if ( value > 11 ){
    level = "extreme";
  }

  return level;
}