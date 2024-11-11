const nbVehicles = 21; // Nombre total de véhicules
const nbTargets = 30; // Nombre total de cibles
let vehicles = [];
let targets = [];
let moveVehicles = false; // Indicateur pour savoir si les véhicules doivent se déplacer
let score = 0; // Score initial
let highScore = 0; // Record
let timer = 10; // Minuteur en secondes
let gameStarted = false; // Indicateur pour savoir si le jeu a commencé
let gameEnded = false; // Indicateur pour savoir si le jeu est terminé
let lastUpdateTime; // Variable pour stocker le dernier temps d'actualisation
let appleImage;
let applePos;

function preload() {
  appleImage = loadImage("pomme.png"); // Remplacez par le chemin de votre image de pomme
}

function setup() {
  createCanvas(1850, 950);
  resetGame(); // Appel à la fonction pour initialiser le jeu
  lastUpdateTime = millis(); // Initialiser le dernier temps d'actualisation
}

function createRandomPosition() {
  let x = random(50, width - 50);
  let y = random(50, height - 50);
  return createVector(x, y);
}

function createTargets() {
  targets = [
    // Définir les positions initiales des cibles pour former "M" et "G"
    createVector(200, 400), createVector(200, 350), createVector(200, 300),
    createVector(200, 250), createVector(300, 300), createVector(300, 350),
    createVector(300, 400), createVector(300, 250), createVector(250, 300),
    createVector(225, 275), createVector(275, 275),
    createVector(400, 400), createVector(400, 350), createVector(400, 300),
    createVector(400, 250), createVector(450, 250), createVector(500, 250),
    createVector(500, 335), createVector(500, 400), createVector(450, 400),
    createVector(455, 335),
  ];
}

function createVehicles(nbVehicles) {
  for (let i = 0; i < nbVehicles; i++) {
    let x = random(width);
    let y = random(height);
    vehicles.push(new Vehicle(x, y));
  }
}

function draw() {
  background(0);

  if (!gameEnded) {
    imageMode(CENTER);
    image(appleImage, applePos.x, applePos.y, 30, 30);

    // Vérifier si le leader (le premier véhicule) touche la pomme
    let leader = vehicles[0];
    let distanceToApple = p5.Vector.dist(leader.pos, applePos);

    if (distanceToApple < leader.r) {
      score++; // Augmenter le score 
      applePos = createRandomPosition(); // Repositionner la pomme aléatoirement
      highScore = max(highScore, score);
    }

    // Mise à jour du minuteur
    let currentTime = millis();
    if (currentTime - lastUpdateTime >= 1000) { // Vérifie si une seconde s'est écoulée
      timer--; // Décrementer le timer
      lastUpdateTime = currentTime; // Réinitialiser le dernier temps d'actualisation
    }

    // Afficher le minuteur en haut de l'écran
    textSize(24);
    fill(255);
    textAlign(LEFT, TOP);
    text(`Temps restant: ${timer}`, 10, 30);
    text(`Score: ${score}`, 10, 60);
    text(`Record: ${highScore}`, 10, 90);

    // Vérifier si le temps est écoulé
    if (timer <= 0) {
      gameEnded = true; // Mettre fin au jeu
    }
  }

  if (gameEnded) {
    background(0, 100); // Assombrit le fond pour mettre en avant le score final
    textSize(48);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text(`Score: ${score}`, width / 2, height / 2);
    text(`Record: ${highScore}`, width / 2, height / 2 + 60);
  }

  // Afficher les cibles seulement si moveVehicles est vrai
  if (moveVehicles) {
    fill(255, 0, 0);
    targets.forEach(target => {
      ellipse(target.x, target.y, 10); // Cibles visibles, plus petites
    });

    // Faire bouger les véhicules vers les cibles
    vehicles.forEach((vehicle, index) => {
      if (index < nbTargets) {
        let target = targets[index]; // Cible correspondante
        let steering = vehicle.arrive(target); // Faire arriver le véhicule vers la cible
        vehicle.applyForce(steering); // Appliquer la force
      }

      // Mettre à jour et afficher
      vehicle.update();
      vehicle.show();
    });
  } else {
    // Suivre le leader et se placer en formation
    let steering;
    let distance = 30; // Distance fixe entre chaque véhicule

    // Parcourir les véhicules
    vehicles.forEach((vehicle, index) => {
      let target = createVector(mouseX, mouseY); // Cible du leader (peut être le curseur)

      if (index === 0) {
        // Le leader (premier véhicule) suit la cible
        steering = vehicle.arrive(target);
      } else if (index === 1) {
        // 2e véhicule, derrière et à gauche du leader
        let leader = vehicles[0];
        let offset = createVector(-distance, distance);
        let newTarget = p5.Vector.add(leader.pos, offset);
        steering = vehicle.arrive(newTarget);
      } else if (index === 2) {
        // 3e véhicule, derrière et à droite du leader
        let leader = vehicles[0];
        let offset = createVector(distance, distance);
        let newTarget = p5.Vector.add(leader.pos, offset);
        steering = vehicle.arrive(newTarget);
      } else if (index === 3) {
        // 4e véhicule, derrière le 2e véhicule
        let leader = vehicles[1];
        let offset = createVector(-distance, distance);
        let newTarget = p5.Vector.add(leader.pos, offset);
        steering = vehicle.arrive(newTarget);
      } else if (index === 4) {
        // 5e véhicule, derrière le 3e véhicule
        let leader = vehicles[2];
        let offset = createVector(distance, distance);
        let newTarget = p5.Vector.add(leader.pos, offset);
        steering = vehicle.arrive(newTarget);
      } else {
        // Véhicules à partir du 6e suivent le véhicule n-2
        let leader = vehicles[index - 2]; // Suivre le véhicule n-2 (4 pour le 6e, 5 pour le 7e, etc.)
        let offset = createVector(0, distance); // Positionner directement derrière le leader
        let newTarget = p5.Vector.add(leader.pos, offset);
        steering = vehicle.arrive(newTarget);
      }

      // Appliquer la force
      vehicle.applyForce(steering);
      vehicle.update();
      vehicle.show();
    });
  }
}

