import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Routes, Route, useParams } from "react-router-dom";
import Episodes from "./Episodes";
import { episodesApi } from "../services/api";

jest.mock("../services/api", () => ({
  episodesApi: { getAll: jest.fn() },
}));

jest.mock("../components/EpisodeList", () => {
  return function EpisodeList({ episodes, onEpisodeClick }) {
    return (
      <div>
        {episodes.map((episode) => (
          <span
            key={episode.id}
            role="link"
            data-episode={episode.id}
            onClick={() => onEpisodeClick(episode)}
          >
            {episode.title}
          </span>
        ))}
      </div>
    );
  };
});

function DetailStub() {
  const { id } = useParams();
  return <div>Detail route {id}</div>;
}

const allEpisodes = [
  { id: 11, title: "Pilot", season_id: 1, season_number: 1 },
  { id: 22, title: "Season two premiere", season_id: 2, season_number: 2 },
];
const seasonTwo = [allEpisodes[1]];
let container;
let root;
let now = 100000;

beforeEach(() => {
  now += 60000;
  jest.spyOn(Date, "now").mockReturnValue(now);
  episodesApi.getAll.mockReset();
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  global.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  jest.restoreAllMocks();
  delete global.IS_REACT_ACT_ENVIRONMENT;
});

async function render() {
  await act(async () =>
    root.render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Episodes />} />
          <Route path="/episodes/:id" element={<DetailStub />} />
        </Routes>
      </MemoryRouter>,
    ),
  );
}

test("clicking an episode navigates to its id-specific route without alerting", async () => {
  const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
  jest.spyOn(console, "log").mockImplementation(() => {});
  episodesApi.getAll.mockResolvedValue({ data: allEpisodes });
  await render();

  await act(async () =>
    container.querySelector('[data-episode="22"]').click(),
  );

  expect(container.textContent).toContain("Detail route 22");
  expect(container.textContent).not.toContain("Pilot");
  expect(alertSpy).not.toHaveBeenCalled();
  expect(console.log).not.toHaveBeenCalled();
});

async function click(label) {
  const button = Array.from(container.querySelectorAll("button")).find(
    (element) => element.textContent === label,
  );
  await act(async () => button.click());
}

test.each(["All Seasons", "Season 2"])(
  "filtered responses do not overwrite the all-episodes cache when returning via %s",
  async (returnButton) => {
    episodesApi.getAll
      .mockResolvedValueOnce({ data: { data: allEpisodes } })
      .mockResolvedValueOnce({ data: seasonTwo });
    await render();
    await click("Season 2");

    expect(episodesApi.getAll).toHaveBeenLastCalledWith({ season_id: 2 });
    expect(container.textContent).not.toContain("Pilot");
    expect(container.textContent).toContain("Season two premiere");

    await click(returnButton);

    expect(episodesApi.getAll).toHaveBeenCalledTimes(2);
    expect(container.textContent).toContain("Pilot");
    expect(container.textContent).toContain("Season two premiere");
  },
);

test("cache hits restore season controls on remount and expire after 30 seconds", async () => {
  episodesApi.getAll.mockResolvedValue({ data: allEpisodes });
  await render();
  act(() => root.unmount());
  root = createRoot(container);
  await render();

  expect(episodesApi.getAll).toHaveBeenCalledTimes(1);
  expect(container.textContent).toContain("Season 1");
  expect(container.textContent).toContain("Season 2");

  act(() => root.unmount());
  Date.now.mockReturnValue(now + 30000);
  root = createRoot(container);
  await render();
  expect(episodesApi.getAll).toHaveBeenCalledTimes(2);
});

test("a late filtered response cannot replace a newer all-seasons cache hit", async () => {
  let resolveSeason;
  episodesApi.getAll
    .mockResolvedValueOnce({ data: allEpisodes })
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSeason = resolve;
        }),
    );
  await render();
  await click("Season 2");
  await click("All Seasons");
  await act(async () => resolveSeason({ data: seasonTwo }));

  expect(container.textContent).toContain("Pilot");
  expect(container.textContent).toContain("Season two premiere");
  expect(container.textContent).not.toContain("Loading episodes...");
});

test.each(["resolve", "reject"])(
  "a stale request that %ss cannot change a newer request's loading or error state",
  async (outcome) => {
    let settleFirst;
    let resolveSecond;
    episodesApi.getAll
      .mockResolvedValueOnce({ data: allEpisodes })
      .mockImplementationOnce(
        () =>
          new Promise((resolve, reject) => {
            settleFirst = () =>
              outcome === "resolve"
                ? resolve({ data: seasonTwo })
                : reject(new Error("Stale request failed"));
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSecond = resolve;
          }),
      );
    await render();
    await click("Season 2");
    await click("Season 1");
    await act(async () => settleFirst());

    expect(container.textContent).toContain("Loading episodes...");
    expect(container.textContent).not.toContain("Failed to load episodes.");

    await act(async () => resolveSecond({ data: [allEpisodes[0]] }));
    expect(container.textContent).toContain("Pilot");
    expect(container.textContent).not.toContain("Season two premiere");
  },
);

test("an unmounted request cannot overwrite the shared cache", async () => {
  let resolveInitial;
  episodesApi.getAll
    .mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveInitial = resolve;
        }),
    )
    .mockResolvedValueOnce({ data: allEpisodes });
  await render();
  act(() => root.unmount());
  root = createRoot(container);
  await render();
  await act(async () => resolveInitial({ data: [] }));

  act(() => root.unmount());
  root = createRoot(container);
  await render();
  expect(episodesApi.getAll).toHaveBeenCalledTimes(2);
  expect(container.textContent).toContain("Pilot");
});

test("returning to cached all seasons clears a filtered-request error", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  episodesApi.getAll
    .mockResolvedValueOnce({ data: allEpisodes })
    .mockRejectedValueOnce(new Error("Request failed"));
  await render();
  await click("Season 2");
  expect(container.textContent).toContain("Failed to load episodes.");

  await click("All Seasons");
  expect(container.textContent).not.toContain("Failed to load episodes.");
  expect(container.textContent).toContain("Pilot");
});
