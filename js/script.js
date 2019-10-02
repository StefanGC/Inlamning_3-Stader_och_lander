//Variabler
var citiesVisited = [];     //Array som sparas stads-ID
var populationVisited = []; //Array som sparas invånarna i besökta städer
var cityId; 
let populationTotal;

//DOM
let countryForm = document.getElementById("countryForm");
let cityForm = document.getElementById("cityForm");
let cityInfo = document.getElementById("cityInfo");
let visitedCities = document.getElementById("visitedCities");


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
            countryForm.innerHTML = "<h5>Steg 1: väjl ett land</h5>" + countrySelect;  
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
            cityForm.innerHTML = "<h5>Steg 2: väjl en stad</h5>" + citySelect;
            cityForm.style.visibility = "visible";
            cityInfo.style.visibility = "hidden"; 
        })
        .catch(err => console.log(JSON.stringify(err)));
}

function visaInfo() {
    cityId = document.getElementById("citySelect").value;
    let countCities = 0;
    fetch('stad.json')
    .then(response => response.json())
    .then(function(jsonCities){
        //recorremos las ciudades y paramos cuando encontremos la ciudad buscada, asi es mas eficiente que reccorrer todas las ciudades 
        while (countCities < jsonCities.length && jsonCities[countCities].id != cityId) {
            countCities++;
        }
        //Al llegar aqui sabemos que jsonCities[countCities].id == cityId
        cityInfo.innerHTML = "<h5>Steg 3: information om stad</h5>";
        cityInfo.innerHTML += "<p>Id: " + jsonCities[countCities].id + "</p>"
        cityInfo.innerHTML += "<p>Stadname: " + jsonCities[countCities].stadname + "</p>"
        cityInfo.innerHTML += "<p>Countryid: " + jsonCities[countCities].countryid + "</p>"
        cityInfo.innerHTML += "<p>population: " + jsonCities[countCities].population + "</p>"
        cityInfo.innerHTML += "<button name=\"visitBtn\" id=\"visitBtn\" class=\"btn btn-info btn-md\">Besökt</button>";
        
        var cityObj = {Id: jsonCities[countCities].id, Countryid:jsonCities[countCities].countryid, population: jsonCities[countCities].population};

        let visitBtn = document.getElementById("visitBtn"); //Tiene que estar aqui porque se crea el boton
        
        
        //När man klickar på Besökt knapp
        visitBtn.onclick = function () {
            localStorage.setItem(jsonCities[countCities].stadname, JSON.stringify(cityObj));
            visaBesoktaStader();
        }

        cityInfo.style.visibility = "visible";
    })
    .catch(err => console.log(JSON.stringify(err)));
}

function visaBesoktaStader() {
    if (localStorage.length != 0){
        populationTotal = 0;
        visitedCities.innerHTML = "<h5>Städer jag besökt</h5><br>";
        visitedCities.innerHTML += skapaTabellmedStader();
        visitedCities.innerHTML += "<h6>Vet du summan av invånarantalet i de besökta städerna? " + populationTotal + "</h6>";
        visitedCities.innerHTML += "<button name=\"visitBtn\" id=\"rensaHistorikBtn\" class=\"btn btn-info btn-md\">Rensa historik</button>";
        
        let rensaBtn = document.getElementById("rensaHistorikBtn"); 
        
        //När man klickar på Rensa historik knapp
        rensaBtn.onclick = function () {
            localStorage.clear();
            visitedCities.innerHTML = "";
            visitedCities.style.visibility = "hidden";
        }
        visitedCities.style.visibility = "visible";
    }
}

function skapaTabellmedStader() {
    var cityObj;
    
    var table = "<div class=\"table-responsive\">";
    table += "<table class=\"table table-hover\">";
    table += "<tr><th>City ID</th><th>Stadname</th><th>Country Id</th><th>population</th></tr>"; //Table header
        
     for (let i = 0; i < localStorage.length; i++) {
        cityObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        table += "<tr><td>"+ cityObj.Id +"</td><td>"+ localStorage.key(i) +"</td><td>"+ cityObj.Countryid +"</td><td>"+ cityObj.population +"</td></tr>";
        populationTotal += cityObj.population;
    }
    table += "</table></div>";
    return table;
}

//Själva kod
skapaMenuLander();

visaBesoktaStader();
