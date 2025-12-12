// script.js

// Theme Toggle
const themeToggleInput = document.getElementById("theme-toggle-input");
const body = document.body;

// Function to set the theme based on local storage
function setTheme() {
  if (localStorage.getItem("dark-mode") === "true") {
    body.classList.add("dark-mode");
    themeToggleInput.checked = true;
  } else {
    body.classList.remove("dark-mode");
    themeToggleInput.checked = false;
  }
}

// Call setTheme on page load
setTheme();

// Event listener for theme toggle
themeToggleInput.addEventListener("change", () => {
  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    localStorage.setItem("dark-mode", "true");
  } else {
    localStorage.setItem("dark-mode", "false");
  }
});

// Collapsible Sections
const collapsibleButtons = document.querySelectorAll(".collapsible-button");

collapsibleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;
    // Toggle the display style
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
});

// Show/Hide All Dialogues
const toggleDialoguesButton = document.getElementById("toggle-dialogues");
let dialoguesVisible = false;

toggleDialoguesButton.addEventListener("click", () => {
  const allCollapsibleContent = document.querySelectorAll(
    ".collapsible-content"
  );

  allCollapsibleContent.forEach((content) => {
    content.style.display = dialoguesVisible ? "none" : "block";
  });

  // Corregido el texto del botón
  toggleDialoguesButton.textContent = dialoguesVisible
    ? "Mostrar todos los diálogos"
    : "Ocultar todos los diálogos";
  dialoguesVisible = !dialoguesVisible;
});

// Chronometer Functionality
const timer = document.getElementById("timer");
const startStopButton = document.getElementById("startStop");
const resetButton = document.getElementById("reset");

let interval;
let timeLeft = 0;
let timerRunning = false;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timer.textContent = `⏱️ ${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
}

function startStopTimer() {
  if (timerRunning) {
    clearInterval(interval);
    startStopButton.textContent = "Start";
  } else {
    interval = setInterval(() => {
      timeLeft++;
      updateTimerDisplay();
    }, 1000);
    startStopButton.textContent = "Stop";
  }
  timerRunning = !timerRunning;
}

function resetTimer() {
  clearInterval(interval);
  timerRunning = false;
  timeLeft = 0;
  updateTimerDisplay();
  startStopButton.textContent = "Start";
}

startStopButton.addEventListener("click", startStopTimer);
resetButton.addEventListener("click", resetTimer);

// Show Activity card and Progress Bar
const activityLinks = document.querySelectorAll(".activity-list a");
const activityCards = document.querySelectorAll(".activity-card");
const progressBar = document.querySelector(".progress");
const numberOfActivities = activityCards.length; // Esto será 6 (para act 0 a act 5)

// Hide all activity cards initially
activityCards.forEach((card) => {
  card.classList.remove("active");
  card.style.display = "none"; // Ensure all cards are initially hidden
});

// Function to show the selected activity card
function showActivity(activityId) {
  // Fade out the current active card
  const currentActive = document.querySelector(".activity-card.active");
  if (currentActive) {
    currentActive.classList.remove("active");
    // Usamos setTimeout para permitir la transición de opacidad antes de ocultar
    setTimeout(() => {
      currentActive.style.display = "none";
    }, 333); // Coincide con la duración de la transición CSS
  }

  // Show the selected activity card and fade it in
  const selectedActivity = document.getElementById(activityId);
  if (selectedActivity) {
    selectedActivity.style.display = "block";
    // Pequeño retardo para asegurar que 'display: block' se aplique antes de 'opacity: 1'
    setTimeout(() => {
      selectedActivity.classList.add("active");
    }, 50); // Un retardo mínimo es suficiente aquí
    updateProgressBar(activityId);
  }
}

// Function to update the progress bar
function updateProgressBar(activityId) {
  const activityIndex = parseInt(activityId.split("-")[1]); // 0 para act-0, 1 para act-1, ..., 5 para act-5

  let progressPercentage;

  // Si hay solo una actividad (para evitar división por cero si numberOfActivities es 1)
  if (numberOfActivities <= 1) { // Usamos <= 1 para cubrir 0 actividades también, aunque no debería pasar
    progressPercentage = (activityIndex === 0 && numberOfActivities === 1) ? 100 : 0;
  } else {
    // Cálculo para múltiples actividades: (índice actual / índice de la última actividad) * 100
    // Si tenemos 6 actividades (0-5), el índice de la última es 5.
    progressPercentage = (activityIndex / (numberOfActivities - 1)) * 100;
  }
  
  // Asegurarse de que el porcentaje esté entre 0 y 100 (seguridad)
  progressPercentage = Math.min(100, Math.max(0, progressPercentage));

  progressBar.style.width = `${progressPercentage}%`;
}

// Add event listeners to activity links
activityLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault(); // Previene el comportamiento por defecto del ancla (salto instantáneo)
    const activityId = link.getAttribute("href").substring(1); // Elimina '#'
    showActivity(activityId);
  });
});

// Show the first activity by default and update progress bar on initial load
if (activityCards.length > 0) {
  showActivity(activityCards[0].id);
  // updateProgressBar(activityCards[0].id); // Ya es llamado dentro de showActivity
}
