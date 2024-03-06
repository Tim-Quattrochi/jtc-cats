import { JSDOM } from "jsdom";
import {
  randomBreed,
  showAToast,
  refreshHTML,
} from "../src/utils/helpers.js";

const setupDOM = () => {
  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  global.document = dom.window.document;
  return dom;
};

const cleanupDOM = () => {
  global.document = undefined;
};

test("has 13 breeds", () => {
  expect(randomBreed).toHaveLength(13);
});

test("showAToast displays a toast element", () => {
  // Set up a simple DOM environment using JSDOM
  const dom = setupDOM();

  showAToast("Test Message", "success");

  const toastElement = dom.window.document.querySelector(".toast");
  expect(toastElement).not.toBeNull();

  expect(toastElement.textContent).toBe("Test Message");
  expect(toastElement.classList.contains("toast-success")).toBe(true);

  cleanupDOM();
});

test("refreshHTML sets element to empty string", () => {
  const dom = setupDOM();

  const container = dom.window.document.createElement("div");
  const p = dom.window.document.createElement("p");
  p.textContent = "Test";
  container.appendChild(p);

  refreshHTML(container);

  expect(container.innerHTML).toBe("");

  cleanupDOM();
});
