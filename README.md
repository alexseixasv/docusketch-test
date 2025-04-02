# 🏠 Room Viewer – DocuSketch Technical Challenge

An interactive canvas-based application built with **Vue.js** and **Three.js** to display rooms of various shapes and visualize their dimensions (`length` and `width`) dynamically.

This project was developed as part of the technical challenge for a frontend position at **DocuSketch**.

---

## 🧩 Challenge Overview

> **Task:**
>
> - Render a random room (triangle, simple, or t-shape) based on `.json` coordinates.
> - Identify and draw two perpendicular segments: `length` and `width`.
> - One of the segments must be parallel to a wall.
> - Add a button that changes the displayed `length` and `width` options.
> - Use your own interpretation for any unspecified parts.

✅ All requirements were implemented, with some enhancements to provide a better user experience.

---

## ✨ Features

- 🔁 Random room rendering from JSON data
- 📏 Auto-detection of perpendicular `length` and `width` segments
- 🧮 Measurement labels displayed directly on canvas
- 🖱️ Interactive zoom, pan, and rotation via `OrbitControls`
- 📱 Responsive canvas with window resize support
- 🎨 Tailwind CSS styling for clean and modern UI
- 📂 Modularized logic using a utility file (`room-utils.js`)
- 🧪 Unit tests with `Vitest`
- 🔗 GitHub button integrated into the interface

---

## 🚀 Technologies Used

- [Vue 3](https://vuejs.org/)
- [Three.js](https://threejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Vitest](https://vitest.dev/)

---

## 🛠 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/alexseixasv/docusketch-test.git
cd docusketch-test

# Install dependencies
npm install

# Run the app
npm run dev
```

Make sure your Node.js version is 16+.

---

## ✅ Run Tests

This project includes unit tests for core logic using [Vitest](https://vitest.dev/).

```bash
# Run test suite
npm run test
```

Test file: `src/tests/room-utils.test.js`

---

## 🧠 Technical Decisions

- Core geometric logic (`getPerpendicularSegments`) was moved to a reusable utility file: `src/utils/room-utils.js`.
- The app uses Three.js primitives to build room outlines and dimension lines.
- Text labels are rendered using `CanvasTexture` on `Sprite` objects for clarity and performance.
- OrbitControls provide interactivity, zoom and rotation for visualizing different shapes.
- A GitHub button and footer were added for better presentation.

---

## 🔗 Live Demo

You can try the project live here:  
🌐 [https://docusketch.alexseixas.com.br](https://docusketch.alexseixas.com.br)

---

## 📄 License

This project is for educational and evaluation purposes only.