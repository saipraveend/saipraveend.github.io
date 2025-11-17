# Content Templates

These templates make it super easy to add new projects and lab experiments to your portfolio.

## Quick Start

### Adding a New Project

1. Copy `project-template.md`
2. Rename it to `YYYY-MM-DD-YourProjectName.markdown`
3. Move it to the `_posts` folder
4. Fill in your project details
5. Add images to `/assets/images/your-project/`
6. Commit and push!

**Example:**
```bash
cp _templates/project-template.md _posts/2025-01-15-AI-Powered-Robot.markdown
```

### Adding a Lab Experiment

1. Copy `lab-experiment-template.md`
2. Rename it to `YYYY-MM-DD-ExperimentName.markdown`
3. Move it to the `_posts` folder
4. Fill in your experiment details
5. Commit and push!

**Example:**
```bash
cp _templates/lab-experiment-template.md _posts/2025-01-15-TinyML-Object-Detection.markdown
```

## Important Fields

### For Projects (`projects: true`)
- **title**: Project name
- **date**: Project completion date (YYYY-MM-DD)
- **tag**: Technologies used (for filtering)
- **image**: Cover image path
- **description**: One-line description (shows on project cards)
- **projects**: Must be `true`

### For Lab Experiments (`lab: true`)
- **title**: Experiment name
- **date**: Start date (YYYY-MM-DD)
- **status**: "In Progress", "Completed", "Failed", or "On Hold"
- **tag**: Technologies/topics
- **description**: One-line description
- **lab**: Must be `true`

## Tags for Filtering

Use consistent tags for the filter buttons to work:
- `Robotics`, `Robot` → filters to "robotics"
- `Arduino`, `ESP32`, `Microcontroller` → filters to "embedded"
- `IoT`, `WiFi`, `Bluetooth` → filters to "iot"
- `Power Electronics`, `DSTATCOM` → filters to "power"

## Image Guidelines

- Store images in `/assets/images/project-name/`
- Cover images work best at 800x600px or similar aspect ratio
- Compress images to keep the site fast (use TinyPNG or similar)
- Supported formats: JPG, PNG, GIF

## Tips

- Write as you build — capture the journey, not just the result
- Include failures and learnings (especially in Lab experiments)
- Link to code repos, videos, and external resources
- Use the side-by-side layout for image + text combinations
- Keep descriptions concise for better card previews

Happy building! 🚀
