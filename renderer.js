window.addEventListener("DOMContentLoaded", () => {
    let startX, startY, selectionDiv;
  
    // Create a selection rectangle dynamically
    const createSelectionDiv = () => {
      selectionDiv = document.createElement("div");
      selectionDiv.style.position = "absolute";
      selectionDiv.style.border = "2px dashed #fff";
      selectionDiv.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
      selectionDiv.style.pointerEvents = "none"; // Ensure the selection box doesn't block mouse events
      selectionDiv.style.zIndex = "999999"; // Make sure it's on top of other elements
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
      event.preventDefault(); // Prevent text selection or other default behavior
  
      startX = event.clientX;
      startY = event.clientY;
  
      if (!selectionDiv) createSelectionDiv();
  
      // Initialize the selection box with width and height as 0
      selectionDiv.style.left = `${startX}px`;
      selectionDiv.style.top = `${startY}px`;
      selectionDiv.style.width = "0px";
      selectionDiv.style.height = "0px";
    });
  
    // Update the selection rectangle dynamically as mouse moves
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
  
    // Complete the area selection and notify the main process
    document.body.addEventListener("mouseup", (event) => {
      if (!selectionDiv) return;
  
      const endX = event.clientX;
      const endY = event.clientY;
  
      const x = Math.min(startX, endX);
      const y = Math.min(startY, endY);
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
  
      // Send the selected area to the main process
      window.electron.send("area-selected", { x, y, width, height });
      removeSelectionDiv();
    });
  
    // Allow the overlay to be closed manually via the Escape key
    document.body.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        window.electron.send("close-overlay");
        removeSelectionDiv();
      }
    });
  
    // Start area selection when requested
    window.electron.on("start-selection", () => {
      createSelectionDiv(); // Initialize the selection area
    });
  });
  