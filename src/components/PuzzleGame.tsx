'use client';

import { useState, useCallback, useMemo } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface PuzzlePiece {
  id: number; // -1 for empty space
  currentPosition: number;
  correctPosition: number;
}

interface PuzzleGameProps {
  imageUrls: string[];
}

// Umami tracking helper
declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string | number | boolean>) => void;
    };
  }
}

const trackEvent = (eventName: string, eventData?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData);
  }
};

const difficultyConfig: Record<Difficulty, { gridSize: number; label: string }> = {
  easy: { gridSize: 3, label: '简单 (3x3)' },
  medium: { gridSize: 4, label: '中等 (4x4)' },
  hard: { gridSize: 5, label: '困难 (5x5)' },
};

export default function PuzzleGame({ imageUrls }: PuzzleGameProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  const gridSize = difficultyConfig[difficulty].gridSize;
  const totalPieces = gridSize * gridSize;
  const currentImageUrl = imageUrls[selectedImageIndex];

  // Check if puzzle is complete (all non-empty pieces in correct position)
  const isComplete = useMemo(() => {
    if (pieces.length === 0 || !gameStarted) return false;
    return pieces
      .filter((piece) => piece.id !== -1)
      .every((piece) => piece.currentPosition === piece.correctPosition);
  }, [pieces, gameStarted]);

  // Create initial puzzle pieces for a given grid size
  const createPuzzlePieces = useCallback((size: number): PuzzlePiece[] => {
    const total = size * size;
    const initialPieces: PuzzlePiece[] = [];
    for (let i = 0; i < total - 1; i++) {
      initialPieces.push({
        id: i,
        currentPosition: i,
        correctPosition: i,
      });
    }
    // Add empty space at the last position
    initialPieces.push({
      id: -1,
      currentPosition: total - 1,
      correctPosition: total - 1,
    });
    return initialPieces;
  }, []);

  // Shuffle pieces using Fisher-Yates algorithm
  const shufflePuzzlePieces = useCallback((piecesToShuffle: PuzzlePiece[]): PuzzlePiece[] => {
    const shuffled = [...piecesToShuffle];
    // Fisher-Yates shuffle for positions
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap currentPosition
      const tempPos = shuffled[i].currentPosition;
      shuffled[i].currentPosition = shuffled[j].currentPosition;
      shuffled[j].currentPosition = tempPos;
    }
    return shuffled;
  }, []);

  // Initialize and start a new game with specified grid size
  const initializeGame = useCallback((size: number) => {
    const newPieces = createPuzzlePieces(size);
    const shuffledPieces = shufflePuzzlePieces(newPieces);
    setPieces(shuffledPieces);
    setMoves(0);
    setGameStarted(true);
    setStartTime(Date.now());
  }, [createPuzzlePieces, shufflePuzzlePieces]);

  // Start new game with current difficulty
  const startNewGame = useCallback(() => {
    initializeGame(gridSize);
    
    // Track game start event
    trackEvent('game_start', {
      difficulty,
      gridSize,
      imageIndex: selectedImageIndex,
    });
  }, [initializeGame, gridSize, difficulty, selectedImageIndex]);

  // Handle difficulty change
  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    // Track difficulty change event
    trackEvent('difficulty_change', {
      from: difficulty,
      to: newDifficulty,
      gridSize: difficultyConfig[newDifficulty].gridSize,
    });
    
    setDifficulty(newDifficulty);
    
    // If game was already started, restart with new difficulty
    if (gameStarted) {
      const newGridSize = difficultyConfig[newDifficulty].gridSize;
      initializeGame(newGridSize);
    }
  }, [difficulty, gameStarted, initializeGame]);

  // Handle image selection
  const handleImageSelect = useCallback((index: number) => {
    // Track image selection event
    trackEvent('image_select', {
      imageIndex: index,
      previousImage: selectedImageIndex,
    });
    
    setSelectedImageIndex(index);
    
    if (gameStarted) {
      initializeGame(gridSize);
    }
  }, [selectedImageIndex, gameStarted, initializeGame, gridSize]);

  // Handle piece click - swap with empty space if adjacent
  const handlePieceClick = useCallback((clickedIndex: number) => {
    if (isComplete) return;

    const clickedPiece = pieces.find((p) => p.currentPosition === clickedIndex);
    if (!clickedPiece || clickedPiece.id === -1) return; // Can't click empty space

    // Find the empty space
    const emptyPiece = pieces.find((p) => p.id === -1);
    if (!emptyPiece) return;

    const emptyPosition = emptyPiece.currentPosition;

    // Check if clicked piece is adjacent to empty space
    const clickedRow = Math.floor(clickedIndex / gridSize);
    const clickedCol = clickedIndex % gridSize;
    const emptyRow = Math.floor(emptyPosition / gridSize);
    const emptyCol = emptyPosition % gridSize;

    const isAdjacent = 
      (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
      (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);

    if (!isAdjacent) return;

    // Swap clicked piece with empty space
    const newPieces = pieces.map((piece) => {
      if (piece.id === clickedPiece.id) {
        return { ...piece, currentPosition: emptyPosition };
      }
      if (piece.id === -1) {
        return { ...piece, currentPosition: clickedIndex };
      }
      return piece;
    });
    
    setPieces(newPieces);
    const newMoves = moves + 1;
    setMoves(newMoves);

    // Track piece move event (throttled - every 5 moves)
    if (newMoves % 5 === 0) {
      trackEvent('piece_move_milestone', {
        moves: newMoves,
        difficulty,
        imageIndex: selectedImageIndex,
      });
    }

    // Check if puzzle is now complete
    const nowComplete = newPieces
      .filter((piece) => piece.id !== -1)
      .every((piece) => piece.currentPosition === piece.correctPosition);
    
    if (nowComplete && startTime) {
      const duration = Math.round((Date.now() - startTime) / 1000);
      // Track game completion event
      trackEvent('game_complete', {
        difficulty,
        gridSize,
        moves: newMoves,
        durationSeconds: duration,
        imageIndex: selectedImageIndex,
      });
    }
  }, [pieces, gridSize, isComplete, moves, difficulty, selectedImageIndex, startTime]);

  // Handle play again
  const handlePlayAgain = useCallback(() => {
    trackEvent('play_again', {
      previousMoves: moves,
      difficulty,
    });
    startNewGame();
  }, [moves, difficulty, startNewGame]);

  const pieceSize = 400 / gridSize;

  return (
    <div className="flex flex-col items-center gap-6 p-4 min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
        🧩 拼图游戏
      </h1>

      {/* Image selector */}
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <span className="text-gray-700 dark:text-gray-300 font-medium">选择图片:</span>
        {imageUrls.map((url, index) => (
          <button
            key={index}
            onClick={() => handleImageSelect(index)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedImageIndex === index
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-600'
            }`}
          >
            图片 {index + 1}
          </button>
        ))}
      </div>

      {/* Difficulty selector */}
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <span className="text-gray-700 dark:text-gray-300 font-medium">难度:</span>
        {(Object.keys(difficultyConfig) as Difficulty[]).map((level) => (
          <button
            key={level}
            onClick={() => handleDifficultyChange(level)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              difficulty === level
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-gray-600'
            }`}
          >
            {difficultyConfig[level].label}
          </button>
        ))}
      </div>

      {/* Start button */}
      <button
        onClick={startNewGame}
        className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all transform hover:scale-105"
      >
        {gameStarted ? '重新开始' : '开始游戏'}
      </button>

      {/* Game stats */}
      {gameStarted && (
        <div className="flex gap-6 text-lg">
          <span className="text-gray-700 dark:text-gray-300">
            移动次数: <strong className="text-purple-600">{moves}</strong>
          </span>
        </div>
      )}

      {/* Puzzle grid */}
      {gameStarted && (
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Main puzzle */}
          <div className="relative">
            <div
              className="grid bg-gray-300 dark:bg-gray-600 rounded-lg overflow-hidden shadow-xl"
              style={{
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                width: '400px',
                height: '400px',
                gap: '2px',
              }}
            >
              {Array.from({ length: totalPieces }).map((_, position) => {
                const piece = pieces.find((p) => p.currentPosition === position);
                if (!piece) return null;

                // Empty space
                if (piece.id === -1) {
                  return (
                    <div
                      key="empty"
                      className="bg-gray-400 dark:bg-gray-700"
                      style={{
                        width: `${pieceSize - 2}px`,
                        height: `${pieceSize - 2}px`,
                      }}
                    />
                  );
                }

                const correctRow = Math.floor(piece.correctPosition / gridSize);
                const correctCol = piece.correctPosition % gridSize;

                return (
                  <div
                    key={piece.id}
                    onClick={() => handlePieceClick(position)}
                    className="cursor-pointer transition-all hover:opacity-80 hover:scale-[1.02] relative overflow-hidden"
                    style={{
                      width: `${pieceSize - 2}px`,
                      height: `${pieceSize - 2}px`,
                      backgroundImage: `url(${currentImageUrl})`,
                      backgroundSize: '400px 400px',
                      backgroundPosition: `-${correctCol * pieceSize}px -${correctRow * pieceSize}px`,
                    }}
                  >
                    {/* Piece number overlay */}
                    <span className="absolute bottom-1 right-1 text-xs bg-black/50 text-white px-1 rounded">
                      {piece.id + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reference image */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-700 dark:text-gray-300 font-medium">参考图片</span>
            <div
              className="rounded-lg overflow-hidden shadow-lg border-4 border-gray-300 dark:border-gray-600"
              style={{
                width: '200px',
                height: '200px',
                backgroundImage: `url(${currentImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </div>
      )}

      {/* Win message */}
      {isComplete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center animate-bounce">
            <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 恭喜！</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
              你完成了拼图！
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              总共移动了 <strong className="text-purple-600">{moves}</strong> 次
            </p>
            <button
              onClick={handlePlayAgain}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition-all"
            >
              再玩一次
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 p-4 bg-white/80 dark:bg-gray-800/80 rounded-xl max-w-md text-center">
        <h3 className="font-bold text-gray-800 dark:text-white mb-2">游戏说明</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          点击与空白格相邻的拼图块，将其移动到空白位置。将所有拼图块移动到正确位置即可完成拼图！
        </p>
      </div>
    </div>
  );
}
