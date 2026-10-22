import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter, useLocation } from "react-router-dom";
import Header from "./Header";

const navigation = [
  ["Home", "/"],
  ["Characters", "/characters"],
  ["Episodes", "/episodes"],
  ["About", "/about"],
];
let container;
let root;

function LocationProbe() {
  const location = useLocation();
  return <output>{location.pathname}</output>;
}

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

async function render(path = "/") {
  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[path]}>
        <Header />
        <LocationProbe />
      </MemoryRouter>,
    );
  });
}

function getLink(label) {
  return Array.from(container.querySelectorAll("a")).find(
    (element) => element.textContent === label,
  );
}

function expectActiveLink(activeLabel) {
  navigation.forEach(([label]) => {
    const style = getComputedStyle(getLink(label));
    expect(style.color).toBe(
      label === activeLabel ? "rgb(62, 175, 26)" : "rgb(204, 204, 204)",
    );
    expect(style.fontWeight).toBe(label === activeLabel ? "bold" : "normal");
  });
}

it("renders the brand and all four navigation links with their destinations", async () => {
  await render();

  const header = container.querySelector("header");
  expect(header).not.toBeNull();
  expect(header.querySelector("nav")).not.toBeNull();
  expect(
    Array.from(header.querySelectorAll("a")).map((link) => [
      link.textContent,
      link.getAttribute("href"),
    ]),
  ).toEqual([["Breaking Bad Fan Hub", "/"], ...navigation]);
});

it.each(navigation)(
  "highlights only %s when its exact route %s is current",
  async (label, path) => {
    await render(path);

    expectActiveLink(label);
  },
);

it.each(["/characters/42", "/episodes/1", "/missing"])(
  "leaves all navigation links inactive at the unmatched route %s",
  async (path) => {
    await render(path);

    expectActiveLink(null);
  },
);

it("highlights the current pathname even when the URL has a query and hash", async () => {
  await render("/characters?sort=name#cast");

  expectActiveLink("Characters");
});

it.each(navigation)(
  "navigates to %s and updates the active link when clicked",
  async (label, path) => {
    await render(path === "/" ? "/about" : "/");

    await act(async () => getLink(label).click());

    expect(container.querySelector("output").textContent).toBe(path);
    expectActiveLink(label);
  },
);

it("returns home and highlights Home when the brand is clicked", async () => {
  await render("/episodes");

  await act(async () => getLink("Breaking Bad Fan Hub").click());

  expect(container.querySelector("output").textContent).toBe("/");
  expectActiveLink("Home");
});