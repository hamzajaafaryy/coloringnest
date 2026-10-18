import type { Metadata } from "next";
import KidsPlayZone from "@/components/play/KidsPlayZone";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Free Creative Games for Kids - Play, Draw & Learn",
  description: "Play free creative games for kids at CraftColoring. Color original cartoon characters, play Rainbow Quest, Memory Garden, Pixel Art Club and Doodle Studio. No sign-up needed.",
  path: "/play/",
});

export default function PlayPage() {
  return <KidsPlayZone />;
}
