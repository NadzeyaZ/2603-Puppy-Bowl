// === Constants ===
const BASE = "https://fsa-puppy-bowl.herokuapp.com/api";
const COHORT = "/2603-nadzeya"; // Make sure to change this!
const RESOURCE = "/players";
const API = BASE + COHORT + RESOURCE;

// === State ===
let players = [];
let selectedPlayer;

// get all players
async function getPlayers() {
  try {
    const response = await fetch(API);
    const result = await response.json();
    players = result.data.players;
    render();
  } catch (error) {
    console.error(`The error when get all players: ${error}`);
  }
}

//get one player by id
async function getPlayer(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    const result = await response.json();
    console.log(result);
    selectedPlayer = result.data.player;
    render();
  } catch (error) {
    console.error(`The error when get a player: ${error}`);
  }
}

/**
 * add a new player
 * @param {Player} player - The player to invite
 */
async function addPlayer(player) {
  try {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    await getPlayers();
  } catch (error) {
    console.error(`The error when add a player: ${error}`);
  }
}

// delete player by id
async function removePlayer(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    selectedPlayer = undefined;
    await getPlayers();
  } catch (error) {
    console.error(`The error when remove a player: ${error}`);
  }
}

// === Components ===
// PuppiesListItem;
function PuppiesListItem(player) {
  const $li = document.createElement("li");
  $li.innerHTML = `
    <a href="#selected">${player.name}</a>
    `;
  $li.addEventListener("click", () => getPlayer(player.id));
  return $li;
}
// PuppiesList;
function PuppiesList() {
  const $ul = document.createElement("ul");
  const $puppies = players.map(PuppiesListItem);
  $ul.replaceChildren(...$puppies);
  return $ul;
}

// PuppyDetails;
function PuppyDetails() {
  if (!selectedPlayer) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a puppy to learn more";
    return $p;
  }
  const $puppy = document.createElement("section");
  $puppy.classList.add("puppy");
  $puppy.innerHTML = `
    <figure>
      <img alt=${selectedPlayer.name} src=${selectedPlayer.imageUrl} />
    </figure>
    <p><strong>Name:</strong> ${selectedPlayer.name}</p>
    <p><strong>ID:</strong>: ${selectedPlayer.id}</p>
    <p><strong>Breed:</strong> ${selectedPlayer.breed}</p>
    <p><strong>Team:</strong> ${selectedPlayer.team?.name ?? "No team"}</p>
    <p><strong>Status:</strong> ${selectedPlayer.status}</p>
    <button>Remove from roaster</button>
  `;
  $puppy.querySelector("button").addEventListener("click", () => {
    removePlayer(selectedPlayer.id);
  });
  return $puppy;
}
// NewPuppyForm;
function NewPuppyForm() {
  const $form = document.createElement("form");
  $form.innerHTML = `
    <label>
      Name
      <input name="name" required />
    </label>
    <label>
      Breed
      <input name="breed" required />
    </label>
    <label>
      Status
      <select name="status">
      <option value="">--Please choose an option--</option>
        <option value="bench">bench</option>
        <option value="field">field</option>
      </select>
    </label>
    <label>
      Image URL
      <input name="imageUrl" />
    </label>
    <button>Invite puppy</button>
  `;
  $form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData($form);
    addPlayer({
      name: data.get("name"),
      breed: data.get("breed"),
      imageUrl: data.get("imageUrl"),
      status: data.get("status"),
    });
  });
  return $form;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Puppy bowl</h1>
    <main>
      <section>
        <h2>All puppies</h2>
        <PuppiesList></PuppiesList>
        <h2>Invite a puppy</h2>
        <NewPuppyForm></NewPuppyForm>
      </section>
      <section id="selected">
        <h2>Puppy Details</h2>
        <PuppyDetails></PuppyDetails>
      </section>
    </main>
  `;

  $app.querySelector("PuppiesList").replaceWith(PuppiesList());
  $app.querySelector("PuppyDetails").replaceWith(PuppyDetails());
  $app.querySelector("NewPuppyForm").replaceWith(NewPuppyForm());
}

async function init() {
  await getPlayers();
  render();
}

init();
