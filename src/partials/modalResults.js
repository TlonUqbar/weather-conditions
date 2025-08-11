import { countryCodes } from "../utils/country_codes.js"; 
import * as vars from "../index.js";

export function modalResults(obj) {
  let results_dom = document.querySelector(".results");
  let searches = document.querySelector('.searches');
  let searchedLocations = JSON.parse(localStorage.getItem('searchedLocations'));
  let search = [];

  results_dom.querySelectorAll(".result").forEach( (l) => l.remove() );

  if ( typeof obj != 'object') {
    let notFound  = document.createElement("div");
    notFound.classList = ["result not-found"];
    notFound.textContent = "Location not found. Check spelling.";
    searches.classList.remove("hide");
    results_dom.appendChild(notFound);
    return;
  }

  obj.forEach( (el, i) => {
    let doc  = document.createElement("div");
    let state = ( el.admin1 === undefined ) ? '' : `, ${el.admin1}`;
    let country  = ( el.country === undefined ) ? countryCodes(el.country_code) : el.country;

    doc.classList.add("result");  
    doc.textContent = `${el.name}${state}, ${country}`;
    doc.setAttribute("data-index", i);
    doc.addEventListener("click", () => {
      vars.testLocation(el);
      vars.closeModal();
      localStorage.setItem("selectedLocation", JSON.stringify(el));

      if( searchedLocations === null || searchedLocations === undefined ){
        search.push(el);
        localStorage.setItem('searchedLocations', JSON.stringify(search));
      } else {
        while(searchedLocations.length > 4){
          searchedLocations.pop();
        }
        searchedLocations.unshift(el);
        localStorage.setItem( 'searchedLocations', JSON.stringify(searchedLocations) );
      }
    });
    results_dom.appendChild(doc);
    searches.classList.add("hide");
  });
}