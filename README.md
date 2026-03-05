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
├── public/
│   └── images/             # Static images for profile and projects
├── src/
│   ├── assets/             # SVGs and other assets
│   ├── content/            # Markdown content for collections
│   │   ├── achievements/   # Academic and professional certifications
│   │   ├── experience/     # Work history
│   │   └── projects/       # Personal projects
│   ├── layouts/            # Base page layouts
│   └── pages/              # Main website pages (About, Achievements, Index, Projects)
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
| `npm run astro ...` | Run CLI commands like `astro add`, `astro check` |

## 🛠 Content Configuration

The site uses three main content collections defined in `src/content/config.ts`:

- **Projects:** Title, description, publish date, tags, and links.
- **Achievements:** Title, organization, date, and type (academic, certification, etc.).
- **Experience:** Title, company, location, dates, and description.

To add new content, simply create a new `.md` file in the respective folder under `src/content/`.
