//You can edit ALL of the code here
const boxContainer = document.getElementById("boxContainer");
const allEpisodes = getAllEpisodes();
let searchContainer = document.getElementById("search");
const resultsNo = document.createElement("p");
let dropDown = document.querySelector("select");

function displaySearchResults(episodeList) {
  resultsNo.innerHTML = `Got ${episodeList.length} episode(s)`;
  resultsNo.className = "resultsNo";
  searchContainer.appendChild(resultsNo);
}

function setup() {
  displaySearchResults(allEpisodes);
  allEpisodes.forEach((episode) => createBoxEpisode(episode));
  createSearch();
  createDropDown(allEpisodes);
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
  episodeBrief.innerHTML = episode.summary;
  episodeBrief.className = "brief";

  let episodeImg = document.createElement("img");
  episodeImg.src = episode.image.medium;
  episodeImg.className = "image";
  episodeImg.alt = episode.name;

  containerDiv.appendChild(title);
  containerDiv.appendChild(episodeImg);
  containerDiv.appendChild(episodeBrief);
}

function createSearch() {
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
        createBoxEpisode(ep);
        listOfSearchedEp.push(ep);
      });

    resultsNo.innerHTML = `Got ${boxContainer.childElementCount} episode(s)`;

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

window.onload = setup;
