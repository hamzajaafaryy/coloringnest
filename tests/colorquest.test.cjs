const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    filename,
  );
const {
  newQuest,
  readQuest,
  narration,
  setting,
} = require("../src/lib/colorquest/story.ts");
const { artwork } = require("../src/lib/colorquest/artwork.ts");

test("saved adventures round-trip, including Unicode names and all chapters", () => {
  const q = {
    ...newQuest(),
    artist: "آدم",
    dragon: "Étoile",
    friend: "cat",
    started: true,
    step: 4,
    completed: [true, true, true, true],
    paintings: Array.from({ length: 4 }, () => ({ "test-shape": "#38bdf8" })),
  };
  assert.deepEqual(readQuest(JSON.stringify(q)), q);
});
test("invalid or inconsistent browser drafts are discarded", () => {
  assert.equal(readQuest("not-json"), null);
  for (const changes of [
    { version: 2 },
    { step: 5 },
    { step: 2 },
    { friend: "wolf" },
    { artist: 34 },
    { artist: "x".repeat(33) },
    { paintings: [{}] },
    { completed: [true, true, true, true] },
    { paintings: [{ "test-shape": "url(javascript:alert(1))" }, {}, {}, {}] },
    { paintings: [{ "bad id": "#ffffff" }, {}, {}, {}] },
  ]) {
    assert.equal(
      readQuest(JSON.stringify({ ...newQuest(), ...changes })),
      null,
      JSON.stringify(changes),
    );
  }
});
test("the chosen body color and companion change the actual story", () => {
  const q = newQuest();
  q.artist = "Adam";
  q.dragon = "Spark";
  q.friend = "dinosaur";
  q.paintings[0]["dragon-body"] = "#3b82f6";
  assert.match(setting(q), /sea/);
  q.paintings[0]["dragon-body"] = "#22c55e";
  assert.match(setting(q), /valley/);
  q.paintings[0]["dragon-body"] = "#ef4444";
  assert.match(setting(q), /flowers/);
  assert.match(narration(q, 0), /Adam/);
  assert.match(narration(q, 0), /Spark/);
  assert.match(narration(q, 2), /dinosaur/);
});
test("each original illustration has unique, keyboard-accessible fill regions", () => {
  for (let chapter = 0; chapter < 4; chapter++) {
    for (const friend of ["cat", "rabbit", "dinosaur"]) {
      const svg = artwork(chapter, friend, {}, true);
      const ids = Array.from(
        svg.matchAll(/data-region="([^"]+)"/g),
        (m) => m[1],
      );
      assert.ok(ids.length >= 8);
      assert.equal(new Set(ids).size, ids.length);
      assert.equal((svg.match(/tabindex="0"/g) || []).length, ids.length);
      assert.ok(svg.includes('viewBox="0 0 800 600"'));
    }
  }
});
test("painted book artwork preserves fills and omits editing controls", () => {
  const svg = artwork(0, "rabbit", { "dragon-body": "#3b82f6" });
  assert.match(svg, /data-region="dragon-body" fill="#3b82f6"/);
  assert.ok(!svg.includes("tabindex"));
  assert.ok(!svg.includes('role="button"'));
  assert.ok(
    !artwork(0, "rabbit", { "dragon-body": "<script>" }).includes("<script>"),
  );
});
