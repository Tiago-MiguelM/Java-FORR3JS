// Tiago Miguel Martins Foutinho
// Skilaverkefni 2

// Setja upp canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

// Stilla canvas til þess að passa við gluggamálin
let width = (canvas.width = innerWidth);
let height = (canvas.height = innerHeight);


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
        this.velX = 1,5;
        this.velY = 1,5;
        this.radius = 30;
        this.angle = Math.PI / 4;
        this.color = "Yellow";
        this.life = 3;
    }

    // Teikna PacMan með opinn munn
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, this.angle / 2, Math.PI * 2 - this.angle / 2, false); // Reikna út hring með 45° munn
        ctx.lineTo(this.x, this.y);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();

        // Býr til auga á pacman
        let eyeRadius = this.radius / 6;
        let eyeX = this.x + this.radius / 3;
        let eyeY = this.y - this.radius / 2; 

        // Teikna augað á pacman með svartan lit
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "black"; // Auga litur
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
};

// Ghost klassi
class Ghost{
    // Smiður sem inniheldur allar upplýsingar fyrir Ghost
    constructor(color) {
        this.radius = 30;
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius; // Random x coordinate
        this.y = Math.random() * (canvas.height - this.radius * 2) + this.radius; // Random y coordinate
        this.color = color;
        this.velX = (Math.random() * 8 - 4) / 2; // Random X velocity between -4 and 4
        this.velY = (Math.random() * 8 - 4) / 2; // Random Y velocity between -4 and 4
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

// Bý til PacMan og teikna hann
let pacman = new PacMan(30, 30);
pacman.draw();

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

// Bý til 4 Pellets, hver á sitthvort horn á skjáinn
let Pellets = [
    new PowerPellets(70, 70, 20), // Top-left corner
    new PowerPellets(canvas.width - 70, 70, 20), // Top-right corner
    new PowerPellets(50, canvas.height - 70, 20), // Bottom-left corner
    new PowerPellets(canvas.width - 70, canvas.height - 70, 20) // Bottom-right corner
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