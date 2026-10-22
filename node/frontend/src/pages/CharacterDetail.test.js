import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Link, Route, Routes } from "react-router-dom";
import CharacterDetail from "./CharacterDetail";
import { charactersApi } from "../services/api";

jest.mock("../services/api", () => ({
  charactersApi: { getById: jest.fn() },
}));

let container;
let root;

beforeEach(() => {
  charactersApi.getById.mockReset();
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

function App({ path = "/characters/1", strict = false }) {
  const tree = (
    <MemoryRouter initialEntries={[path]}>
      <nav>
        <Link to="/characters/2">go-two</Link>
        <Link to="/characters/3">go-three</Link>
      </nav>
      <Routes>
        <Route path="/characters" element={<div>Characters list page</div>} />
        <Route path="/characters/:id" element={<CharacterDetail />} />
      </Routes>
    </MemoryRouter>
  );
  return strict ? <React.StrictMode>{tree}</React.StrictMode> : tree;
}

async function render(props) {
  await act(async () => root.render(<App {...props} />));
}

async function click(el) {
  await act(async () => el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 })));
}

const linkByText = (text) =>
  Array.from(container.querySelectorAll("a")).find((a) => a.textContent === text);

function deferred() {
  const d = {};
  d.promise = new Promise((resolve, reject) => {
    d.resolve = resolve;
    d.reject = reject;
  });
  return d;
}

const full = {
  id: 1,
  name: "Jane Doe",
  actor_name: "Actor One",
  status: "Alive",
  bio: "A long biography.",
  image_url: "http://img.test/jane.png",
  is_main_character: 1,
  episodes: [
    { id: 20, title: "Zeta", episode_number: 5, is_featured: 0 },
    { id: 10, title: "Alpha", episode_number: 2, is_featured: 1 },
  ],
};

async function renderCharacter(data) {
  charactersApi.getById.mockResolvedValue({ data });
  await render();
}

async function expectBackLinkWorks() {
  const back = linkByText("Back to Characters");
  expect(back.getAttribute("href")).toBe("/characters");
  await click(back);
  expect(container.textContent).toContain("Characters list page");
}

it("fetches the character for the id in the URL", async () => {
  await renderCharacter({ ...full, id: 42 });
  charactersApi.getById.mockClear();
  act(() => root.unmount());
  root = createRoot(container);
  charactersApi.getById.mockResolvedValue({ data: full });
  await render({ path: "/characters/42" });
  expect(charactersApi.getById).toHaveBeenCalledTimes(1);
  expect(charactersApi.getById).toHaveBeenCalledWith("42");
});

it("shows a loading status with a working back link while pending", async () => {
  charactersApi.getById.mockReturnValue(new Promise(() => {}));
  await render();
  expect(container.querySelector('[role="status"]').textContent).toBe("Loading character...");
  await expectBackLinkWorks();
});

it("renders the character from response.data with all profile fields", async () => {
  await renderCharacter(full);
  expect(container.querySelector("h1").textContent).toBe("Jane Doe");
  expect(container.textContent).toContain("Played by Actor One");
  expect(container.textContent).toContain("Alive");
  expect(container.textContent).toContain("A long biography.");
  const img = container.querySelector("img");
  expect(img.getAttribute("src")).toBe("http://img.test/jane.png");
  expect(img.getAttribute("alt")).toBe("Jane Doe");
  expect(container.querySelector('[role="status"]')).toBeNull();
  await expectBackLinkWorks();
});

it.each([
  [1, "Main character"],
  [0, "Supporting character"],
  [undefined, "Unknown role"],
  [null, "Unknown role"],
])("classifies is_main_character=%s as %s", async (flag, label) => {
  await renderCharacter({ ...full, is_main_character: flag });
  const dd = Array.from(container.querySelectorAll("dd")).map((d) => d.textContent);
  expect(dd).toContain(label);
});

it("falls back for missing optional fields and shows initials without an image", async () => {
  await renderCharacter({ id: 1, name: "  ", episodes: [] });
  expect(container.querySelector("h1").textContent).toBe("Unknown character");
  expect(container.textContent).toContain("Played by Unknown actor");
  expect(container.textContent).toContain("No biography available.");
  expect(Array.from(container.querySelectorAll("dd")).map((d) => d.textContent)[0]).toBe("Unknown");
  expect(container.querySelector("img")).toBeNull();
  expect(container.querySelector('[role="img"]').textContent).toBe("?");
});

