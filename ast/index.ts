import { extractScriptFromSvelte } from "./parseSvelte";
import { Project, SourceFile } from "ts-morph";
import { embedText } from "./embed";
import fs from "fs";
import path from "path";

const project = new Project({
	tsConfigFilePath: "tsconfig.json"
});

async function analyzeSourceFile(sourceFile: SourceFile, results: any[]) {
	console.log("Analyzing:", sourceFile.getFilePath());

	// ---- Classes ----
	for (const cls of sourceFile.getClasses()) {
		const name = cls.getName() ?? "AnonymousClass";
		const code = cls.getText();
		const embedding = await embedText(code);

		results.push({
			file: sourceFile.getFilePath(),
			type: "class",
			name,
			code,
			embedding
		});

		// ---- Methods ----
		for (const method of cls.getMethods()) {
			const mName = method.getName();
			const mCode = method.getText();
			const mEmbedding = await embedText(mCode);

			results.push({
				file: sourceFile.getFilePath(),
				type: "method",
				class: name,
				name: mName,
				code: mCode,
				embedding: mEmbedding
			});
		}
	}

	// ---- Standalone Functions ----
	for (const fn of sourceFile.getFunctions()) {
		const name = fn.getName() ?? "anonymous_function";
		const code = fn.getText();
		const embedding = await embedText(code);

		results.push({
			file: sourceFile.getFilePath(),
			type: "function",
			name,
			code,
			embedding
		});
	}
}

async function analyzeProject(rootDir: string) {
	// const sourceFiles = project.addSourceFilesAtPaths(`${rootDir}/**/*.ts`);
	// const sourceFiles = [
	// 	...project.addSourceFilesAtPaths("src/**/*.ts"),
	// 	...project.addSourceFilesAtPaths("src/**/*.svelte"),
	// ];
	// const results: any[] = [];

	// for (const sf of sourceFiles) {
	// 	await analyzeSourceFile(sf, results);
	// }

	// fs.writeFileSync("vectordb.json", JSON.stringify(results, null, 2));
	// console.log("\nAll embeddings saved to vectordb.json");

	const results: any[] = [];

    // 1. Ανάλυση .ts
    const tsFiles = project.addSourceFilesAtPaths(`${rootDir}/**/*.ts`);
    for (const sf of tsFiles) {
        await analyzeSourceFile(sf, results);
    }

    // 2. Ανάλυση .svelte
    await analyzeDirectory(rootDir, results);

    // Αποθήκευση
    fs.writeFileSync("vectordb.json", JSON.stringify(results, null, 2));
    console.log("Saved all embeddings to vectordb.json");
}

async function analyzeDirectory(dir: string, results: any[]) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			await analyzeDirectory(fullPath, results);
		} else if (entry.name.endsWith(".svelte")) {
			await analyzeSvelte(fullPath, results);
		}
	}
}

async function analyzeSvelte(filePath: string, results: any[]) {
	const scripts = extractScriptFromSvelte(filePath);

	for (const script of scripts) {
		// Δημιουργούμε virtual TypeScript source file στο ts-morph
		const sf = project.createSourceFile(
			filePath + "::script_" + Math.random(),
			script,
			{ overwrite: true }
		);

		console.log("Analyzing Svelte script:", filePath);

		await analyzeSourceFile(sf, results);
	}
}


analyzeProject("src/lib"); // <-- εδώ βάλε τον φάκελο του project σου