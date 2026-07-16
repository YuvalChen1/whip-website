# WHIP Cursor Landing Page

A fully responsive, animated, and interactive landing page promoting the **WHIP Cursor - Control Your AI** Chrome extension.

Check out the Chrome Extension on the [Chrome Web Store](https://chromewebstore.google.com/detail/whip-cursor-control-your/gnoimbmeinfcfhabjecankoiccnpjaak).

## 🚀 Features

- **Live Interactive Sandbox**: Test the physical cursor mechanics directly in your browser. Swap between the Classic Whip, Leather Whip, Fly Swatter, Wobbly Fish, and the Premium Water Gun.
- **Web Audio Sound Synthesis**: Satisfying audio feedback (whip cracks, splats, water splashes, fish wobbles) synthesized in real-time using the HTML5 Web Audio API (no heavy external assets required).
- **Responsive Layout**: Fluid UI optimized for desktop, tablet, and mobile displays using custom glassmorphic cards and CSS gradients.
- **Productivity & Gamification Highlights**: Overview of visual tuning, prompt template injections, sync controls, and achievements.

## 🛠️ Technology Stack

- **Structure**: Semantic HTML5
- **Style**: Modern Vanilla CSS (featuring custom glassmorphism, responsive grid grids, floating blur blobs, custom scrollbars, and buttons)
- **Logic**: Vanilla ES6 JavaScript (includes custom Verlet integration rope simulation, particle physics, fly math tracking, and audio synthesis)

## 💻 Local Setup & Development

To view the landing page locally:

1. Clone this repository:
   ```bash
   git clone https://github.com/YuvalChen1/whip-website.git
   ```
2. Navigate into the directory:
   ```bash
   cd whip-website
   ```
3. Open `index.html` in your favorite web browser or start a local server (e.g. VS Code Live Server or python server):
   ```bash
   python -m http.server 8000
   ```
   *Note: Using a local server is recommended for loading some local assets and enabling Web Audio API playback securely.*

## 📄 License

This project is open-source. Feel free to customize and modify it as you see fit.