it("uses up to two uppercase initials when there is no image", async () => {
  await renderCharacter({ ...full, image_url: null, name: "mary jane watson" });
  const initials = container.querySelector('[role="img"]');
  expect(initials.textContent).toBe("MJ");
  expect(initials.getAttribute("aria-label")).toBe("mary jane watson initials");
});

it("replaces a broken image with initials", async () => {
  await renderCharacter(full);
  await act(async () => container.querySelector("img").dispatchEvent(new Event("error")));
  expect(container.querySelector("img")).toBeNull();
  expect(container.querySelector('[role="img"]').textContent).toBe("JD");
});

it("lists episode appearances in the order received without season labels or links", async () => {
  await renderCharacter(full);
  const items = Array.from(container.querySelectorAll("li"));
  expect(items.map((li) => li.querySelector("h3").textContent)).toEqual(["Zeta", "Alpha"]);
  expect(items[0].textContent).toContain("Episode 5");
  expect(items[0].textContent).toContain("Not featured");
  expect(items[1].textContent).toContain("Episode 2");
  expect(items[1].textContent).toContain("Featured appearance");
  expect(container.textContent).not.toMatch(/season/i);
  expect(container.querySelectorAll("li a").length).toBe(0);
});

it("falls back for missing episode fields", async () => {
  await renderCharacter({ ...full, episodes: [{ id: 7 }] });
  const li = container.querySelector("li");
  expect(li.textContent).toContain("Untitled episode");
  expect(li.textContent).toContain("Episode number unknown");
  expect(li.textContent).toContain("Featured status unknown");
});

it.each([
  ["an empty array", []],
  ["absent", undefined],
])("says no appearances are recorded when episodes are %s", async (_n, episodes) => {
  await renderCharacter({ ...full, episodes });
  expect(container.textContent).toContain("No appearances are recorded for this character.");
  expect(container.querySelectorAll("li").length).toBe(0);
});

it("shows a not-found message for HTTP 404 with a working back link", async () => {
  charactersApi.getById.mockRejectedValue({ response: { status: 404 } });
  await render();
  expect(container.querySelector('[role="alert"] h1').textContent).toBe("Character not found");
  expect(container.textContent).not.toContain("Failed to load");
  await expectBackLinkWorks();
});

it.each([
  ["a server error", { response: { status: 500 } }],
  ["a network error", new Error("Network Error")],
])("shows a distinct failure message for %s", async (_n, err) => {
  charactersApi.getById.mockRejectedValue(err);
  await render();
  expect(container.querySelector('[role="alert"] h1').textContent).toBe("Unable to load character");
  expect(container.textContent).toContain("Failed to load character details.");
  expect(container.textContent).not.toContain("not be found");
  await expectBackLinkWorks();
});

it("refetches on route id change, hides the old profile, and resets a broken image", async () => {
  const second = deferred();
  charactersApi.getById
    .mockResolvedValueOnce({ data: full })
    .mockReturnValueOnce(second.promise);
  await render();
  await act(async () => container.querySelector("img").dispatchEvent(new Event("error")));
  expect(container.querySelector("img")).toBeNull();

  await click(linkByText("go-two"));
  expect(charactersApi.getById).toHaveBeenLastCalledWith("2");
  expect(container.textContent).toContain("Loading character...");
  expect(container.textContent).not.toContain("Jane Doe");

  await act(async () => second.resolve({ data: { ...full, id: 2, name: "Bob Ross" } }));
  expect(container.querySelector("h1").textContent).toBe("Bob Ross");
  expect(container.querySelector("img").getAttribute("src")).toBe(full.image_url);
});

it("clears an error immediately when navigating to another id, before the new request settles", async () => {
  const second = deferred();
  charactersApi.getById
    .mockRejectedValueOnce({ response: { status: 404 } })
    .mockReturnValueOnce(second.promise);
  await render();
  expect(container.textContent).toContain("Character not found");
  await click(linkByText("go-two"));
  expect(container.textContent).not.toContain("Character not found");
  expect(container.querySelector('[role="alert"]')).toBeNull();
  expect(container.textContent).toContain("Loading character...");
  await act(async () => second.resolve({ data: { ...full, id: 2, name: "Bob Ross" } }));
  expect(container.querySelector("h1").textContent).toBe("Bob Ross");
});

