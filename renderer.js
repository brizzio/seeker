

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-screen-capture").addEventListener("click", () => {
    window.electron.send("select-monitor");
  });
});


window.electron.on("monitors-available", (monitors) => {
  const monitorSelect = document.getElementById("monitor-select");
  monitorSelect.innerHTML = ""; // Clear existing options

  monitors.forEach((monitor) => {
    const option = document.createElement("option");
    option.value = monitor.id;
    option.textContent = monitor.name;
    monitorSelect.appendChild(option);
  });

  monitorSelect.style.display = "block";
  document.getElementById("confirm-monitor").style.display = "block";
});

document.getElementById("confirm-monitor").addEventListener("click", () => {
  const selectedMonitorId = document.getElementById("monitor-select").value;
  window.electron.send("monitor-selected", Number(selectedMonitorId));
});

window.electron.on("images-updated", (images) => {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = ""; // Clear previous images

  images.forEach((image) => {
    const img = document.createElement("img");
    img.src = image;
    img.style.width = "100px";
    img.style.height = "100px";
    img.style.margin = "5px";
    gallery.appendChild(img);
  });
});
