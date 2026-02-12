import { useGameStore } from "./store/gameStore";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";

function App() {
	const screen = useGameStore((state) => state.screen);

	return (
		<>
			{screen === "start" && <StartScreen />}
			{screen === "game" && <GameScreen />}
		</>
	);
}

export default App;
// v59xQIKDjwpQbupp
