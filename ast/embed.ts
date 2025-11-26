import { pipeline } from "@xenova/transformers";

let embedder: any = null;

export async function getEmbedder() {
	if (!embedder) {
		console.log("Loading embedding model...");
		embedder = await pipeline(
			"feature-extraction",
			"sentence-transformers/all-MiniLM-L6-v2"
		);
	}
	return embedder;
}

export async function embedText(text: string): Promise<number[]> {
	const model = await getEmbedder();
	const output = await model(text, { pooling: "mean", normalize: true });
	return Array.from(output.data);
}