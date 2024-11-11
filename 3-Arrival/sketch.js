const nbVehicles = 20;
let vehicles = [];

function setup() {
  createCanvas(800, 800);
  createVehicles(nbVehicles);
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

  // Cible qui suit la souris, cercle rouge de rayon 32
  let target = createVector(mouseX, mouseY);
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  let steering;

  // Espacement fixe pour tous les véhicules
  let distance = 30; // Distance fixe entre chaque véhicule

  // Parcourir les véhicules
  vehicles.forEach((vehicle, index) => {

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

    // Mettre à jour et afficher
    vehicle.update();
    vehicle.show();
  });
}

function keyPressed() {
  if (key === 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}
