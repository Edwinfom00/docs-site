# Edwin Packages — Documentation Site

A modern, production-grade documentation platform for open-source TypeScript packages. Built with cutting-edge Web technologies for optimal performance, accessibility, and developer experience.

**Live at:** [packages.edwinfom.dev](https://packages.edwinfom.dev)

---

## Features

- **Multi-Package Support** — Host documentation for multiple packages with independent versioning
- **Multi-Language Support** — Built-in internationalization (i18n) with English (en) and French (fr)
- **Version Management** — Display and navigate between multiple package versions seamlessly
- **Modern UI/UX** — Beautiful, responsive design with dark mode support via `next-themes`
- ** MDX Content** — Write documentation using Markdown + JSX for interactive docs
- **Full-Text Search** — SearchModal component for discovering documentation content
- **Syntax Highlighting** — Beautiful code blocks with `rehype-pretty-code` and Shiki
- **Table of Contents** — Auto-generated navigation for long documentation pages
- **Performance Optimized** — Next.js 16 App Router with optimized font loading and bundle analysis
- **SEO Ready** — Built-in OpenGraph metadata and semantic HTML structure
- **Responsive Design** — Mobile-first approach with Tailwind CSS 4

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16.2.3](https://nextjs.org) with App Router |
| **UI Library** | [React 19.2.4](https://react.dev) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) with PostCSS 4 |
| **Content** | [next-mdx-remote 6.0.0](https://github.com/hashicorp/next-mdx-remote) |
| **Markdown Processing** | Unified, Remark, Rehype ecosystem |
| **Code Highlighting** | [Shiki 4.0.2](https://shiki.matsu.io) + [rehype-pretty-code 0.14.3](https://rehype-pretty-code.com) |
| **Theme Management** | [next-themes 0.4.6](https://github.com/pacocoursey/next-themes) |
| **Icons** | [lucide-react 1.8.0](https://lucide.dev) |
| **Linting** | [ESLint 9](https://eslint.org) with Next.js config |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |

---

## Project Structure

```
docs-site/
├── app/                          # Next.js App Router directory
│   ├── layout.tsx               # Root layout with metadata & theme provider
│   ├── page.tsx                 # Homepage featuring all packages
│   ├── globals.css              # Global styles & CSS variables
│   └── docs/                    # Dynamic documentation routes
│       ├── [package]/           # Package slug parameter
│       │   └── [version]/       # Version parameter
│       │       └── [lang]/      # Language parameter (en, fr)
│       │           └── [slug]/  # Document slug
│       │               └── page.tsx
│
├── components/                  # Reusable React components
│   ├── DocsHeader.tsx          # Navigation header & branding
│   ├── DocsSidebar.tsx         # Sidebar navigation with version switcher
│   ├── DocContent.tsx          # MDX content renderer with styling
│   ├── SearchModal.tsx         # Full-text search interface
│   ├── TableOfContents.tsx     # Auto-generated page TOC
│   └── ui/                     # Atomic UI components
│
├── content/                    # Static documentation content
│   └── packages/              # Package documentation
│       └── ai-guard/          # Example: @edwinfom/ai-guard
│           ├── meta.json      # Package metadata & versions
│           └── v0.2.0/        # Version directory
│               ├── en/        # English docs
│               │   ├── nav.json          # Navigation structure
│               │   ├── introduction.mdx
│               │   ├── installation.mdx
│               │   ├── quick-start.mdx
│               │   ├── api-reference.mdx
│               │   └── ...
│               └── fr/        # French docs (same structure)
│
├── lib/
│   ├── content.ts             # Content loader & package utilities
│   └── mdx.ts                 # MDX compilation configuration
│
├── public/                    # Static assets (favicons, etc.)
│
├── next.config.ts            # Next.js configuration
├── tailwind.config.ts        # Tailwind CSS configuration  
├── tsconfig.json             # TypeScript configuration
├── eslint.config.mjs         # ESLint configuration
├── postcss.config.mjs        # PostCSS configuration
├── package.json              # Dependencies & scripts
└── README.md                 # This file
```

---

## Getting Started

### Prerequisites

- **Node.js** 18.17+ or 20+
- **npm** 9+ (or yarn/pnpm equivalent)

### Installation

```bash
# Clone repository
git clone https://github.com/Edwinfom00/docs-site.git
cd docs-site

# Install dependencies
npm install
```

### Development Server

Start the development server with hot reload:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Changes to files automatically refresh the page.

### Build for Production

```bash
# Create optimized production build
npm run build

# Start production server
npm start
```

---

## 📖 How to Add Documentation

### 1. Create Package Directory

```bash
content/packages/your-package/
├── meta.json
├── v1.0.0/
│   ├── en/
│   │   ├── nav.json
│   │   ├── introduction.mdx
│   │   └── ...
│   └── fr/
│       ├── nav.json
│       ├── introduction.mdx
│       └── ...
```

### 2. Create `meta.json`

```json
{
  "name": "@your-org/your-package",
  "slug": "your-package",
  "description": "A brief description of your package",
  "version": "1.0.0",
  "versions": ["1.0.0"],
  "latestVersion": "1.0.0",
  "npm": "https://www.npmjs.com/package/@your-org/your-package",
  "github": "https://github.com/your-org/your-package",
  "license": "MIT",
  "author": "Your Name",
  "color": "#3b82f6",
  "icon": "star",
  "tags": ["tag1", "tag2"]
}
```

### 3. Create Navigation Structure (`nav.json`)

```json
[
  {
    "title": "Getting Started",
    "items": [
      { "title": "Introduction", "slug": "introduction" },
      { "title": "Installation", "slug": "installation" },
      { "title": "Quick Start", "slug": "quick-start" }
    ]
  },
  {
    "title": "Documentation",
    "items": [
      { "title": "API Reference", "slug": "api-reference" },
      { "title": "Examples", "slug": "examples" }
    ]
  }
]
```

### 4. Write Documentation (MDX)

Create `.mdx` files with Markdown + React JSX:

```mdx
# Installation

Install the package from npm:

\`\`\`bash
npm install @your-org/your-package
\`\`\`

## What is MDX?

MDX lets you use JSX in markdown:

export const Highlight = ({children}) => (
  <span style={{backgroundColor: 'yellow'}}>{children}</span>
);

This is <Highlight>highlighted text</Highlight> in MDX!
```

---

## Customization

### Styling Variables

Global CSS variables are defined in `app/globals.css`:

```css
:root {
  --color-primary: #3b82f6;
  --color-text: #1f2937;
  --color-bg: #ffffff;
  /* ... more variables */
}

[data-theme='dark'] {
  --color-text: #f3f4f6;
  --color-bg: #111827;
  /* ... dark mode variables */
}
```

### Package Colors

Each package has a `color` property in `meta.json` that affects the UI theme when viewing that package.

### Add Custom Components

Create reusable components in `components/ui/` and import them in your MDX files.

---

## Available Scripts

```bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

---

## Internationalization (i18n)

The platform supports multiple languages through directory structure:

- `content/packages/[package]/[version]/en/` — English documentation
- `content/packages/[package]/[version]/fr/` — French documentation
- Add more by creating additional language directories

Add the language code to the routing parameters in `app/docs/[package]/[version]/[lang]/[slug]/page.tsx`.

---

## Search Functionality

The `SearchModal` component provides full-text search across all documentation. It searches:

- Page titles
- Slugs
- Document content
- Navigation items

Customize search behavior in `components/SearchModal.tsx`.

---

## Performance & Optimization

- **Code Splitting** — Automatic via Next.js
- **Image Optimization** — Use Next.js `Image` component
- **Font Optimization** — Geist font family preloaded
- **CSS Optimization** — Tailwind CSS purges unused styles
- **Syntax Highlighting** — CSS-in-JS with Shiki for minimal bundle impact

Monitor performance:

```bash
# Check bundle size
npm run build  # Reports built bundle metrics
```

---

## Security

- **Content Security** — No untrusted content execution
- **HTML Sanitization** — Built into Rehype processing
- **Next.js Security Headers** — Configured in layout.tsx
- **No External CDN** — All assets self-hosted

---

## Current Packages

### @edwinfom/ai-guard v0.2.0

A security middleware for AI API responses with:

- ✅ PII redaction
- ✅ Schema enforcement
- ✅ Prompt injection detection
- ✅ Budget sentinel
- ✅ Audit logging
- ✅ Content policy validation

[View Documentation](http://localhost:3000/docs/ai-guard)  
[NPM Package](https://www.npmjs.com/package/@edwinfom/ai-guard)  
[GitHub Repository](https://github.com/Edwinfom00/ai-guard)

---

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Documentation Contributions

When adding new documentation:

1. Ensure MDX files follow the established format
2. Add entries to `nav.json` for new sections
3. Verify links work properly
4. Test in both dark and light modes
5. Verify responsive design on mobile

---

## Troubleshooting

### Port 3000 already in use

```bash
npm run dev -- -p 3001
```

### MDX compilation errors

Ensure your MDX syntax is valid. Common issues:
- Unclosed JSX tags
- Indentation in code blocks
- Missing escaping of special characters

### Styles not updating

Clear Next.js cache:

```bash
rm -rf .next
npm run dev
```

### Development server won't start

Try clearing dependencies and reinstalling:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## License

This project is licensed under the **MIT License** — see LICENSE file for details.

The **@edwinfom/ai-guard** package is also MIT licensed.

---

## Author

**Edwin Fom**

- GitHub: [@Edwinfom00](https://github.com/Edwinfom00)
- NPM: [@edwinfom](https://www.npmjs.com/~edwinfom)
- Documentation: [packages.edwinfom.dev](https://packages.edwinfom.dev)

---

## Support & Feedback

-**Issues** — [GitHub Issues](https://github.com/Edwinfom00/docs-site/issues)
-**Discussions** — [GitHub Discussions](https://github.com/Edwinfom00/docs-site/discussions)
-**Email** — edwinfom05@gmail.com

---

## Acknowledgments

- [Vercel](https://vercel.com) — Next.js and hosting insights
- [Tailwind Labs](https://tailwindlabs.com) — Tailwind CSS framework
- [Unified](https://unifiedjs.com) — Markdown/MDX processing ecosystem
- Open-source community — All dependencies and inspiration

---

**Built with love for the modern developer experience.**
