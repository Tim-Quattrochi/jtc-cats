import { refreshHTML } from "./helpers.js";

//elements
const btn = document.querySelector(".getCat");
const catPic = document.querySelector(".catPic");
const form = document.querySelector("form");
const catCard = document.querySelector(".catCard");
const title = document.createElement("h2");
const descr = document.createElement("p");

const randomBreed = [
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

function makeItRandom() {
  return Math.floor(Math.random() * randomBreed.length);
}

async function getCat(e) {
  e.preventDefault();

  const response = await fetch(
    `http://localhost:3001/api/create/${randomBreed[makeItRandom()]}`
  );

  //refresh the elements
  refreshHTML(title);
  refreshHTML(descr);

  const data = await response.json();

  console.log(data);

  const { image, name, description } = data[0];

  title.textContent = name;
  descr.textContent = description;
  catCard.prepend(title, descr);

  console.log(image);

  catPic.src = image.url;
}

form.addEventListener("submit", getCat);
