import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import App from "./App";
import { episodesApi } from "./services/api";

jest.mock("./services/api", () => ({
  episodesApi: { getAll: jest.fn(), getById: jest.fn() },
}));

jest.mock("./pages/Home", () => () => <div>Home page</div>);
jest.mock("./pages/Characters", () => () => <div>Characters page</div>);
jest.mock("./pages/About", () => () => <div>About page</div>);

const episodes = [
  { id: 11, title: "Pilot", season_id: 1, season_number: 1, episode_number: 1 },
  { id: 42, title: "Cat's in the Bag", season_id: 1, season_number: 1, episode_number: 2 },
];

const detailFor = (id, title) => ({
  data: { success: true, data: { id, title, show_title: "Breaking Bad", description: `About ${title}` } },
});

let container;
let root;
let now = 1000000;
const originalUrl = window.location.pathname + window.location.search + window.location.hash;

beforeEach(() => {
  now += 60000; // expire Episodes' module-level cache between tests
  jest.spyOn(Date, "now").mockReturnValue(now);
  jest.spyOn(window, "alert").mockImplementation(() => {});
  episodesApi.getAll.mockReset().mockResolvedValue({ data: { data: episodes } });
  episodesApi.getById.mockReset().mockImplementation((id) =>
    Promise.resolve(
      detailFor(
        Number(id),
        episodes.find((episode) => String(episode.id) === String(id))?.title ?? `Episode ${id}`,
      ),
    ),
  );
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  window.history.replaceState({}, "", originalUrl);
  jest.restoreAllMocks();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

async function renderAt(path) {
  window.history.pushState({}, "", path);
  await act(async () => root.render(<App />));
}

async function click(element) {
  await act(async () => {
    element.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 }));
  });
}

const byText = (selector, text) =>
  Array.from(container.querySelectorAll(selector)).find((el) => el.textContent === text);

function expectChrome() {
  expect(container.querySelector("header")).not.toBeNull();
  expect(container.querySelector("footer")).not.toBeNull();
  expect(container.textContent).toContain("Breaking Bad Fan Hub");
  expect(container.textContent).toContain("A fan-made site for TV show enthusiasts");
}

describe("episode routing", () => {
  it("navigates to the clicked episode's id from the list without alerting", async () => {
    await renderAt("/episodes");
    await click(byText("h3", "Cat's in the Bag"));

    expect(window.location.pathname).toBe("/episodes/42");
    expect(episodesApi.getById).toHaveBeenCalledTimes(1);
    expect(episodesApi.getById).toHaveBeenCalledWith("42");
    expect(container.querySelector("h1").textContent).toBe("Cat's in the Bag");
    expect(container.textContent).toContain("About Cat's in the Bag");
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("renders the detail from a direct entry without loading the episode list", async () => {
    await renderAt("/episodes/7");

    expect(episodesApi.getById).toHaveBeenCalledWith("7");
    expect(episodesApi.getAll).not.toHaveBeenCalled();
    expect(container.querySelector("h1").textContent).toBe("Episode 7");
    expect(container.textContent).toContain("Breaking Bad");
    expect(window.alert).not.toHaveBeenCalled();
  });

  it("returns to the episode list from the back link", async () => {
    await renderAt("/episodes/42");
    await click(byText("a", "← Back to episodes"));

    expect(window.location.pathname).toBe("/episodes");
    expect(container.querySelector("h1").textContent).toBe("Episodes");
    expect(container.textContent).toContain("Pilot");
    expect(container.textContent).toContain("Cat's in the Bag");
  });

  it("keeps the header and footer on the list and detail routes", async () => {
    await renderAt("/episodes");
    expectChrome();

    await click(byText("h3", "Pilot"));
    expect(window.location.pathname).toBe("/episodes/11");
    expect(container.querySelector("h1").textContent).toBe("Pilot");
    expectChrome();
  });

  it("keeps the header and footer when the detail fails to load", async () => {
    episodesApi.getById.mockRejectedValue({ response: { status: 404 } });
    await renderAt("/episodes/999");

    expect(container.textContent).toContain("Episode not found");
    expectChrome();
  });
});
