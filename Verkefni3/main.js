// Tiago Miguel Martins Foutinho
// Skilaverkefni 2

"use strict";

// Setja upp canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

// Stilla canvas til þess að passa við gluggamálin
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  initialPacManX = canvas.width / 2;
  initialPacManY = canvas.height / 2;
  
  if (Pellets && Pellets.length === 4) { // Make sure Pellets array exists and has 4 elements
    Pellets[0].x = 70;
    Pellets[0].y = 70;
    Pellets[1].x = canvas.width - 70;
    Pellets[1].y = 70;
    Pellets[2].x = 70;
    Pellets[2].y = canvas.height - 70;
    Pellets[3].x = canvas.width - 70;
    Pellets[3].y = canvas.height - 70;
  }
}

// Breytur til að vita hvort takinn sé niðri
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

// Reikna stöðu pacmans til að byrja í miðjuna
let initialPacManX = canvas.width / 2;
let initialPacManY = canvas.height / 2;


// Even sem athugar fyrir Keydown trigger
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    leftPressed = true;
  } else if (event.key === "ArrowRight") {
    rightPressed = true;
  } else if (event.key === "ArrowUp") {
    upPressed = true;
  } else if (event.key === "ArrowDown") {
    downPressed = true;
  }
});

// Even sem athugar fyrir Keyup trigger
window.addEventListener("keyup", (event) => {
    if (event.key === "ArrowLeft") {
      leftPressed = false;
    } else if (event.key === "ArrowRight") {
      rightPressed = false;
    } else if (event.key === "ArrowUp") {
      upPressed = false;
    } else if (event.key === "ArrowDown") {
      downPressed = false;
    }
  });


// Power Pellets klassi
class PowerPellets {
    // Smiður sem inniheldur allar upplýsingar fyrir Power Pellets
    constructor(x, y, radius,) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = "Yellow";
    }

    // Teikna gulan power pellet
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color
        ctx.fill();
    }
};

// PacMan klassi 
class PacMan {
    // Smiður sem inniheldur allar upplýsingar fyrir PacMan
    constructor(x, y) {
        this.x = x;
        this.y = y; 
        this.velX = 4;
        this.velY = 4;
        this.radius = 30;
        this.angle = Math.PI / 4;
        this.color = "Yellow";
        this.life = 3;
        this.rotation = 0; // New property for rotation angle
    }

    // Teikna PacMan með opinn munn
    draw() {
      ctx.save(); // Vista State áður en hann breytist

      // Reikna breytu gráður áður enn hann hreyfist 
      if (leftPressed) {
        this.rotation = Math.PI;
      } else if (rightPressed) {
          this.rotation = 0;
      } else if (upPressed) {
          this.rotation = -Math.PI / 2;
      } else if (downPressed) {
          this.rotation = Math.PI / 2;
      }

      // breyta gráður í x og y ás og snúa honum
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);

      // teikna pacman með opinn munn
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, this.angle / 2, Math.PI * 2 - this.angle / 2, false); // Reikna út hring með 45° munn
      ctx.lineTo(0, 0);
      ctx.closePath();
      
      // breyta lit á pacman
      ctx.fillStyle = this.color;
      ctx.fill();

      // Býr til auga á pacman
      let eyeRadius = this.radius / 6;
      let eyeX = this.radius / 3;
      let eyeY = -this.radius / 2; 

      // Teikna augað á pacman með svartan lit
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = "black"; // Auga litur
      ctx.fill();

      ctx.restore(); // breyta aftur í upphaf state
  }

    // Uppfæra stöðu PacMan og athuga hvort það er árekstu við canvas strigamörkum
    update() {

        if (leftPressed) {
            this.x -= this.velX;
          } else if (rightPressed) {
            this.x += this.velX;
          }
      
          if (upPressed) {
            this.y -= this.velY;
          } else if (downPressed) {
            this.y += this.velY;
          }

        // Athuga hvort hann rekst í brúnir á canvas
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.velX *= -1; // Breytir um átt við áresktur á hægri eða vinstri vegg
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.velY *= -1; // Breytir um átt við áresktur á toppnum eða gólfinu
        }
    }
};

