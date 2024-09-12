const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const searchForm = document.querySelector("[data-searchForm]");
const grantAccessContainer = document.querySelector(".grant-location-container");
const userInfoContainer = document.querySelector(".user-info-container");

let currTab = userTab;
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";
currTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickedTab)
{
    if(currTab != clickedTab)
    {
        currTab.classList.remove("current-tab");
        currTab = clickedTab;
        currTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            grantAccessContainer.classList.remove("active");
            userInfoContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            userInfoContainer.classList.remove("active");
            searchForm.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
});

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates;

    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json()
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){

    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[city-name]");
    const cityIcon = document.querySelector("[city-icon]");
    const description = document.querySelector("[desc]");
    const weatherImg = document.querySelector("[weather-icon]");
    const dataTemp = document.querySelector("[temp]");
    const wind = document.querySelector("[data-wind]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloud]");

    cityName.innerHTML = weatherInfo?.name;
    cityIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = weatherInfo?.weather?.[0]?.description;
    weatherImg.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    dataTemp.innerHTML =`${weatherInfo?.main?.temp} °C`;
    wind.innerHTML = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    clouds.innerHTML = `${weatherInfo?.clouds?.all}%`;
}

function getLocation()
{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("location not availaible");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessBtn = document.querySelector("[data-grantAccess]");

grantAccessBtn.addEventListener("click", getLocation); 
const searchCity = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    let cityName = searchCity.value;

    if(cityName === "")
    {
        return;
    }
    else{
        fetchSearchWeather(cityName);
    }
});

async function fetchSearchWeather(city){
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data =await response.json();
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){

    }
}