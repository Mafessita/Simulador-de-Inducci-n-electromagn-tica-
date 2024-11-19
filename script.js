const canvas = document.getElementById('fieldCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 400;

// Variables
let intensity = 75; // Intensidad del campo magnético
let turns = 4; // Número de espiras en la bobina
let area = 75; // Área de las espiras como porcentaje
let showField = true; // Mostrar el campo magnético
let showElectrons = true; // Mostrar electrones
let isMagnetFlipped = false; // Estado del imán (normal o volteado)
let electronAngle = 0; // Ángulo para animar los electrones

// Variables adicionales para la posición de la bobina
const coilCenter = { x: canvas.width / 2 + 100, y: canvas.height / 2 }; // Coordenadas del centro de la bobina

// Imán
let magnet = { x: 50, y: canvas.height / 2 - 20, width: 80, height: 40, dragging: false };

// Función para calcular la distancia entre el imán y la bobina (en metros)
function calculateDistance() {
  const magnetCenter = { x: magnet.x + magnet.width / 2, y: magnet.y + magnet.height / 2 }; // Centro del imán
  const dx = coilCenter.x - magnetCenter.x;
  const dy = coilCenter.y - magnetCenter.y;
  const distancePx = Math.sqrt(dx * dx + dy * dy); // Distancia en píxeles
  return distancePx * 0.01; // Convertir a metros
}

// Dibujar distancia en pantalla
function drawDistance() {
  const distance = calculateDistance(); // Distancia en metros
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Distancia: ${distance.toFixed(2)} m`, 10, 20); // Mostrar la distancia en la esquina superior izquierda
}

// Función para calcular la corriente inducida con ajuste por orientación
function calculateInducedCurrent() {
  const magnetSize = (magnet.width * 0.01) * (magnet.height * 0.01);
  const coilArea = calculateCoilArea();
  const distance = calculateDistance() * 100;

  // Incorporar la intensidad del campo magnético en el cálculo
  let current = ((magnetSize * coilArea * intensity / 100) * (100 - distance)) / 5;

  current *= isMagnetFlipped ? -2 : 2;

  return current;
}

// Dibujar corriente inducida en pantalla
function drawInducedCurrent() {
  const current = calculateInducedCurrent();
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Corriente inducida: ${current.toFixed(2)} A`, 10, 40); // Mostrar corriente en la pantalla
}

// Función para calcular el flujo magnético inducido en la bobina
function calculateMagneticFlux() {
  const current = calculateInducedCurrent(); // Corriente inducida (en A)
  const flux = current * 0.1; // Flujo magnético inducido (en Wb)
  return flux;
}

