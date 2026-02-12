import { twMerge } from "tailwind-merge";

// Calculate letter statuses for a submitted row
function getLetterStatuses(
	rowWords: string[],
	word: string[],
): ("correct" | "present" | "absent")[] {
	const statuses: ("correct" | "present" | "absent")[] = [];
	const wordCopy = [...word];
	const used = new Array(5).fill(false);

	// First pass: mark correct letters
	for (let i = 0; i < 5; i++) {
		if (rowWords[i] === wordCopy[i]) {
			statuses[i] = "correct";
			used[i] = true;
		}
	}

	// Second pass: mark present/absent letters
	for (let i = 0; i < 5; i++) {
		if (statuses[i]) continue;

		const letterIndex = wordCopy.findIndex(
			(letter, idx) => letter === rowWords[i] && !used[idx],
		);

		if (letterIndex !== -1) {
			statuses[i] = "present";
			used[letterIndex] = true;
		} else {
			statuses[i] = "absent";
		}
	}

	return statuses;
}

function CellGrid({
	cellStyle,
	words,
	word,
	rowIndex,
	showColors = false,
	hideLetters = false,
	shakeRow = -1,
}: {
	cellStyle: string;
	words: string[][];
	word: string[];
	rowIndex: number;
	showColors?: boolean;
	hideLetters?: boolean;
	shakeRow?: number;
}) {
	return (
		<div className="flex justify-center items-center">
			<div className="flex flex-col gap-1 max-w-sm">
				{Array.from({ length: 6 }, (_, i) => (
					<CellRow
						key={i}
						cellStyle={cellStyle}
						row={i}
						words={words}
						word={word}
						rowIndex={rowIndex}
						showColors={showColors}
						hideLetters={hideLetters}
						isShaking={i === shakeRow}
					/>
				))}
			</div>
		</div>
	);
}

function CellRow({
	cellStyle,
	row,
	words,
	word,
	rowIndex,
	showColors,
	hideLetters,
	isShaking = false,
}: {
	cellStyle: string;
	row: number;
	words: string[][];
	word: string[];
	rowIndex: number;
	showColors: boolean;
	hideLetters: boolean;
	isShaking?: boolean;
}) {
	// Calculate statuses for submitted rows
	const isSubmitted = row < rowIndex;
	const statuses = isSubmitted ? getLetterStatuses(words[row], word) : null;

	return (
		<div
			className={`flex flex-row items-center gap-1 ${isShaking ? "animate-shake" : ""}`}
		>
			{Array.from({ length: 5 }, (_, i) => (
				<Cell
					key={i}
					style={cellStyle}
					value={hideLetters ? "" : words[row][i]}
					status={statuses ? statuses[i] : undefined}
					showColors={showColors && isSubmitted}
					hasContent={words[row][i] !== ""}
					isShaking={isShaking}
				/>
			))}
		</div>
	);
}

function Cell({
	style = "",
	value = "",
	status,
	showColors,
	hasContent = false,
	isShaking = false,
}: {
	style?: string;
	value?: string;
	status?: "correct" | "present" | "absent";
	showColors?: boolean;
	hasContent?: boolean;
	isShaking?: boolean;
}) {
	let colorStyle = "";

	if (isShaking) {
		colorStyle = "border-red-500";
	} else if (showColors && status) {
		switch (status) {
			case "correct":
				colorStyle = "bg-green-500 border-green-500 text-white";
				break;
			case "present":
				colorStyle = "bg-yellow-500 border-yellow-500 text-white";
				break;
			case "absent":
				colorStyle = "bg-gray-500 border-gray-500 text-white";
				break;
		}
	} else if (value !== "" || hasContent) {
		colorStyle = "border-gray-500";
	}

	const defaultStyle = "flex justify-center items-center font-bold";

	const finalStyle = twMerge(defaultStyle, style, colorStyle);
	return <div className={finalStyle}>{value}</div>;
}

export default CellGrid;
