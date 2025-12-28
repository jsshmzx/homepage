'use client';

import { useState } from 'react';
import HomePage from './HomePage';
import P5Canvas from './P5Canvas';
import PuzzleGame from './PuzzleGame';

type Page = 'home' | 'p5canvas' | 'puzzle';

const puzzleImages = [
  'https://picsum.photos/400/400?random=1',
  'https://picsum.photos/400/400?random=2',
  'https://picsum.photos/400/400?random=3',
];

export default function Navigation() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  return (
    <div className="relative min-h-screen">
      {/* Navigation Menu */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg">
        <button
          onClick={() => setCurrentPage('home')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            currentPage === 'home'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          主页
        </button>
        <button
          onClick={() => setCurrentPage('p5canvas')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            currentPage === 'p5canvas'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          创意画布
        </button>
        <button
          onClick={() => setCurrentPage('puzzle')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            currentPage === 'puzzle'
              ? 'bg-green-600 text-white shadow-md'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          拼图游戏
        </button>
      </nav>

      {/* Page Content */}
      <div className="w-full h-full">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'p5canvas' && <P5Canvas />}
        {currentPage === 'puzzle' && <PuzzleGame imageUrls={puzzleImages} />}
      </div>
    </div>
  );
}
