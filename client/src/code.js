import {
  refreshHTML,
  randomBreed,
  showAToast,
  makeItRandom,
  whichCatsHaveBeenFetched,
  createStyledElement,
} from "./utils/helpers.js";

//elements
const saveBtn = document.querySelector("#save");
const catPic = document.querySelector(".catPic");
const form = document.querySelector("form");
const catCard = document.querySelector(".catCard");
const title = document.querySelector(".breedName");

const descr = document.createElement("p");
const previewContainer = document.createElement("aside");

const addToCollection = createStyledElement(
  "button",
  "addToCollection",
  "Add to collection"
);

let input,
  catId,
  catIdToDelete = [],
  cats = 0;

let catsIdFetched = [];

function loopAndRender(list) {
  refreshHTML(previewContainer);
  for (let i = 0; i < list.length; i++) {
    let container = createStyledElement("div", "previewContainer");

    previewContainer.classList.add("previewContainer");

    let img = createStyledElement("img", "previewCat");
    let deleteIcon = createStyledElement(
      "span",
      "previewDelete",
      "X"
    );

    img.src = list[i].url;
    img.alt = list[i].name;

    document.body.append(container);
    previewContainer.append(container);
    document.body.append(previewContainer);

    container.append(deleteIcon);
    container.append(img);

    deleteIcon.addEventListener("click", async (e) => {
      e.stopPropagation();
      await deleteCat(e);
    });
  }
}

async function deleteCat(e) {
  e.preventDefault();
  e.stopPropagation();

  const elementClicked = e.target;
  const parentElement = elementClicked.parentElement;
  const previousSibling = parentElement.previousElementSibling;
  const nextSibling = parentElement.nextElementSibling;

  if (previousSibling === null && nextSibling === null) {
    previewContainer.remove();
  }

  catIdToDelete = parentElement
    .querySelector("img")
    .src.split("/")
    .pop()
    .split(".")[0];

  try {
    const response = await fetch(
      `http://localhost:3001/api/cats/${catIdToDelete}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    const {
      image: { id },
    } = data[0];

    if (response.status === 200) {
      cats--;
      catsIdFetched = whichCatsHaveBeenFetched(
        catsIdFetched,
        id,
        true
      );

      showAToast("Cat deleted", "success");
      loopAndRender(
        whichCatsHaveBeenFetched(catsIdFetched, id, true)
      );
    } else {
      showAToast("Cat not deleted", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showAToast("Cat not deleted", "error");
  } finally {
    //refresh the cat id.
    catIdToDelete = "";
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

  const { image: cat, name, description, nickName } = data[0];

  title.textContent = nickName ? nickName : name;

  descr.textContent = description;
  catCard.prepend(title, descr);

  catId = cat.id;

  catPic.src = cat.url;

  catCard.append(addToCollection);

  //push the newly fetched cat to the array.
  catsIdFetched.push(cat);

  addToCollection.addEventListener("click", () => {
    loopAndRender(whichCatsHaveBeenFetched(catsIdFetched, cat));
  });
}

saveBtn.addEventListener("click", function () {
  const h1 = document.createElement("h1");
  h1.id = "editable";
  h1.innerText = input.value;
  input.replaceWith(h1);
  this.style.display = "none";

  title.removeEventListener("click", titleClickHandler);
});

form.addEventListener("submit", async (e) => {
  await getCat(e);
});

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
