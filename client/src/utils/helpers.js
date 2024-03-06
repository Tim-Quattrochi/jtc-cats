export function refreshHTML(element) {
  element.innerHTML = "";
}

export const randomBreed = [
  "siberian",
  "bengal",
  "siamese",
  "ragdoll",
  "persian",
  "main",
  "scottish",
  "british",
  "abyssinian",
  "burmese",
  "himalayan",
  "russian",
  "munchkin",
];

/**
 * @param {string} message  message to display.
 * @param {string} level success | error
 */

export function showAToast(message, level) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.classList.add(`toast-${level}`);
  toast.textContent = message;
  document.body.append(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

export function whichCatsHaveBeenFetched(
  list,
  cat,
  forDelete = false
) {
  let updatedList;

  // if this function is being used to delete, only the id is passed.
  // if it is being used to add, it's an object.
  const isCatInList = list.some((catObj) =>
    cat.id ? catObj.id === cat.id : catObj.id === cat
  );

  if (!forDelete && !isCatInList) {
    updatedList = [...list, cat];
  } else {
    updatedList = list.filter((catObj) => catObj.id !== cat);
  }

  return updatedList;
}

export function makeItRandom() {
  return Math.floor(Math.random() * randomBreed.length);
}

/**
 * @param {string} tag HTML element name.
 * @param {string} classes className to add.
 * @param {string} [text=""] text to add if any.
 * @returns {HTMLElement} HTML element.
 * @example createElement("div", "previewContainer");
 */

export function createStyledElement(tag, classes, text = "") {
  const element = document.createElement(tag);
  element.classList.add(classes);
  element.textContent = text;
  return element;
}

/**
 * Renders a list of items by creating preview elements and attaching event listeners for deletion.
 *
 * @param {Array} list - The list of cats to render.
 * @param {Function} deleteCb - The callback function to be executed when an item is deleted.
 */

export function loopAndRender(list, deleteCb) {
  document.querySelector(".previewContainer")?.remove();
  const previewContainer = createStyledElement(
    "aside",
    "previewContainer"
  );

  for (let i = 0; i < list.length; i++) {
    let container = createStyledElement("div", "previewContainer");

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
      await deleteCb(e);
    });
  }
}

/**
 * Makes an element editable and updates its value when the save button is clicked.
 * @param {string} elementId - The ID of the element to make editable.
 * @param {string} buttonId - The ID of the save button.
 * @param {string} catId - The ID of the cat to edit
 */

export function makeEditable(elementId, buttonId, catId) {
  let nameElement = document.querySelector("h2");
  let saveBtn = document.querySelector(`#${buttonId}`);

  let input;

  const nameElementClickHandler = function () {
    input = document.createElement("input");
    input.value = this.innerText;
    this.replaceWith(input);
    saveBtn.style.display = "inline";
  };

  nameElement.addEventListener("click", nameElementClickHandler);

  saveBtn.addEventListener("click", function () {
    nameElement = document.createElement("h2");
    nameElement.id = elementId;
    nameElement.innerText = input.value;
    input.replaceWith(nameElement);
    this.style.display = "none";
    // make the element clickable/editable again.
    nameElement.addEventListener("click", nameElementClickHandler);

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
          showAToast("Cat name changed!", "success");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });
}
