# Manuel Klettner - Personal Portfolio

This is the source code for my personal portfolio website, built with [Astro](https://astro.build/) and TypeScript. It showcases my professional experience, academic achievements, and personal projects.

## 🚀 Technologies

- **Framework:** [Astro](https://astro.build/) (v5)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** Vanilla CSS (Custom Properties for Theme Support)
- **Content Management:** Astro Content Collections (Markdown)

## 📁 Project Structure

```text
/
├── public/                 # Static assets (favicons, etc.)
├── scripts/                # Utility scripts (e.g., sync-citations.ts)
├── src/
│   ├── assets/             # SVGs and project images
│   │   └── images/         # Images for projects and profile
│   ├── components/         # Shared Astro components
│   ├── content/            # Markdown content for collections
│   │   ├── achievements/   # Academic and professional certifications
│   │   ├── experience/     # Work history
│   │   └── projects/       # Personal projects
│   ├── layouts/            # Base page layouts
│   ├── pages/              # Main website pages (About, Achievements, Index, Projects, etc.)
│   └── utils/              # Helper functions
├── astro.config.mjs        # Astro configuration
└── package.json            # Project dependencies and scripts
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command             | Action                                           |
| :------------------ | :----------------------------------------------- |
| `npm install`       | Installs dependencies                            |
| `npm run dev`       | Starts local dev server at `localhost:4321`      |
| `npm run build`     | Build your production site to `./dist/`          |
| `npm run preview`   | Preview your build locally, before deploying     |
| `npm run format`    | Format code with Prettier                        |
| `npm run lint`      | Lint code with ESLint                            |
| `npm test`          | Run unit tests with Vitest                       |
| `npm run astro ...` | Run CLI commands like `astro add`, `astro check` |

## 🧪 Testing

The project uses [Vitest](https://vitest.dev/) for unit testing, focusing on utility functions and scripts.

To run tests once:

```bash
npm test
```

To run tests in watch mode:

```bash
npx vitest
```

Test files are located alongside the code they test (e.g., `scripts/sync-citations.test.ts`).

## 🛠 Content Configuration

The site uses three main content collections defined in `src/content/config.ts`:

- **Projects:** Title, description, publish date, tags, and links.
- **Achievements:** Title, organization, date, and type (academic, certification, etc.).
- **Experience:** Title, company, location, dates, and description.

To add new content, simply create a new `.md` file in the respective folder under `src/content/`.

## 📚 Citation Synchronization

The project includes a script to automatically fetch and update citation counts from [Semantic Scholar](https://www.semanticscholar.org/) for papers with an `arxivId` in their frontmatter.

- **Script:** `scripts/sync-citations.ts`
- **Data Store:** `src/data/citations.json`
- **GitHub Action:** Citations are automatically synced daily via `.github/workflows/sync-citations.yml`.

To manually sync citations, run:

```bash
npx tsx scripts/sync-citations.ts
```
