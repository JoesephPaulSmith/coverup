'use client';

import { useState, useEffect } from 'react';

const SYMBOLS = ['🌑', '🌕', '⭐️', '☀️', '☁️', '💧', '❤️', '♦️', '♠️', '♣️'];
const PLACEHOLDER_SYMBOLS = ['☸️', '✝️', '♒️', '♈️', '☮️'];

type GameState = 'playing' | 'won' | 'lost';

export default function Home() {
    const [gameGrid, setGameGrid] = useState<string[][]>([]);
    const [correctAnswer, setCorrectAnswer] = useState<string[]>([]);
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>(PLACEHOLDER_SYMBOLS);
    const [guesses, setGuesses] = useState<string[][]>([]);
    const [correctPositions, setCorrectPositions] = useState<boolean[]>([false, false, false, false, false]);
    const [gameState, setGameState] = useState<GameState>('playing');
    const [previousCorrectCount, setPreviousCorrectCount] = useState(0);

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const hour = new Date().getHours();
        const isDaytime = hour >= 6 && hour < 18;

        const grid: string[][]= [[], [], [], [], []];
        const answer: string[] = [];

        // Column 1: 2 options (Sun or Moon based on time)
        const col1Options = isDaytime ? ['☀️', '🌕'] : ['🌑', '☀️'];
        grid[0] = shuffleArray([...col1Options]);
        answer[0] = col1Options[0];

        // Column 2: 3 options (Moon phases + one other)
        const moonPhases = ['🌑', '🌕'];
        const col2Options = [...moonPhases, '⭐️'];
        grid[1] = shuffleArray([...col2Options]);
        answer[1] = col2Options[Math.floor(Math.random() * col2Options.length)];

        // Columns 3-5: Random symbols
        for (let col = 2; col < 5; col++) {
            const numOptions = col + 2; // 4, 5, 6 options
            const shuffled = shuffleArray([...SYMBOLS]);
            grid[col] = shuffled.slice(0, numOptions);
            answer[col] = shuffled[Math.floor(Math.random() * numOptions)];
        }

        setGameGrid(grid);
        setCorrectAnswer(answer);
        setSelectedSymbols(PLACEHOLDER_SYMBOLS);
        setGuesses([]);
        setCorrectPositions([false, false, false, false, false]);
        setGameState('playing');
        setPreviousCorrectCount(0);
    };

    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    const handleSymbolSelect = (columnIndex: number, symbol: string) => {
        const newSelected = [...selectedSymbols];
        newSelected[columnIndex] = symbol;
        setSelectedSymbols(newSelected);
    };

    const isCheckEnabled = () => {
        return gameState === 'playing' && selectedSymbols.every(symbol => !PLACEHOLDER_SYMBOLS.includes(symbol));
    };

    const handleCheck = () => {
        if (!isCheckEnabled()) return;

        const newGuesses = [...guesses, [...selectedSymbols]];
        setGuesses(newGuesses);

        const newCorrectPositions = selectedSymbols.map((symbol, idx) =>
            symbol === correctAnswer[idx]
        );
        setCorrectPositions(newCorrectPositions);

        const correctCount = newCorrectPositions.filter(Boolean).length;

        // Check if all correct
        if (correctCount === 5) {
            setGameState('won');
        } else if (correctCount === previousCorrectCount) {
            // No new correct answers
            setGameState('lost');
        } else {
            // Some progress made, continue playing
            setPreviousCorrectCount(correctCount);
            // Reset selections for incorrect positions
            const newSelections = selectedSymbols.map((symbol, idx) =>
                newCorrectPositions[idx] ? symbol : PLACEHOLDER_SYMBOLS[idx]
            );
            setSelectedSymbols(newSelections);
        }
    };

    const renderGrid = () => {
        const maxRows = 6;
        const rows: JSX.Element[] = [];

        for (let row = 0; row < maxRows; row++) {
            const cells: JSX.Element[] = [];
            for (let col = 0; col < 5; col++) {
                const gridValue = gameGrid[col]?.[row];
                if (gridValue) {
                    cells.push(
                        <div
                            key={`${row}-${col}`}
                            className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl bg-gray-200 dark:bg-gray-700 rounded-lg"
                        >
                            {gridValue}
                        </div>
                    );
                } else {
                    cells.push(
                        <div
                            key={`${row}-${col}`}
                            className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl bg-black dark:bg-gray-900 rounded-lg"
                        >
                            ◼️
                        </div>
                    );
                }
            }
            rows.push(
                <div key={row} className="flex gap-2 sm:gap-3">
                    {cells}
                </div>
            );
        }

        // Add guess history rows
        guesses.forEach((guess, guessIdx) => {
            const cells = guess.map((symbol, colIdx) => (
                <div
                    key={`guess-${guessIdx}-${colIdx}`}
                    className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl bg-blue-500 rounded-lg"
                >
                    🟦
                </div>
            ));
            rows.push(
                <div key={`guess-row-${guessIdx}`} className="flex gap-2 sm:gap-3">
                    {cells}
                </div>
            );
        });

        return rows;
    };

    const getButtonOutlineClass = (colIdx: number) => {
        if (gameState === 'won') {
            return 'ring-4 ring-green-500';
        } else if (gameState === 'lost') {
            return 'ring-4 ring-red-500';
        } else if (guesses.length > 0 && correctPositions[colIdx]) {
            return 'ring-4 ring-cyan-400';
        }
        return '';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            <main className="w-full max-w-md flex flex-col items-center gap-6">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    Cover Up
                </h1>

                <div className="flex flex-col gap-2 sm:gap-3">
                    {renderGrid()}
                </div>

                <div className="flex gap-2 sm:gap-3 mt-4">
                    {selectedSymbols.map((symbol, colIdx) => (
                        <div key={colIdx} className="relative">
                            <select
                                value={symbol}
                                onChange={(e) => handleSymbolSelect(colIdx, e.target.value)}
                                disabled={gameState !== 'playing' || correctPositions[colIdx]}
                                className={`w-14 h-14 sm:w-16 sm:h-16 text-2xl sm:text-3xl bg-white dark:bg-gray-800 rounded-lg cursor-pointer appearance-none text-center border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${getButtonOutlineClass(colIdx)}`}
                            >
                                <option value={symbol}>{symbol}</option>
                                {gameGrid[colIdx]?.map((gridSymbol) => (
                                    gridSymbol !== symbol && (
                                        <option key={gridSymbol} value={gridSymbol}>
                                            {gridSymbol}
                                        </option>
                                    )
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                {gameState === 'lost' && (
                    <div className="text-center">
                        <p className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                            Game Over!
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Correct answer:
                        </p>
                        <div className="flex gap-2 justify-center mt-2">
                            {correctAnswer.map((symbol, idx) => (
                                <div
                                    key={idx}
                                    className="w-12 h-12 flex items-center justify-center text-2xl bg-green-100 dark:bg-green-900 rounded-lg"
                                >
                                    {symbol}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {gameState === 'won' && (
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        Congratulations! You won!
                    </p>
                )}

                <div className="flex flex-col gap-3 w-full">
                    <button
                        onClick={handleCheck}
                        disabled={!isCheckEnabled()}
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg"
                    >
                        Check
                    </button>
                    <button
                        onClick={initializeGame}
                        className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-lg"
                    >
                        Restart
                    </button>
                </div>
            </main>
        </div>
    );
}
