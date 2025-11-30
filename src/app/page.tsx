import PuzzleGame from "@/components/PuzzleGame";

const puzzleImages = [
  "/images/puzzle1.svg",
  "/images/puzzle2.svg",
];

export default function Home() {
  return <PuzzleGame imageUrls={puzzleImages} />;
}
