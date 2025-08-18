import {getUnits} from "./units.js";


// TODO: Fiddle around with the units a bit more to get a better range gap

let units = getUnits();
let temp = units.temperature;

export function updateMinSide(target, value) {
  let rg = target.querySelector('.range-middle');
  let rl = target.querySelector('.range-low');
  let inpt = target.querySelector('.range-input input.min');
  
  if( temp === 'fahrenheit'){
    inpt.value = parseInt(value / 2);
    rg.style.left = ( (value / inpt.max) * 100 / 2 ) + '%';
    rl.style.right = ( 100 - (value / inpt.max) * 100 / 2 ) + '%';
  } else {
    inpt.value = parseInt(value);
    rg.style.left = (value / inpt.max) * 100 + '%';
    rl.style.right = 100 - (value / inpt.max) * 100 + '%';
  }

  inpt.disabled = true;
}

export function updateMaxSide(target, value) {
  let rg = target.querySelector('.range-middle');
  let rh = target.querySelector('.range-high');
  let inpt = target.querySelector('.range-input input.max');

  if (units.temperature === 'celsius') {
    inpt.value = parseInt(value * 2 + 15);
    rg.style.right = ( (100 - (value / inpt.max) * 100) * 2) + 10 + '%';
    rh.style.left = ( (value / inpt.max) * 100 * 2 ) + 10 + '%';
  } else {
    inpt.value = parseInt(value);
    rg.style.right = 100 - (value / inpt.max) * 100 + '%';
    rh.style.left = (value / inpt.max) * 100 + '%';
  }

  inpt.disabled = true;
}
