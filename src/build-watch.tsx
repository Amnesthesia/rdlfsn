import { marked } from "marked";
import {
	existsSync,
	mkdirSync,
	readFileSync,
	watchFile,
	writeFileSync,
	readdirSync,
	statSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { render } from "preact-render-to-string";
import {
	type ResumeData,
	ResumeTemplate,
} from "./components/ResumeTemplate.js";

interface ConfigSection {
	file: string;
	required: boolean;
}

interface BuildConfig {
	template: {
		defaultTitle: string;
	};
	content: {
		sections: {
			[key: string]: ConfigSection;
		};
	};
	output: {
		directory: string;
		filename: string;
	};
	build: {
		cleanBefore: boolean;
		verbose: boolean;
	};
}

// Check if running in watch mode
const isWatchMode =
	process.argv.includes("--watch") ||
	process.env.npm_lifecycle_event?.includes("dev") ||
	process.env.npm_lifecycle_script?.includes("dev");

// Check if tsx is handling the watching (so we don't duplicate)
const tsxIsWatching = process.argv.includes("--watch");

console.log("Debug - process.argv:", process.argv);
console.log("Debug - isWatchMode:", isWatchMode);
console.log("Debug - tsxIsWatching:", tsxIsWatching);

// Load configuration
function loadConfig(): BuildConfig {
	try {
		const configContent = readFileSync("config.json", "utf-8");
		return JSON.parse(configContent) as BuildConfig;
	} catch (error) {
		console.error("❌ Error loading config.json:", error);
		process.exit(1);
	}
}

// Ensure directory exists
function ensureDirectoryExists(filePath: string): void {
	const dir = dirname(filePath);
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
}

// Find all TypeScript/JSX files in a directory
function findTsxFiles(dir: string): string[] {
	const files: string[] = [];

	try {
		if (!existsSync(dir)) {
			return files;
		}

		const items = readdirSync(dir);

		for (const item of items) {
			const fullPath = join(dir, item);
			const stat = statSync(fullPath);

			if (stat.isDirectory()) {
				files.push(...findTsxFiles(fullPath));
			} else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
				files.push(fullPath);
			}
		}
	} catch (error) {
		console.warn(`Warning: Could not read directory ${dir}:`, error);
	}

	return files;
}

// Load and parse markdown content
function loadMarkdownContent(
	filename: string,
	required: boolean = false,
): string {
	try {
		if (!existsSync(filename)) {
			if (required) {
				throw new Error(`Required file ${filename} does not exist`);
			}
			if (!isWatchMode) {
				console.log(`   ⚠️  Optional file ${filename} not found, skipping`);
			}
			return '<p class="text-gray-500 italic">Content not available</p>';
		}

		const markdown = readFileSync(filename, "utf-8");
		return marked.parse(markdown) as string;
	} catch (error) {
		console.error(`❌ Error loading ${filename}:`, error);
		if (required) {
			process.exit(1);
		}
		return `<p class="text-red-500">Error loading content from ${filename}</p>`;
	}
}

// Load all markdown content based on configuration
function loadResumeData(config: BuildConfig): ResumeData {
	const sections: { [key: string]: string } = {};

	for (const [sectionName, sectionConfig] of Object.entries(
		config.content.sections,
	)) {
		sections[sectionName] = loadMarkdownContent(
			sectionConfig.file,
			sectionConfig.required,
		);
	}

	// Extract title from header content (first h1) or use default
	const titleMatch = sections.header?.match(/<h1[^>]*>([^<]+)<\/h1>/);
	const title = titleMatch
		? titleMatch[1].replace(/\*\*/g, "").trim()
		: config.template.defaultTitle;

	return {
		title,
		header: sections.header || "",
		experience: sections.experience || "",
		projects: sections.projects || "",
		contact: sections.contact || "",
		skills: sections.skills || "",
		education: sections.education || "",
	};
}

// Build function
function buildResume(): void {
	try {
		const config = loadConfig();

		// Ensure output directory exists
		const outputPath = `${config.output.directory}/${config.output.filename}`;
		ensureDirectoryExists(outputPath);

		// Load all markdown content
		const resumeData = loadResumeData(config);

		// Render JSX to HTML string
		const htmlContent = render(ResumeTemplate({ data: resumeData }));
		const fullHtml = `<!DOCTYPE html>\n${htmlContent}`;

		// Write the generated HTML
		writeFileSync(outputPath, fullHtml);

		const timestamp = new Date().toLocaleTimeString();
		console.log(`[${timestamp}] ✅ Resume HTML built successfully`);
	} catch (error) {
		console.error("❌ Build error:", error);
		if (!isWatchMode) {
			process.exit(1);
		}
	}
}

// Main function
function main(): void {
	if (isWatchMode && !tsxIsWatching) {
		console.log("🔄 Starting watch mode...");

		// Initial build
		buildResume();

		// Watch for changes (only when tsx is not handling it)
		const config = loadConfig();
		const filesToWatch = [
			"config.json",
			...Object.values(config.content.sections).map((section) => section.file),
		];

		// Also watch TypeScript/JSX component files
		const componentFiles = findTsxFiles("src/components");
		filesToWatch.push(...componentFiles);

		filesToWatch.forEach((file) => {
			if (existsSync(file)) {
				watchFile(file, { interval: 1000 }, () => {
					console.log(`📝 File changed: ${file}`);
					buildResume();
				});
			}
		});

		console.log("👀 Watching for file changes...");
		console.log("📁 Files being watched:", filesToWatch);

		// Keep the process alive
		process.stdin.resume();
	} else if (tsxIsWatching) {
		// tsx is handling the watching, just build once
		console.log("🔄 tsx watch mode detected - building once...");
		buildResume();
	} else {
		console.log("🚀 Building resume website with JSX...");
		buildResume();
		console.log("✅ Build complete!");
	}
}

// Handle errors gracefully
process.on("uncaughtException", (error) => {
	console.error("❌ Uncaught exception:", error.message);
	if (!isWatchMode) {
		process.exit(1);
	}
});

process.on("unhandledRejection", (reason) => {
	console.error("❌ Unhandled rejection:", reason);
	if (!isWatchMode) {
		process.exit(1);
	}
});

// Handle graceful shutdown
process.on("SIGINT", () => {
	console.log("\n👋 Shutting down...");
	process.exit(0);
});

// Run the build
main();
