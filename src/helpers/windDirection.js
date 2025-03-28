export function windDirection( angle ){
	let directions = [ "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
                    "S", "SSW", "SW", "WSW","W", "WNW", "NW", "NNW" ];
	let section = parseInt( angle/22.5 + 0.5 );

	section = section % 16;

	return directions[section];
}

