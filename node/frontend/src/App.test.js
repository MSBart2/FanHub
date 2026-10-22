import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import App from "./App";
import { charactersApi } from "./services/api";

jest.mock("./services/api", () => ({
  charactersApi: { getAll: jest.fn(), getById: jest.fn() },
}));

const walter = {
  id: 1,
  name: "Walter White",
  actor_name: "Bryan Cranston",
  status: "alive",
  is_main_character: 1,
  bio: "A chemistry teacher.",
  episodes: [],
};
const jesse = {
  id: 2,
  name: "Jesse Pinkman",
  actor_name: "Aaron Paul",
  status: "alive",
  is_main_character: 1,
  bio: "A former student.",
  episodes: [
    { id: 9, title: "Cat's in the Bag", episode_number: 2, is_featured: 1 },
  ],
};

let container;
let root;

beforeEach(() => {
  charactersApi.getAll.mockReset().mockResolvedValue({ data: [walter, jesse] });
  charactersApi.getById
    .mockReset()
    .mockImplementation((id) =>
      Promise.resolve({ data: String(id) === "2" ? jesse : walter }),
    );
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.history.pushState({}, "", "/");
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

async function renderAt(path) {
  window.history.pushState({}, "", path);
  await act(async () => root.render(<App />));
}

async function clickLink(predicate) {
  const link = Array.from(container.querySelectorAll("a")).find(predicate);
  expect(link).toBeTruthy();
  await act(async () => link.click());
}

function expectLayout() {
  expect(container.querySelector("header")).not.toBeNull();
  expect(container.querySelector("header").textContent).toContain(
    "Breaking Bad Fan Hub",
  );
  expect(container.querySelector("footer")).not.toBeNull();
  expect(container.querySelector("footer").textContent).toContain("FanHub");
}

describe("character detail routing", () => {
  it("renders the detail page for a direct /characters/:id URL with the id param", async () => {
    await renderAt("/characters/2");

    expect(charactersApi.getById).toHaveBeenCalledWith("2");
    expect(charactersApi.getAll).not.toHaveBeenCalled();
    expect(container.querySelector("h1").textContent).toBe("Jesse Pinkman");
    expect(container.textContent).toContain("Cat's in the Bag");
    expect(window.location.pathname).toBe("/characters/2");
  });

  it("keeps Header and Footer on a directly entered detail URL", async () => {
    await renderAt("/characters/1");

    expectLayout();
  });

  it("links each character in the list to its /characters/:id URL", async () => {
    await renderAt("/characters");

    const hrefs = Array.from(container.querySelectorAll("main a")).map((a) =>
      a.getAttribute("href"),
    );
    expect(hrefs).toEqual(["/characters/1", "/characters/2"]);
  });

  it("navigates list to detail and back to list without a page reload", async () => {
    await renderAt("/characters");
    expect(container.querySelector("h1").textContent).toBe("Characters");
    expectLayout();
    const marker = container.querySelector("header");

    await clickLink((a) => a.textContent.includes("Jesse Pinkman"));

    expect(window.location.pathname).toBe("/characters/2");
    expect(charactersApi.getById).toHaveBeenCalledWith("2");
    expect(container.querySelector("h1").textContent).toBe("Jesse Pinkman");
    expectLayout();

    await clickLink((a) => a.textContent === "Back to Characters");

    expect(window.location.pathname).toBe("/characters");
    expect(container.querySelector("h1").textContent).toBe("Characters");
    expect(container.textContent).toContain("Walter White");
    expect(container.textContent).toContain("Jesse Pinkman");
    expectLayout();
    // Same header DOM node: the app was never remounted/reloaded.
    expect(container.querySelector("header")).toBe(marker);
  });

  it("navigates between detail pages through the list and shows the new character", async () => {
    await renderAt("/characters");
    await clickLink((a) => a.textContent.includes("Walter White"));
    expect(container.querySelector("h1").textContent).toBe("Walter White");

    await clickLink((a) => a.textContent === "Back to Characters");
    await clickLink((a) => a.textContent.includes("Jesse Pinkman"));

    expect(container.querySelector("h1").textContent).toBe("Jesse Pinkman");
  });

  it("reaches the list from the detail page via the Header Characters link", async () => {
    await renderAt("/characters/1");

    await clickLink(
      (a) => a.closest("header") && a.textContent === "Characters",
    );

    expect(window.location.pathname).toBe("/characters");
    expect(container.querySelector("h1").textContent).toBe("Characters");
  });
});
