import React, { act } from "react";
import { createRoot } from "react-dom/client";
import Episodes from "./Episodes";
import { episodesApi } from "../services/api";

jest.mock("../services/api", () => ({
  episodesApi: { getAll: jest.fn() },
}));

const allEpisodes = [
  { id: 1, title: "Pilot", season_id: 1, season_number: 1, episode_number: 1 },
  { id: 2, title: "Seven Thirty-Seven", season_id: 2, season_number: 2, episode_number: 1 },
];

let container;
let root;
let testTime = Date.now();

beforeEach(() => {
  testTime += 31000;
  jest.spyOn(Date, "now").mockReturnValue(testTime);
  global.IS_REACT_ACT_ENVIRONMENT = true;
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  episodesApi.getAll.mockReset();
});

afterEach(async () => {
  await act(async () => root.unmount());
  container.remove();
  jest.restoreAllMocks();
});

async function clickSeason(label) {
  const button = [...container.querySelectorAll("button")].find(
    (element) => element.textContent === label,
  );
  expect(button).toBeDefined();
  await act(async () => {
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

test("returns to all episodes after viewing a filtered season", async () => {
  episodesApi.getAll.mockImplementation(({ season_id } = {}) =>
    Promise.resolve({
      data: { data: season_id ? allEpisodes.filter((episode) => episode.season_id === season_id) : allEpisodes },
    }),
  );

  await act(async () => root.render(<Episodes />));
  await clickSeason("Season 2");
  expect(container.textContent).toContain("Seven Thirty-Seven");
  expect(container.textContent).not.toContain("Pilot");

  await clickSeason("All Seasons");
  expect(container.textContent).toContain("Pilot");
  expect(container.textContent).toContain("Seven Thirty-Seven");
  expect(episodesApi.getAll).toHaveBeenCalledTimes(2);
});

test("ignores a filtered response that arrives after returning to all seasons", async () => {
  let resolveFiltered;
  episodesApi.getAll.mockImplementation(({ season_id } = {}) =>
    season_id
      ? new Promise((resolve) => { resolveFiltered = resolve; })
      : Promise.resolve({ data: { data: allEpisodes } }),
  );

  await act(async () => root.render(<Episodes />));
  await clickSeason("Season 2");
  await clickSeason("All Seasons");

  await act(async () => {
    resolveFiltered({ data: { data: [allEpisodes[1]] } });
  });
  expect(container.textContent).toContain("Pilot");
  expect(container.textContent).toContain("Seven Thirty-Seven");
});

test("restores the season buttons when mounting from the all-episodes cache", async () => {
  episodesApi.getAll.mockResolvedValue({ data: { data: allEpisodes } });

  await act(async () => root.render(<Episodes />));
  await act(async () => root.unmount());
  root = createRoot(container);
  await act(async () => root.render(<Episodes />));

  expect([...container.querySelectorAll("button")].map((button) => button.textContent))
    .toEqual(["All Seasons", "Season 1", "Season 2"]);
  expect(episodesApi.getAll).toHaveBeenCalledTimes(1);
});
