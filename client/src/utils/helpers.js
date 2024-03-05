export function refreshHTML(element) {
  if (element instanceof HTMLElement) {
    element.innerHTML = "";
  }
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
