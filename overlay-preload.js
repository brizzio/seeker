const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  let startX, startY, selectionDiv;

  // Create a selection rectangle dynamically
  const createSelectionDiv = () => {
    selectionDiv = document.createElement("div");
    selectionDiv.style.position = "absolute";
    selectionDiv.style.border = "2px dashed #fff";
    selectionDiv.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    selectionDiv.style.pointerEvents = "none";
    document.body.appendChild(selectionDiv);
  };

  // Remove the selection rectangle
  const removeSelectionDiv = () => {
    if (selectionDiv) {
      document.body.removeChild(selectionDiv);
      selectionDiv = null;
    }
  };

  // Start area selection
  document.body.addEventListener("mousedown", (event) => {
    event.preventDefault();
    startX = event.clientX;
    startY = event.clientY;

    if (!selectionDiv) createSelectionDiv();

    selectionDiv.style.left = `${startX}px`;
    selectionDiv.style.top = `${startY}px`;
    selectionDiv.style.width = "0px";
    selectionDiv.style.height = "0px";
  });

  // Update the selection rectangle dynamically
  document.body.addEventListener("mousemove", (event) => {
    if (!selectionDiv) return;

    const currentX = event.clientX;
    const currentY = event.clientY;

    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);
    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);

    selectionDiv.style.left = `${x}px`;
    selectionDiv.style.top = `${y}px`;
    selectionDiv.style.width = `${width}px`;
    selectionDiv.style.height = `${height}px`;
  });

  // Complete area selection and notify the main process
  document.body.addEventListener("mouseup", (event) => {
    if (!selectionDiv) return;

    const endX = event.clientX;
    const endY = event.clientY;

    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    ipcRenderer.send("area-selected", { x, y, width, height });
    removeSelectionDiv();
  });

  // Close the overlay manually (Esc key)
  document.body.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      ipcRenderer.send("close-overlay");
      removeSelectionDiv();
    }
  });
});
