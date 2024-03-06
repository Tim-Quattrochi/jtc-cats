import {
  refreshHTML,
  randomBreed,
  showAToast,
  makeItRandom,
  whichCatsHaveBeenFetched,
  createStyledElement,
  loopAndRender,
  makeEditable,
} from "./utils/helpers.js";

//elements
const catPic = document.querySelector(".catPic");
const form = document.querySelector("form");
const catCard = document.querySelector(".catCard");
const title = document.querySelector(".breedName");
const descr = document.createElement("p");

const addToCollection = createStyledElement(
  "button",
  "addToCollection",
  "Add to collection"
);

let catId,
  catIdToDelete,
  cats = 0;

let catsIdFetched = [];

/**
 * Deletes a cat.
 * @param {Event} e - The event object.
 * @returns {Promise<void>} - A promise that resolves when the cat is deleted.
 */
async function deleteCat(e) {
  e.preventDefault();
  e.stopPropagation();

  // variables to determine which dynamic img was clicked get then get the id from
  // the filename.
  const elementClicked = e.target;
  const parentElement = elementClicked.parentElement;

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
        whichCatsHaveBeenFetched(catsIdFetched, id, true),
        deleteCat
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

  const response = await fetch(
    `http://localhost:3001/api/cats/${randomBreed[makeItRandom()]}`
  );

  //refresh the elements
  refreshHTML(title);
  refreshHTML(descr);

  // check and remove the editable name element if it exists from previous.
  let editableName = document.querySelector("#editableName");

  if (editableName) {
    editableName.remove();
  }

  const data = await response.json();

  const { image: cat, name, description, nickName } = data[0];

  title.textContent = nickName ? nickName : name;

  descr.textContent = description;
  catCard.prepend(title, descr);

  catId = cat.id;

  catPic.src = cat.url;

  catCard.append(addToCollection);

  //push the newly fetched cat to the array.
  catsIdFetched.push(cat);

  makeEditable("editableName", "save", catId);

  addToCollection.addEventListener("click", async (e) => {
    showAToast("Cat added to collection.", "success");
    loopAndRender(
      whichCatsHaveBeenFetched(catsIdFetched, cat),
      deleteCat
    );
  });
}

form.addEventListener("submit", async (e) => {
  await getCat(e);
});

//first load.
window.addEventListener("load", () =>
  showAToast("Click 'Get a cat' to get your first cat", "success")
);
