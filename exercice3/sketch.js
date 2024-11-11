let vehicles = [];
let pacmanImage, enemyImage;
let pacmanDiameterSlider, enemyDiameterSlider;
let debugMode = false;

function preload() {
  pacmanImage = loadImage('pacman.png'); // Remplacez par le chemin de votre image Pac-Man
  enemyImage = loadImage('ennemie.png'); // Remplacez par le chemin de votre image d'ennemi
}

function setup() {
  createCanvas(1000, 600);

  uiGraphics = createGraphics(width, 100);
  uiGraphics.position(0, height - 100);

  pacmanDiameterSlider = createSlider(10, 200, 50);
  enemyDiameterSlider = createSlider(10, 200, 50);

  pacmanDiameterSlider.position(20, height - 80);
  enemyDiameterSlider.position(20, height - 40);

  pacmanDiameterSlider.style('width', '100px');
  enemyDiameterSlider.style('width', '100px');

  let pacmanLabel = createDiv('Détection pour PacMan');
  pacmanLabel.position(130, height - 75);
  pacmanLabel.style('color', 'white');
  pacmanLabel.style('font-size', '12px');

  let enemyLabel = createDiv('Détection pour ennemis');
  enemyLabel.position(130, height - 35);
  enemyLabel.style('color', 'white');
  enemyLabel.style('font-size', '12px');
  
  // Créez vos véhicules ici
  for (let i = 0; i < 10; i++) {
    vehicles.push(new Vehicle(random(width), random(height), "pacman"));
    vehicles.push(new Vehicle(random(width), random(height), "enemy"));
  }

  
  
}

function countVehicles() {
  let pacmanCount = 0;
  let enemyCount = 0;

  vehicles.forEach(vehicle => {
    if (vehicle.type === "pacman") {
      pacmanCount++;
    } else if (vehicle.type === "enemy") {
      enemyCount++;
    }
  });

  return { pacmanCount, enemyCount };
}

function draw() {
  background(0);

  vehicles.forEach(vehicle => {
    vehicle.updateDetectionRadius();
    vehicle.behave(vehicles);
    vehicle.update();
    vehicle.show(debugMode);
  });

  let counts = countVehicles();

  // Affichez les informations à droite du canvas
  fill(255);
  textSize(16);
  textAlign(LEFT, CENTER);

  // Affichez le nombre de Pac-Man
  image(pacmanImage, width - 180, 20, 30, 30);
  text(`Pac-Man: ${counts.pacmanCount}`, width -140, 35);

  // Affichez le nombre d'ennemis
  image(enemyImage, width - 180, 60, 30, 30);
  text(`Ennemis: ${counts.enemyCount}`, width -140, 75);

}

function keyPressed() {
  if (key === 'a') {
    vehicles.push(new Vehicle(random(width), random(height), "enemy"));
  }

  if (key === 'p') {
    vehicles.push(new Vehicle(random(width), random(height), "pacman"));
  }

  if (key === 'd') {
    debugMode = !debugMode;  // Active/désactive le mode de débogage
  }
  // supression des pacman 
  if (key === 'e') {
    for (let i = 0; i < vehicles.length; i++) {
      if (vehicles[i].type === "pacman") {
        vehicles.splice(i, 1);
        break; // Supprimez seulement un Pac-Man
      }
    }
}
}
