const scenes = Array.from(document.querySelectorAll(".scene"));
const navButtons = Array.from(document.querySelectorAll(".nav-btn"));
const routeNodes = Array.from(document.querySelectorAll(".route-node"));
const brand = document.querySelector(".brand");
const prevStep = document.querySelector("#prevStep");
const nextStep = document.querySelector("#nextStep");
const stepName = document.querySelector("#stepName");
const progressFill = document.querySelector("#progressFill");

const consumeRange = document.querySelector("#consumeRange");
const createRange = document.querySelector("#createRange");
const consumeValue = document.querySelector("#consumeValue");
const createValue = document.querySelector("#createValue");
const balanceTitle = document.querySelector("#balanceTitle");
const balanceText = document.querySelector("#balanceText");
const focusScore = document.querySelector("#focusScore");
const focusMeter = document.querySelector("#focusMeter");
const statusText = document.querySelector("#statusText");
const pixelHero = document.querySelector("#pixelHero");
const phoneBoss = document.querySelector("#phoneBoss");

const ideaButton = document.querySelector("#ideaButton");
const ideaScreen = document.querySelector("#ideaScreen");
const creationIdea = document.querySelector("#creationIdea");
const creationButton = document.querySelector("#creationButton");
const choiceButtons = Array.from(document.querySelectorAll(".choice-btn"));
const activityTip = document.querySelector("#activityTip");

const habitBoard = document.querySelector("#habitBoard");
const completeHabit = document.querySelector("#completeHabit");
const resetHabit = document.querySelector("#resetHabit");
const streakText = document.querySelector("#streakText");

const creativePlan = document.querySelector("#creativePlan");
const pausePlan = document.querySelector("#pausePlan");
const habitPlan = document.querySelector("#habitPlan");
const planOutput = document.querySelector("#planOutput");
const buildPlan = document.querySelector("#buildPlan");
const copyPlan = document.querySelector("#copyPlan");
const copyStatus = document.querySelector("#copyStatus");

const creationActivities = {
  arte: [
    "Dibuja un personaje que represente tu atención y dale una habilidad especial.",
    "Haz un comic de 4 viñetas sobre vencer una distracción.",
    "Diseña una portada para una playlist de estudio.",
    "Escribe una historia corta donde el protagonista recupera su concentración."
  ],
  estudio: [
    "Explica un tema de clase en 5 frases simples.",
    "Crea 6 tarjetas de memoria para estudiar vocabulario o conceptos.",
    "Haz un resumen visual de una lección usando flechas y palabras clave.",
    "Graba un audio de 1 minuto enseñando algo que ya entiendes."
  ],
  tecnologia: [
    "Programa o dibuja una pantalla de app para bloquear notificaciones.",
    "Crea un quiz de 5 preguntas sobre un tema que estés aprendiendo.",
    "Diseña un mini juego donde ganas puntos por mantener el foco.",
    "Haz una lista de reglas para usar mejor tu celular durante tareas."
  ]
};

const activityTips = {
  arte: "Arte: convierte una idea en imagen, texto, música o diseño.",
  estudio: "Estudio: transforma información en explicación propia.",
  tecnologia: "Tecnología: usa herramientas digitales para crear, no solo consumir."
};

const boredomIdeas = [
  "Idea desbloqueada: inventa una regla para usar mejor tu celular.",
  "Idea desbloqueada: piensa en un objeto que ayude a estudiar sin distracciones.",
  "Idea desbloqueada: convierte una preocupación en una pregunta investigable.",
  "Idea desbloqueada: imagina un videojuego donde el enemigo sean las notificaciones.",
  "Idea desbloqueada: escribe 5 cosas que podrías hacer cuando no hay internet.",
  "Idea desbloqueada: diseña una rutina de tarde sin pantalla durante 30 minutos."
];

let currentStep = 0;
let selectedActivity = "arte";
let habitCount = Number(localStorage.getItem("attentionHabitCount") || 0);

