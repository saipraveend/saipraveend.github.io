### Portfolio & Lab [![pages-build-deployment](https://github.com/saipraveend/saipraveend.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/saipraveend/saipraveend.github.io/actions/workflows/pages/pages-build-deployment)

**Live at:** https://saipraveend.github.io/

A modern portfolio showcasing embedded systems, robotics, and AI + hardware projects.

## ✨ Features

- **Modern Design**: Clean, tech-forward aesthetic with smooth animations
- **Projects Showcase**: Filterable grid of hardware and robotics projects
- **Lab Section**: Lightweight space for sharing AI + hardware experiments
- **Fully Responsive**: Optimized for all devices
- **Easy Content Management**: Simple templates for adding new projects and experiments

## 🚀 Quick Start

### Adding New Projects

1. Copy the template: `cp _templates/project-template.md _posts/YYYY-MM-DD-ProjectName.markdown`
2. Fill in your project details
3. Add images to `/assets/images/project-name/`
4. Commit and push!

### Adding Lab Experiments

1. Copy the template: `cp _templates/lab-experiment-template.md _posts/YYYY-MM-DD-ExperimentName.markdown`
2. Document your experiment
3. Commit and push!

See `_templates/README.md` for detailed instructions.

## 🛠️ Tech Stack

- **Static Site Generator**: Jekyll
- **Hosting**: GitHub Pages
- **Design**: Custom modern CSS with responsive grid layouts
- **Base Theme**: Originally based on [Indigo](https://github.com/sergiokopplin/indigo) by Sérgio Kopplin (heavily customized)

## 📦 Local Development

```bash
# Install dependencies
bundle install

# Run locally
bundle exec jekyll serve

# View at http://localhost:4000
```

## 🎨 Customization

- **Colors**: Edit `_sass/base/variables.sass`
- **Navigation**: Edit `_includes/nav.html`
- **Homepage**: Edit `index.html`
- **Projects/Lab**: Edit `projects.html` and `lab.html`

## 📝 License

Content is personal. Code is open source (MIT).
