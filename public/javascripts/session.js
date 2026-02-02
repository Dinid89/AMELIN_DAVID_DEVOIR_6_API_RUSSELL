const today = new Date().toLocaleDateString(fr-FR, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
});

document.getElementById("currentDate").textContent = today

