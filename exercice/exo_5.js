let font;
const nbVehicles = 21;
let vehicles = [];
let moveVehicles = false;
let followLeader = false;
let fireworks = [];
let input;

function preload() {
  font = loadFont('Roboto-MediumItalic.ttf'); 
} 

function setup() {
  createCanvas(1500, 800);
  createVehiclesFromText('JUL', 100, 600, 192); // Génère les véhicules à partir du texte 'JUL'
  createInputText(); // Crée un champ d'entrée pour le texte
}

function createInputText() {
  input = createInput(''); // Champ d'entrée pour le texte
  input.position((width - input.width) / 2, height - 60); // Positionne au milieu en bas du canvas
  input.size(300); // Taille de l'entrée
  input.style('font-size', '20px'); // Taille de la police
  input.style('padding', '10px'); // Espacement intérieur
  input.style('border', '2px solid #000'); // Bordure
  input.style('border-radius', '10px'); // Coins arrondis
  input.style('box-shadow', '0 4px 8px rgba(0, 0, 0, 0.1)'); // Ombre
  input.input(updateText);
}

function createVehiclesFromText(text, x, y, fontSize) {
  vehicles = []; // Efface les anciens véhicules pour n'afficher que le nouveau texte
  let points = font.textToPoints(text, x, y, fontSize);

  points.forEach(pt => {
    let vehicle = new Vehicle(pt.x, pt.y);
    vehicles.push(vehicle);
  });
}

function drawBackground() {
  // Créer un dégradé vertical
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(135, 206, 250), color(0, 102, 204), inter); // Dégradé du bleu clair au bleu foncé
    stroke(c);
    line(0, i, width, i);
  }
}

function draw() {
  drawBackground();

  vehicles.forEach(vehicle => {
    if (moveVehicles) {
      vehicle.behaviors();
    } else if (followLeader) {
      let leaderPos = createVector(mouseX, mouseY);
      vehicle.followLeader(leaderPos); // Suivi du leader directement
    }
    vehicle.update();
    vehicle.show();
  });

  // Mettre à jour la position de l'entrée pour qu'elle reste au milieu en bas du canvas
  input.position((width - input.width) / 2, height - 60); // Ajusté plus haut

  // Mettre à jour et dessiner les feux d'artifice
  for (let i = fireworks.length - 1; i >= 0; i--) {
    updateFirework(fireworks[i]);
    showFirework(fireworks[i]);
    if (fireworks[i].done) {
      fireworks.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (key === ' ') {
    moveVehicles = !moveVehicles; // Active/désactive le mouvement vers les points
  } else if (key === 'l') {
    followLeader = !followLeader; // Active/désactive le suivi du leader
  }
}

function updateText() {
  let inputText = this.value(); // Utilise 'this' pour accéder à l'entrée
  createVehiclesFromText(inputText, 100, 400, 192); // Mets à jour avec le texte saisi
  fireworks.push(createFirework()); // Ajoute un nouveau feu d'artifice
}

function createFirework() {
  let firework = {
    hu: random(255),
    firework: createParticle(random(width), height, true),
    exploded: false,
    particles: []
  };
  return firework;
}

function createParticle(x, y, firework) {
  let particle = {
    pos: createVector(x, y),
    firework: firework,
    lifespan: 255,
    hu: random(255),
    vel: firework ? createVector(0, random(-12, -8)) : p5.Vector.random2D().mult(random(2, 10)),
    acc: createVector(0, 0)
  };
  return particle;
}

function applyForce(particle, force) {
  particle.acc.add(force);
}

function updateParticle(particle) {
  if (!particle.firework) {
    particle.vel.mult(0.9);
    particle.lifespan -= 4;
  }
  particle.vel.add(particle.acc);
  particle.pos.add(particle.vel);
  particle.acc.mult(0);
}

function showParticle(particle) {
  colorMode(HSB);
  if (!particle.firework) {
    strokeWeight(2);
    stroke(particle.hu, 255, 255, particle.lifespan);
  } else {
    strokeWeight(4);
    stroke(particle.hu, 255, 255);
  }
  point(particle.pos.x, particle.pos.y);
}

function updateFirework(firework) {
  if (!firework.exploded) {
    applyForce(firework.firework, createVector(0, 0.2));
    updateParticle(firework.firework);

    if (firework.firework.vel.y >= 0) {
      firework.exploded = true;
      explodeFirework(firework);
    }
  }

  for (let i = firework.particles.length - 1; i >= 0; i--) {
    applyForce(firework.particles[i], createVector(0, 0.2));
    updateParticle(firework.particles[i]);
    if (firework.particles[i].lifespan < 0) {
      firework.particles.splice(i, 1);
    }
  }
}

function explodeFirework(firework) {
  for (let i = 0; i < 100; i++) {
    let p = createParticle(firework.firework.pos.x, firework.firework.pos.y, false);
    firework.particles.push(p);
  }
}

function showFirework(firework) {
  if (!firework.exploded) {
    showParticle(firework.firework);
  }

  for (let p of firework.particles) {
    showParticle(p);
  }
}