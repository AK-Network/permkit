#!/usr/bin/env ts-node

/**
 * AI Readiness Checker for JavaScript / TypeScript Packages
 *
 * Checks:
 *  ✔ Type definitions coverage
 *  ✔ JSDoc comments on functions and classes
 *  ✔ Dynamic code usage (eval, Function)
 *  ✔ Examples directory
 *  ✔ Tests directory
 *  ✔ README quality
 *  ✔ Suspicious folder names
 *  ✔ AST validation via TypeScript compiler
 */

import ts from "typescript";
import fs from "fs";
import path from "path";

const BAD_FOLDERS = new Set(["utils", "common", "misc"]);
const DYNAMIC_PATTERNS = [/eval\s*\(/, /new Function\s*\(/];

function walk(dir: string): string[] {
	let results: string[] = [];
	for (const file of fs.readdirSync(dir)) {
		const full = path.join(dir, file);
		if (fs.statSync(full).isDirectory()) {
			if (!["node_modules", "dist", "build"].includes(file)) {
				results = results.concat(walk(full));
			}
		} else if (file.endsWith(".ts") || file.endsWith(".js")) {
			results.push(full);
		}
	}
	return results;
}

function checkFolderNames(root: string) {
	const dirs = fs.readdirSync(root).filter(f => fs.statSync(path.join(root, f)).isDirectory());
	return dirs.filter(d => BAD_FOLDERS.has(d));
}

function checkReadme(root: string) {
	const file = path.join(root, "README.md");
	if (!fs.existsSync(file)) return { exists: false, score: 0 };

	const text = fs.readFileSync(file, "utf8").toLowerCase();
	const score = [
		"install",
		"usage",
		"example",
		"api",
		"import",
		"quickstart",
	].reduce((acc, key) => acc + (text.includes(key) ? 1 : 0), 0);

	return { exists: true, score };
}

function analyzeSourceFile(fileName: string, sourceText: string) {
	const sourceFile = ts.createSourceFile(
		fileName,
		sourceText,
		ts.ScriptTarget.Latest,
		true
	);

	let functionCount = 0;
	let typedCount = 0;
	let jsdocMissing = 0;
	let dynamicHits: string[] = [];

	// Detect dynamic code
	for (const pattern of DYNAMIC_PATTERNS) {
		if (pattern.test(sourceText)) dynamicHits.push(pattern.toString());
	}

	function visit(node: ts.Node) {
		if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
			functionCount++;

			// Check JSDoc
			const jsDocs = ts.getJSDocTags(node);
			if (jsDocs.length === 0) jsdocMissing++;

			// Check typing
			if (node.type || (node.parameters?.some(p => p.type))) {
				typedCount++;
			}
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);

	return { functionCount, typedCount, jsdocMissing, dynamicHits };
}

function main() {
	const root = process.argv[2];
	if (!root) {
		console.log("Usage: ts-node ai-readiness-checker.ts <path-to-project>");
		process.exit(1);
	}

	const files = walk(root);
	if (files.length === 0) {
		console.log("No JS/TS files found.");
		process.exit(0);
	}

	let totalFunctions = 0;
	let totalTyped = 0;
	let totalJsdocMissing = 0;
	let dynamicWarnings: { file: string; hits: string[] }[] = [];

	for (const file of files) {
		const text = fs.readFileSync(file, "utf8");
		const result = analyzeSourceFile(file, text);

		totalFunctions += result.functionCount;
		totalTyped += result.typedCount;
		totalJsdocMissing += result.jsdocMissing;

		if (result.dynamicHits.length > 0) {
			dynamicWarnings.push({ file, hits: result.dynamicHits });
		}
	}

	const readme = checkReadme(root);
	const badFolders = checkFolderNames(root);

	const hasExamples = fs.existsSync(path.join(root, "examples"));
	const hasTests =
		fs.existsSync(path.join(root, "tests")) ||
		files.some(f => f.toLowerCase().includes("test"));

	console.log("\n==== AI READINESS REPORT ====\n");

	console.log(`Analyzed files: ${files.length}`);

	// Typings
	if (totalFunctions > 0) {
		console.log(
			`\n[Typing] ${(100 * totalTyped / totalFunctions).toFixed(1)}% functions have type annotations`
		);
	} else console.log("\n[Typing] No functions found");

	// JSDoc
	console.log(
		`[JSDoc] Missing JSDoc comments: ${totalJsdocMissing} of ${totalFunctions} functions`
	);

	// Dynamic Code
	if (dynamicWarnings.length) {
		console.log("\n[Dynamic Code] WARNING – dynamic JS detected:");
		for (const w of dynamicWarnings) {
			console.log(`  - ${w.file}: ${w.hits.join(", ")}`);
		}
	} else {
		console.log("\n[Dynamic Code] OK – none detected");
	}

	// README
	if (!readme.exists) {
		console.log("\n[README] Missing README.md");
	} else {
		console.log(`[README] Quality score: ${readme.score}/6`);
	}

	// Examples
	console.log(`[Examples] ${hasExamples ? "OK" : "Missing"}`);

	// Tests
	console.log(`[Tests] ${hasTests ? "OK" : "Missing"}`);

	// Folder names
	if (badFolders.length) {
		console.log(
			`[Naming] Weak generic folder names found: ${badFolders.join(", ")}`
		);
	} else {
		console.log("[Naming] No problematic folder names detected");
	}

	console.log("\n==== END REPORT ====\n");
}

main();
