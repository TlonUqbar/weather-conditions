
export function extractData(weather, section){
  const rawData = weather[`${section}`];
  let testObj = {};

  Object.keys(rawData).forEach( key => {
    if(isArray(rawData[key])) {
      testObj[`${key}`] = rawData[`${key}`];
    } else {
      testObj[`${key}`] = `${rawData[`${key}`]}`;
    }    
  });
  return testObj;
}

function isArray(what){ return Object.prototype.toString.call(what) === '[object Array]'; }