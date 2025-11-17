# How to Add Content

I made these templates so I can quickly add new projects and experiments without having to remember the Jekyll frontmatter every time.

## Adding a Project

When you finish something substantial:

```bash
# Copy the template
cp _templates/project-template.md _posts/2025-03-20-My-New-Robot.markdown

# Edit the file - fill in your details
# Add photos to /assets/images/my-new-robot/

# Push it live
git add .
git commit -m "Add robot project"
git push
```

The project will show up on the homepage timeline and in the projects grid. Takes about 2 minutes for GitHub Pages to rebuild.

## Adding a Lab Experiment

For quick tests, prototypes, or experiments you want to document:

```bash
# Copy the experiment template
cp _templates/lab-experiment-template.md _posts/2025-03-20-ESP32-ML-Test.markdown

# Document what you're trying, what worked, what didn't
# Push whenever - update it later as the experiment evolves

git add .
git commit -m "Lab: testing ML on ESP32"
git push
```

Lab posts can be rough. That's the point. Document as you build, not after everything works.

## Frontmatter Fields That Matter

**Projects:**
- `projects: true` - Makes it show up in projects
- `title` - What you built
- `date` - When you finished (YYYY-MM-DD)
- `tag` - Tech you used (Arduino, Robot, IoT, etc.)
- `image` - Path to cover photo
- `description` - One sentence summary

**Lab Experiments:**
- `lab: true` - Shows up in Lab section
- `status` - "In Progress", "Completed", "Failed", "On Hold"
- `title` - What you're testing
- `date` - When you started
- `tag` - What tech you're using
- `description` - Quick summary

## Tags

Be consistent with tags so the filters work:
- **Robotics stuff**: `Robot`, `Robotics`, `Autonomous`
- **Microcontrollers**: `Arduino`, `ESP32`, `PIC`, `STM32`
- **IoT**: `IoT`, `WiFi`, `Bluetooth`, `LoRa`
- **Power**: `Power Electronics`, `DSTATCOM`
- **AI**: `AI`, `TinyML`, `Machine Learning`

## Images

- Put them in `/assets/images/project-name/`
- Cover images: roughly 800x600 works well
- Compress before uploading (I use TinyPNG)
- JPG for photos, PNG for diagrams

## Writing Tips

Things I've learned:
- Write while building, not 6 months later when you've forgotten half the details
- Failed experiments are worth documenting - you'll remember what didn't work
- Link to code repos even if the code is messy
- The side-by-side layout (see template) works great for hardware photos + explanations
- Keep card descriptions short - you can explain details in the full post

## The Point

The whole goal of these templates is to remove friction. If documenting a project takes 30 minutes instead of 3 hours, you'll actually do it.

Document what you build. Future you will thank current you.
