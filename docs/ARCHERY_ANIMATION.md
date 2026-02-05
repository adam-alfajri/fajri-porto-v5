# Archery Skill Shots - Technical Grimoire Animation

## Overview

This implementation adds an interactive "Archery Skill Shots" concept to the Technical Grimoire section. The feature creates an engaging visual narrative where skill icons are represented as targets that an archer shoots at as the user scrolls.

## Features

### 1. Skill Icons as Targets
- Skill cards are initially scattered randomly across the screen
- Each target has subtle animations:
  - **Bouncing effect**: Continuous gentle up/down movement
  - **Target pulse**: Expanding/contracting circular target marker
  - **Icon rotation**: Slow 360° rotation for visual interest

### 2. Archer Character with Animated Arrows
- **Archer appearance**: Classical archer SVG illustration positioned on the left side
- **Scroll-triggered shooting**: As user scrolls, archer shoots arrows sequentially at each target
- **Arrow physics**: 
  - Curved flight path using GSAP easing
  - Natural parabolic arc
  - Rotation to match flight direction
  - 0.8-second flight duration
  - 0.5-second delay between shots

### 3. Hit Effects
When an arrow hits a target:
- **Glow animation**: Radial gradient flash from impact point
- **Shake effect**: Brief rotational shake of the target
- **Border highlight**: Gold border emphasis
- **Target marker removal**: Pulse animation stops after hit

### 4. Dynamic Grid Formation
- After all targets are hit, continued scrolling triggers grid formation
- Targets smoothly arrange into their final horizontal scroll layout
- Archer gracefully fades out

## Accessibility

### Reduced Motion Support
When `prefers-reduced-motion: reduce` is detected:
- All animations are disabled or simplified
- Targets appear in final grid position immediately
- No archer/arrow animations play

### Graceful Degradation
- **No GSAP**: Cards display in static grid layout
- **No ScrollTrigger**: All animations disabled
- **No JavaScript**: Cards visible with CSS styling only

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
