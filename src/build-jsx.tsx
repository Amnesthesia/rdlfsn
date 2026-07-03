import { marked } from "marked";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
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
			console.log(`   ⚠️  Optional file ${filename} not found, skipping`);
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

// Generate client-side JavaScript
function generateClientJS(): string {
	return `
// Client-side functionality for the resume website
// Since markdown is now pre-rendered at build time using JSX, this file handles
// styling and any interactive features

// Function to apply TailwindCSS classes to pre-rendered markdown elements
function styleMarkdownContent() {
  // Style all markdown content containers
  document.querySelectorAll('.markdown-content').forEach((container) => {
    // Style headings
    container.querySelectorAll('h1').forEach((h) => {
      h.className = 'text-3xl font-bold text-gray-800 mb-4';
    });
    
    container.querySelectorAll('h2').forEach((h) => {
      h.className = 'text-2xl font-semibold text-gray-700 mb-3';
    });
    
    container.querySelectorAll('h3').forEach((h) => {
      h.className = 'text-xl font-medium text-gray-600 mb-2';
    });
    
    container.querySelectorAll('h4').forEach((h) => {
      h.className = 'text-lg font-medium text-gray-600 mb-2';
    });
    
    // Style paragraphs
    container.querySelectorAll('p').forEach((p) => {
      p.className = 'text-gray-600 mb-3 leading-relaxed';
    });
    
    // Style lists
    container.querySelectorAll('ul').forEach((ul) => {
      ul.className = 'list-disc list-inside text-gray-600 mb-3 space-y-1';
    });
    
    container.querySelectorAll('ol').forEach((ol) => {
      ol.className = 'list-decimal list-inside text-gray-600 mb-3 space-y-1';
    });
    
    container.querySelectorAll('li').forEach((li) => {
      li.className = 'mb-1';
    });
    
    // Style links
    container.querySelectorAll('a').forEach((a) => {
      a.className = 'text-blue-500 hover:text-blue-600 underline';
    });
    
    // Style emphasis
    container.querySelectorAll('strong').forEach((strong) => {
      strong.className = 'font-semibold text-gray-800';
    });
    
    container.querySelectorAll('em').forEach((em) => {
      em.className = 'italic';
    });
    
    // Style code
    container.querySelectorAll('code').forEach((code) => {
      code.className = 'bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm';
    });
    
    container.querySelectorAll('pre').forEach((pre) => {
      pre.className = 'bg-gray-100 p-3 rounded-lg overflow-x-auto mb-3';
    });
    
    // Style blockquotes
    container.querySelectorAll('blockquote').forEach((blockquote) => {
      blockquote.className = 'border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-3';
    });
  });
}

// Add smooth scroll behavior for internal links (if any)
function addSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Initialize when page loads
function initialize() {
  styleMarkdownContent();
  addSmoothScrolling();
  
  // Log that the resume has loaded
  console.log('Resume website loaded successfully! 🎉 (Built with JSX)');
}

// Load functionality when page loads
document.addEventListener('DOMContentLoaded', initialize);
`;
}

// Main build function
function build(): void {
	console.log("🚀 Building resume website with JSX...");
	console.log("");

	// Load configuration
	const config = loadConfig();
	console.log("⚙️  Configuration loaded successfully");

	// Ensure output directory exists
	const outputPath = `${config.output.directory}/${config.output.filename}`;
	const jsOutputPath = `${config.output.directory}/js/main.js`;
	ensureDirectoryExists(outputPath);
	ensureDirectoryExists(jsOutputPath);

	// Load all markdown content
	console.log("");
	console.log("📄 Loading markdown content...");
	const resumeData = loadResumeData(config);

	// Show what content was loaded
	if (config.build.verbose) {
		Object.entries(resumeData).forEach(([section, content]) => {
			if (section !== "title") {
				const wordCount = content.split(" ").length;
				const sectionConfig = config.content.sections[section];
				const isRequired = sectionConfig?.required
					? "(required)"
					: "(optional)";
				console.log(`   ✅ ${section} ${isRequired}: ${wordCount} words`);
			}
		});
		console.log(`   🏷️  Page title: "${resumeData.title}"`);
	}

	console.log("");
	console.log("🔧 Rendering JSX template...");

	// Render JSX to HTML string
	const htmlContent = render(ResumeTemplate({ data: resumeData }));
	const fullHtml = `<!DOCTYPE html>\n${htmlContent}`;

	// Write the generated HTML
	writeFileSync(outputPath, fullHtml);

	// Generate and write client-side JavaScript
	const clientJS = generateClientJS();
	writeFileSync(jsOutputPath, clientJS);

	console.log("   ✅ JSX template rendered successfully");
	console.log(`   📁 HTML output: ${outputPath}`);
	console.log(`   📁 JS output: ${jsOutputPath}`);
	console.log("");
	console.log("✅ Build complete!");
	console.log("📁 Next steps:");
	console.log('   Run "npm run serve" to preview your resume');
}

// Handle errors gracefully
process.on("uncaughtException", (error) => {
	console.error("❌ Uncaught exception:", error.message);
	process.exit(1);
});

process.on("unhandledRejection", (reason) => {
	console.error("❌ Unhandled rejection:", reason);
	process.exit(1);
});

// Run the build
build();
