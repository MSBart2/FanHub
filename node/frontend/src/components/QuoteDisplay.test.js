import React from "react";
import { createRoot } from "react-dom/client";
import { act } from "react-dom/test-utils";
import QuoteDisplay from "./QuoteDisplay";

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

async function render(props) {
  await act(async () => root.render(<QuoteDisplay {...props} />));
}

async function clickLike() {
  const button = container.querySelector("button");
  await act(async () => button.click());
}

const quote = {
  id: 42,
  quote_text: "How you doin'?",
  character_name: "Joey",
  episode_title: "The One with the Blackout",
  season_number: 1,
  episode_number: 7,
  context: "Joey greets a woman at the coffee house.",
  likes_count: 3,
  is_famous: true,
};

test("renders the quote, attribution, episode number, context, and initial like count", async () => {
  await render({ quote });

  expect(container.querySelector("blockquote").textContent).toBe("How you doin'?");
  expect(container.textContent).toContain("— Joey");
  expect(container.textContent).toContain("The One with the Blackout");
  expect(container.textContent).toContain("(S1E7)");
  expect(container.textContent).toContain("Context: Joey greets a woman at the coffee house.");
  expect(container.querySelector("button").textContent).toBe("🤍 3");
});

test("hides character and episode attribution when their options are disabled", async () => {
  await render({ quote, showCharacter: false, showEpisode: false });

  expect(container.textContent).not.toContain("Joey");
  expect(container.textContent).not.toContain("The One with the Blackout");
  expect(container.textContent).not.toContain("(S1E7)");
});

test("shows the famous quote badge only for famous quotes", async () => {
  await render({ quote });
  expect(container.textContent).toContain("⭐ Famous Quote");

  await act(async () => root.render(<QuoteDisplay quote={{ ...quote, is_famous: false }} />));
  expect(container.textContent).not.toContain("⭐ Famous Quote");
});

test("likes a quote once and increments its count after the callback succeeds", async () => {
  const onLike = jest.fn().mockResolvedValue(undefined);
  await render({ quote, onLike });

  await clickLike();
  expect(onLike).toHaveBeenCalledTimes(1);
  expect(onLike).toHaveBeenCalledWith(42);
  expect(container.querySelector("button").textContent).toBe("❤️ 4");
  expect(container.querySelector("button").disabled).toBe(true);

  await clickLike();
  expect(onLike).toHaveBeenCalledTimes(1);
  expect(container.querySelector("button").textContent).toBe("❤️ 4");
});

test("increments the like count when no callback is provided", async () => {
  await render({ quote: { ...quote, likes_count: 0 } });

  await clickLike();
  expect(container.querySelector("button").textContent).toBe("❤️ 1");
});

test("keeps the quote unliked when the like callback rejects", async () => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  const onLike = jest.fn().mockRejectedValue(new Error("Request failed"));
  await render({ quote, onLike });

  await clickLike();

  expect(onLike).toHaveBeenCalledWith(42);
  expect(container.querySelector("button").textContent).toBe("🤍 3");
  expect(container.querySelector("button").disabled).toBe(false);
});