it("does not render season or first-appearance data from the API scalar fields", async () => {
  await renderCharacter({
    ...full,
    season_id: 7431,
    first_appearance: 8642,
    episodes: [{ id: 10, title: "Alpha", episode_number: 2, is_featured: 1, season_id: 7431 }],
  });
  expect(container.querySelector("h1").textContent).toBe("Jane Doe");
  expect(container.textContent).not.toMatch(/season/i);
  expect(container.textContent).not.toMatch(/first appearance/i);
  expect(container.textContent).not.toContain("7431");
  expect(container.textContent).not.toContain("8642");
});

it.each(["resolves", "rejects"])(
  "an obsolete request that %s after the current one has displayed does not change the current profile",
  async (outcome) => {
    const first = deferred();
    const second = deferred();
    charactersApi.getById.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    await render();
    await click(linkByText("go-two"));
    await act(async () => second.resolve({ data: { ...full, id: 2, name: "Current Person" } }));
    expect(container.querySelector("h1").textContent).toBe("Current Person");

    await act(async () =>
      outcome === "resolves"
        ? first.resolve({ data: { ...full, id: 1, name: "Obsolete Person" } })
        : first.reject({ response: { status: 404 } })
    );
    expect(container.querySelector("h1").textContent).toBe("Current Person");
    expect(container.textContent).not.toContain("Obsolete Person");
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(container.querySelector('[role="status"]')).toBeNull();
  }
);

it("ignores a stale success that arrives after navigation", async () => {
  const first = deferred();
  const second = deferred();
  charactersApi.getById.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
  await render();
  await click(linkByText("go-two"));
  await act(async () => first.resolve({ data: { ...full, name: "Stale Person" } }));
  expect(container.textContent).toContain("Loading character...");
  expect(container.textContent).not.toContain("Stale Person");
  await act(async () => second.resolve({ data: { ...full, id: 2, name: "Fresh Person" } }));
  expect(container.querySelector("h1").textContent).toBe("Fresh Person");
});

it("ignores a stale failure that arrives after navigation", async () => {
  const first = deferred();
  const second = deferred();
  charactersApi.getById.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
  await render();
  await click(linkByText("go-two"));
  await act(async () => first.reject({ response: { status: 404 } }));
  expect(container.textContent).toContain("Loading character...");
  expect(container.querySelector('[role="alert"]')).toBeNull();
  await act(async () => second.resolve({ data: { ...full, id: 2, name: "Fresh Person" } }));
  expect(container.querySelector("h1").textContent).toBe("Fresh Person");
  expect(container.querySelector('[role="alert"]')).toBeNull();
});

it.each(["resolves", "rejects"])("a request that %s after unmount never has its payload read", async (outcome) => {
  const d = deferred();
  charactersApi.getById.mockReturnValue(d.promise);
  const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  const payloadRead = jest.fn();
  await render();
  act(() => root.unmount());
  await act(async () => {
    if (outcome === "resolves") {
      d.resolve({ get data() { payloadRead(); return full; } });
    } else {
      d.reject({ get response() { payloadRead(); return { status: 404 }; } });
    }
  });
  expect(payloadRead).not.toHaveBeenCalled();
  expect(container.textContent).toBe("");
  expect(errorSpy).not.toHaveBeenCalled();
  root = createRoot(container);
});

it("renders the character under StrictMode double effects", async () => {
  charactersApi.getById.mockResolvedValue({ data: full });
  await render({ strict: true });
  expect(container.querySelector("h1").textContent).toBe("Jane Doe");
  expect(container.querySelector('[role="status"]')).toBeNull();
  expect(container.querySelectorAll("li").length).toBe(2);
});

it.each(["resolves", "rejects"])(
  "under StrictMode a cleaned-up first request that %s after the active one does not replace the profile",
  async (outcome) => {
    const cleanedUp = deferred();
    const active = deferred();
    charactersApi.getById
      .mockReturnValueOnce(cleanedUp.promise)
      .mockReturnValueOnce(active.promise);
    await render({ strict: true });
    expect(charactersApi.getById).toHaveBeenCalledTimes(2);

    await act(async () => active.resolve({ data: { ...full, name: "Active Person" } }));
    expect(container.querySelector("h1").textContent).toBe("Active Person");

    await act(async () =>
      outcome === "resolves"
        ? cleanedUp.resolve({ data: { ...full, name: "Cleaned Up Person" } })
        : cleanedUp.reject({ response: { status: 404 } })
    );
    expect(charactersApi.getById).toHaveBeenCalledTimes(2);
    expect(container.querySelector("h1").textContent).toBe("Active Person");
    expect(container.textContent).not.toContain("Cleaned Up Person");
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(container.querySelector('[role="status"]')).toBeNull();
  }
);
