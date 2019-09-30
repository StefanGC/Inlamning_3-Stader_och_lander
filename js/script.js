//DOM
let countryForm = document.getElementById("countryForm");
let cityForm = document.getElementById("cityForm");
let cityInfo = document.getElementById("cityInfo");

//Functioner
function skapaMenuLander() {
    fetch('land.json')
        .then(response => response.json())
        .then(function(jsonCountries){
            let countrySelect = "<select id=\"countrySelect\" onchange=\"skapaMenuStader();\">";
            countrySelect += "<option value=\"0\" disabled selected>Välj ett land</option>"
            for(let countCountry = 0; countCountry < jsonCountries.length; countCountry++){
                countrySelect += "<option value=\"" + jsonCountries[countCountry].id + "\">"+ jsonCountries[countCountry].countryname + "</option>";
            }
            countrySelect += "</select>";  
            countryForm.innerHTML = countrySelect;   
        })
        .catch(err => console.log(JSON.stringify(err)));
}
    
function skapaMenuStader() {
    let countryId = document.getElementById("countrySelect").value;
    cityInfo.innerHTML = "";
    fetch('stad.json')
        .then(response => response.json())
        .then(function(jsonCities){
            let citySelect = "<select id=\"citySelect\" onchange=\"visaInfo();\">";
            citySelect += "<option value=\"0\" disabled selected>Välj en stad</option>"
            for(let countCities = 0; countCities < jsonCities.length; countCities++){
                if (jsonCities[countCities].countryid == countryId) {//Posible mejora: crear un JSON sólo con las ciudades 
                    citySelect += "<option value=\"" + jsonCities[countCities].id + "\">"+ jsonCities[countCities].stadname + "</option>";
                }
            }
            citySelect += "</select>";  
            cityForm.innerHTML = citySelect;
        })
        .catch(err => console.log(JSON.stringify(err)));
}

function visaInfo() {
    let cityId = document.getElementById("citySelect").value;
    let countCities = 0;
    fetch('stad.json')
    .then(response => response.json())
    .then(function(jsonCities){
        //recorremos las ciudades y paramos cuando encontremos la ciudad buscada, asi es mas eficiente que reccorrer todas las ciudades 
        while (countCities < jsonCities.length && jsonCities[countCities].id != cityId) {
            countCities++;
        }
        //Al llegar aqui sabemos que jsonCities[countCities].id == cityId
        cityInfo.innerHTML = "<p>Id: " + jsonCities[countCities].id + "</p>"
        cityInfo.innerHTML += "<p>Stadname: " + jsonCities[countCities].stadname + "</p>"
        cityInfo.innerHTML += "<p>Countryid: " + jsonCities[countCities].countryid + "</p>"
        cityInfo.innerHTML += "<p>population: " + jsonCities[countCities].population + "</p>"
    })
    .catch(err => console.log(JSON.stringify(err)));
}


//Själva kod
skapaMenuLander();
