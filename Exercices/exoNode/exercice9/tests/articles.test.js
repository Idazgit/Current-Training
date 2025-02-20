import { validateArticle } from "../utils/validator.js";

// Exemple avec Node:test
import test from "node:test";
import assert from "node:assert/strict";

test("article validation", async (t) => {
  await t.test("validates article with correct data", () => {
    const article = {
      title: "Test Article",
      content: "This is a valid content for testing",
    };
    const errors = validateArticle(article);
    assert.equal(errors.length, 0);
  });

  await t.test("detects missing title", () => {
    const article = {
      content: "Content without title",
    };
    const errors = validateArticle(article);
    assert.equal(errors.length, 1);
    assert.equal(errors[0], "Title is required");
  });
});
