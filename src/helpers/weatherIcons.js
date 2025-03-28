

export function iconHelper(forecast){
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