class Vehicle {
    constructor(x, y) {
      this.pos = createVector(random(width), random(height)); // Position initiale aléatoire
      this.target = createVector(x, y); // Position cible
      this.vel = p5.Vector.random2D(); // Vitesse initiale aléatoire
      this.acc = createVector(); // Accélération
      this.maxSpeed = 5; // Vitesse maximale
      this.maxForce = 0.3; // Force maximale
    }
  
    // Applique une force au véhicule
    applyForce(force) {
      this.acc.add(force);
    }
  
    // Comportement principal du véhicule
    behaviors() {
      let arrive = this.arrive(this.target); // Arriver à la cible
      this.applyForce(arrive); // Appliquer la force d'arrivée
    }
  
    // Méthode pour ajuster la trajectoire afin d'arriver à la cible
    arrive(target) {
      let desired = p5.Vector.sub(target, this.pos); // Direction vers la cible
      let d = desired.mag(); // Distance jusqu'à la cible
      let speed = this.maxSpeed;
  
      // Réduire la vitesse en approchant de la cible
      if (d < 100) {
        speed = map(d, 0, 100, 0, this.maxSpeed);
      }
      desired.setMag(speed);
  
      let steer = p5.Vector.sub(desired, this.vel); // Calculer la force de direction
      steer.limit(this.maxForce); // Limiter la force à la force maximale
      return steer;
    }

    followLeader(leader) {
      let desired = p5.Vector.sub(leader, this.pos);
      let d = desired.mag();
      let speed = this.maxSpeed;
    
      if (d < 100) {
        speed = map(d, 0, 100, 0, this.maxSpeed);
      }
      desired.setMag(speed);
    
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      this.applyForce(steer); // Applique la force de direction ici
    }
    
    
  
    // Met à jour la position en fonction de la vitesse et de l'accélération
    update() {
      this.vel.add(this.acc); // Mettre à jour la vitesse
      this.pos.add(this.vel); // Mettre à jour la position
      this.acc.mult(0); // Réinitialiser l'accélération pour le prochain cycle
    }
  
    // Affiche le véhicule à l'écran
    show() {
      let speed = this.vel.mag(); // Obtenir la vitesse actuelle
      let colorValue = map(speed, 0, this.maxSpeed, 100, 255); // Change la couleur en fonction de la vitesse
  
      if (this.isAtTarget) {
        fill(255, 215, 0); // Couleur dorée si à la cible
      } else {
        fill(colorValue, 100, 255 - colorValue); // Couleur dynamique
      }
      
      noStroke();
      ellipse(this.pos.x, this.pos.y, 8); // Dessine le véhicule comme un cercle
    }
  }
  