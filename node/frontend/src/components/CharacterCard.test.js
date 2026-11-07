import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import CharacterCard from "./CharacterCard";

const base = {
  name: "Jane Doe",
  actor_name: "Actor One",
  status: "alive",
  image_url: "http://example.com/jane.png",
  is_main_character: true,
};
let container;
let root;

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

async function render(character, onClick) {
  await act(async () =>
    root.render(<CharacterCard character={character} onClick={onClick} />),
  );
}

const placeholder = () => container.querySelector("img").nextSibling;

it("renders the character name, actor and status", async () => {
  await render(base);
  expect(container.querySelector("h3").textContent).toContain("Jane Doe");
  expect(container.textContent).toContain("Played by Actor One");
  expect(container.textContent).toContain("alive");
});

it("renders the image with src and alt and hides the placeholder", async () => {
  await render(base);
  const img = container.querySelector("img");
  expect(img.getAttribute("src")).toBe(base.image_url);
  expect(img.getAttribute("alt")).toBe("Jane Doe");
  expect(placeholder().style.display).toBe("none");
});

it("shows initials placeholder and no img when image_url is missing", async () => {
  await render({ ...base, image_url: null });
  expect(container.querySelector("img")).toBeNull();
  expect(container.textContent).toContain("JD");
});

it("limits initials to two uppercase letters", async () => {
  await render({ ...base, image_url: null, name: "mary jane watson" });
  expect(container.textContent).toContain("MJ");
  expect(container.textContent).not.toContain("MJW");
});

it("shows the MAIN badge only for main characters", async () => {
  await render(base);
  expect(container.textContent).toContain("MAIN");
  await render({ ...base, is_main_character: false });
  expect(container.textContent).not.toContain("MAIN");
});

it("falls back to Unknown actor when actor_name is missing", async () => {
  await render({ ...base, actor_name: undefined });
  expect(container.textContent).toContain("Played by Unknown");
});

it("falls back to Unknown status when status is missing", async () => {
  await render({ ...base, status: undefined });
  expect(container.textContent).toContain("Unknown");
});

it("calls onClick with the character when the card is clicked", async () => {
  const onClick = jest.fn();
  await render(base, onClick);
  await act(async () => container.querySelector("h3").click());
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onClick).toHaveBeenCalledWith(base);
});

it("does not throw when clicked without an onClick handler", async () => {
  await render(base);
  await act(async () => container.querySelector("h3").click());
  expect(container.querySelector("h3")).not.toBeNull();
});

it("swaps the broken image for the placeholder on image error", async () => {
  await render(base);
  const img = container.querySelector("img");
  await act(async () => {
    img.dispatchEvent(new Event("error", { bubbles: false }));
  });
  expect(img.style.display).toBe("none");
  expect(placeholder().style.display).toBe("flex");
});
