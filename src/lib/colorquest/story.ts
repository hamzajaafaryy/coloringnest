export type Friend = "rabbit" | "cat" | "dinosaur";
export type Paint = Record<string, string>;
export type Quest = {
  version: 1;
  artist: string;
  dragon: string;
  friend: Friend;
  started: boolean;
  step: number;
  completed: boolean[];
  paintings: Paint[];
};

export const STORAGE_KEY = "craftcoloring-colorquest-rainbow-v1";
export const FRIENDS: { id: Friend; name: string; emoji: string }[] = [
  { id: "rabbit", name: "A brave bunny", emoji: "🐰" },
  { id: "cat", name: "A curious cat", emoji: "🐱" },
  { id: "dinosaur", name: "A gentle dinosaur", emoji: "🦕" },
];
export const CHAPTERS = [
  {
    title: "Meet your dragon",
    short: "Dragon",
    hint: "Give your little dragon its first splash of color.",
  },
  {
    title: "The whispering woods",
    short: "Forest",
    hint: "Color the trees and the secret path through the forest.",
  },
  {
    title: "A friend along the way",
    short: "Friend",
    hint: "Every adventure is brighter with a friend. Color yours!",
  },
  {
    title: "The rainbow castle",
    short: "Castle",
    hint: "Bring the castle and its rainbow back to life.",
  },
];
export const PALETTE = [
  "#ef4444",
  "#f97316",
  "#facc15",
  "#22c55e",
  "#14b8a6",
  "#38bdf8",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#a16207",
];
export const newQuest = (): Quest => ({
  version: 1,
  artist: "",
  dragon: "Sunny",
  friend: "rabbit",
  started: false,
  step: 0,
  completed: [false, false, false, false],
  paintings: [{}, {}, {}, {}],
});

export function readQuest(raw: string | null): Quest | null {
  if (!raw) return null;
  try {
    const q = JSON.parse(raw);
    if (
      q.version !== 1 ||
      typeof q.artist !== "string" ||
      typeof q.dragon !== "string" ||
      !FRIENDS.some((f) => f.id === q.friend) ||
      typeof q.started !== "boolean" ||
      !Number.isInteger(q.step) ||
      q.step < 0 ||
      q.step > 4 ||
      !Array.isArray(q.completed) ||
      q.completed.length !== 4 ||
      !q.completed.every((v: unknown) => typeof v === "boolean") ||
      !Array.isArray(q.paintings) ||
      q.paintings.length !== 4
    )
      return null;
    if (q.artist.length > 32 || q.dragon.length > 32) return null;
    for (const paint of q.paintings) {
      if (
        !paint ||
        typeof paint !== "object" ||
        Array.isArray(paint) ||
        Object.keys(paint).length > 100
      )
        return null;
      for (const [key, value] of Object.entries(paint)) {
        if (
          !/^[a-z][a-z0-9-]{0,40}$/.test(key) ||
          typeof value !== "string" ||
          !/^#[0-9a-f]{6}$/i.test(value)
        )
          return null;
      }
    }
    if (q.step > 0 && !q.completed.slice(0, q.step).every(Boolean)) return null;
    if (
      q.completed.some(
        (done: boolean, i: number) =>
          done && !Object.keys(q.paintings[i]).length,
      )
    )
      return null;
    return q as Quest;
  } catch {
    return null;
  }
}

export function setting(quest: Quest) {
  const color =
    quest.paintings[0]["dragon-body"] ||
    Object.values(quest.paintings[0])[0] ||
    "#ec4899";
  const r = parseInt(color.slice(1, 3), 16),
    g = parseInt(color.slice(3, 5), 16),
    b = parseInt(color.slice(5, 7), 16);
  return b > r && b > g
    ? "beside the sparkling sea"
    : g > r && g > b
      ? "in a leafy green valley"
      : "in a garden full of flowers";
}
export function narration(quest: Quest, chapter: number) {
  const dragon = quest.dragon.trim() || "Sunny";
  const friend = quest.friend === "rabbit" ? "bunny" : quest.friend;
  const author = quest.artist.trim() || "our young artist";
  return (
    [
      `${dragon} was a little dragon who lived ${setting(quest)}. One morning, the sky lost its rainbow! With colors chosen by ${author}, ${dragon} set off to find it.`,
      `Deep in the whispering woods, ${dragon} found a winding path. The trees rustled, “Follow the colors!” Each bright leaf lit the way toward a faraway castle.`,
      `Along the path, a friendly ${friend} appeared. “I will help you!” said the ${friend}. Together, the two friends crossed the meadow, making the journey a little less scary and a lot more fun.`,
      `At the castle, ${dragon} and the ${friend} discovered a sleeping rainbow. ${author}'s colors woke it up! The rainbow stretched across the sky, and everyone cheered. From that day on, the friends knew that a little creativity could make a big difference.`,
    ][chapter] || ""
  );
}
