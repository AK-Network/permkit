import { readFileSync } from "node:fs";

export function extractScriptFromSvelte(filePath: string): string[] {
    const content = readFileSync(filePath, "utf8");

    // Τα <script> block μπορεί να είναι πολλά
    const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/g;

    const results: string[] = [];
    let match;

    while ((match = scriptRegex.exec(content)) !== null) {
        const scriptContent = match[1].trim();
        results.push(scriptContent);
    }

    return results;
}