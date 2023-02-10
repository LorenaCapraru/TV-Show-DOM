const boxContainer = document.getElementById("boxContainer");
let searchContainer = document.getElementById("search");
let dropDown = document.querySelector(".dropDown");
let dropDownShows = document.querySelector(".dropDownShows");
let allShows = getAllShows();

function displaySearchResults(episodeList) {
  resultsNo = document.getElementById("resultsNo");
  resultsNo.innerHTML = `Got ${boxContainer.childElementCount} result(s)`;
  resultsNo.className = "resultsNo";
}

async function displayShows() {
  //I initialize the page when it loads the first time
  dropDown.style.visibility = "hidden";
  createSearch(allShows);
  createDropDownShows(allShows);
  allShows.forEach((show) => createBoxShow(show));
  displaySearchResults(allShows);
}

function createBoxEpisode(episode) {
  let containerDiv = document.createElement("div");
  boxContainer.appendChild(containerDiv);
  containerDiv.className = "box";

  let seasonNo = document.createElement("span");
  seasonNo.innerHTML = `S${Number(episode.season) > 10 ? 1 : 0}${
    episode.season
  }`;

  let episodeNo = document.createElement("span");
  episodeNo.innerText = `E${Number(episode.number) > 10 ? 1 : 0}${
    episode.number
  }`;

  let title = document.createElement("h3");
  title.innerHTML = `${episode.name.toUpperCase()} - `;
  title.appendChild(seasonNo);
  title.appendChild(episodeNo);
  title.className = "title";

  let episodeBrief = document.createElement("p");
  episodeBrief.innerHTML = episode.summary ?? "Summary unavailable";
  episodeBrief.className = "brief";

  let episodeImg = document.createElement("img");

  episodeImg.src =
    episode.image?.medium ??
    "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg";

  episodeImg.className = "image";
  episodeImg.alt = episode.name;

  containerDiv.appendChild(title);
  containerDiv.appendChild(episodeImg);
  containerDiv.appendChild(episodeBrief);
}

function createBoxShow(show) {
  let containerDiv = document.createElement("div");
  boxContainer.appendChild(containerDiv);
  containerDiv.className = "box";

  let showDetailsBox = document.createElement("div");
  showDetailsBox.className = "showDetailsBox";

  let showSummary = document.createElement("div");
  showSummary.className = "showSummery";

  let title = document.createElement("h3");
  title.innerHTML = `${show.name.toUpperCase()}`;
  title.className = "title";

  let showBrief = document.createElement("p");
  showBrief.innerHTML = show.summary ?? "Summary unavailable";
  showBrief.className = "brief";

  let showImg = document.createElement("img");
  showImg.src =
    show.image?.medium ??
    "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg";
  showImg.className = "image";
  showImg.alt = show.name;

  let showGenre = document.createElement("p");
  showGenre.innerHTML = `Genre(s): ${show.genres}`;

  let showStatus = document.createElement("p");
  showStatus.innerHTML = `Status: ${show.status}`;

  let showRating = document.createElement("p");
  showRating.innerHTML = `Rating: ${show.rating.average}`;

  let showRuntime = document.createElement("p");
  showRuntime.innerHTML = `Runtime: ${show.runtime}`;

  showSummary.appendChild(title);
  showSummary.appendChild(showImg);
  showSummary.appendChild(showBrief);
  showDetailsBox.appendChild(showGenre);
  showDetailsBox.appendChild(showStatus);
  showDetailsBox.appendChild(showRating);
  showDetailsBox.appendChild(showRuntime);

  //I created 2 different div's to append the show's detail just to control the flex-box
  containerDiv.appendChild(showSummary);
  containerDiv.appendChild(showDetailsBox);
}

function createSearch(allEpisodes) {
  let searchEpisodes = document.getElementById("searchEpisode");
  searchEpisodes.className = "searchEpisodes";

  let listOfSearchedEp = [];

  searchEpisodes.addEventListener("input", () => {
    boxContainer.innerHTML = "";
    allEpisodes
      .filter((episode) => {
        return (
          episode.name
            .toLowerCase()
            .includes(searchEpisodes.value.toLowerCase()) ||
          episode.summary
            .toLowerCase()
            .includes(searchEpisodes.value.toLowerCase())
        );
      })
      .forEach((ep) => {
        ep.genres ? createBoxShow(ep) : createBoxEpisode(ep);
        listOfSearchedEp.push(ep);
      });

    resultsNo.innerHTML = `Got ${boxContainer.childElementCount} result(s)`;

    if (boxContainer.childElementCount === 0) {
      let noFoundElement = document.createElement("h1");
      noFoundElement.innerHTML = "No matching results.";
      boxContainer.appendChild(noFoundElement);
    }
  });
}

function createDropDown(allEpisodes) {
  let firstOption = document.createElement("option");
  firstOption.innerText = "All Episodes";
  firstOption.value = "All Episodes";
  dropDown.appendChild(firstOption);

  for (let episode of allEpisodes) {
    let option = document.createElement("option");
    option.innerHTML = `S${Number(episode.season) > 10 ? 1 : 0}${
      episode.season
    }E${Number(episode.number) > 10 ? 1 : 0}${episode.number} - ${
      episode.name
    }`;
    dropDown.appendChild(option);
  }

  dropDown.addEventListener("change", () => {
    if (dropDown.value === "All Episodes") {
      boxContainer.innerHTML = "";
      allEpisodes.forEach((episode) => createBoxEpisode(episode));
    } else boxContainer.innerHTML = "";
    for (let episode of allEpisodes)
      if (
        dropDown.options[dropDown.selectedIndex].text.includes(episode.name)
      ) {
        createBoxEpisode(episode);
        resultsNo.innerHTML = `Got one episode(s)`;
      }
  });
}

function createDropDownShows(allShows) {
  let firstShow = document.createElement("option");
  firstShow.innerText = "All Shows";
  dropDownShows.appendChild(firstShow);

  allShows.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });

  for (let show of allShows) {
    let option = document.createElement("option");
    option.innerText = show.name;
    option.value = show.id;
    dropDownShows.appendChild(option);
  }

  dropDownShows.addEventListener("change", () => {
    if (dropDownShows.value === "All Shows") {
      boxContainer.innerHTML = "";
      dropDown.style.visibility = "hidden";

      displayShows();
    } else {
      dropDown.style.visibility = "visible";
      boxContainer.innerHTML = "";
      let showId = dropDownShows.value;
      fetchEpisodes(showId);
    }
  });
}

async function fetchEpisodes(showId) {
  const response = await fetch(
    `https://api.tvmaze.com/shows/${showId}/episodes`
  );
  const showEpisodes = await response.json();

  boxContainer.innerHTML = "";
  showEpisodes.forEach((episode) => createBoxEpisode(episode));

  dropDown.innerHTML = "";
  createDropDown(showEpisodes);
  createSearch(showEpisodes);
  displaySearchResults(showEpisodes);
}

function setup() {
  displayShows();
}

window.onload = setup;
