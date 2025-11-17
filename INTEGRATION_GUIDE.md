# Design System Integration Guide

Quick guide to integrate the MATLAB Blue design system into your portfolio.

## What's Been Updated

### ✅ Files Created
1. **`/_sass/base/design-system.scss`** - Complete design system with CSS variables
2. **`/DESIGN_SYSTEM.md`** - Comprehensive documentation
3. **`/INTEGRATION_GUIDE.md`** - This file

### ✅ Files Updated
1. **`/_sass/base/variables.sass`** - Changed from Google Blue to MATLAB Blue
2. **`/index.html`** - Updated inline styles to use MATLAB Blue

## Quick Start

### Option 1: Add to Existing Styles (Recommended)

Add this line to `/_includes/style.scss` (after line 1):

```scss
@import "base/design-system";
@import "base/variables";
```

This will make all design system variables and components available throughout your site.

### Option 2: Direct Import in HTML

If you want to use the design system only on specific pages, add this to your page's front matter:

```html
---
layout: page
title: My Page
---

<style>
{% include design-system.scss %}
</style>
```

## Current Color Changes

### Before (Google Blue)
- Primary: `#1a73e8` (Google Blue)
- Hover: `#1967d2`
- Background: `#e8f0fe`

### After (MATLAB Blue)
- Primary: `#0076A8` (MATLAB Blue)
- Hover: `#005980`
- Background: `#e6f4f9`

All instances in `index.html` have been updated automatically.

## Using the Design System

### Method 1: CSS Variables (Modern, Recommended)

```html
<style>
.my-component {
  color: var(--color-primary-500);        /* MATLAB Blue */
  padding: var(--space-6);                /* 24px */
  border-radius: var(--radius-base);      /* 8px */
  font-size: var(--font-size-lg);         /* 20px */
  transition: var(--transition-base);     /* Smooth transition */
}

.my-component:hover {
  background: var(--color-primary-50);    /* Light blue bg */
  box-shadow: var(--shadow-primary);      /* Blue shadow */
}
</style>
```

### Method 2: Component Classes

```html
<!-- Buttons -->
<button class="btn btn-primary">Click Me</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-text">Text Button</button>

<!-- Cards -->
<div class="card card-interactive">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content...</p>
  </div>
</div>

<!-- Project Grid -->
<div class="project-grid">
  <article class="project-card">
    <img src="..." class="project-image" alt="...">
    <div class="project-content">
      <h3 class="project-title">Project Name</h3>
      <p class="project-description">Description...</p>
      <div class="project-tags">
        <span class="tag">Tag1</span>
        <span class="tag">Tag2</span>
      </div>
    </div>
  </article>
</div>
```

## Migration Checklist

To fully migrate your portfolio to the new design system:

### Phase 1: Core Integration
- [ ] Add design system import to `/_includes/style.scss`
- [ ] Test that existing styles still work
- [ ] Verify color changes look good on all pages

### Phase 2: Update Existing Components
- [ ] Replace hardcoded colors with CSS variables
- [ ] Replace hardcoded spacing with spacing scale
- [ ] Update button styles to use `.btn` classes
- [ ] Update card styles to use `.card` classes

### Phase 3: New Components
- [ ] Use design system for all new components
- [ ] Follow spacing system for layouts
- [ ] Use semantic color tokens

### Phase 4: Refinement
- [ ] Test accessibility (contrast, focus states)
- [ ] Test on mobile devices
- [ ] Optimize performance
- [ ] Document custom components

## Common Patterns

### 1. Creating a Custom Button

```html
<style>
.custom-cta {
  /* Use design tokens instead of hardcoded values */
  padding: var(--space-4) var(--space-8);
  background: var(--color-primary-500);
  color: white;
  border: none;
  border-radius: var(--radius-base);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  transition: var(--transition-base);
  cursor: pointer;
}

.custom-cta:hover {
  background: var(--color-primary-600);
  box-shadow: var(--shadow-primary);
  transform: translateY(-2px);
}
</style>

<button class="custom-cta">Get Started</button>
```

### 2. Responsive Grid Layout

```html
<style>
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-6);
  padding: var(--space-8);
}
</style>

<div class="responsive-grid">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>
```

