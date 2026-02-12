import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { twMerge } from "tailwind-merge";

function App() {
	const [rowIndex, setRowIndex] = useState<number>(0);
	const [colIndex, setColIndex] = useState<number>(0);
	const [word, setWord] = useState<string[]>(["A", "P", "P", "L", "E"]);
	const [words, setWords] = useState<string[][]>([
		["", "", "", "", ""],
		["", "", "", "", ""],
		["", "", "", "", ""],
		["", "", "", "", ""],
		["", "", "", "", ""],
		["", "", "", "", ""],
	]);

	useEffect(() => {
		console.log(`Row: ${rowIndex}, Col: ${colIndex}`);
		console.log(words.toString());
	}, [words, rowIndex, colIndex]);

	function handleKeyPress(letter: string) {
		if (letter === "ENTER") {
			if (rowIndex === 5) return;
			if (colIndex < 5) return;
			setRowIndex((prevRowIndex) => prevRowIndex + 1);
			setColIndex(0);
			return;
		}

		if (letter === "⌫") {
			setWords((prevWords) => {
				const newWords = [...prevWords];
				newWords[rowIndex][Math.max(colIndex - 1, 0)] = "";
				return newWords;
			});

			if (colIndex !== 0) setColIndex((prevColIndex) => prevColIndex - 1);

			return;
		}

		if (colIndex === 5) return;

		setWords((prevWords) => {
			const newWords = [...prevWords];
			newWords[rowIndex][colIndex] = letter;
			return newWords;
		});

		if (colIndex < 5) {
			setColIndex((prevColIndex) => prevColIndex + 1);
		}
	}

	return (
		<>
			<div className="w-full h-screen flex flex-col items-center px-2 py-4 gap-4 justify-between">
				{/* Opponent's grid */}
				<CellGrid
					cellStyle="w-6 h-4 border border-gray-300"
					words={words}
					rowIndex={rowIndex}
					colIndex={colIndex}
				/>

				{/* My own grid */}
				<div className="flex-1 flex items-center">
					<CellGrid
						cellStyle="w-12 h-12 border-2 border-gray-300"
						words={words}
						rowIndex={rowIndex}
						colIndex={colIndex}
					/>
				</div>

				<Keyboard handleKeyPress={handleKeyPress} />
			</div>
		</>
	);
}

function CellGrid({
	cellStyle,
	words,
	rowIndex,
	colIndex,
}: {
	cellStyle: string;
	words: string[][];
	rowIndex: number;
	colIndex: number;
}) {
	return (
		<div className="flex justify-center items-center">
			<div className="flex flex-col gap-1 max-w-sm">
				<CellRow
					cellStyle={cellStyle}
					row={0}
					words={words}
					rowIndex={rowIndex}
					colIndex={colIndex}
				/>
				<CellRow
					cellStyle={cellStyle}
					row={1}
					words={words}
					rowIndex={rowIndex}
					colIndex={colIndex}
				/>
				<CellRow
					cellStyle={cellStyle}
					row={2}
					words={words}
					rowIndex={rowIndex}
					colIndex={colIndex}
				/>
				<CellRow
					cellStyle={cellStyle}
					row={3}
					words={words}
					rowIndex={rowIndex}
					colIndex={colIndex}
				/>
				<CellRow
					cellStyle={cellStyle}
					row={4}
					words={words}
					rowIndex={rowIndex}
					colIndex={colIndex}
				/>
				<CellRow
					cellStyle={cellStyle}
					row={5}
					words={words}
					rowIndex={rowIndex}
					colIndex={colIndex}
				/>
			</div>
		</div>
	);
}

function CellRow({
	cellStyle,
	row,
	words,
	rowIndex,
	colIndex,
}: {
	cellStyle: string;
	row: number;
	words: string[][];
	rowIndex: number;
	colIndex: number;
}) {
	return (
		<div className="flex flex-row items-center gap-1">
			<Cell
				style={cellStyle}
				row={row}
				col={0}
				value={words[row][0]}
				rowIndex={rowIndex}
				colIndex={colIndex}
			/>
			<Cell
				style={cellStyle}
				row={row}
				col={1}
				value={words[row][1]}
				rowIndex={rowIndex}
				colIndex={colIndex}
			/>
			<Cell
				style={cellStyle}
				row={row}
				col={2}
				value={words[row][2]}
				rowIndex={rowIndex}
				colIndex={colIndex}
			/>
			<Cell
				style={cellStyle}
				row={row}
				col={3}
				value={words[row][3]}
				rowIndex={rowIndex}
				colIndex={colIndex}
			/>
			<Cell
				style={cellStyle}
				row={row}
				col={4}
				value={words[row][4]}
				rowIndex={rowIndex}
				colIndex={colIndex}
			/>
		</div>
	);
}

function Cell({
	style = "",
	value = "",
	row,
	col,
	rowIndex,
	colIndex,
}: {
	style?: string;
	value?: string;
	row: number;
	col: number;
	rowIndex: number;
	colIndex: number;
}) {
	if (value !== "") {
		style = twMerge(style, "border-gray-500");
	}

	const defaultStyle =
		"w-12 h-12 border-2 border-gray-300 flex justify-center items-center p-1 text-3xl font-bold text-gray-500";
	const finalStyle = twMerge(defaultStyle, style);

	return <div className={finalStyle}>{value}</div>;
}

function Keyboard({
	handleKeyPress,
}: {
	handleKeyPress: (letter: string) => void;
}) {
	const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
	const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
	const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

	return (
		<div className="w-full max-w-lg flex flex-col gap-2 pb-2">
			{/* First row */}
			<div className="flex flex-row gap-1 justify-center">
				{row1.map((letter) => (
					<Key handleKeyPress={handleKeyPress} key={letter} letter={letter} />
				))}
			</div>

			{/* Second row */}
			<div className="flex flex-row gap-1 justify-center">
				{row2.map((letter) => (
					<Key handleKeyPress={handleKeyPress} key={letter} letter={letter} />
				))}
			</div>

			{/* Third row */}
			<div className="flex flex-row gap-1 justify-center">
				<Key handleKeyPress={handleKeyPress} letter="ENTER" isWide />
				{row3.map((letter) => (
					<Key handleKeyPress={handleKeyPress} key={letter} letter={letter} />
				))}
				<Key handleKeyPress={handleKeyPress} letter="⌫" isWide />
			</div>
		</div>
	);
}

function Key({
	letter = "",
	isWide = false,
	handleKeyPress,
}: {
	letter: string;
	isWide?: boolean;
	handleKeyPress?: (letter: string) => void;
}) {
	function handleClick() {
		if (handleKeyPress) {
			handleKeyPress(letter);
		}
	}

	return (
		<button
			onClick={handleClick}
			className={`${
				isWide ? "w-14 sm:w-16" : "w-10 sm:w-14"
			} h-12 sm:h-14 bg-gray-300 hover:bg-gray-400 rounded font-bold ${
				letter === "ENTER" ? "text-xs sm:text-sm" : "text-sm sm:text-base"
			} flex items-center justify-center transition-colors`}
		>
			{letter}
		</button>
	);
}

export default App;
