# Electron Screen Capture App

## Overview

This Electron application allows users to capture a specific area of their screen from a selected monitor. It utilizes the Electron API to capture screen thumbnails and the Sharp library to crop images based on user-specified dimensions.

The app runs on **Electron** and makes use of the `desktopCapturer` API to fetch screen sources and `sharp` for image processing.

---

## Features

- Capture a screen area from a selected monitor.
- Crop the screen capture based on user-defined coordinates.
- Capture a series of images at regular intervals (configurable).
- Send base64-encoded images to the renderer process for further use (display, saving, etc.).
- Handles multi-monitor setups and allows the user to specify which monitor to capture.
- Stop capturing after a specified time.

---

## Installation

### Prerequisites

- Node.js (version 14 or above)
- npm or yarn

### Steps to install and run

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/screen-capture-app.git
   cd screen-capture-app
   Install dependencies:

Using npm:
```bash
npm install
```
Or using yarn:
```bash
yarn install
```

2.Build the app:

To build the Electron app, run:

```bash
npm run build
```


3.After the build is complete, run the application:

```bash
npm start
```

This will open the Electron app, where you can start capturing your screen.

### Sections included:
- **Overview**: Provides a high-level summary of the app's functionality.
- **Features**: Lists key features of the app.
- **Installation**: Detailed steps to clone the repo, install dependencies, build, and run the app.
- **Usage**: Describes how to interact with the app to start capturing, stop capturing, view images, and handle errors.
- **Project Structure**: A breakdown of the project directory and files.
- **Libraries and Dependencies**: Information on the libraries used.
- **Configuration**: Customizable parts of the app such as capture interval and timeout.
- **Troubleshooting**: Solutions to common issues like invalid crop area or missing monitor.
- **License**: Information on licensing.
- **Contact**: How to contact the project owner for support.

### Usage

# Start capturing:

From the renderer (UI) process, call the start-capturing event and pass in the desired monitor and capture area dimensions.

# Stopping capture:

The app will automatically stop capturing after 5 seconds, but this can be adjusted in the setTimeout function inside the start-capturing event listener.

# View the images:

The images are stored in an array and sent back to the renderer process as base64-encoded strings. The most recent images will be sent to the renderer in a message called images-updated.

# Handling errors:

If no monitor or area is selected, the app will send an error message (capture-error) to the renderer process.

Project Structure

```perl
screen-capture-app/
│
├── main.js               # Main process (Electron)
├── renderer.js           # Renderer process (UI logic)
├── index.html            # Basic HTML template for the UI
├── package.json          # Project dependencies and scripts
├── package-lock.json     # Lock file for npm dependencies
├── sharp.js              # Image processing logic (using sharp)
├── assets/               # Any static assets like images/icons
└── README.md             # This file
```
