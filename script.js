//You can edit ALL of the code here
function makePageForEpisodes(episodeList) {
  //const rootElem = document.getElementById("root");
  //rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}

const rootElem = document.getElementById("root");

function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  for (let episode of allEpisodes) {
    let containerDiv = document.createElement("div");
    rootElem.appendChild(containerDiv);
    containerDiv.className = "box";

    let seasonNo = document.createElement("span");
    seasonNo.innerHTML = `S${Number(episode.season) > 10 ? 1 : 0}${
      episode.season
    }`;

    let episodeNo = document.createElement("span");
    episodeNo.innerText = `E${Number(episode.number) > 10 ? 1 : 0}${
      episode.number
    }`;

    let title = document.createElement("h2");
    title.innerHTML = `${episode.name} - `;
    title.appendChild(seasonNo);
    title.appendChild(episodeNo);

    let episodeBrief = document.createElement("p");
    episodeBrief.innerHTML = episode.summary;

    let episodeImg = document.createElement("img");
    episodeImg.src = episode.image.medium;
    //episodeImg.alt = episode.alt;

    containerDiv.appendChild(title);
    containerDiv.appendChild(episodeImg);
    containerDiv.appendChild(episodeBrief);
  }
}

window.onload = setup;
