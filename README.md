# Personal Website - Anirban Ray

This is my personal website built with [Quarto](https://quarto.org/).

## Local Development

To preview the website locally:

```bash
quarto preview
```

## Building the Site

To build the website:

```bash
quarto render
```

The built site will be in the `_site` directory.

## Deployment

### GitHub Pages

To deploy to GitHub Pages:

1. Push this repository to GitHub
2. Go to repository Settings > Pages
3. Set Source to "GitHub Actions"
4. Create `.github/workflows/publish.yml` (see deployment section)

### Manual Deployment

After running `quarto render`, upload the contents of the `_site` directory to your web host.

## Project Structure

- `index.qmd` - Homepage
- `about.qmd` - About page
- `projects.qmd` - Projects showcase
- `blog.qmd` - Blog listing
- `contact.qmd` - Contact information
- `_quarto.yml` - Website configuration
- `styles.css` - Custom CSS styles

## License

© 2025 Anirban Ray. All rights reserved.
