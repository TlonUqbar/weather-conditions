
export function extractData(weather, section){
  const rawData = weather[`${section}`];
  let myObj = {};

  Object.keys(rawData).forEach( key => {
    if(isArray(rawData[key])) {
      myObj[`${key}`] = rawData[`${key}`];
    } else {
      myObj[`${key}`] = `${rawData[`${key}`]}`;
    }    
  });
  return myObj;
}

function isArray(what){ return Object.prototype.toString.call(what) === '[object Array]'; }