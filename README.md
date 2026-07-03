# Resume Website

A modern, responsive resume website built with JSX/Preact, TailwindCSS, and Markdown content using server-side rendering.

## Features

- 📱 **Responsive Design** - Looks great on desktop, tablet, and mobile
- 🎨 **TailwindCSS Styling** - Modern, clean design with utility-first CSS
- 📝 **Markdown Content** - Easy to edit content in separate markdown files
- ⚛️ **JSX Templates** - Component-based templates with Preact/JSX
- 🔧 **Type-Safe Components** - Fully typed React-style components
- 🖨️ **Print Friendly** - Optimized for printing to PDF
- ⚡ **Fast Loading** - Minimal dependencies, served from CDN
- 🔄 **Build-time Rendering** - Server-side rendering with Preact
- 📝 **TypeScript** - Fully typed build system and components

## Project Structure

```
resume/
├── src/                      # TypeScript source files
│   ├── components/           # JSX components
│   │   ├── ResumeTemplate.tsx  # Main resume template
│   │   └── Layout.tsx          # Layout components
│   ├── build-jsx.tsx         # JSX-based build script
│   ├── build-enhanced.ts     # Legacy template build script
│   └── main.ts               # Client-side TypeScript
├── templates/                # Legacy HTML templates
│   └── index.html           # Legacy template (unused in JSX build)
├── content/                 # Markdown content files
│   ├── header.md            # Name and title
│   ├── contact.md           # Contact information
│   ├── experience.md        # Work experience
│   ├── projects.md          # Notable projects
│   ├── skills.md            # Technical skills
│   └── education.md         # Education background
├── dist/                    # Generated files (created by build)
│   ├── index.html           # Final HTML file
│   └── js/
│       └── main.js          # Compiled JavaScript
├── config.json             # Build configuration
├── package.json            # Project configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## Getting Started

### Installation

```bash
# Install dependencies
npm install
```

### Development (Recommended)

```bash
# Start development mode with live reloading
npm run dev

# This starts:
# - JSX template compilation with file watching
# - TypeScript compilation in watch mode  
# - Live server with automatic browser refresh
```

### Building for Production

```bash
# Build everything
npm run build

# Or build components separately
npm run build:content  # Build JSX templates
npm run build:client   # Compile TypeScript
```

### Serving

```bash
# Live server (recommended for development)
npm run serve

# Python server (legacy)
npm run serve-python

# Open in browser
npm run open
```

## Development Workflow

The new TypeScript-based workflow provides:

- **🔄 Live Reloading**: Changes to markdown files automatically rebuild the HTML
- **⚡ Fast TypeScript Compilation**: `tsc --watch` for instant client-side updates
- **🔧 Hot Module Reloading**: Live-server automatically refreshes the browser
- **👀 File Watching**: Monitors markdown files, config, and TypeScript files

### File Watching

The development server watches these files for changes:
- All markdown files in `content/`
- `config.json` configuration
- TypeScript files in `src/`

When you edit any of these files:
1. **Markdown/Config changes** → HTML regenerated instantly
2. **TypeScript changes** → JavaScript recompiled and browser refreshed
3. **JSX component changes** → Full rebuild and refresh

## JSX Template System

The project uses Preact for server-side rendering with JSX components:

### Component Architecture

```typescript
// Main template component
export const ResumeTemplate = ({ data }: ResumeTemplateProps) => (
  <html lang="en">
    <DocumentHead title={data.title} />
    <body className="bg-gray-50 min-h-screen">
      <MainLayout>
        <HeaderSection content={data.header} />
        <TwoColumnLayout>
          <LeftColumn>
            <Section title="Experience" borderColor="border-blue-500">
              <MarkdownContent html={data.experience} />
            </Section>
          </LeftColumn>
        </TwoColumnLayout>
      </MainLayout>
    </body>
  </html>
);
```

### Available Components

- **Layout Components**: `MainLayout`, `TwoColumnLayout`, `LeftColumn`, `RightColumn`
- **Content Components**: `Section`, `MarkdownContent`, `HeaderSection`
- **Interactive Components**: `PrintButton`

### Type Safety

All components are fully typed with TypeScript:

```typescript
interface ResumeData {
  title: string;
  header: string;
  experience: string;
  projects: string;
  contact: string;
  skills: string;
  education: string;
}
```

### Configuration

Edit `config.json` to customize the build process:

```json
{
  "template": {
    "defaultTitle": "Your Name"
  },
  "content": {
    "sections": {
      "header": {
        "file": "content/header.md",
        "required": true
      }
    }
  }
}
```

## Customizing Your Resume

### 1. Update Personal Information
Edit the markdown files in the `content/` directory:

- **header.md** - Your name and professional title
- **contact.md** - Email, phone, social links, location
- **experience.md** - Work history and achievements
- **projects.md** - Notable projects and contributions
- **skills.md** - Technical skills and competencies
- **education.md** - Academic background and achievements

### 2. Customize Components
- **Layout**: Edit components in `src/components/Layout.tsx`
- **Template**: Modify `src/components/ResumeTemplate.tsx`
- **Styling**: Update TailwindCSS classes in components

### 3. Add New Sections
1. Create a new markdown file in `content/`
2. Add the section to `config.json`
3. Update the `ResumeData` interface
4. Add the section to the template component

### 4. Create New Components
```typescript
// src/components/CustomSection.tsx
interface CustomSectionProps {
  title: string;
  children?: ComponentChildren;
}

export const CustomSection = ({ title, children }: CustomSectionProps) => (
  <div className="custom-section">
    <h3>{title}</h3>
    {children}
  </div>
);
```

## Build Scripts

- `npm run dev` - Start development mode with live reloading
- `npm run build` - Full production build 
- `npm run build:content` - Build JSX templates only
- `npm run build:client` - Compile TypeScript only
- `npm run serve` - Serve with live-server
- `npm run clean` - Remove generated files
- `npm run type-check` - Check TypeScript without compilation

## Development vs Production

### Development Mode (`npm run dev`)
- **File watching** enabled for instant updates
- **Live server** with hot reloading
- **Parallel compilation** of content and client code
- **Automatic browser refresh** on file changes

### Production Build (`npm run build`)
- **Optimized compilation** without watching
- **Clean build** removes old files first
- **Static files** ready for deployment

## JSX vs Legacy Template System

### JSX Benefits (Current)
- ✅ Type-safe components
- ✅ Component composition and reusability
- ✅ Better maintainability
- ✅ IDE support and IntelliSense
- ✅ Familiar React/JSX syntax

### Legacy Template Benefits
- ✅ Simple placeholder replacement
- ✅ No framework dependencies
- ✅ Smaller build output

## Printing/PDF Export

The resume is optimized for printing:

1. Click the "Print Resume" button, or
2. Use your browser's print function (Ctrl/Cmd + P)
3. Choose "Save as PDF" as the destination
4. Recommended settings: A4 size, no margins

## Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## Technologies Used

- **Preact** - Lightweight React alternative for SSR
- **JSX** - Component-based templating
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first CSS framework (via CDN)
- **Marked.js** - Markdown parser (via NPM)

## License

MIT License - feel free to use this template for your own resume!
