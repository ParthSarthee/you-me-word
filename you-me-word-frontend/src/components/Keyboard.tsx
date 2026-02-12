type LetterStatus = "correct" | "present" | "absent" | "unused";

function Keyboard({
	handleKeyPress,
	handleEnterPress,
	handleBackspacePress,
	letterStatuses,
}: {
	handleKeyPress: (letter: string) => void;
	handleEnterPress: () => void;
	handleBackspacePress: () => void;
	letterStatuses: Record<string, LetterStatus>;
}) {
	const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
	const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
	const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

	return (
		<div className="w-full max-w-lg flex flex-col gap-2 pb-2">
			{/* First row */}
			<div className="flex flex-row gap-1 justify-center">
				{row1.map((letter) => (
					<Key
						handleKeyPress={handleKeyPress}
						key={letter}
						letter={letter}
						status={letterStatuses[letter]}
					/>
				))}
			</div>

			{/* Second row */}
			<div className="flex flex-row gap-1 justify-center">
				{row2.map((letter) => (
					<Key
						handleKeyPress={handleKeyPress}
						key={letter}
						letter={letter}
						status={letterStatuses[letter]}
					/>
				))}
			</div>

			{/* Third row */}
			<div className="flex flex-row gap-1 justify-center">
				<Key handleKeyPress={handleEnterPress} letter="ENTER" isWide />
				{row3.map((letter) => (
					<Key
						handleKeyPress={handleKeyPress}
						key={letter}
						letter={letter}
						status={letterStatuses[letter]}
					/>
				))}
				<Key handleKeyPress={handleBackspacePress} letter="⌫" isWide />
			</div>
		</div>
	);
}

function Key({
	letter = "",
	isWide = false,
	handleKeyPress,
	status = "unused",
}: {
	letter: string;
	isWide?: boolean;
	handleKeyPress?: (letter: string) => void;
	status?: LetterStatus;
}) {
	function handleClick() {
		if (handleKeyPress) {
			handleKeyPress(letter);
		}
	}

	const getKeyColor = () => {
		switch (status) {
			case "correct":
				return "bg-green-500 hover:bg-green-600 text-white";
			case "present":
				return "bg-yellow-500 hover:bg-yellow-600 text-white";
			case "absent":
				return "bg-gray-600 hover:bg-gray-700 text-white";
			default:
				return "bg-gray-300 hover:bg-gray-400 text-black";
		}
	};

	return (
		<button
			onClick={handleClick}
			className={`${
				isWide ? "w-14 sm:w-16" : "w-10 sm:w-14"
			} h-12 sm:h-14 ${getKeyColor()} rounded font-bold ${
				letter === "ENTER" ? "text-xs sm:text-sm" : "text-sm sm:text-base"
			} flex items-center justify-center transition-colors`}
		>
			{letter}
		</button>
	);
}

export default Keyboard;