// Ghost klassi
class Ghost{
    // Smiður sem inniheldur allar upplýsingar fyrir Ghost
    constructor(color) {
        this.radius = 30;
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius; // Random x coordinate
        this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius; // Random y coordinate
        this.color = color;
        this.velX = Math.random() * 8 - 4; // Random X velocity between -4 and 4
        this.velY = Math.random() * 8 - 4; // Random Y velocity between -4 and 4
    }

    // Teikna Ghost
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color
        ctx.fill();
    }

    // Uppfæra stöðu PacMan og athuga hvort það er árekstu við canvas strigamörkum
    update() {
        this.x += this.velX;
        this.y += this.velY;

        // Athuga hvort hann rekst í brúnir á canvas
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.velX *= -1; // Breytir um átt við áresktur á hægri eða vinstri vegg
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.velY *= -1; // Breytir um átt við áresktur á toppnum eða gólfinu
        }
    }
}

// Bý til 4 Pellets, hver á sitthvort horn á skjáinn
let Pellets = [
  new PowerPellets(70, 70, 20), // Top-left corner
  new PowerPellets(canvas.width - 70, 70, 20), // Top-right corner
  new PowerPellets(50, canvas.height - 70, 20), // Bottom-left corner
  new PowerPellets(canvas.width - 70, canvas.height - 70, 20) // Bottom-right corner
];

function startGame() {
    // Bý til PacMan og teikna hann með miðju canvas sem upphafsstað
    let pacman = new PacMan(initialPacManX, initialPacManY);

    // Bý til array með 4 ghosts
    let ghosts = [
        new Ghost("Cyan"),
        new Ghost("Red"),
        new Ghost("Pink"),
        new Ghost("Orange")
    ];

    // Aðgerð til að teikna alla drauga
    function drawGhosts() {
        for (const ghost of ghosts) {
            ghost.draw() // Teikna Ghosts
            ghost.update(); // Uppfæra staðsetningu á Ghosts
        }
    }

    // // Bý til 4 Pellets, hver á sitthvort horn á skjáinn
    // let Pellets = [
    //     new PowerPellets(70, 70, 20), // Top-left corner
    //     new PowerPellets(canvas.width - 70, 70, 20), // Top-right corner
    //     new PowerPellets(50, canvas.height - 70, 20), // Bottom-left corner
    //     new PowerPellets(canvas.width - 70, canvas.height - 70, 20) // Bottom-right corner
    // ];

    Pellets = [
      new PowerPellets(70, 70, 20),
      new PowerPellets(canvas.width - 70, 70, 20),
      new PowerPellets(70, canvas.height - 70, 20),
      new PowerPellets(canvas.width - 70, canvas.height - 70, 20)
    ];

    // Aðgerð til að teikna alla Pellets
    function drawPellets() {
        for (const pellet of Pellets) {
            pellet.draw()
        }
    }

    // Aðgerð til að gera leiklykkjuna
    function render(timestamp) {
        // Hreinsa Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Uppfæra og teikna Ghosts
        drawGhosts();

        // Uppfæra og teikna PacMan
        pacman.update();
        pacman.draw();

        // Teikna öll Pellets
        drawPellets();

        // Biðja um næsta animation frame
        window.requestAnimationFrame(render);
    }
    // Byrja hreyfilykkjuna með því að kalla á fyrsta frame-ið.
    window.requestAnimationFrame(render);
    window.addEventListener('resize', resizeCanvas);
    // At the end of your existing code
    resizeCanvas(); // This sets the initial sizes and positions


}

addEventListener("load", (event) => {});
onload = (event) => {
  startGame();
} 