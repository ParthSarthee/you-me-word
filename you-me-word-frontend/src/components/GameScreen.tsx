import { useEffect, useRef, useState } from "react";
import { useGameStore } from "../store/gameStore";
import CellGrid from "./CellGrid";
import Keyboard from "./Keyboard";
import { saveMyState, fetchOpponentState } from "../lib/supabase";

const POLL_INTERVAL = 2000; // Poll every 2 seconds

function GameScreen() {
	const {
		gameCode,
		playerRole,
		word,
		myWords,
		myRowIndex,
		myGameOver,
		myWon,
		opponentJoined,
		opponentWords,
		opponentRowIndex,
		opponentGameOver,
		opponentWon,
		handleKeyPress,
		handleEnterPress,
		handleBackspacePress,
		resetGame,
		syncOpponentState,
	} = useGameStore();

	// Track shaking row for invalid word animation
	const [shakeRow, setShakeRow] = useState(-1);

	// Track last saved state to avoid unnecessary saves
	const lastSavedRef = useRef<string>("");

	// Check if game is decided (someone won, so no more input allowed)
	const isGameDecided = myWon || opponentWon || myGameOver;

	// Wrapped handlers that check if game is decided
	const wrappedHandleKeyPress = (letter: string) => {
		if (isGameDecided) return;
		handleKeyPress(letter);
	};

	const wrappedHandleEnterPress = () => {
		if (isGameDecided) return;
		const success = handleEnterPress();
		if (!success && useGameStore.getState().myColIndex === 5) {
			// Invalid word - trigger shake animation
			setShakeRow(myRowIndex);
			setTimeout(() => setShakeRow(-1), 500);
		}
	};

	const wrappedHandleBackspacePress = () => {
		if (isGameDecided) return;
		handleBackspacePress();
	};

	// Save my state to DB whenever it changes
	useEffect(() => {
		if (gameCode === null || !playerRole) return;

		const stateKey = JSON.stringify({ myWords, myRowIndex, myGameOver, myWon });
		if (stateKey === lastSavedRef.current) return; // Skip if unchanged

		saveMyState(gameCode, playerRole, myWords, myRowIndex, myGameOver, myWon);
		lastSavedRef.current = stateKey;
	}, [gameCode, playerRole, myWords, myRowIndex, myGameOver, myWon]);

	// Poll for opponent's state
	useEffect(() => {
		if (gameCode === null || !playerRole) return;

		const pollOpponent = async () => {
			const data = await fetchOpponentState(gameCode, playerRole);
			if (data) {
				syncOpponentState(data.words, data.row_index, data.game_over, data.won);
			}
		};

		// Initial fetch
		pollOpponent();

		// Set up polling interval
		const intervalId = setInterval(pollOpponent, POLL_INTERVAL);

		return () => clearInterval(intervalId);
	}, [gameCode, playerRole, syncOpponentState]);

	// Handle physical keyboard input
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Enter") {
				wrappedHandleEnterPress();
			} else if (e.key === "Backspace") {
				wrappedHandleBackspacePress();
			} else if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
				wrappedHandleKeyPress(e.key.toUpperCase());
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	});

	const copyGameCode = () => {
		if (gameCode !== null) {
			navigator.clipboard.writeText(gameCode.toString());
			alert("Game code copied!");
		}
	};

	// Determine game result
	const getGameResult = () => {
		const wordString = word.join("");

		// Both players still playing
		if (!myGameOver && !opponentGameOver) return null;

		// I won first (opponent hasn't won yet)
		if (myWon && !opponentWon) {
			return {
				type: "win",
				message: `You won! The word was "${wordString}"`,
			};
		}

		// Opponent won first
		if (opponentWon && !myWon) {
			return {
				type: "lose",
				message: `You lost. The word was "${wordString}"`,
			};
		}

		// Both won (rare - same time)
		if (myWon && opponentWon) {
			return {
				type: "tie",
				message: `It's a tie. The word was "${wordString}"`,
			};
		}

		// I exhausted guesses without winning
		if (myGameOver && !myWon) {
			// If opponent also exhausted, both lose
			if (opponentGameOver && !opponentWon) {
				return {
					type: "both-lose",
					message: `You both lost. The word was "${wordString}"`,
				};
			}
			// Opponent still playing, I lost
			return {
				type: "lose",
				message: `You lost. The word was "${wordString}"`,
			};
		}

		return null;
	};

	const gameResult = getGameResult();

	// Compute letter statuses for keyboard coloring
	const getLetterStatuses = (): Record<
		string,
		"correct" | "present" | "absent" | "unused"
	> => {
		const statuses: Record<
			string,
			"correct" | "present" | "absent" | "unused"
		> = {};

		// Go through all submitted rows
		for (let row = 0; row < myRowIndex; row++) {
			const rowWord = myWords[row];
			for (let col = 0; col < 5; col++) {
				const letter = rowWord[col];
				if (!letter) continue;

				const isCorrect = word[col] === letter;
				const isPresent = word.includes(letter);

				// Only upgrade status, never downgrade (correct > present > absent)
				if (isCorrect) {
					statuses[letter] = "correct";
				} else if (isPresent && statuses[letter] !== "correct") {
					statuses[letter] = "present";
				} else if (!statuses[letter]) {
					statuses[letter] = "absent";
				}
			}
		}

		return statuses;
	};

	const letterStatuses = getLetterStatuses();

	return (
		<div className="w-full h-screen flex flex-col items-center px-2 py-2 gap-2 lg:gap-4 justify-between relative">
			{/* Header with game code and back button - floating */}
			<div className="absolute top-2 left-2 right-2 flex items-center justify-between px-2 z-10">
				<button
					onClick={resetGame}
					className="text-gray-500 hover:text-gray-700 font-medium bg-white/80 backdrop-blur-sm px-2 py-1 rounded"
				>
					← Back
				</button>
				<button
					onClick={copyGameCode}
					className="bg-white/80 backdrop-blur-sm hover:bg-gray-200 px-3 py-1 rounded text-sm font-mono text-gray-500"
				>
					#{gameCode}
				</button>
			</div>

			{/* Grids container - stacked on mobile, side by side on desktop */}
			<div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-2 lg:gap-12 w-full">
				{/* My own grid - shows first on mobile, left on desktop */}
				<div className="text-center order-2 lg:order-1">
					<p className="text-xs text-gray-400 mb-1 hidden lg:block">Me</p>
					<CellGrid
						cellStyle="w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 border-2 border-gray-300 text-xl sm:text-2xl"
						words={myWords}
						word={word}
						rowIndex={myRowIndex}
						showColors={true}
						shakeRow={shakeRow}
					/>
				</div>

				{/* Opponent's grid - shows second on mobile (top), right on desktop */}
				<div className="text-center order-1 lg:order-2">
					<p className="text-xs text-gray-400 mb-1">
						You {!opponentJoined && "(not joined)"}
					</p>
					<CellGrid
						cellStyle="w-5 h-4 lg:w-14 lg:h-14 border border-gray-300 text-xs lg:text-2xl"
						words={opponentWords}
						word={word}
						rowIndex={opponentRowIndex}
						showColors={true}
						hideLetters={true}
					/>
				</div>
			</div>

			{/* Bottom section - Keyboard or Status messages */}
			{!opponentJoined ? (
				<div className="flex items-center justify-center py-8">
					<div className="bg-gray-100 border border-gray-300 rounded-lg px-6 py-4 text-gray-700 text-center shadow-lg">
						<p className="text-lg font-medium">
							Waiting for opponent to join...
						</p>
						<p className="text-sm mt-1">
							Share the code{" "}
							<span className="font-mono font-bold">#{gameCode}</span> with your
							partner
						</p>
					</div>
				</div>
			) : gameResult ? (
				<div className="flex items-center justify-center py-8">
					<div className="text-center py-4 px-8 rounded-lg shadow-lg bg-gray-100 text-gray-700 border border-gray-300">
						<p className="font-bold text-lg lg:text-xl">{gameResult.message}</p>
					</div>
				</div>
			) : (
				<Keyboard
					handleKeyPress={wrappedHandleKeyPress}
					handleEnterPress={wrappedHandleEnterPress}
					handleBackspacePress={wrappedHandleBackspacePress}
					letterStatuses={letterStatuses}
				/>
			)}
		</div>
	);
}

export default GameScreen;
