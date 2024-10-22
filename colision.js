const canvas = document.getElementById("canvas"); 
let ctx = canvas.getContext("2d");

// Obtiene las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = "#D3D3D3"; // Fondo gris claro

// Función para generar una letra aleatoria de A-Z
function getRandomLetter() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
}

class Circle {
  constructor(x, y, radius, color, speed) {
    this.posX = x;
    this.posY = y;
    this.radius = radius;
    this.color = color;
    this.originalColor = color; // Guardar el color original
    this.text = getRandomLetter(); // Generar una letra aleatoria
    this.speed = speed;

    // Velocidad aleatoria entre 1 y 5
    this.dx = (Math.random() * 4 + 1) * (Math.random() < 0.5 ? -1 : 1); // Dirección al azar
    this.dy = (Math.random() * 4 + 1) * (Math.random() < 0.5 ? -1 : 1);
    
    this.isFlashing = false; // Variable para manejar el flasheo
    this.flashTimeout = null; // Timeout para el flasheo
  }

  draw(context) {
    context.beginPath();
    context.strokeStyle = this.color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "20px Arial";
    context.fillText(this.text, this.posX, this.posY);
    context.lineWidth = 2;
    context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
    context.stroke();
    context.closePath();
  }

  update(context) {
    this.draw(context);

    // Actualizar la posición X
    this.posX += this.dx;
    // Cambiar la dirección si el círculo llega al borde del canvas en X
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }

    // Actualizar la posición Y
    this.posY += this.dy;
    // Cambiar la dirección si el círculo llega al borde del canvas en Y
    if (this.posY + this.radius > window_height || this.posY - this.radius < 0) {
      this.dy = -this.dy;
    }
  }

  // Función para detectar colisiones y rebotar
  detectCollision(otherCircle) {
    const distX = this.posX - otherCircle.posX;
    const distY = this.posY - otherCircle.posY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Si la distancia entre los dos círculos es menor a la suma de sus radios, hay colisión
    if (distance < this.radius + otherCircle.radius) {
      // Cambiar color a azul durante la colisión
      if (!this.isFlashing && !otherCircle.isFlashing) {
        this.startFlash();
        otherCircle.startFlash();
      }

      // Rebotar intercambiando velocidades
      const tempDx = this.dx;
      const tempDy = this.dy;

      this.dx = otherCircle.dx;
      this.dy = otherCircle.dy;

      otherCircle.dx = tempDx;
      otherCircle.dy = tempDy;

      return true;
    }
    return false;
  }

  // Función para iniciar el flasheo
  startFlash() {
    this.isFlashing = true;
    this.color = "#0000FF"; // Cambiar a azul
    clearTimeout(this.flashTimeout); // Limpiar el timeout previo si existía

    // Volver al color original después de 200 ms
    this.flashTimeout = setTimeout(() => {
      this.color = this.originalColor;
      this.isFlashing = false;
    }, 200);
  }
}

// Crear un array para almacenar los círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = Math.random() * (window_height - radius * 2) + radius;
    let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
    let speed = Math.random() * 5 + 1; // Velocidad entre 1 y 5
    circles.push(new Circle(x, y, radius, color, speed));
  }
}

// Función para animar los círculos
function animate() {
  ctx.clearRect(0, 0, window_width, window_height); // Limpiar el canvas
  circles.forEach(circle => {
    circle.update(ctx); // Actualizar cada círculo
  });

  // Detectar colisiones entre círculos
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      circles[i].detectCollision(circles[j]);
    }
  }

  requestAnimationFrame(animate); // Repetir la animación
}

// Generar 10 círculos y comenzar la animación
generateCircles(10); 
animate();
