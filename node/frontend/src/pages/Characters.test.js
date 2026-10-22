import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Routes, Route, useParams, useLocation } from "react-router-dom";
import Characters from "./Characters";
import { charactersApi } from "../services/api";

jest.mock("../services/api", () => ({
  charactersApi: { getAll: jest.fn() },
}));

const characters = [
  { id: 11, name: "Sam Smith", actor_name: "Actor One", status: "alive", is_main_character: true },
  { id: 22, name: "Sam Smith", actor_name: "Actor Two", status: "deceased", is_main_character: false },
];

let container;
let root;

function Detail() {
  const { id } = useParams();
  return <div data-testid="detail">Detail for {id}</div>;
}

function Path() {
  return <div data-testid="path">{useLocation().pathname}</div>;
}

beforeEach(() => {
  charactersApi.getAll.mockReset();
  charactersApi.getAll.mockResolvedValue({ data: characters });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  global.IS_REACT_ACT_ENVIRONMENT = true;
  jest.spyOn(window, "alert").mockImplementation(() => {});
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
      <MemoryRouter initialEntries={["/characters"]}>
        <Path />
        <Routes>
          <Route path="/characters" element={<Characters />} />
          <Route path="/characters/:id" element={<Detail />} />
        </Routes>
      </MemoryRouter>,
    ),
  );
}

function selects() {
  return container.querySelectorAll("select");
}

async function choose(select, value) {
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set.call(select, value);
    select.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

async function type(value) {
  const input = container.querySelector("input");
  await act(async () => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
  return input;
}

async function press(input, key) {
  await act(async () => {
    input.dispatchEvent(
      new KeyboardEvent("keypress", { key, charCode: key === "Enter" ? 13 : 65, bubbles: true }),
    );
  });
}

it("loads characters with no params initially", async () => {
  await render();
  expect(charactersApi.getAll).toHaveBeenCalledTimes(1);
  expect(charactersApi.getAll).toHaveBeenCalledWith({});
  expect(container.textContent).toContain("Played by Actor One");
});

it("links each card to its own id, including duplicate names", async () => {
  await render();
  const hrefs = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
  expect(hrefs).toEqual(["/characters/11", "/characters/22"]);
});

it.each([
  [0, "11"],
  [1, "22"],
])("clicking duplicate-named card %i navigates to detail %s without alert or reload", async (index, id) => {
  await render();
  const link = container.querySelectorAll("a")[index];
  const event = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });
  await act(async () => {
    link.dispatchEvent(event);
  });
  expect(event.defaultPrevented).toBe(true);
  expect(window.alert).not.toHaveBeenCalled();
  expect(container.querySelector('[data-testid="path"]').textContent).toBe(`/characters/${id}`);
  expect(container.querySelector('[data-testid="detail"]').textContent).toBe(`Detail for ${id}`);
});

it("shows an empty message when no characters match", async () => {
  charactersApi.getAll.mockResolvedValue({ data: [] });
  await render();
  expect(container.textContent).toContain("No characters found.");
  expect(container.querySelectorAll("a")).toHaveLength(0);
});

it("shows an error message when loading fails", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  charactersApi.getAll.mockRejectedValue(new Error("down"));
  await render();
  expect(container.textContent).toContain("Failed to load characters. Is the backend running?");
});

it.each([
  ["main", { is_main: "true" }],
  ["supporting", { is_main: "false" }],
])("%s filter sends is_main param", async (value, params) => {
  await render();
  await choose(selects()[0], value);
  expect(charactersApi.getAll).toHaveBeenLastCalledWith(params);
});

it("returning the role filter to all drops is_main", async () => {
  await render();
  await choose(selects()[0], "main");
  await choose(selects()[0], "all");
  expect(charactersApi.getAll).toHaveBeenLastCalledWith({});
});

it("status filter sends status param", async () => {
  await render();
  await choose(selects()[1], "deceased");
  expect(charactersApi.getAll).toHaveBeenLastCalledWith({ status: "deceased" });
});

it("role and status filters combine", async () => {
  await render();
  await choose(selects()[0], "main");
  await choose(selects()[1], "alive");
  expect(charactersApi.getAll).toHaveBeenLastCalledWith({ is_main: "true", status: "alive" });
});

it("typing does not search until Enter is pressed", async () => {
  await render();
  const input = await type("sam");
  expect(input.value).toBe("sam");
  await press(input, "a");
  expect(charactersApi.getAll).toHaveBeenCalledTimes(1);
  await press(input, "Enter");
  expect(charactersApi.getAll).toHaveBeenCalledTimes(2);
  expect(charactersApi.getAll).toHaveBeenLastCalledWith({ search: "sam" });
});

it("search term is combined with filters", async () => {
  await render();
  const input = await type("sam");
  await press(input, "Enter");
  await choose(selects()[0], "supporting");
  expect(charactersApi.getAll).toHaveBeenLastCalledWith({ is_main: "false", search: "sam" });
});
