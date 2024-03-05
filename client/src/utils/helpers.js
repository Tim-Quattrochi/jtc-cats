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