function pluralHours(value) {
  return Number(value) === 1 ? "1 hora" : `${value} horas`;
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function setStep(index) {
  currentStep = Math.max(0, Math.min(scenes.length - 1, index));

  scenes.forEach((scene, sceneIndex) => {
    scene.classList.toggle("is-active", sceneIndex === currentStep);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("is-active", Number(button.dataset.step) === currentStep);
  });

  routeNodes.forEach((node, nodeIndex) => {
    node.classList.toggle("is-active", nodeIndex === currentStep);
  });

  const title = scenes[currentStep].dataset.title;
  const progress = (currentStep / (scenes.length - 1)) * 100;
  stepName.textContent = title;
  progressFill.style.width = `${progress}%`;
  prevStep.disabled = currentStep === 0;
  nextStep.textContent = currentStep === scenes.length - 1 ? "Finalizar" : "Siguiente";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateFocus() {
  const consume = Number(consumeRange.value);
  const create = Number(createRange.value);
  const score = Math.max(0, Math.min(100, 50 + create * 8 - consume * 6 + habitCount * 2));

  consumeValue.textContent = pluralHours(consume);
  createValue.textContent = pluralHours(create);
  focusScore.textContent = `${score}%`;
  focusMeter.style.width = `${score}%`;
  pixelHero.style.transform = `translateX(${Math.round(score / 4)}px)`;
  phoneBoss.style.opacity = String(Math.max(0.25, 1 - score / 120));

  if (create > consume) {
    balanceTitle.textContent = "Modo creador activado";
    balanceText.textContent = "Tu atención está trabajando para ti. Estás invirtiendo energía en habilidades, ideas y proyectos propios.";
  } else if (create === consume) {
    balanceTitle.textContent = "Día equilibrado";
    balanceText.textContent = "Hay consumo, pero también creación. El siguiente nivel es proteger un bloque fijo para construir algo tuyo.";
  } else {
    balanceTitle.textContent = "Alerta de distracción";
    balanceText.textContent = "El consumo domina el día. Cambia una sesión corta de pantalla por una actividad creadora.";
  }

  if (score >= 75) {
    statusText.textContent = "Nivel alto: foco estable y misión clara.";
  } else if (score >= 45) {
    statusText.textContent = "Nivel medio: puedes subir con una decisión pequeña.";
  } else {
    statusText.textContent = "Nivel bajo: las notificaciones están ganando terreno.";
  }
}

function setCreationActivity() {
  creationIdea.textContent = randomFrom(creationActivities[selectedActivity]);
}

function startIdeaMachine() {
  ideaButton.disabled = true;
  ideaScreen.textContent = "CARGANDO ABURRIMIENTO...";

  let dots = 0;
  const loader = setInterval(() => {
    dots = (dots + 1) % 4;
    ideaScreen.textContent = `ESPERA${".".repeat(dots)}`;
  }, 450);

  setTimeout(() => {
    clearInterval(loader);
    ideaScreen.textContent = randomFrom(boredomIdeas);
    ideaButton.disabled = false;
    updateFocus();
  }, 3200);
}

function renderHabitBoard() {
  habitBoard.innerHTML = "";

  for (let index = 0; index < 21; index += 1) {
    const cell = document.createElement("span");
    cell.className = "habit-cell";
    if (index < habitCount) {
      cell.classList.add("done");
    }
    habitBoard.appendChild(cell);
  }

  streakText.textContent = `Racha: ${habitCount} ${habitCount === 1 ? "día" : "días"}`;
}

function createPlanText() {
  return [
    "Mi misión de 7 días:",
    `1. Crear: ${creativePlan.value}.`,
    `2. Pausar: ${pausePlan.value}.`,
    `3. Repetir: ${habitPlan.value}.`,
    "Regla: hacerlo antes de perder tiempo en scroll."
  ].join("\n");
}

function renderPlan() {
  planOutput.textContent = createPlanText();
  copyStatus.textContent = "Plan listo para usar durante una semana.";
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => setStep(Number(button.dataset.step)));
});

routeNodes.forEach((node) => {
  node.addEventListener("click", () => setStep(Number(node.dataset.step)));
});

brand.addEventListener("click", (event) => {
  event.preventDefault();
  setStep(0);
});

prevStep.addEventListener("click", () => setStep(currentStep - 1));
nextStep.addEventListener("click", () => {
  if (currentStep === scenes.length - 1) {
    setStep(0);
    return;
  }
  setStep(currentStep + 1);
});

consumeRange.addEventListener("input", updateFocus);
createRange.addEventListener("input", updateFocus);
creationButton.addEventListener("click", setCreationActivity);
ideaButton.addEventListener("click", startIdeaMachine);
buildPlan.addEventListener("click", renderPlan);

copyPlan.addEventListener("click", async () => {
  const text = createPlanText();

  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = "Plan copiado al portapapeles.";
  } catch (error) {
    copyStatus.textContent = "No se pudo copiar automáticamente. El plan está visible en pantalla.";
  }
});

[creativePlan, pausePlan, habitPlan].forEach((select) => {
  select.addEventListener("change", renderPlan);
});

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedActivity = button.dataset.activity;
    choiceButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    activityTip.textContent = activityTips[selectedActivity];
    setCreationActivity();
  });
});

completeHabit.addEventListener("click", () => {
  habitCount = Math.min(21, habitCount + 1);
  localStorage.setItem("attentionHabitCount", String(habitCount));
  renderHabitBoard();
  updateFocus();
});

resetHabit.addEventListener("click", () => {
  habitCount = 0;
  localStorage.setItem("attentionHabitCount", "0");
  renderHabitBoard();
  updateFocus();
});

renderHabitBoard();
setCreationActivity();
renderPlan();
updateFocus();
setStep(0);