function resetGame() {
  vehicles = [];
  targets = [];
  score = 0;
  timer = 10; // Réinitialiser le timer à 10 secondes
  gameEnded = false; // Réinitialiser l'état de fin de jeu
  createVehicles(nbVehicles); // Recréer les véhicules
  createTargets(); // Recréer les cibles initiales
  changeTargetPositions(); // Réinitialiser les positions des cibles
  applePos = createRandomPosition(); // Repositionner la pomme
  lastUpdateTime = millis(); // Réinitialiser le temps d'actualisation
}

// Gestion des touches
function keyPressed() {
  if (key === 'r' || key === 'R') { // Vérifier si la touche 'r' est pressée
    resetGame(); // Appeler la fonction pour réinitialiser le jeu
  }
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
  if (key === ' ') { // Si la touche espace est pressée
    moveVehicles = !moveVehicles; // Alterner le mouvement des véhicules
  }
} 

function changeTargetPositions() {
  // Définir un décalage pour déplacer les cibles
  const dx = random(-50, 50); // Décalage horizontal aléatoire
  const dy = random(-50, 50); // Décalage vertical aléatoire

  // Appliquer le décalage aux cibles
  for (let i = 0; i < targets.length; i++) {
    targets[i].x += dx;
    targets[i].y += dy;

    // Vérifier les chevauchements et réajuster
    for (let j = 0; j < i; j++) {
      while (p5.Vector.dist(targets[i], targets[j]) < 30) { // Si les cibles se chevauchent
        targets[i].x += 40; // Déplacer l'une d'elles
      }
    }
  }
}

function changeTargetPositions() {
  // Définir un décalage pour déplacer les cibles
  const dx = random(-50, 50); // Décalage horizontal aléatoire
  const dy = random(-50, 50); // Décalage vertical aléatoire

  // Réaffecter les cibles avec le décalage
  targets.forEach(target => {
    // Appliquer le décalage tout en maintenant les cibles dans les limites du canevas
    target.x = constrain(target.x + dx, 0, width); // Limiter à la largeur de l'écran
    target.y = constrain(target.y + dy, 0, height); // Limiter à la hauteur de l'écran
  });

  // S'assurer que les cibles conservent leur forme
  for (let i = 0; i < targets.length; i++) {
    targets[i].x = constrain(targets[i].x, 0, width);
    targets[i].y = constrain(targets[i].y, 0, height);
  }

  
  for (let i = 0; i < targets.length; i++) {
    for (let j = i + 1; j < targets.length; j++) {
      let d = p5.Vector.dist(targets[i], targets[j]);
      if (d < 30) { // Si les cibles se chevauchent
        let offsetX = (targets[j].x - targets[i].x) / d * 15; // Ajustement horizontal
        let offsetY = (targets[j].y - targets[i].y) / d * 15; // Ajustement vertical
        targets[i].x -= offsetX; // Ajustement de la cible i
        targets[i].y -= offsetY; // Ajustement de la cible i
        targets[j].x += offsetX; // Ajustement de la cible j
        targets[j].y += offsetY; // Ajustement de la cible j
      }
    }
  }

  // Appeler cette fonction à une vitesse aléatoire
  setTimeout(changeTargetPositions, random(500, 2000)); // Changer la position après un délai aléatoire
}
