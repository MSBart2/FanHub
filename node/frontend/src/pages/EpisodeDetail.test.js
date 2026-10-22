import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Routes, Route, useNavigate } from "react-router-dom";
import EpisodeDetail from "./EpisodeDetail";
import { episodesApi } from "../services/api";

jest.mock("../services/api", () => ({
  episodesApi: { getById: jest.fn() },
}));

let container;
let root;
let navigate;

function Harness() {
  navigate = useNavigate();
  return null;
}

function App({ path, strict }) {
  const tree = (
    <MemoryRouter initialEntries={[path]}>
      <Harness />
      <Routes>
        <Route path="/episodes" element={<div>Episodes list page</div>} />
        <Route path="/episodes/:id" element={<EpisodeDetail />} />
      </Routes>
    </MemoryRouter>
  );
  return strict ? <React.StrictMode>{tree}</React.StrictMode> : tree;
}

async function render(path = "/episodes/7", strict = false) {
  await act(async () => root.render(<App path={path} strict={strict} />));
}

const ok = (data) => ({ data: { success: true, data } });
const httpError = (status) =>
  Object.assign(new Error("fail"), { response: { status } });
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};
const flush = () => act(async () => {});
const text = () => container.textContent;
const backLink = () =>
  Array.from(container.querySelectorAll("a")).find((a) =>
    a.textContent.includes("Back to episodes"),
  );
const dd = (label) => {
  const dt = Array.from(container.querySelectorAll("dt")).find(
    (e) => e.textContent === label,
  );
  return dt ? dt.nextElementSibling.textContent : undefined;
};

const full = {
  id: 7,
  title: "Pilot",
  show_title: "Space Show",
  season_number: 2,
  season_title: "The Second",
  episode_number: 3,
  description: "A long description.",
  air_date: "2024-03-05",
  runtime_minutes: 45,
  director: "Dana Dir",
  writer: "Wes Writer",
  rating: 8.5,
  thumbnail_url: "http://img/thumb.png",
  characters: [
    {
      id: 1,
      name: "Alice",
      actor_name: "Actor A",
      image_url: "http://img/a.png",
      is_featured: true,
    },
    { id: 2, name: "Bob", actor_name: null, image_url: null, is_featured: false },
  ],
  quotes: [
    {
      id: 10,
      quote_text: "Hello there",
      character_name: "Alice",
      context: "At the door",
    },
    { id: 11, quote_text: "Mystery words", character_name: null },
  ],
};

