import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
	// const [count, setCount] = useState(0);

	return (
		<>
			<div className="w-full h-screen flex flex-col items-center px-2 py-4 gap-4 justify-between">
				{/* <h1>you, me and word</h1> */}

				{/* <div className="flex flex-row justify-center gap-4">
					<CellGrid cellStyle="w-4 h-4 border border-gray-300" />
					<div className="flex flex-col gap-2">
						<div className="flex flex-row gap-2">
							<Cell style="w-11 h-11 bg-green-200" />
							<Cell style="w-11 h-11 bg-orange-200" />
						</div>
						<div className="flex flex-row gap-2">
							<Cell style="w-11 h-11 bg-gray-200" />
							<Cell style="w-11 h-11 border-2 border-gray-200" />
						</div>
					</div>
				</div> */}

				{/* Opponent's grid */}
				<CellGrid cellStyle="w-6 h-6 border border-gray-300" />

				{/* My own grid */}
				<div className="flex-1 flex items-center">
					<CellGrid />
				</div>

				<Keyboard />
			</div>
		</>
	);
}

function CellGrid({ cellStyle = "w-12 h-12 border-2 border-gray-300" }) {
	return (
		<div className="flex justify-center items-center">
			<div className="flex flex-col gap-1 max-w-sm">
				<CellRow cellStyle={cellStyle} />
				<CellRow cellStyle={cellStyle} />
				<CellRow cellStyle={cellStyle} />
				<CellRow cellStyle={cellStyle} />
				<CellRow cellStyle={cellStyle} />
			</div>
		</div>
	);
}

function CellRow({ cellStyle = "w-12 h-12 border-2 border-gray-300" }) {
	return (
		<div className="flex flex-row items-center gap-1">
			<Cell style={cellStyle} />
			<Cell style={cellStyle} />
			<Cell style={cellStyle} />
			<Cell style={cellStyle} />
			<Cell style={cellStyle} />
		</div>
	);
}

function Cell({ style = "w-12 h-12 border-2 border-gray-300", value = "" }) {
	return (
		<div
			className={`${style} flex justify-center items-center p-1 text-3xl font-bold`}
		>
			{value}
		</div>
	);
}

function Keyboard() {
	const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
	const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
	const row3 = ["Z", "X", "C", "V", "B", "N", "M"];

	return (
		<div className="w-full max-w-lg flex flex-col gap-2 pb-2">
			{/* First row */}
			<div className="flex flex-row gap-1 justify-center">
				{row1.map((letter) => (
					<Key key={letter} letter={letter} />
				))}
			</div>

			{/* Second row */}
			<div className="flex flex-row gap-1 justify-center">
				{row2.map((letter) => (
					<Key key={letter} letter={letter} />
				))}
			</div>

			{/* Third row */}
			<div className="flex flex-row gap-1 justify-center">
				<Key letter="ENTER" isWide />
				{row3.map((letter) => (
					<Key key={letter} letter={letter} />
				))}
				<Key letter="⌫" isWide />
			</div>
		</div>
	);
}

function Key({ letter, isWide = false }) {
	return (
		<button
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
