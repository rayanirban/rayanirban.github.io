# Personal Website

A personal website built with Quarto featuring a metallic black theme.

## Setup

1. Install Quarto: https://quarto.org/docs/get-started/
2. Add your profile picture as `profile.jpg` in the root directory
3. Edit `index.qmd` with your personal information
4. Customize other pages as needed

## Development

Preview the website locally:
```bash
quarto preview
```

## Build

Build the website:
```bash
quarto render
```

The output will be in the `docs` folder, ready for GitHub Pages deployment.

## Deployment

1. Go to your GitHub repository settings
2. Navigate to Pages
3. Set Source to "Deploy from a branch"
4. Select the `main` branch and `/docs` folder
5. Save

Your website will be available at https://rayanirban.github.io
