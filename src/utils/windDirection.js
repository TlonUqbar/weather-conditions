export function windDirection( angle ){
	let section = parseInt( angle/22.5 + 0.5 );
	let directions = [ "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                    "S", "SSW", "SW", "WSW","W", "WNW", "NW", "NNW" ];
	
	section = section % 16;
	return directions[section];
}
