let temp = "celsius";
let speed = "kmh";
let precip = "mm";
let results = "20" ;


export function getLocation() {
  return JSON.parse(localStorage.getItem("selectedLocation"));
}

function defaultUnits(){
  let defaultUnits = { "temperature":  "celsius", "wind" : "kmh", "precipitation" : "mm", "results" : "20" };
  localStorage.setItem("defaultUnits", JSON.stringify(defaultUnits));
} 


export function setUnits(temp, precip, speed, results) {
  let units = { "temperature":  temp, "wind" : speed, "precipitation" : precip, "results" : results };
  localStorage.setItem("units", JSON.stringify(units));
}


export function getUnits(){
  // console.log("called units");
  if( Object.keys(localStorage).includes("units") ) {
    // console.log("units", JSON.parse(localStorage.units));
    return JSON.parse(localStorage.getItem("units"));
  } else {
    // let defaultUnits = { "temperature":  "celsius", "wind" : "kmh", "precipitation" : "mm", "results" : "20" };
    // localStorage.setItem("defaultUnits", JSON.stringify(defaultUnits));
    // console.log("default", JSON.parse(localStorage.getItem("defaultUnits")));
    defaultUnits();
    return JSON.parse(localStorage.getItem("defaultUnits"));
  }
  
}