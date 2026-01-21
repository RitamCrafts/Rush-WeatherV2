console.log("JS active!");

//TIME TO GET ALL ID
const searchBoxE=document.getElementById("search-box");
const searchButtonE=document.getElementById("search-button");
const cityNameDisplayE=document.getElementById("city-name-display");
const countryNameDisplayE=document.getElementById("country-name-display");
const locationDisplayE=document.getElementById("location-display");
const weatherIconE=document.getElementById("weather-icon");
const currentStatusE=document.getElementById("current-status");
const currentTempE=document.getElementById("current-temp");
const unitE=document.getElementById("unit");
//-----------------------OTHER VARIABLES/CONSTS-----------------------------
const openWeather_apiKey="b162e29a35f54faa55e2389396d583ad"; //yes at the time making it , I know that this is unsafe, but idk how to hide it in env yet also I will just replace it if necessary as of now


searchButtonE.addEventListener("click",Search);
searchBoxE.addEventListener("keypress",(e)=>{
    if(e.key=="Enter"){
        Search();
    }
})

async function Search(){
    console.log("Searching region - "+searchBoxE.value);
    const locationData=await locationAPICall(searchBoxE.value.trim().toLowerCase());
    if(locationData===null){
        alert("Place was not found, please try nearby places or there is an API error.");
        return ["Place was not found, please try nearby places or there is an API error.",null];
    }
    const weatherData=await weatherAPICall(lat=locationData.lat,lon=locationData.lon);
    if(weatherData===null){
        alert("Place was not found, please try nearby places or there is an API error.");
        return ["Weather data is not available for the location or there is an API error.",null];
    }
    updateDisplay(locationData,weatherData);
    return 0;
}

