'use client';

import { useState, useEffect, JSX } from 'react';

const SYMBOLS = ['🌑', '🌕', '⭐️', '☀️', '☁️', '💧', '❤️', '♦️', '♠️', '♣️'];
const PLACEHOLDER_SYMBOLS = ['☸️', '✝️', '♒️', '♈️', '☮️', '🛑', '❇️', '✳️', '🛗', '🛜', '📶', '🎦'];

type GameState = 'playing' | 'won' | 'lost';

export default function Home() {
    const [gameGrid, setGameGrid] = useState<string[][]>([]);
    const [correctAnswer, setCorrectAnswer] = useState<string[]>([]);
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>(['S', 'T', 'A', 'R', 'T']);
    const [coveredSymbols, setCoveredSymbols] = useState<Set<string>[]>([new Set(), new Set(), new Set(), new Set(), new Set()]);
    const [correctPositions, setCorrectPositions] = useState<boolean[]>([false, false, false, false, false]);
    const [gameState, setGameState] = useState<GameState>('playing');
    const [previousCorrectCount, setPreviousCorrectCount] = useState(0);
    const [lastCheckedSymbols, setLastCheckedSymbols] = useState<string[]>([]);
    const [showAbout, setShowAbout] = useState(false);
    const [stats, setStats] = useState({ attempts: 0, wins: 0 });

    useEffect(() => {
        const stored = localStorage.getItem('coverup-stats');
        if (stored) {
            setStats(JSON.parse(stored));
        }
    }, []);

    const recordStat = (won: boolean) => {
        setStats(prev => {
            const updated = { attempts: prev.attempts + 1, wins: prev.wins + (won ? 1 : 0) };
            localStorage.setItem('coverup-stats', JSON.stringify(updated));
            return updated;
        });
    };

    const resetStats = () => {
        const cleared = { attempts: 0, wins: 0 };
        setStats(cleared);
        localStorage.setItem('coverup-stats', JSON.stringify(cleared));
    };

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

        let starterSymbols = []
        for (let ss = 0; ss < 5; ss++){
            const shuffledStarters = shuffleArray([...PLACEHOLDER_SYMBOLS]);
            starterSymbols.push(shuffledStarters[Math.floor(Math.random() * shuffledStarters.length)])
        }

        setGameGrid(grid);
        setCorrectAnswer(answer);
        setSelectedSymbols(starterSymbols);
        setCoveredSymbols([new Set(), new Set(), new Set(), new Set(), new Set()]);
        setCorrectPositions([false, false, false, false, false]);
        setGameState('playing');
        setPreviousCorrectCount(0);
        setLastCheckedSymbols([]);
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
        if (gameState !== 'playing') return false;

        // Check each column
        for (let i = 0; i < 5; i++) {
            // Skip columns that are already correct
            if (correctPositions[i]) continue;

            const symbol = selectedSymbols[i];

            // Must not be a placeholder
            if (PLACEHOLDER_SYMBOLS.includes(symbol)) return false;

            // If we've checked before, must be a new selection for incorrect positions
            if (lastCheckedSymbols.length > 0 && symbol === lastCheckedSymbols[i]) {
                return false;
            }
        }

        return true;
    };

    const handleCheck = () => {
        if (!isCheckEnabled()) return;

        // Save the symbols we're checking
        setLastCheckedSymbols([...selectedSymbols]);

        // Mark selected symbols as covered in each column
        const newCoveredSymbols = coveredSymbols.map((set, idx) => {
            const newSet = new Set(set);
            newSet.add(selectedSymbols[idx]);
            return newSet;
        });
        setCoveredSymbols(newCoveredSymbols);

        const newCorrectPositions = selectedSymbols.map((symbol, idx) =>
            symbol === correctAnswer[idx]
        );
        setCorrectPositions(newCorrectPositions);

        const correctCount = newCorrectPositions.filter(Boolean).length;

        // Check if all correct
        if (correctCount === 5) {
            setGameState('won');
            recordStat(true);
        } else if (correctCount === previousCorrectCount) {
            // No new correct answers
            setGameState('lost');
            recordStat(false);
        } else {
            // Some progress made, continue playing
            setPreviousCorrectCount(correctCount);
            // Keep current selections - no reset needed
        }
    };

    const renderGrid = () => {
        const maxRows = 6;
        const rows: JSX.Element[] = [];

        for (let row = maxRows - 1; row >= 0; row--) {
            const cells: JSX.Element[] = [];
            for (let col = 0; col < 5; col++) {
                const gridValue = gameGrid[col]?.[row];
                if (gridValue) {
                    // Check if this symbol has been covered (guessed)
                    const isCovered = coveredSymbols[col]?.has(gridValue);
                    cells.push(
                        <div
                            key={`${row}-${col}`}
                            className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-3xl ${
                                isCovered ? 'bg-blue-500' : 'bg-[#F8EA66]'
                            }`}
                        >
                            {isCovered ? '🟦' : gridValue}
                        </div>
                    );
                } else {
                    cells.push(
                        <div
                            key={`${row}-${col}`}
                            className="w-14 h-14 sm:w-16 sm:h-16"
                        >
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

        return rows;
    };

    const getButtonOutlineClass = (colIdx: number) => {
        if (gameState === 'won') {
            return 'ring-4 ring-green-500';
        } else if (gameState === 'lost') {
            return 'ring-4 ring-red-500';
        } else if (coveredSymbols[colIdx]?.size > 0 && correctPositions[colIdx]) {
            return 'ring-4 ring-cyan-400';
        }
        return '';
    };

    const getAvailableOptions = (colIdx: number): string[] => {
        const columnSymbols = gameGrid[colIdx] || [];
        const covered = coveredSymbols[colIdx] || new Set();

        // Filter out symbols that have already been covered (guessed)
        return columnSymbols.filter(symbol => !covered.has(symbol));
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <main className="w-full max-w-md flex flex-col items-center gap-6">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                    <em><span style={{color: '#FFFF00'}}>Symbolic Cover Up</span></em>
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
                                className={`w-14 h-14 sm:w-16 sm:h-16 text-2xl sm:text-3xl bg-[#F8EA66] cursor-pointer appearance-none text-center border-2 border-gray-300 hover:border-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${getButtonOutlineClass(colIdx)}`}
                            >
                                <option value={symbol}>{symbol}</option>
                                {getAvailableOptions(colIdx).map((gridSymbol) => (
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
                                    className="w-12 h-12 flex items-center justify-center text-2xl bg-green-100 dark:bg-green-900"
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
                    <button
                        onClick={() => setShowAbout(true)}
                        className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-lg"
                    >
                        About
                    </button>
                </div>

                {showAbout && (
                    <div
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowAbout(false)}
                    >
                        <div
                            className="bg-white text-gray-900 rounded-lg p-6 max-w-sm w-full shadow-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 className="text-xl font-bold mb-3">About</h2>
                            <p className="mb-4">
                                A simple symbolic simulator of the classic pricing game <strong>Cover Up</strong> from
                                {' '}<em>The Price is Right</em>.
                            </p>
                            <p className="mb-4">
                                Built by{' '}
                                <a
                                    href="https://jpTheSmithe.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 underline hover:text-blue-800"
                                >
                                    jpTheSmithe.com
                                </a>
                            </p>
                            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                                <h3 className="font-bold mb-2">Stats</h3>
                                <p>Games played: {stats.attempts}</p>
                                <p>Wins: {stats.wins}</p>
                                <p>Win rate: {stats.attempts > 0 ? Math.round((stats.wins / stats.attempts) * 100) : 0}%</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={resetStats}
                                    className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Reset Stats
                                </button>
                                <button
                                    onClick={() => setShowAbout(false)}
                                    className="w-full py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
