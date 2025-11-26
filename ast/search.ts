import fs from "fs";
import { embedText } from "./embed.js";

function cosineSim(a: number[], b: number[]) {
	let dot = 0, ma = 0, mb = 0;
	for (let i = 0; i < a.length; i++) {
		dot += a[i] * b[i];
		ma += a[i] * a[i];
		mb += b[i] * b[i];
	}
	return dot / (Math.sqrt(ma) * Math.sqrt(mb));
}

async function search(query: string, topK = 5) {
	const db = JSON.parse(fs.readFileSync("vectordb.json", "utf8"));
	const qEmb = await embedText(query);

	const ranked = db
		.map(entry => ({
			...entry,
			score: cosineSim(qEmb, entry.embedding)
		}))
		.sort((a, b) => b.score - a.score)
		.slice(0, topK);

	console.log("\n🔎 Results:\n");
	for (const r of ranked) {
		console.log("File:", r.file);
		console.log("Type:", r.type);
		console.log("Name:", r.name);
		console.log("Score:", r.score.toFixed(4));
		console.log("Code:", r.code.slice(0, 200) + "...");
		console.log("---");
	}
}

await search(process.argv[2] || "authentication logic");