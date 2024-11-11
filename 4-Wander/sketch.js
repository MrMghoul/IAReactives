let vehicles = [];
let debugMode = false;

let distanceSlider, radiusSlider, maxSpeedSlider, maxForceSlider;
let distanceLabel, radiusLabel, maxSpeedLabel, maxForceLabel;

function setup() {
  createCanvas(800, 600);
  
  // Création des sliders
  distanceSlider = createSlider(50, 300, 150, 1);
  distanceSlider.position(10, height + 10);
  distanceLabel = createP("Distance du cercle :").position(160, height + 0);

  radiusSlider = createSlider(10, 100, 50, 1);
  radiusSlider.position(10, height + 40);
  radiusLabel = createP("Rayon du cercle :").position(160, height + 30);

  maxSpeedSlider = createSlider(1, 10, 4, 0.1);
  maxSpeedSlider.position(10, height + 70);
  maxSpeedLabel = createP("Vitesse maximale :").position(160, height + 60);

  maxForceSlider = createSlider(0.1, 2, 0.2, 0.01);
  maxForceSlider.position(10, height + 100);
  maxForceLabel = createP("Force maximale :").position(160, height + 90);

  for (let i = 0; i < 10; i++) {
    let x = random(width);
    let y = random(height);
    let r = random(8, 16);
    let col = color(random(255), random(255), random(255));
    vehicles.push(new Vehicle(x, y, r, col));
  }
}

function draw() {
  background(0);

  // Met à jour les paramètres des véhicules avec les valeurs des sliders
  let distanceValue = distanceSlider.value();
  let radiusValue = radiusSlider.value();
  let maxSpeedValue = maxSpeedSlider.value();
  let maxForceValue = maxForceSlider.value();

  vehicles.forEach(vehicle => {
    vehicle.distanceCercle = distanceValue;
    vehicle.wanderRadius = radiusValue;
    vehicle.maxSpeed = maxSpeedValue;
    vehicle.maxForce = maxForceValue;

    vehicle.wander(debugMode);
    vehicle.update();
    vehicle.show();
    vehicle.edges();
  });
}

function keyPressed() {
  if (key === 'd' || key === 'D') {
    debugMode = !debugMode;
  }
}
