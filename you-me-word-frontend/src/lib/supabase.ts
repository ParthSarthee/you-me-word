import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY =
	import.meta.env.VITE_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TABLE_NAME = "game_states";

export interface GameStatePayload {
	words: string[][];
	row_index: number;
	game_over: boolean;
	won: boolean;
}

// Save my state to the database
export async function saveMyState(
	gameCode: number,
	playerRole: "host" | "guest",
	words: string[][],
	rowIndex: number,
	gameOver: boolean,
	won: boolean,
): Promise<boolean> {
	const id = `${gameCode}_${playerRole}`;

	const { error } = await supabase.from(TABLE_NAME).upsert({
		id,
		game_code: gameCode,
		player_role: playerRole,
		words,
		row_index: rowIndex,
		game_over: gameOver,
		won,
		updated_at: new Date().toISOString(),
	});

	if (error) {
		console.error("Error saving state:", error);
		return false;
	}
	return true;
}

// Fetch opponent's state from the database
export async function fetchOpponentState(
	gameCode: number,
	myRole: "host" | "guest",
): Promise<GameStatePayload | null> {
	const opponentRole = myRole === "host" ? "guest" : "host";
	const opponentId = `${gameCode}_${opponentRole}`;

	const { data, error } = await supabase
		.from(TABLE_NAME)
		.select("words, row_index, game_over, won")
		.eq("id", opponentId)
		.maybeSingle();

	if (error) {
		console.error("Error fetching opponent state:", error);
		return null;
	}

	if (!data) {
		return null; // Opponent hasn't joined yet
	}

	return {
		words: data.words,
		row_index: data.row_index,
		game_over: data.game_over,
		won: data.won,
	};
}
