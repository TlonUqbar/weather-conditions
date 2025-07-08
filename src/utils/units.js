
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
  if( Object.keys(localStorage).includes("units") ) {
    return JSON.parse(localStorage.getItem("units"));
  } else {
    defaultUnits();
    return JSON.parse(localStorage.getItem("defaultUnits"));
  }
  
}