beforeEach(() => {
  episodesApi.getById.mockReset();
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

it("shows loading state with a working back link, then fetches by route id", async () => {
  const d = deferred();
  episodesApi.getById.mockReturnValue(d.promise);
  await render("/episodes/42");
  expect(episodesApi.getById).toHaveBeenCalledWith("42");
  expect(text()).toContain("Loading episode...");
  expect(backLink().getAttribute("href")).toBe("/episodes");
  await act(async () => d.resolve(ok(full)));
  expect(text()).not.toContain("Loading episode...");
  expect(container.querySelector("h1").textContent).toBe("Pilot");
});

it("renders all metadata, description, characters and quotes", async () => {
  episodesApi.getById.mockResolvedValue(ok(full));
  await render();
  expect(text()).toContain("Space Show");
  expect(dd("Season")).toBe("2");
  expect(dd("Season title")).toBe("The Second");
  expect(dd("Episode")).toBe("3");
  expect(dd("Air date")).toBe("2024-03-05");
  expect(container.querySelector("time").getAttribute("datetime")).toBe("2024-03-05");
  expect(dd("Runtime")).toBe("45 min");
  expect(dd("Director")).toBe("Dana Dir");
  expect(dd("Writer")).toBe("Wes Writer");
  expect(dd("Rating")).toBe("8.5/10");
  expect(text()).toContain("A long description.");
  expect(text()).toContain("Alice");
  expect(text()).toContain("Played by Actor A");
  expect(text()).toContain("Featured character");
  expect(text()).toContain("Hello there");
  expect(text()).toContain("At the door");
  expect(container.querySelector("img").getAttribute("src")).toBe("http://img/thumb.png");
});

it("omits optional metadata rows and uses fallbacks when fields are missing", async () => {
  episodesApi.getById.mockResolvedValue(ok({ id: 7 }));
  await render();
  expect(container.querySelector("h1").textContent).toBe("Untitled episode");
  expect(text()).toContain("Show unavailable");
  expect(container.querySelectorAll("dt")).toHaveLength(0);
  expect(text()).toContain("No description available.");
  expect(text()).toContain("No episode image available.");
  expect(container.querySelector("img")).toBeNull();
});

it("keeps numeric zero values visible", async () => {
  episodesApi.getById.mockResolvedValue(
    ok({ id: 7, title: "Zero", season_number: 0, episode_number: 0, runtime_minutes: 0, rating: 0 }),
  );
  await render();
  expect(dd("Season")).toBe("0");
  expect(dd("Episode")).toBe("0");
  expect(dd("Runtime")).toBe("0 min");
  expect(dd("Rating")).toBe("0/10");
});

it("shows a date-only air date as the same calendar day", async () => {
  episodesApi.getById.mockResolvedValue(ok({ id: 7, air_date: "2024-01-01" }));
  await render();
  expect(dd("Air date")).toBe("2024-01-01");
});

it("falls back to a placeholder when the thumbnail or a portrait fails to load", async () => {
  episodesApi.getById.mockResolvedValue(ok(full));
  await render();
  const imgs = container.querySelectorAll("img");
  expect(imgs).toHaveLength(2);
  await act(async () => {
    imgs[0].dispatchEvent(new Event("error"));
  });
  expect(text()).toContain("No episode image available.");
  expect(container.querySelectorAll("img")).toHaveLength(1);
  await act(async () => {
    container.querySelector("img").dispatchEvent(new Event("error"));
  });
  expect(container.querySelectorAll("img")).toHaveLength(0);
  expect(text()).toContain("No image");
});

it("replaces Alice's broken portrait with a fallback inside her own card", async () => {
  episodesApi.getById.mockResolvedValue(ok(full));
  await render();
  const aliceCard = () => container.querySelectorAll("ul")[0].querySelectorAll("li")[0];
  expect(aliceCard().textContent).not.toContain("No image");
  const portrait = aliceCard().querySelector("img");
  expect(portrait.getAttribute("alt")).toBe("Portrait of Alice");
  await act(async () => {
    portrait.dispatchEvent(new Event("error"));
  });
  expect(aliceCard().textContent).toContain("Alice");
  expect(aliceCard().textContent).toContain("No image");
  expect(aliceCard().querySelector("img")).toBeNull();
  // the episode thumbnail is unaffected
  expect(container.querySelector("img").getAttribute("src")).toBe("http://img/thumb.png");
});

it("renders characters from id, name, actor_name, image_url, is_featured only", async () => {
  episodesApi.getById.mockResolvedValue(ok(full));
  await render();
  const items = container.querySelectorAll("ul")[0].querySelectorAll("li");
  expect(items).toHaveLength(2);
  expect(items[0].querySelector("img").getAttribute("alt")).toBe("Portrait of Alice");
  expect(items[1].textContent).toContain("Bob");
  expect(items[1].textContent).not.toContain("Played by");
  expect(items[1].textContent).not.toContain("Featured character");
  expect(items[1].textContent).toContain("No image");
});

it("shows unknown speaker for quotes without a character and omits missing context", async () => {
  episodesApi.getById.mockResolvedValue(ok(full));
  await render();
  const quotes = container.querySelectorAll("blockquote");
  expect(quotes[0].textContent).toContain("Alice");
  expect(quotes[1].textContent).toContain("Unknown speaker");
  expect(text().match(/Context:/g)).toHaveLength(1);
});

it("is read-only: no character links, buttons or form controls", async () => {
  episodesApi.getById.mockResolvedValue(ok(full));
  await render();
  expect(container.querySelectorAll("button, input, form, select, textarea")).toHaveLength(0);
  const hrefs = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
  expect(hrefs).toEqual(["/episodes"]);
});

it.each([
  ["absent", {}],
  ["empty", { characters: [], quotes: [] }],
  ["null", { characters: null, quotes: null }],
])("explains %s characters and quotes arrays", async (_n, extra) => {
  episodesApi.getById.mockResolvedValue(ok({ id: 7, title: "T", ...extra }));
  await render();
  expect(text()).toContain("No characters listed for this episode.");
  expect(text()).toContain("No quotes listed for this episode.");
});

it("shows a distinct not-found state for 404 with a working link", async () => {
  episodesApi.getById.mockRejectedValue(httpError(404));
  await render();
  expect(text()).toContain("Episode not found");
  expect(text()).not.toContain("Unable to load episode");
  expect(backLink().getAttribute("href")).toBe("/episodes");
  await act(async () => backLink().click());
  expect(text()).toContain("Episodes list page");
});

it.each([
  ["server 500", httpError(500)],
  ["network failure", new Error("Network Error")],
])("shows a generic error for %s with a working link", async (_n, err) => {
  episodesApi.getById.mockRejectedValue(err);
  await render();
  expect(container.querySelector("[role=alert]").textContent).toContain("Unable to load episode");
  expect(text()).not.toContain("Episode not found");
  await act(async () => backLink().click());
  expect(text()).toContain("Episodes list page");
});

it.each([
  ["success false", { data: { success: false, data: full } }],
  ["missing data", { data: { success: true } }],
  ["array data", { data: { success: true, data: [] } }],
  ["no body", {}],
])("treats a malformed response (%s) as an error", async (_n, response) => {
  episodesApi.getById.mockResolvedValue(response);
  await render();
  expect(text()).toContain("Unable to load episode");
});

it("resets and refetches when the route id changes", async () => {
  const second = deferred();
  episodesApi.getById
    .mockResolvedValueOnce(ok({ ...full, title: "First" }))
    .mockReturnValueOnce(second.promise);
  await render("/episodes/1");
  expect(text()).toContain("First");
  await act(async () => navigate("/episodes/2"));
  expect(episodesApi.getById).toHaveBeenLastCalledWith("2");
  expect(text()).toContain("Loading episode...");
  expect(text()).not.toContain("First");
  await act(async () => second.resolve(ok({ id: 2, title: "Second" })));
  expect(container.querySelector("h1").textContent).toBe("Second");
});

it.each([
  ["404 not-found", httpError(404), "Episode not found"],
  ["generic error", httpError(500), "Unable to load episode"],
])("clears a %s state when navigating to a new route", async (_n, err, message) => {
  const next = deferred();
  episodesApi.getById.mockRejectedValueOnce(err).mockReturnValueOnce(next.promise);
  await render("/episodes/7");
  expect(text()).toContain(message);
  await act(async () => navigate("/episodes/8"));
  expect(episodesApi.getById).toHaveBeenLastCalledWith("8");
  expect(text()).toContain("Loading episode...");
  expect(text()).not.toContain(message);
  expect(container.querySelector("[role=alert]")).toBeNull();
  await act(async () => next.resolve(ok({ id: 8, title: "Recovered" })));
  expect(container.querySelector("h1").textContent).toBe("Recovered");
  expect(text()).not.toContain(message);
});

it("clears failed-image state when navigating to another episode", async () => {
  episodesApi.getById
    .mockResolvedValueOnce(ok(full))
    .mockResolvedValueOnce(ok({ ...full, id: 8, title: "Other" }));
  await render("/episodes/7");
  await act(async () => {
    container.querySelector("img").dispatchEvent(new Event("error"));
  });
  await act(async () => navigate("/episodes/8"));
  expect(container.querySelector("img").getAttribute("src")).toBe("http://img/thumb.png");
});

it("ignores a stale success from a previous id", async () => {
  const first = deferred();
  episodesApi.getById
    .mockReturnValueOnce(first.promise)
    .mockResolvedValueOnce(ok({ id: 2, title: "Second" }));
  await render("/episodes/1");
  await act(async () => navigate("/episodes/2"));
  await act(async () => first.resolve(ok({ id: 1, title: "Stale" })));
  expect(container.querySelector("h1").textContent).toBe("Second");
  expect(text()).not.toContain("Stale");
});

it("ignores a stale rejection from a previous id", async () => {
  const first = deferred();
  episodesApi.getById
    .mockReturnValueOnce(first.promise)
    .mockResolvedValueOnce(ok({ id: 2, title: "Second" }));
  await render("/episodes/1");
  await act(async () => navigate("/episodes/2"));
  await act(async () => first.reject(httpError(404)));
  expect(container.querySelector("h1").textContent).toBe("Second");
  expect(text()).not.toContain("Episode not found");
});

// Smoke coverage only: React 18 no longer warns on post-unmount setState, so this
// does not prove the component's cancellation guard; it only checks nothing throws/logs.
it("smoke: does not log errors or throw when requests settle after unmount", async () => {
  const errSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  const ok1 = deferred();
  const bad = deferred();
  episodesApi.getById.mockReturnValueOnce(ok1.promise).mockReturnValueOnce(bad.promise);
  await render("/episodes/1");
  await act(async () => root.render(<div>gone</div>));
  await act(async () => {
    ok1.resolve(ok(full));
    await ok1.promise;
  });
  await render("/episodes/2");
  await act(async () => root.render(<div>gone</div>));
  await act(async () => {
    bad.reject(httpError(500));
    await bad.promise.catch(() => {});
  });
  await flush();
  expect(errSpy).not.toHaveBeenCalled();
  expect(text()).toBe("gone");
});

it("renders the result under StrictMode's double effect", async () => {
  episodesApi.getById.mockResolvedValue(ok(full));
  await render("/episodes/7", true);
  expect(container.querySelector("h1").textContent).toBe("Pilot");
  expect(text()).not.toContain("Loading episode...");
});

it("renders an error under StrictMode when the request rejects", async () => {
  episodesApi.getById.mockRejectedValue(httpError(404));
  await render("/episodes/7", true);
  expect(text()).toContain("Episode not found");
});

// Under StrictMode the first effect's request is obsolete; the second is current.
async function renderStrictWithDeferredCalls() {
  const obsolete = deferred();
  const current = deferred();
  episodesApi.getById
    .mockReturnValueOnce(obsolete.promise)
    .mockReturnValueOnce(current.promise);
  await render("/episodes/7", true);
  expect(episodesApi.getById).toHaveBeenCalledTimes(2);
  expect(text()).toContain("Loading episode...");
  return { obsolete, current };
}

it("StrictMode: an obsolete success does not overwrite the current success", async () => {
  const { obsolete, current } = await renderStrictWithDeferredCalls();
  await act(async () => current.resolve(ok({ id: 7, title: "Current" })));
  await act(async () => obsolete.resolve(ok({ id: 7, title: "Obsolete" })));
  expect(container.querySelector("h1").textContent).toBe("Current");
  expect(text()).not.toContain("Obsolete");
});

it("StrictMode: an obsolete rejection does not replace the current detail", async () => {
  const { obsolete, current } = await renderStrictWithDeferredCalls();
  await act(async () => current.resolve(ok({ id: 7, title: "Current" })));
  await act(async () => obsolete.reject(httpError(404)));
  expect(container.querySelector("h1").textContent).toBe("Current");
  expect(text()).not.toContain("Episode not found");
  expect(container.querySelector("[role=alert]")).toBeNull();
});

it("StrictMode: an obsolete success does not replace the current error", async () => {
  const { obsolete, current } = await renderStrictWithDeferredCalls();
  await act(async () => current.reject(httpError(404)));
  await act(async () => obsolete.resolve(ok({ id: 7, title: "Obsolete" })));
  expect(text()).toContain("Episode not found");
  expect(text()).not.toContain("Obsolete");
});

it("StrictMode: an obsolete rejection does not replace the current error", async () => {
  const { obsolete, current } = await renderStrictWithDeferredCalls();
  await act(async () => current.reject(httpError(404)));
  await act(async () => obsolete.reject(httpError(500)));
  expect(text()).toContain("Episode not found");
  expect(text()).not.toContain("Unable to load episode");
});
