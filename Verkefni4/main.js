// Tiago Miguel Martins Foutinho
// Skilaverkefni 3

"use strict";

// ------------------ Constants ------------------ //

const PELLET_RADIUS = 20;
const GHOST_COLORS = ["Cyan", "Red", "Pink", "Orange"];

// ------------------ Global Breytur ------------------ //

// Setja upp canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

// Breytur fyrir lyklaborðsatriði
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;

// Upphafshnit fyrir PacMan
let initialPacManX = canvas.width / 2;
let initialPacManY = canvas.height / 2;

// Flagga fyrir sýnileika á Power Pellets
let showPellet = true;

// ------------------ Utility Functions ------------------ //


// Laga stærð á canvasi eftir gluggastærð
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Reikna út upphafsstaðsetningu fyrir PacMan
  initialPacManX = canvas.width / 2;
  initialPacManY = canvas.height / 2;
  
  // Uppfæra staðsetningar á öllum Power Pellets
  if (Pellets && Pellets.length === 4) {
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

// ------------------ Classes ------------------ //

// Power Pellets klassi
class PowerPellets {
    // Smiður sem inniheldur allar upplýsingar fyrir Power Pellets
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = "Yellow";
    }

    // Teikna gulan power pellet
    draw() {
      if (showPellet) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.fillStyle = this.color
          ctx.fill();
        }
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
        this.rotation = 0;
        this.score = 10
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
      ctx.fillStyle = "black";
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
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius;
        this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius;
        this.color = color;
        this.velX = Math.random() * 8 - 4;
        this.velY = Math.random() * 8 - 4;
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

// ------------------ Main Functions ------------------ //


// Bý til 4 Pellets, hver á sitthvort horn á skjáinn
let Pellets = [
  new PowerPellets(70, 70, PELLET_RADIUS), // Top-left corner
  new PowerPellets(canvas.width - 70, 70, PELLET_RADIUS), // Top-right corner
  new PowerPellets(50, canvas.height - 70, PELLET_RADIUS), // Bottom-left corner
  new PowerPellets(canvas.width - 70, canvas.height - 70, PELLET_RADIUS) // Bottom-right corner
];

function startGame() {
    // Bý til PacMan og teikna hann með miðju canvas sem upphafsstað
    let pacman = new PacMan(initialPacManX, initialPacManY);

    // Bý til fylki með 4 ghosts
    let ghosts = [
        new Ghost(GHOST_COLORS[0]),
        new Ghost(GHOST_COLORS[1]),
        new Ghost(GHOST_COLORS[2]),
        new Ghost(GHOST_COLORS[3])
    ];

    // Fall sem teiknar alla draugana
    function drawGhosts() {
        for (const ghost of ghosts) {
            ghost.draw() // Teikna Ghosts
            ghost.update(); // Uppfæra staðsetningu á Ghosts
        }
    }
    
    // Endurstillir staðsetningu á Pellets, gagnlegt ef canvas breytist
    Pellets = [
      new PowerPellets(70, 70, 20),
      new PowerPellets(canvas.width - 70, 70, 20),
      new PowerPellets(70, canvas.height - 70, 20),
      new PowerPellets(canvas.width - 70, canvas.height - 70, 20)
    ];

    // Fall sem teiknar alla pellets
    function drawPellets() {
        for (const pellet of Pellets) {
            pellet.draw() // Teiknar pellet 
        }
    }

    // Leiklykkja sem uppfærir og teiknar allt í hvert sinn
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

        // Draw life counter in the middle of the screen
        ctx.font = '20px Fira Code';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(`Lives: ${pacman.life}`, canvas.width / 2, 25)
        ctx.fillText(`Score: ${pacman.score}`, canvas.width / 2, 50)

        // Sækir næsta "frame" í animation
        window.requestAnimationFrame(render);
    }
    // Ræsir leiklykkjuna með því að kalla á fyrsta "frame"-ið
    window.requestAnimationFrame(render);

    // Bætir við event listener fyrir resize atburð
    window.addEventListener('resize', resizeCanvas);

}

// ------------------ Event Listeners ------------------ //

// Event listener fyrir ýmis lykilatriði
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

// ------------------ Automatic Code ------------------ //

// Uppfærir stærð og staðsetningu þegar síðan hlaðast
resizeCanvas();

// Ræsir leikinn þegar vafri hefur lokið að hlaða síðunni
addEventListener("load", (event) => {
  startGame();
});

// Kveikir eða slekkur á Power Pellets á hverri sekúndu
setInterval(() => {
  showPellet = !showPellet;
}, 1000);