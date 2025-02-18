
import "./styles.css";

const API_KEY=secrets.API_KEY;

let userSelection;

const requestOptions = {
  method: "GET",
  redirect: "follow",
  mode: "cors"
};


function fetchInitialGeoLocation(){
  // API call get location IP address based
  // https://api.ipgeolocation.io/ipgeo?apiKey=API_KEY
  let baseURL = "https://api.ipgeolocation.io/ipgeo";
  let apiKey = `apiKey=${API_KEY}`;
  let results;
  let startingLocation;

  try {
    let test = Object.keys(localStorage);

    if( test.includes("ipLocation") ){
      console.log("true 1: ");
    } else {
      console.log("false 1");

      fetch(`${baseURL}?${apiKey}`, requestOptions)
      .then( (response) => response.json() )
      .then( (json) => { results = json;  console.log("startingLocation", results); } )
      .then( () => startingLocation = extractIPGeoValues(results))
      .then( () => localStorage.setItem("ipLocation", JSON.stringify(startingLocation)) )
      .then( () => fetchGeoCodingData(startingLocation))
      .then( () => localStorage.setItem("savedLocation", JSON.stringify(startingLocation)) )
      .catch( (error) => console.error(error) );
    }
  } catch (error) {
    console.log("error: ", error);
  }
}


function extractIPGeoValues(results) {
  let geocoded = results.city;

  return geocoded;
}



function fetchGeoCodingData(userLocation) {
  // API call to get geoCoding
  // https://geocoding-api.open-meteo.com/v1/search?name=${encodedLocation}&count=10&language=en&format=json
  let encodedLocation = userLocation.replace(/\W/g, '+');
  let baseURL = "https://geocoding-api.open-meteo.com/v1/search";
  let name = `name=${encodedLocation}`;
  let count = "count=10";
  let language = "language=en";
  let format = "format=json";
  let results;
  let listed;


  try {
    let existing = Object.keys(localStorage);
      if (existing.includes("savedLocation")) {
        let savedLocation = JSON.parse(localStorage.getItem("savedLocation"));

        if( savedLocation === userLocation ){
          console.log("comparing 1", savedLocation, userLocation);
        } else {
          console.log("comparing 2", savedLocation, userLocation);
          localStorage.setItem("savedLocation", JSON.stringify(userLocation));
          console.log("newlySaved: ", JSON.parse(localStorage.getItem("savedLocation")));

          fetch(`${baseURL}?${name}&${count}&${language}&${format}`, requestOptions)
          .then( (response) => response.json() )
          .then( (json) => { results = json; console.log("results: ", results); } )
          .then(() => { listed = extractGeoLocationValues(results); console.log("listed: ", listed);  })
          .then( () => localStorage.setItem("GeoCodedList", JSON.stringify(listed)))
          .catch( (error) => console.error(error));
        }
      }
  } catch (error) {
    console.error("error", error);
  }

}

function extractGeoLocationValues (results) {
  let myKeys = ["name", "admin1", "country_code", "timezone", "latitude", "longitude"];
  let rawResults = results.results;
  let list = [];

  rawResults.forEach( element => {
    let tempObj = {};

    Object.keys(element).forEach( (k) => {
      if( myKeys.includes(k) ) {
        tempObj[`${k}`] = `${element[`${k}`]}`;
      }
    });
    list.push(tempObj);
  });

  return list;
}


function selectGeoCodedLocation(index) {

  try {
    let condition = Object.keys(localStorage);
      if( condition.includes("GeoCodedList")) {
        let city = JSON.parse(localStorage.getItem("GeoCodedList"))[index];

        localStorage.setItem("selectedLocation", JSON.stringify(city));
        console.log("city", JSON.stringify(city));
        return city;
      }
  } catch (error) {
    console.log("error", error);
  }
}


function fetchCurrentWeather(userSelection){
  // API Call get current weather conditions
  // https://api.open-meteo.com/v1/forecast?latitude=33.647&longitude=-117.6892
  // &current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m
  // &daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant
  // &temperature_unit=fahrenheit
  // &wind_speed_unit=mph
  // &precipitation_unit=inch
  // &timezone=America%2FLos_Angeles
  // &forecast_days=4
  let baseURL = "https://api.open-meteo.com/v1/forecast";
  let latitude = `latitude=${userSelection.latitude}`;
  let longitude = `longitude=${userSelection.longitude}`;
  let current = 'current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m';
  let daily = 'daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant';
  let temperature = 'temperature_unit=fahrenheit';
  let precipitation = 'precipitation_unit=inch';
  let wind = 'wind_speed_unit=mph';
  let units = `${temperature}&${precipitation}&${wind}`;
  let timezone = 'timezone=America%2FLos_Angeles';
  let forecast = 'forecast_days=4';
  let now;

  fetch(`${baseURL}?${latitude}&${longitude}&${current}&${daily}&${units}&${timezone}&${forecast}`, requestOptions)
    .then(response => response.json())
    .then( (json) => { now = json; console.log("conditions now: ", now); })
    .catch(error => console.log("error", error));
}



// Function Calls testing
fetchInitialGeoLocation();

// simulating switching locations entering city names or postal codes
fetchGeoCodingData("Lake Forest");
// fetchGeoCodingData("94115");
// fetchGeoCodingData("Lima");

// simulating user selection from returned list of cities
userSelection = await selectGeoCodedLocation(0);

fetchCurrentWeather(userSelection);

console.log("mySelection: ", userSelection);

