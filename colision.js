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

    // Velocidad aleatoria entre 1 y 5 hacia arriba
    this.dy = -1 * (Math.random() * 4 + 1); // Movimiento hacia arriba
    this.dx = (Math.random() * 2 - 1) * 2; // Pequeño movimiento horizontal aleatorio
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

    // Actualizar la posición X (leve movimiento horizontal)
    this.posX += this.dx;
    // Si el círculo se sale del borde izquierdo o derecho, cambia de dirección
    if (this.posX + this.radius > window_width || this.posX - this.radius < 0) {
      this.dx = -this.dx;
    }

    // Actualizar la posición Y (solo hacia arriba)
    this.posY += this.dy;

    // Si el círculo se sale por la parte superior, lo reubica justo debajo del canvas
    if (this.posY + this.radius < 0) {
      this.posY = window_height + this.radius; // Reiniciar el círculo al fondo
    }
  }

  // Función para detectar colisiones y rebotar
  detectCollision(otherCircle) {
    const distX = this.posX - otherCircle.posX;
    const distY = this.posY - otherCircle.posY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Si la distancia entre los dos círculos es menor a la suma de sus radios, hay colisión
    if (distance < this.radius + otherCircle.radius) {
      // Cambiar las velocidades en X y Y para simular el rebote
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

  // Detectar si el círculo fue clicado
  isClicked(mouseX, mouseY) {
    const distX = mouseX - this.posX;
    const distY = mouseY - this.posY;
    const distance = Math.sqrt(distX * distX + distY * distY);

    // Retorna true si el clic está dentro del radio del círculo
    return distance <= this.radius;
  }
}

// Crear un array para almacenar los círculos
let circles = [];

// Función para generar círculos aleatorios, ubicados justo debajo del canvas
function generateCircles(n) {
  for (let i = 0; i < n; i++) {
    let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
    let x = Math.random() * (window_width - radius * 2) + radius;
    let y = window_height + radius; // Empieza justo debajo del canvas
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

// Función para eliminar un círculo al hacer clic
canvas.addEventListener("click", function(event) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  // Buscar si el clic fue sobre algún círculo y eliminarlo si es así
  circles = circles.filter(circle => !circle.isClicked(mouseX, mouseY));
});

// Generar 10 círculos y comenzar la animación
generateCircles(10); 
animate();
