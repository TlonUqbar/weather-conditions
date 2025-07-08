import { requestOptions } from "../index.js";
import { getUnits } from "../utils/units.js";


export function geoCoding(userLocation){
  let encodedLocation = userLocation.replace(/\W/g, '+');
  let baseURL = "https://geocoding-api.open-meteo.com/v1/search";
  let name = `name=${encodedLocation}`;
  let setUnits  = getUnits();
  let count = `count=${setUnits.results}`;
  let language = "language=en";
  let format = "format=json";
  let results;
  let listed = {};


  return fetch(`${baseURL}?${name}&${count}&${language}&${format}`, requestOptions)
    .then( (response) => response.json() )
    .then( (json) => { results = json; } )
    .then( () => { 
      listed = extractGeoLocationValues(results); 
      // console.table(listed); 
      return listed; } )
    .catch( (error) => console.error(error));
}


function extractGeoLocationValues (results) {
  let myKeys = ["name", "admin1", "country_code", "country", "timezone", "latitude", "longitude"];
  let rawResults = results.results;
  let list = [];

  if( rawResults && rawResults !== 'null' && rawResults !== 'undefined' ){
    rawResults.forEach( element => {
      let tempObj = {};

      Object.keys(element).forEach( (k) => {
        if( myKeys.includes(k) ) { tempObj[`${k}`] = `${element[`${k}`]}`;}
      });
      list.push(tempObj);
    });
    return list;
  } else { return "Location not found"; }
}