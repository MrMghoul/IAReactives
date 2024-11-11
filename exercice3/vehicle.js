class Vehicle {
  constructor(x, y, type) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.baseSpeed = 2;
    this.maxSpeed = this.baseSpeed;
    this.maxForce = 0.2;
    this.size = 20; // Taille fixe de l'image
    this.type = type;
    this.detectionRadius = type === "pacman" ? pacmanDiameterSlider.value() : enemyDiameterSlider.value();
    this.isFleeing = false;
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
    
    this.wrapAround();
  }

  wrapAround() {
    if (this.pos.x > width) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = width;

    if (this.pos.y > height) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = height;
  }

  wander() {
    let wanderForce = p5.Vector.random2D();
    wanderForce.mult(0.1);
    this.applyForce(wanderForce);
    this.maxSpeed = this.baseSpeed;
  }

  findNearest(vehicles) {
    let nearest = null;
    let minDist = this.detectionRadius;

    vehicles.forEach(other => {
      if (other !== this) {
        let d = p5.Vector.dist(this.pos, other.pos);
        if (d < minDist) {
          minDist = d;
          nearest = other;
        }
      }
    });
    return nearest;
  }

  pursue(target) {
    let desired = p5.Vector.sub(target.pos, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  flee(target) {
    let desired = p5.Vector.sub(this.pos, target.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  behave(vehicles) {
    let nearest = this.findNearest(vehicles);
  
    if (nearest) {
      // Vérifiez si le véhicule actuel est un ennemi
      if (this.type === "enemy" && nearest.type === "pacman") {
        // Fuir Pac-Man
        this.flee(nearest);
        // Assurez-vous que la vitesse des ennemis est augmentée
        this.maxSpeed = this.baseSpeed + 2;
  
        // Vérifiez si Pac-Man est touché
        
      } else if (this.type === "pacman" && nearest.type === "enemy") {
        // Pac-Man doit poursuivre l'ennemi
        this.pursue(nearest);
        if (this.touches(nearest)) {
          // Ennemi touché, suppression
          let index = vehicles.indexOf(nearest);
          if (index > -1) vehicles.splice(index, 1); // Supprimez l'ennemi
        }
      } else {
        this.wander(); // Si aucun véhicule n'est proche, errer
      }
    } else {
      this.wander(); // Aucune voiture proche, errer
    }
  }
  

  touches(other) {
    // Vérifie la collision entre ce véhicule et un autre
    return p5.Vector.dist(this.pos, other.pos) < (this.size + other.size) / 2;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show(debugMode) {
    // Positionner l'image au centre
    if (this.type === "pacman") {
      image(pacmanImage, this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
    } else if (this.type === "enemy") {
      image(enemyImage, this.pos.x - this.size / 2, this.pos.y - this.size / 2, this.size, this.size);
    }

    if (debugMode) {
      noFill();
      stroke(0, 255, 0);
      ellipse(this.pos.x, this.pos.y, this.detectionRadius * 2);
    }
  }
  updateDetectionRadius() {
    this.detectionRadius = this.type === "pacman" ? pacmanDiameterSlider.value() : enemyDiameterSlider.value();
  }

}
