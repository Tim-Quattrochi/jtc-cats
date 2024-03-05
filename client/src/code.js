import {
  refreshHTML,
  randomBreed,
  showAToast,
} from "./utils/helpers.js";

//elements
const saveBtn = document.querySelector("#save");
const catPic = document.querySelector(".catPic");
const form = document.querySelector("form");
const catCard = document.querySelector(".catCard");
const title = document.querySelector(".breedName");
const deleteBtn = document.querySelector(".delete");
const descr = document.createElement("p");
const previewContainer = document.createElement("aside");

let input, catId;

let cats = 0;

let catsIdFetched = [];

function loopAndRender() {
  refreshHTML(previewContainer);
  for (let i = 0; i < catsIdFetched.length; i++) {
    previewContainer.classList.add("previewContainer");
    let img = document.createElement("img");
    img.src = catsIdFetched[i].url;
    img.alt = catsIdFetched[i].name;
    img.classList.add("previewCat");
    img.addEventListener("click", deleteCat);
    document.body.append(previewContainer);
    previewContainer.append(img);
  }
}

function whichCatsHaveBeenFetched(cat, forDelete = false) {
  if (!forDelete) {
    catsIdFetched.push(cat);
  } else {
    catsIdFetched = catsIdFetched.filter(
      (catObj) => catObj.id !== cat.id
    );
  }
  loopAndRender();
}

function makeItRandom() {
  return Math.floor(Math.random() * randomBreed.length);
}

async function deleteCat(e) {
  e.preventDefault();
  e.stopPropagation();

  try {
    const response = await fetch(
      `http://localhost:3001/api/cats/${catId}`,
      {
        method: "DELETE",
      }
    );

    if (response.status === 200) {
      cats--;
      whichCatsHaveBeenFetched(catId, true);

      loopAndRender();

      showAToast("Cat deleted", "success");

      await getCat(e);
    } else {
      showAToast("Cat not deleted", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showAToast("Cat not deleted", "error");
  }
}

async function getCat(e) {
  e.preventDefault();
  e.stopPropagation();

  cats++; //increment the cats fetched.
  console.log(cats);

  const response = await fetch(
    `http://localhost:3001/api/cats/${randomBreed[makeItRandom()]}`
  );

  //refresh the elements
  refreshHTML(title);
  refreshHTML(descr);
  let editableH1 = document.querySelector("#editable1");

  if (editableH1) {
    editableH1.remove();
  }

  const data = await response.json();

  console.log("RES: ", data);

  const { image, name, description, nickName } = data[0];

  whichCatsHaveBeenFetched(image);

  title.textContent = nickName ? nickName : name;

  descr.textContent = description;
  catCard.prepend(title, descr);

  catId = image.id;

  catPic.src = image.url;

  //if the cats gotten is greater than one then the user can delete.
  if (cats > 0) {
    deleteBtn.style.display = "inline";
  }
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

deleteBtn.addEventListener("click", deleteCat);

makeEditable("editable1", "save");

//first load.
showAToast("Click 'Get a cat' to get your first cat", "success");

//The user first visits the site.
//They are greeted with a "Get a cat" button.
//The user clicks the button, and a random breed is fetched.
//The cat's name and description are displayed on the page.
//This is the READ of CRUD.

//The user can give the cat a nickname.
//This is the UPDATE of CRUD.