// Dibujar el flujo magnético inducido en pantalla
function drawMagneticFlux() {
  const flux = calculateMagneticFlux(); // Flujo magnético en Wb
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Flujo magnético: ${flux.toFixed(4)} Wb`, 10, 80); // Mostrar el flujo magnético en pantalla
}

// Función para calcular el área de la bobina (en metros cuadrados)
function calculateCoilArea() {
  // Radio máximo de una espira (en metros)
  const maxRadius = (60 * (area / 100)) * 0.01;

  // Área de una espira (π * r^2)
  const singleCoilArea = Math.PI * Math.pow(maxRadius, 2);

  // Área total de la bobina (espiras * área de una espira)
  const totalCoilArea = singleCoilArea * turns;

  return totalCoilArea;
}

// Dibujar el área de la espira en pantalla
function drawCoilArea() {
  const coilArea = calculateCoilArea(); // Área en \( \text{m}^2 \)
  ctx.fillStyle = "white";
  ctx.font = "16px Arial";
  ctx.fillText(`Área de la bobina: ${coilArea.toFixed(4)} m²`, 10, 60); // Mostrar el área en la pantalla
}

// Dibujar campo magnético
function drawField() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Campo Magnético
  if (showField) {
    const maxOpacity = intensity / 100; // Opacidad máxima según intensidad
    ctx.strokeStyle = `rgba(255, 0, 0, ${maxOpacity})`;
    ctx.lineWidth = 1;

    // Dibuja líneas concéntricas
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 20 + i * 10, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // Dibujar imán
  drawMagnet();

  // Dibujar bobina
  drawCoil();

  // Dibujar distancia
  drawDistance();

  // Dibujar área de la bobina
  drawCoilArea();

  // Dibujar corriente inducida
  drawInducedCurrent();

  // Dibujar flujo magnético inducido
  drawMagneticFlux();

  // Reacción (bombilla)
  drawBulb();
}

// Dibujar imán
function drawMagnet() {
  if (isMagnetFlipped) {
    // Polos invertidos
    ctx.fillStyle = "red";
    ctx.fillRect(magnet.x, magnet.y, magnet.width / 2, magnet.height);
    ctx.fillStyle = "blue";
    ctx.fillRect(magnet.x + magnet.width / 2, magnet.y, magnet.width / 2, magnet.height);
    ctx.fillStyle = "white";
    ctx.fillText("N", magnet.x + 10, magnet.y + 25);
    ctx.fillText("S", magnet.x + magnet.width / 2 + 10, magnet.y + 25);
  } else {
    // Polos normales
    ctx.fillStyle = "blue";
    ctx.fillRect(magnet.x, magnet.y, magnet.width / 2, magnet.height);
    ctx.fillStyle = "red";
    ctx.fillRect(magnet.x + magnet.width / 2, magnet.y, magnet.width / 2, magnet.height);
    ctx.fillStyle = "white";
    ctx.fillText("S", magnet.x + 10, magnet.y + 25);
    ctx.fillText("N", magnet.x + magnet.width / 2 + 10, magnet.y + 25);
  }
}

// Dibujar bobina
function drawCoil() {
  const maxCoilRadius = 60 * (area / 100); // Ajustar el radio máximo de las espiras según el área
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;

  for (let i = 0; i < turns; i++) {
    const radius = 20 + (i * maxCoilRadius) / turns; // Distribuir el tamaño de las espiras proporcionalmente
    ctx.beginPath();
    ctx.arc(canvas.width / 2 + 100, canvas.height / 2, radius, Math.PI * 0.5, Math.PI * 1.5);
    ctx.stroke();
  }

 
}

// Dibujar electrones
function drawElectrons(maxCoilRadius) {
  const speed = (intensity / 100) * 0.05; // Velocidad de los electrones
  electronAngle += isMagnetFlipped ? -speed : speed; // Invertir dirección si el imán está volteado

  for (let i = 0; i < turns; i++) {
    const radius = 20 + (i * maxCoilRadius) / turns; // Radio ajustado según el área
    const x = canvas.width / 2 + 100 + Math.cos(electronAngle + i) * radius; // Movimiento circular
    const y = canvas.height / 2 + Math.sin(electronAngle + i) * radius;

    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2); // Representa el electrón como un pequeño círculo
    ctx.fill();
  }
}

// Dibujar bombilla
function drawBulb() {
  const distance = calculateDistance(); // Calcular la distancia
  const flux = calculateMagneticFlux(); // Flujo magnético inducido
  const isMoving = magnet.dragging; // Determinar si el imán está en movimiento

  // Verificar si la intensidad del campo magnético es 0 o si el imán no se está moviendo
  if (intensity === 0 || !isMoving) {
    ctx.fillStyle = "gray"; // Bombilla apagada, color gris
  } else {
    // Factor de intensidad basado en la distancia, intensidad y número de espiras
    const intensityFactor = Math.max(0, (1 - distance / 2) * (intensity / 100) * (turns / 10));

    // Determinar color de la bombilla: amarillo si hay suficiente flujo
    if (intensityFactor > 0) {
      ctx.fillStyle = `rgba(255, 255, 0, ${Math.min(intensityFactor, 1)})`; // Color amarillo con opacidad limitada a 1
    } else {
      ctx.fillStyle = "gray"; // Color gris si no hay suficiente intensidad
    }
  }

  // Dibujar la bombilla como un círculo
  ctx.beginPath();
  ctx.arc(canvas.width / 2 + 100, canvas.height / 2 - 100, 20, 0, Math.PI * 2);
  ctx.fill();
}

// Eventos para arrastrar el imán
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (
    mouseX >= magnet.x &&
    mouseX <= magnet.x + magnet.width &&
    mouseY >= magnet.y &&
    mouseY <= magnet.y + magnet.height
  ) {
    magnet.dragging = true;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (magnet.dragging) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    magnet.x = mouseX - magnet.width / 2; // Centra el imán respecto al mouse
    drawField();
  }
});

canvas.addEventListener('mouseup', () => {
  magnet.dragging = false;
});

// Eventos de interacción con controles
document.getElementById('intensity').addEventListener('input', (e) => {
  intensity = e.target.value;
  drawField();
});

document.getElementById('turns').addEventListener('input', (e) => {
  turns = parseInt(e.target.value, 10);
  drawField();
});

document.getElementById('area').addEventListener('input', (e) => {
  area = e.target.value;
  drawField();
});

document.getElementById('showField').addEventListener('change', (e) => {
  showField = e.target.checked;
  drawField();
});

document.getElementById('showElectrons').addEventListener('change', (e) => {
  showElectrons = e.target.checked;
  drawField();
});

document.getElementById('flipMagnet').addEventListener('click', () => {
  isMagnetFlipped = !isMagnetFlipped;
  drawField();
});

// Animación
function animate() {
  drawField();
  requestAnimationFrame(animate);
}

// Inicialización
animate();
