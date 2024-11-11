let vehicles = [];
let invaderImg;

function preload() {
  invaderImg = loadImage('vehicule.png'); // Assurez-vous d'avoir une image appelée "space_invader.png"
}

function setup() {
  createCanvas(1000, 800);
  for (let i = 0; i < 30; i++) {
    vehicles.push(new Vehicle(random(width), random(height), invaderImg));
  }
}

function draw() {
  background(30);

  vehicles.forEach(vehicle => {
    vehicle.avoid(vehicles);
    vehicle.update();
    vehicle.show();
  });
}
