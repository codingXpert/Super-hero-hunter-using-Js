let favHerosContainer = document.getElementById("favourites-container");

// fetch results from API
async function fetchAsync(url) {
  try {
    let res = await fetch(url);
    let data = await res.json();
    return data;
  } catch (err) {
    console.log("Error from API call", err);
    return;
  }
}

// redirect to a super hero page with respective id
async function displayHeroPage(e) {
  let heroPagePath = `${window.location.pathname} + /../hero.html#id=${e.target.parentElement.id}`;
  window.open(heroPagePath);
}

// display a list of favourite heros by creating element using DOM
async function updateFavouriteHeroes() {
  let favourites = getFavourites();
  for (let i = 0; i < favourites.length; i++) {
    let favItem = document.createElement("div");
    favItem.setAttribute("id", favourites[i]);
    favItem.className = "fav-item";
    let url = `https://superheroapi.com/api.php/2928355607286861/${favourites[i]}`;
    let data = await fetchAsync(url);
    if (data && data.response === "success") {
      let heroImage = document.createElement("img");
      heroImage.setAttribute("src", data["image"]["url"]);
      heroImage.addEventListener("click", displayHeroPage);
      favItem.appendChild(heroImage);
      let heroInfo = document.createElement("div");
      heroInfo.className = "hero-info";
      let heroName = document.createElement("span");
      heroName.innerHTML = data["name"];
      heroInfo.appendChild(heroName);
      let removeHeroFromFavs = document.createElement("button");
      removeHeroFromFavs.innerHTML = "Remove from Favourites";
      removeHeroFromFavs.addEventListener("click", removeFromFavourites);
      heroInfo.appendChild(removeHeroFromFavs);
      favItem.appendChild(heroInfo);
      favHerosContainer.appendChild(favItem);
    }
  }
}

// remove from favourites and also remove the node from dom
async function removeFromFavourites(e) {
  let id = e.target.parentElement.parentElement.id;
  let favs = getFavourites();

  let updatedFavs = favs.filter(function (val) {
    return val != id;
  });
  localStorage.setItem("favHeros", JSON.stringify(updatedFavs));

  let favItem = document.getElementsByClassName("fav-item");
  for (let i = 0; i < favItem.length; i++) {
    if (favItem[i].id == id) {
      favHerosContainer.removeChild(favItem[i]);
      break;
    }
  }
}

// get a list of favourite heroes
function getFavourites() {
  let favourites;
  if (localStorage.getItem("favHeros") === null) {
    favourites = [];
  } else {
    favourites = JSON.parse(localStorage.getItem("favHeros"));
  }
  return favourites;
}

updateFavouriteHeroes();
