const searchHero = document.getElementById('search-hero');
const searchResultsContainer = document.getElementById('search-resukt');
const url = "https://superheroapi.com/api.php/2928355607286861";

triggerEventListeners();
function triggerEventListeners() {
    searchHero.addEventListener('keyup', handleSearch);
}

// when a user clicks enter in the search bar redirects him to superhero page
async function handleEnter(nameToSearch) {
    let data = await fetchAsync(`${url}/search/${nameToSearch}`);
    // redirect to super hero page if success
    if (data.response === "success") {
        let heroPagePath = `${window.location.pathname} + /../hero.html#id=${data.results[0].id}`;
        window.open(heroPagePath);
    }
}

//   handle earch input
async function handleSearch(e) {
    // trim the name to searched
    let nameToSearch = e.target.value.trim();
    //if user has hit enter in the search bar
    if (e.keycode === 13 && nameToSearch.length > 0) {
        handleEnter(nameToSearch);
    }
    if (nameToSearch.length == 0) {
        await clearSearchResults();
    } else {
        //fetch the complete data
        let data = await fetchAsync(`${url}/search/${nameToSearch}`);
        if (data && data.response === "success") {
            searchResultsContainer.innerHTML = "";
            let favorites = getFavourites();
            // create elements using DOM for appending to search results and add event listeners
            for (let i = 0; i < data.results.length; i++) {
                let searchItem = document.createElement('div');
                searchItem.className = "search-reasult";

                let heroImage = document.createElement('img');
                heroImage.setAttribute("src", `${data.results[i].image.url}`);
                heroImage.setAttribute("id", `${data.results[i].id}`);
                heroImage.addEventListener("click", displayHeroPage);

                searchItem.appendChild(heroImage);

                let heroInfo = document.createElement("div");
                heroInfo.className = "hero-info";
                heroInfo.setAttribute("id", `${data.results[i].id}`);

                searchItem.appendChild(heroInfo);


                let heroName = document.createElement("span");
                heroName.innerText = data.results[i].name;
                heroInfo.appendChild(heroName);

                let optionButton = document.createElement("button");
                if (favorites.includes(data.results[i].id)) {
                    optionButton.innerHTML = "Remove from favourites";
                    optionButton.addEventListener("click", removeFromFavourites);
                } else {
                    optionButton.innerHTML = "Add to favourites";
                    optionButton.addEventListener("click", addToFavourites);
                }
                heroInfo.appendChild(optionButton);

                searchResultsContainer.appendChild(searchItem);

            }
        } else {
            await clearSearchResults();
        }
    }
}

// API Call
async function fetchAsync(url) {
    try {
      let res = await fetch(url);
      let data = await res.json();
      return data;
    } catch (err) {
      await clearSearchResults();
    }
  }
  
  // clear all search results
  async function clearSearchResults() {
    let i = searchResultsContainer.childNodes.length;
    while (i--) {
      searchResultsContainer.removeChild(searchResultsContainer.lastChild);
    }
  }
  
  // redirect to a super hero page with respective id
  async function displayHeroPage(e) {
    let heroPagePath = `${window.location.pathname} + /../hero.html#id=${e.target.id}`;
    window.open(heroPagePath);
    console.log(heroPagePath);
  }
  
  // return the list of favourite hero id's which is stored in local storage
  function getFavourites() {
    let favourites;
    if (localStorage.getItem("favHeros") === null) {
      favourites = [];
    } else {
      favourites = JSON.parse(localStorage.getItem("favHeros"));
    }
    return favourites;
  }
  
  // add superhero to favourites
  async function addToFavourites(e) {
    let itemId = e.target.parentElement.id;
    let favorites = getFavourites();
    if (!favorites.includes(itemId)) {
      favorites.push(itemId);
    }
    localStorage.setItem("favHeros", JSON.stringify(favorites));
    e.target.innerHTML = "Remove from favourites";
    e.target.removeEventListener("click", addToFavourites);
    e.target.addEventListener("click", removeFromFavourites);
  }
  
  // remove superhero from favourites
  async function removeFromFavourites(e) {
    let itemId = e.target.parentElement.id;
    console.log("itemId remove", itemId);
    let favourites = getFavourites();
  
    let updatedFavorites = favourites.filter(function (val) {
      return val != itemId;
    });
    localStorage.setItem("favHeros", JSON.stringify(updatedFavorites));
    e.target.innerHTML = "Add to favourites";
    e.target.removeEventListener("click", removeFromFavourites);
    e.target.addEventListener("click", addToFavourites);
  }

  