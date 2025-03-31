import { countryCodes } from "../helpers/country_codes.js"; 
import * as vars from "../index.js";

// let thisHour = DateTime.now().hour;

function isDay() { return JSON.parse(localStorage.getItem("info")).is_day;}


export function modalResults(obj) {
  let results_dom = document.querySelector(".results");
  let input = document.querySelector("input");

  results_dom.querySelectorAll(".result").forEach( (l) => l.remove() );

  if ( typeof obj != 'object') {
    let notFound  = document.createElement("div");
    notFound.classList = ["result not-found"];
    notFound.textContent = "Location not found. Check spelling.";
    results_dom.appendChild(notFound);
    return;
  }

  obj.forEach( (el, i) => {
    let doc  = document.createElement("div");
    let state = ( el.admin1 === undefined ) ? '' : `, ${el.admin1}`;
    let country  = ( el.country === undefined ) ? countryCodes(el.country_code) : el.country;
    doc.classList.add("result");  

    doc.textContent = `${el.name}${state}, ${country}`;

    // doc.textContent = `${el.name}, ${el.admin1}, ${el.country}`;
    doc.setAttribute("data-index", i);
    doc.addEventListener("click", () => {
      vars.testLocation(el);
      vars.closeModal();
      // setTimeout( () => { input.value = ""; }, 1000 ); 
      localStorage.setItem("selectedLocation", JSON.stringify(el));
      
    });
    results_dom.appendChild(doc);
  });
}