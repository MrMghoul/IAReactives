class Vehicle {
    constructor(x, y, img) {
      this.pos = createVector(random(width), random(height));
      this.vel = p5.Vector.random2D().mult(4);
      this.acc = createVector();
      this.r = 20;
      this.maxSpeed = 10;
      this.maxForce = 0.2;
      this.img = img;
    }
  
    // Applique une force au véhicule
    applyForce(force) {
      this.acc.add(force);
    }
  
    // Évite les autres véhicules
    avoid(vehicles) {
      let steering = createVector();
      let total = 0;
      vehicles.forEach(other => {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (other !== this && d < 50) {
          let diff = p5.Vector.sub(this.pos, other.pos);
          diff.div(d * d); // Inversement proportionnel à la distance
          steering.add(diff);
          total++;
        }
      });
      if (total > 0) {
        steering.div(total);
        steering.setMag(this.maxSpeed);
        steering.sub(this.vel);
        steering.limit(this.maxForce);
      }
      this.applyForce(steering);
    }
  
    // Met à jour la position du véhicule
    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.acc.mult(0);
  
      // Wrap-around : réapparaît de l'autre côté de l'écran
      if (this.pos.x > width) this.pos.x = 0;
      if (this.pos.x < 0) this.pos.x = width;
      if (this.pos.y > height) this.pos.y = 0;
      if (this.pos.y < 0) this.pos.y = height;
    }
  
    // Affiche le véhicule avec la texture "Space Invader"
    show() {
      // Change de couleur en fonction de la proximité
      let close = false;
      vehicles.forEach(other => {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (other !== this && d < 50) close = true;
      });
      
      // Définir la couleur en fonction de la proximité
      tint(close ? color(255, 0, 0) : color(0, 255, 0));
      image(this.img, this.pos.x, this.pos.y, this.r, this.r);
    }
  }
  