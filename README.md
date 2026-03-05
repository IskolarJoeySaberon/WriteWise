# WriteWise

Research Writing Guide Application - Web

## GitHub Pages Hosting

This repo deploys automatically to GitHub Pages from the `docs/` folder using GitHub Actions.

Deploy steps:

1. Push your changes to the `main` branch.
2. In GitHub, go to: Settings > Pages.
3. Under "Build and deployment":
   - Source: `GitHub Actions`
4. The workflow `.github/workflows/deploy-pages.yml` will publish the site.

Site entry point: `docs/index.html` (redirects to `docs/html/index.html`)

Project structure (simplified):

```
docs/
	index.html
	html/
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
