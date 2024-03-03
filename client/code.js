import { refreshHTML, randomBreed } from "./helpers.js";

//elements
const saveBtn = document.querySelector("#save");
const catPic = document.querySelector(".catPic");
const form = document.querySelector("form");
const catCard = document.querySelector(".catCard");
const title = document.querySelector(".breedName");
const deleteBtn = document.querySelector(".delete");
const descr = document.createElement("p");

let input, catId, changed;

let cats = 0;

function makeItRandom() {
  return Math.floor(Math.random() * randomBreed.length);
}

async function deleteCat(e) {
  e.preventDefault();
  const { data } = await fetch(
    `http://localhost:3001/api/cats/${catId}`,
    {
      method: "DELETE",
    }
  );

  console.log(data);
}

async function getCat(e) {
  e.preventDefault();

  const response = await fetch(
    `http://localhost:3001/api/cats/${randomBreed[makeItRandom()]}`
  );

  cats++; //increment the cats fetched.
  console.log(cats);
  //refresh the elements
  refreshHTML(title);
  refreshHTML(descr);
  let editableH1 = document.querySelector("#editable1");

  if (editableH1) {
    editableH1.remove();
  }

  const data = await response.json();

  console.log(data);

  const { image, name, description, nickName } = data[0];

  title.textContent = nickName ? nickName : name;

  descr.textContent = description;
  catCard.prepend(title, descr);

  catId = image.id;

  title.setAttribute("data-tooltip", "Click to give me a nickname");
  title.setAttribute("data-placement", "top");

  catPic.src = image.url;
}

saveBtn.addEventListener("click", function () {
  const h1 = document.createElement("h1");
  h1.id = "editable";
  h1.innerText = input.value;
  input.replaceWith(h1);
  this.style.display = "none";

  title.removeEventListener("click", titleClickHandler);
});

form.addEventListener("submit", getCat);

function makeEditable(h1Id, buttonId) {
  let h1 = document.querySelector("h2");
  let button = document.querySelector(`#${buttonId}`);

  let input;

  const h1ClickHandler = function () {
    input = document.createElement("input");
    input.value = this.innerText;
    this.replaceWith(input);
    button.style.display = "inline";
  };

  h1.addEventListener("click", h1ClickHandler);

  button.addEventListener("click", function () {
    h1 = document.createElement("h1");
    h1.id = h1Id;
    h1.innerText = input.value;
    input.replaceWith(h1);
    this.style.display = "none";

    h1.addEventListener("click", h1ClickHandler);

    if (catId) {
      fetch(`http://localhost:3001/api/cats/${catId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: input.value }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          changed = true;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });
}
console.log(changed);
if (changed) {
  console.log("changed");
}
makeEditable("editable1", "save");

//The user first visits the site.
//They are greeted with a "Get a cat" button.
//The user clicks the button, and a random breed is fetched.
//The cat's name and description are displayed on the page.
//This is the READ of CRUD.

//The user can give the cat a nickname.
//This is the UPDATE of CRUD.
