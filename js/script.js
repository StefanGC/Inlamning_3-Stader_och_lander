//Variabler
let countryId;          //Lagra värdet om countrySelect
let cityId;             //Lagra värdet om citySelect
let populationTotal;    //lagra den totala befolkningen i de besökta städerna


//DOM
let countryForm = document.getElementById("countryForm");
let cityForm = document.getElementById("cityForm");
let cityInfo = document.getElementById("cityInfo");
let visitedCities = document.getElementById("visitedCities");


//Listrutan med länder skapas
function skapaMenuLander() {
    fetch('land.json')
        .then(response => response.json())
        .then(function(jsonCountries){
            let countrySelect = "<select id=\"countrySelect\" onchange=\"skapaMenuStader();\">";
            countrySelect += "<option value=\"0\" disabled selected>Välj ett land</option>"
            for(let countCountry = 0; countCountry < jsonCountries.length; countCountry++){
                countrySelect += "<option value=\"" + jsonCountries[countCountry].id + "\">"+ jsonCountries[countCountry].countryname + "</option>";
            }
            countrySelect += "<option value=\"-1\">Städer jag besökt</option>";
            countrySelect += "</select>";  
            countryForm.innerHTML = "<h5>Steg 1: väjl ett land</h5>" + countrySelect;  
        })
        .catch(err => console.log(JSON.stringify(err)));
}
   

//Listrutan med städer skapas
function skapaMenuStader() {
    countryId = document.getElementById("countrySelect").value;
    cityInfo.innerHTML = "";
    fetch('stad.json')
        .then(response => response.json())
        .then(function(jsonCities){
            if (countryId == "-1"){
                visaBesoktaStader();
                cityForm.style.visibility = "hidden";
                cityInfo.style.visibility = "hidden";
            } else {
                let citySelect = "<select id=\"citySelect\" onchange=\"visaInfo();\">";
                citySelect += "<option value=\"0\" disabled selected>Välj en stad</option>"
                for(let countCities = 0; countCities < jsonCities.length; countCities++){
                    if (jsonCities[countCities].countryid == countryId) {
                        citySelect += "<option value=\"" + jsonCities[countCities].id + "\">"+ jsonCities[countCities].stadname + "</option>";
                    }
                }
                citySelect += "</select>";  
                cityForm.innerHTML = "<h5>Steg 2: väjl en stad</h5>" + citySelect;
                cityForm.style.visibility = "visible";
                cityInfo.style.visibility = "hidden"; 
            }
        })
        .catch(err => console.log(JSON.stringify(err)));
}


//Visa information om den staden besökaren har valt
function visaInfo() {
    cityId = document.getElementById("citySelect").value;
    let countCities = 0;
    fetch('stad.json')
    .then(response => response.json())
    .then(function(jsonCities){
        //Vi går genom städerna och stannar när vi hittar den stad vi letar efter, så det är mer effektivt än att gå igenom alla städer 
        while (countCities < jsonCities.length && jsonCities[countCities].id != cityId) {
            countCities++;
        }
        cityInfo.innerHTML = "<h5>Steg 3: information om stad</h5>";
        cityInfo.innerHTML += "<br><p>" + jsonCities[countCities].stadname + " är ett stad i " + document.getElementById("countrySelect").options[countryId].text + " och där bor " + jsonCities[countCities].population + " st invånare.</p><br>";
        cityInfo.innerHTML += "<button name=\"visitBtn\" id=\"visitBtn\" class=\"btn btn-info btn-md\">Besökt</button>";
        
        //Ett objekt skapas med all information om staden 
        var cityObj = {Id: jsonCities[countCities].id, Countryid:jsonCities[countCities].countryid, population: jsonCities[countCities].population};

        let visitBtn = document.getElementById("visitBtn");
        
        //När man klickar på Besökt knapp
        visitBtn.onclick = function () {
            localStorage.setItem(jsonCities[countCities].stadname, JSON.stringify(cityObj));
            visaBesoktaStader();
        }
        cityInfo.style.visibility = "visible";
    })
    .catch(err => console.log(JSON.stringify(err)));
}


//Visa alla besökta städer
function visaBesoktaStader() {
    if (localStorage.length > 0){
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
        
    } else {
        visitedCities.innerHTML = "<h5>Städer jag besökt</h5><br>";
        visitedCities.innerHTML += "<p>Du har inte besökt någon stad än. För att besöka städer måste du först välja ett land i menyn ovan, sedan en stad och klicka på beskt-knappen för att lägga till staden som besökt.</p>";
    }
    visitedCities.style.visibility = "visible";
}

//Tabellen skapas med de besökta städerna
function skapaTabellmedStader() {
    var cityObj;
    
    var table = "<div class=\"table-responsive\">";
    table += "<table class=\"table table-hover\">";
    table += "<tr><th>City ID</th><th>Stadname</th><th>Country ID</th><th>Population</th></tr>"; //Table header
        
     for (let i = 0; i < localStorage.length; i++) {
        cityObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
        table += "<tr><td>"+ cityObj.Id +"</td><td>"+ localStorage.key(i) +"</td><td>"+ cityObj.Countryid +"</td><td>"+ cityObj.population +"</td></tr>";
        populationTotal += cityObj.population;
    }
    table += "</table></div>";
    return table;
}

//Menyn med länderna visas i början
skapaMenuLander();