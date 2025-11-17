# Saipraveen Durairaman's Portfolio

[![Build Status](https://github.com/saipraveend/saipraveend.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)](https://github.com/saipraveend/saipraveend.github.io/actions/workflows/pages/pages-build-deployment)

**Live at: https://saipraveend.github.io/**

This is where I document what I build. Started with simple robots in 2010, moved through power electronics and IoT, and now exploring AI on embedded hardware. Over a decade of projects, experiments, and learning — all in one place.

## What's Here

**Projects** - The polished stuff. Robots that competed at IIT Madras, power electronics systems that got published, DIY hardware that made it to Hackster. Each one represents weeks or months of work.

**Lab** - The experimental stuff. Quick tests with TinyML, failed prototypes, half-baked ideas that might become something. This is where I share what I'm figuring out right now.

**About** - Who I am, what I do, and why I build things.

## Running Locally

```bash
bundle install
bundle exec jekyll serve
# Open http://localhost:4000
```

That's it. Jekyll + GitHub Pages = simple and fast.

## Adding New Content

I built templates so I can add projects without friction:

**New Project:**
```bash
cp _templates/project-template.md _posts/2025-02-15-My-New-Robot.markdown
# Edit file, add images to /assets/images/my-new-robot/
git add . && git commit -m "New project" && git push
```

**Lab Experiment:**
```bash
cp _templates/lab-experiment-template.md _posts/2025-02-15-Testing-TinyML.markdown
# Document while building, push when done
git add . && git commit -m "New experiment" && git push
```

Check `_templates/README.md` for more details.

## Tech Details

- **Static site**: Jekyll (GitHub Pages native)
- **Styling**: Custom CSS, no frameworks
- **Fonts**: System fonts (fast, clean)
- **Base**: Started with Indigo theme, ripped out most of it
- **Hosting**: GitHub Pages (free, reliable)

Colors are in `_sass/base/variables.sass` if you want to tweak them.

## Design Philosophy

I wanted something that:
- Loads fast (no bloat)
- Shows my work clearly (timeline on homepage)
- Makes adding content easy (templates)
- Doesn't look like every other portfolio (custom design)
- Actually represents who I am (no corporate BS)

The timeline on the homepage tells the story better than any resume. You can see the progression from basic robots in 2010 to AI + hardware experiments today.

## Contributing

This is my personal site, but if you see something broken or want to suggest an improvement, open an issue. I'm always learning.

## License

The code is MIT - use whatever you want. The content (projects, posts, images) is mine. Don't copy my work, but feel free to learn from how the site is built.

---

Built with Jekyll. Hosted on GitHub Pages. Maintained by someone who actually uses microcontrollers for fun.
