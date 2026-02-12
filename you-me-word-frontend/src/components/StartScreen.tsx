import { useState } from "react";
import { useGameStore } from "../store/gameStore";

function StartScreen() {
	const [codeInput, setCodeInput] = useState("");
	const [showCodeInput, setShowCodeInput] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [createError, setCreateError] = useState(false);

	const startNewGame = useGameStore((state) => state.startNewGame);
	const joinGame = useGameStore((state) => state.joinGame);

	const handleNewGame = async () => {
		setIsCreating(true);
		setCreateError(false);
		const success = await startNewGame();
		if (!success) {
			setCreateError(true);
		}
		setIsCreating(false);
	};

	const handleJoinGame = () => {
		const code = parseInt(codeInput, 10);
		if (isNaN(code)) {
			alert("Please enter a valid number");
			return;
		}
		joinGame(code);
	};

	return (
		<div className="w-full h-screen flex flex-col items-center justify-center gap-8 px-4">
			<div className="text-center">
				<h1 className="text-4xl font-bold text-gray-700 mb-2">YouMe & Word</h1>
				<p className="text-gray-500">Made by Parth with ♥️ for Janhvi</p>
			</div>

			<div className="flex flex-col gap-4 w-full max-w-xs">
				<button
					onClick={handleNewGame}
					disabled={isCreating}
					className="w-full py-4 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-400 text-white font-bold rounded-lg text-lg transition-colors"
				>
					{isCreating ? "Creating..." : "New Game"}
				</button>

				{createError && (
					<p className="text-red-500 text-sm text-center">
						Failed to create game. Please try again.
					</p>
				)}

				{!showCodeInput ? (
					<button
						onClick={() => setShowCodeInput(true)}
						className="w-full py-4 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-lg text-lg transition-colors"
					>
						Join Game
					</button>
				) : (
					<div className="flex flex-col gap-2">
						<input
							type="text"
							value={codeInput}
							onChange={(e) => setCodeInput(e.target.value)}
							placeholder="Enter game code"
							className="w-full py-3 px-4 border-2 border-gray-300 rounded-lg text-lg text-center focus:border-gray-500 focus:outline-none"
							autoFocus
						/>
						<div className="flex gap-2">
							<button
								onClick={() => setShowCodeInput(false)}
								className="flex-1 py-3 bg-gray-300 hover:bg-gray-400 font-bold rounded-lg transition-colors"
							>
								Cancel
							</button>
							<button
								onClick={handleJoinGame}
								className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
							>
								Join
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default StartScreen;