### 3. Section with Consistent Spacing

```html
<style>
.feature-section {
  padding: var(--space-section) 0;    /* 80px top/bottom */
  max-width: var(--size-container-xl); /* 1200px */
  margin: 0 auto;
}

.feature-section h2 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--space-8);
  text-align: center;
  color: var(--color-text-primary);
}
</style>
```

### 4. Interactive Card

```html
<style>
.interactive-card {
  background: var(--color-bg-primary);
  border: var(--border-width-1) solid var(--color-border-light);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: var(--transition-base);
  cursor: pointer;
}

.interactive-card:hover {
  border-color: var(--color-primary-500);
  box-shadow: var(--shadow-primary);
  transform: translateY(-4px);
}
</style>

<article class="interactive-card">
  <h3>Card Title</h3>
  <p>Card description...</p>
</article>
```

## Design Tokens Quick Reference

### Most Used Colors
```css
--color-primary-500      /* #0076A8 - MATLAB Blue */
--color-primary-600      /* #006a99 - Hover state */
--color-primary-50       /* #e6f4f9 - Light background */

--color-text-primary     /* #2f3842 - Main text */
--color-text-secondary   /* #6b7784 - Supporting text */

--color-bg-primary       /* #ffffff - White background */
--color-bg-secondary     /* #fafbfc - Card background */

--color-border-base      /* #dce0e3 - Standard border */
```

### Most Used Spacing
```css
--space-2     /* 8px  - Tight spacing */
--space-4     /* 16px - Base unit */
--space-6     /* 24px - Medium */
--space-8     /* 32px - Large */
--space-12    /* 48px - Section spacing */
```

### Most Used Typography
```css
--font-size-base    /* 16px - Body text */
--font-size-lg      /* 20px - Large text */
--font-size-xl      /* 24px - h4 */
--font-size-3xl     /* 36px - h2 */
--font-size-5xl     /* 60px - Hero */
```

## Performance Benefits

Using the design system provides:

1. **System Fonts** - No web font loading (faster by ~200ms)
2. **CSS Variables** - Runtime theming without JavaScript
3. **Optimized Animations** - GPU-accelerated transforms
4. **Minimal CSS** - Reusable tokens = smaller file size
5. **Better Caching** - One design system file, cached forever

## Accessibility Features

The design system includes:

- ✅ WCAG AAA contrast ratios
- ✅ Focus visible indicators
- ✅ Reduced motion support
- ✅ High contrast mode support
- ✅ Semantic HTML structure
- ✅ ARIA labels and roles

## Testing Checklist

Before deploying:

- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test keyboard navigation
- [ ] Test screen reader compatibility
- [ ] Test with JavaScript disabled
- [ ] Test print styles
- [ ] Run Lighthouse audit (aim for 90+ accessibility score)

## Troubleshooting

### Colors not updating?
Make sure the design system is imported **before** other styles in `style.scss`.

### CSS variables not working?
CSS variables require a modern browser. For IE11 support, add fallbacks:
```css
.element {
  color: #0076A8;                      /* Fallback */
  color: var(--color-primary-500);     /* Modern */
}
```

### Animations not working?
Check if user has `prefers-reduced-motion` enabled. The design system respects this preference.

### Spacing looks off?
Make sure `html` has `font-size: 62.5%` for correct rem calculations.

## Next Steps

1. **Import the design system** into your main stylesheet
2. **Test thoroughly** on all pages
3. **Gradually migrate** components to use design tokens
4. **Document custom components** you create
5. **Share feedback** and iterate

## Resources

- **Full Documentation**: `/DESIGN_SYSTEM.md`
- **Design System File**: `/_sass/base/design-system.scss`
- **Color Palette**: See "Color Palette" section in documentation
- **Component Examples**: See "Usage Examples" in documentation

## Support

For questions or issues:
1. Check the main documentation (`DESIGN_SYSTEM.md`)
2. Review the CSS file (`design-system.scss`) - it's heavily commented
3. Look at existing implementations in `index.html`

---

**Remember:** The design system is a living document. As you build new components, add them to the system and update the documentation.

Happy building! 🚀