async function locationAPICall(cityName){
    let res=await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${openWeather_apiKey}`);
    let data = await res.json();
    if(!data[0]){
        const locationData={locFound: false};
        console.log("LocationAPI data not Recieved")
        return null;
    }

    //country map generated from AI
    const countryMap = {
        AF: "Afghanistan", AX: "Åland Islands", AL: "Albania", DZ: "Algeria",
        AS: "American Samoa", AD: "Andorra", AO: "Angola", AI: "Anguilla",
        AQ: "Antarctica", AG: "Antigua & Barbuda", AR: "Argentina", AM: "Armenia",
        AW: "Aruba", AU: "Australia", AT: "Austria", AZ: "Azerbaijan",
        BS: "Bahamas", BH: "Bahrain", BD: "Bangladesh", BB: "Barbados",
        BY: "Belarus", BE: "Belgium", BZ: "Belize", BJ: "Benin",
        BM: "Bermuda", BT: "Bhutan", BO: "Bolivia", BQ: "Caribbean Netherlands",
        BA: "Bosnia & Herzegovina", BW: "Botswana", BV: "Bouvet Island",
        BR: "Brazil", IO: "British Indian Ocean Territory", BN: "Brunei",
        BG: "Bulgaria", BF: "Burkina Faso", BI: "Burundi", CV: "Cabo Verde",
        KH: "Cambodia", CM: "Cameroon", CA: "Canada", KY: "Cayman Islands",
        CF: "Central African Republic", TD: "Chad", CL: "Chile", CN: "China",
        CX: "Christmas Island", CC: "Cocos (Keeling) Islands", CO: "Colombia",
        KM: "Comoros", CG: "Congo - Brazzaville", CD: "Congo - Kinshasa",
        CK: "Cook Islands", CR: "Costa Rica", CI: "Côte d’Ivoire", HR: "Croatia",
        CU: "Cuba", CW: "Curaçao", CY: "Cyprus", CZ: "Czechia",
        DK: "Denmark", DJ: "Djibouti", DM: "Dominica", DO: "Dominican Republic",
        EC: "Ecuador", EG: "Egypt", SV: "El Salvador", GQ: "Equatorial Guinea",
        ER: "Eritrea", EE: "Estonia", SZ: "Eswatini", ET: "Ethiopia",
        FK: "Falkland Islands", FO: "Faroe Islands", FJ: "Fiji", FI: "Finland",
        FR: "France", GF: "French Guiana", PF: "French Polynesia",
        TF: "French Southern Territories", GA: "Gabon", GM: "Gambia",
        GE: "Georgia", DE: "Germany", GH: "Ghana", GI: "Gibraltar",
        GR: "Greece", GL: "Greenland", GD: "Grenada", GP: "Guadeloupe",
        GU: "Guam", GT: "Guatemala", GG: "Guernsey", GN: "Guinea",
        GW: "Guinea-Bissau", GY: "Guyana", HT: "Haiti", HM: "Heard & McDonald Islands",
        VA: "Vatican City", HN: "Honduras", HK: "Hong Kong SAR China",
        HU: "Hungary", IS: "Iceland", IN: "India", ID: "Indonesia",
        IR: "Iran", IQ: "Iraq", IE: "Ireland", IM: "Isle of Man",
        IL: "Israel", IT: "Italy", JM: "Jamaica", JP: "Japan",
        JE: "Jersey", JO: "Jordan", KZ: "Kazakhstan", KE: "Kenya",
        KI: "Kiribati", KP: "North Korea", KR: "South Korea", KW: "Kuwait",
        KG: "Kyrgyzstan", LA: "Laos", LV: "Latvia", LB: "Lebanon",
        LS: "Lesotho", LR: "Liberia", LY: "Libya", LI: "Liechtenstein",
        LT: "Lithuania", LU: "Luxembourg", MO: "Macau SAR China", MG: "Madagascar",
        MW: "Malawi", MY: "Malaysia", MV: "Maldives", ML: "Mali",
        MT: "Malta", MH: "Marshall Islands", MQ: "Martinique", MR: "Mauritania",
        MU: "Mauritius", YT: "Mayotte", MX: "Mexico", FM: "Micronesia",
        MD: "Moldova", MC: "Monaco", MN: "Mongolia", ME: "Montenegro",
        MS: "Montserrat", MA: "Morocco", MZ: "Mozambique", MM: "Myanmar",
        NA: "Namibia", NR: "Nauru", NP: "Nepal", NL: "Netherlands",
        NC: "New Caledonia", NZ: "New Zealand", NI: "Nicaragua", NE: "Niger",
        NG: "Nigeria", NU: "Niue", NF: "Norfolk Island", MK: "North Macedonia",
        MP: "Northern Mariana Islands", NO: "Norway", OM: "Oman", PK: "Pakistan",
        PW: "Palau", PS: "Palestinian Territories", PA: "Panama", PG: "Papua New Guinea",
        PY: "Paraguay", PE: "Peru", PH: "Philippines", PN: "Pitcairn Islands",
        PL: "Poland", PT: "Portugal", PR: "Puerto Rico", QA: "Qatar",
        RE: "Réunion", RO: "Romania", RU: "Russia", RW: "Rwanda",
        BL: "St. Barthélemy", SH: "St. Helena", KN: "St. Kitts & Nevis",
        LC: "St. Lucia", MF: "St. Martin", PM: "St. Pierre & Miquelon",
        VC: "St. Vincent & Grenadines", WS: "Samoa", SM: "San Marino",
        ST: "Sao Tome & Principe", SA: "Saudi Arabia", SN: "Senegal",
        RS: "Serbia", SC: "Seychelles", SL: "Sierra Leone", SG: "Singapore",
        SX: "Sint Maarten", SK: "Slovakia", SI: "Slovenia", SB: "Solomon Islands",
        SO: "Somalia", ZA: "South Africa", GS: "South Georgia & South Sandwich Islands",
        SS: "South Sudan", ES: "Spain", LK: "Sri Lanka", SD: "Sudan",
        SR: "Suriname", SJ: "Svalbard & Jan Mayen", SE: "Sweden", CH: "Switzerland",
        SY: "Syria", TW: "Taiwan", TJ: "Tajikistan", TZ: "Tanzania",
        TH: "Thailand", TL: "Timor-Leste", TG: "Togo", TK: "Tokelau",
        TO: "Tonga", TT: "Trinidad & Tobago", TN: "Tunisia", TR: "Turkey",
        TM: "Turkmenistan", TC: "Turks & Caicos Islands", TV: "Tuvalu", UG: "Uganda",
        UA: "Ukraine", AE: "United Arab Emirates", GB: "United Kingdom", US: "United States",
        UM: "U.S. Outlying Islands", UY: "Uruguay", UZ: "Uzbekistan",
        VU: "Vanuatu", VE: "Venezuela", VN: "Vietnam", VG: "British Virgin Islands",
        VI: "U.S. Virgin Islands", WF: "Wallis & Futuna", EH: "Western Sahara",
        YE: "Yemen", ZM: "Zambia", ZW: "Zimbabwe"
    }; 
    const locationData={
        city: data[0].name,
        countryCode: data[0].country,
        country: countryMap[data[0].country],
        state:data[0].state,
        lat:data[0].lat,
        lon:data[0].lon,
    };
    console.log(locationData);
    return locationData; 
}

async function weatherAPICall(lat,lon,){
    console.log("\nweather api call");
    let res=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${openWeather_apiKey}&units=metric`)
    let data=await res.json();
    console.log(data);
    if (data.length===0){
        console.log("WeatherAPI data not Recieved");
        return null;
    }
    let checkDayNight="day";
    if (data.weather[0].icon.endsWith("n")){
        checkDayNight="night";
    }
    else{
        checkDayNight="day";
    }
    const weatherData={
        temp:Math.round(data.main.temp),
        weatherStatus:data.weather[0].main,
        checkDayNight:checkDayNight,
        weatherIcon:data.weather[0].icon,
    };
    console.log(weatherData);
    return weatherData;
}

function updateDisplay(locData,wethData){
    let lat=Math.abs(Math.round(locData.lat*10)/10);
    let lon=Math.abs(Math.round(locData.lon*10)/10);
    let ns=locData.lat<0 ? "S" : "N";
    let ew=locData.lon<0 ? "W" : "E";
    cityNameDisplayE.textContent=locData.city;
    countryNameDisplayE.textContent=locData.country;
    locationDisplayE.textContent=`Lat:${lat}° ${ns} | Lon:${lon}° ${ew}`
    currentStatusE.textContent=wethData.weatherStatus;
    currentTempE.textContent=wethData.temp+"°";
    unitE.textContent="C";
    currentTempE.style.marginLeft="1rem";
    weatherIconE.src=`assets/${wethData.weatherIcon}.png`;
}
