import { create } from "zustand";
import solutionWordsArray from "../assets/solution_words.json";
import wordleWordsArray from "../assets/wordle_words.json";
import { generateUniqueGameCode, cleanupOldGames } from "../lib/supabase";

const wordleWords = new Set(wordleWordsArray);

export type GameScreen = "start" | "game";
export type PlayerRole = "host" | "guest";

interface GameState {
	// Screen state
	screen: GameScreen;

	// Game identification
	gameCode: number | null;
	playerRole: PlayerRole | null;

	// The word to guess
	word: string[];

	// My game state
	myWords: string[][];
	myRowIndex: number;
	myColIndex: number;
	myGameOver: boolean;
	myWon: boolean;

	// Opponent's game state (synced via Supabase)
	opponentJoined: boolean;
	opponentWords: string[][];
	opponentRowIndex: number;
	opponentGameOver: boolean;
	opponentWon: boolean;

	// Actions
	startNewGame: () => Promise<boolean>; // returns true if successful
	joinGame: (code: number) => void;
	handleKeyPress: (letter: string) => void;
	handleEnterPress: () => boolean; // returns true if word was valid
	handleBackspacePress: () => void;
	resetGame: () => void;

	// Sync actions (called from Supabase listeners)
	syncOpponentState: (
		words: string[][],
		rowIndex: number,
		gameOver: boolean,
		won: boolean,
	) => void;
}

const emptyGrid = (): string[][] => [
	["", "", "", "", ""],
	["", "", "", "", ""],
	["", "", "", "", ""],
	["", "", "", "", ""],
	["", "", "", "", ""],
	["", "", "", "", ""],
];

export const useGameStore = create<GameState>((set, get) => ({
	// Initial state
	screen: "start",
	gameCode: null,
	playerRole: null,
	word: [],
	myWords: emptyGrid(),
	myRowIndex: 0,
	myColIndex: 0,
	myGameOver: false,
	myWon: false,
	opponentJoined: false,
	opponentWords: emptyGrid(),
	opponentRowIndex: 0,
	opponentGameOver: false,
	opponentWon: false,

	startNewGame: async () => {
		// Clean up old games first
		await cleanupOldGames();

		// Generate a unique game code
		const code = await generateUniqueGameCode(solutionWordsArray.length);

		// If code generation failed, return false
		if (code === null) {
			return false;
		}

		// Ensure code is within bounds
		const safeCode = Math.min(code, solutionWordsArray.length - 1);
		const word = solutionWordsArray[safeCode].toUpperCase().split("");

		set({
			screen: "game",
			gameCode: safeCode,
			playerRole: "host",
			word,
			myWords: emptyGrid(),
			myRowIndex: 0,
			myColIndex: 0,
			myGameOver: false,
			myWon: false,
			opponentJoined: false,
			opponentWords: emptyGrid(),
			opponentRowIndex: 0,
			opponentGameOver: false,
			opponentWon: false,
		});

		return true;
	},

	joinGame: (code: number) => {
		if (code < 0 || code >= solutionWordsArray.length) {
			alert("Invalid game code!");
			return;
		}

		const word = solutionWordsArray[code].toUpperCase().split("");

		set({
			screen: "game",
			gameCode: code,
			playerRole: "guest",
			word,
			myWords: emptyGrid(),
			myRowIndex: 0,
			myColIndex: 0,
			myGameOver: false,
			myWon: false,
			opponentJoined: false,
			opponentWords: emptyGrid(),
			opponentRowIndex: 0,
			opponentGameOver: false,
			opponentWon: false,
		});
	},

	handleKeyPress: (letter: string) => {
		const { myColIndex, myRowIndex, myGameOver, opponentJoined } = get();
		if (!opponentJoined) return;
		if (myGameOver) return;
		if (myColIndex === 5) return;

		set((state) => {
			const newWords = state.myWords.map((row) => [...row]);
			newWords[myRowIndex][myColIndex] = letter;
			return {
				myWords: newWords,
				myColIndex: myColIndex + 1,
			};
		});
	},

	handleEnterPress: () => {
		const {
			myRowIndex,
			myColIndex,
			myWords,
			word,
			myGameOver,
			opponentJoined,
		} = get();
		if (!opponentJoined) return false;
		if (myGameOver) return false;
		if (myColIndex < 5) return false;

		// Check if word exists in valid words list
		const currentWord = myWords[myRowIndex].join("").toLowerCase();
		if (!wordleWords.has(currentWord)) {
			return false;
		}

		// Check if player won
		const won = currentWord === word.join("").toLowerCase();
		const gameOver = won || myRowIndex === 5;

		set({
			myRowIndex: myRowIndex + 1,
			myColIndex: 0,
			myWon: won,
			myGameOver: gameOver,
		});

		return true;
	},

	handleBackspacePress: () => {
		const { myColIndex, myRowIndex, myGameOver } = get();
		if (myGameOver) return;
		if (myColIndex === 0) return;

		set((state) => {
			const newWords = state.myWords.map((row) => [...row]);
			newWords[myRowIndex][myColIndex - 1] = "";
			return {
				myWords: newWords,
				myColIndex: myColIndex - 1,
			};
		});
	},

	resetGame: () => {
		set({
			screen: "start",
			gameCode: null,
			playerRole: null,
			word: [],
			myWords: emptyGrid(),
			myRowIndex: 0,
			myColIndex: 0,
			myGameOver: false,
			myWon: false,
			opponentJoined: false,
			opponentWords: emptyGrid(),
			opponentRowIndex: 0,
			opponentGameOver: false,
			opponentWon: false,
		});
	},

	syncOpponentState: (words, rowIndex, gameOver, won) => {
		set({
			opponentJoined: true,
			opponentWords: words,
			opponentRowIndex: rowIndex,
			opponentGameOver: gameOver,
			opponentWon: won,
		});
	},
}));
