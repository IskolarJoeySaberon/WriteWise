# WriteWise

Research Writing Guide Application - Web

## GitHub Pages Hosting

This repo is structured for GitHub Pages using the docs/ folder.

Deploy steps:

1. Push your changes to the `main` branch (already set up).
2. In GitHub, go to: Settings > Pages.
3. Under "Build and deployment":
   - Source: "Deploy from a branch"
   - Branch: `main`
   - Folder: `/docs`
4. Click Save. Pages will build and publish your site.

Site entry point: `docs/index.html`

Project structure (simplified):

```
docs/
	index.html
	chapter-guide.html
	citations.html
	contact.html
	grammar.html
	keywords.html
	learning.html
	lessons.html
	login.html
	plagiarism.html
	reset-password.html
	tutorials.html
	css/
	js/
	images/
```

All links and assets use relative paths (e.g., `css/...`, `js/...`, `images/...`), so they work on Pages.
