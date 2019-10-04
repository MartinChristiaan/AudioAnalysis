var emitters = []
export function updateEmitter(idx,x,y,t_cur,ctx)
{
    while (idx > emitters.length-1) {
        emitters.push(new Emmitter(x,y))
    }
    emitters[idx].update(y,t_cur,ctx)    
}


let width = innerWidth
let height = innerHeight;
let nParticles = 200
//noise.seed(Math.random());

class V2 {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }
  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }
  reset(x, y) {
    this.x = x;
    this.y = y;
  }
  lerp(vector, n) {
    this.x += (vector.x - this.x)*n;
    this.y += (vector.y - this.y)*n;
  }
}

class Particle {
  constructor(x,y) {
    this.position = new V2(-100,-100);
    this.velocity = new V2();
    this.acceleration = new V2();
    this.alpha = 0;
    this.color = '#000000';
    this.points = [new V2(-10 + Math.random()*20, -10 + Math.random()*20),
                   new V2(-10 + Math.random()*20, -10 + Math.random()*20),
                   new V2(-10 + Math.random()*20, -10 + Math.random()*20)];
  }
  
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.reset(0,0);
    this.alpha -= 0.008;
    if (this.alpha < 0) this.alpha = 0;
  }
  
  follow(forces) {
    var x = Math.floor(this.position.x / 20);
    var y = Math.floor(this.position.y / 20);
    var index = x * Math.floor(height/20) + y;
    var force = forces[index];
    if (force) this.applyForce(force);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }
  
  draw(ctx) {
//    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.moveTo(this.position.x+this.points[0].x, this.position.y+this.points[0].y);
    ctx.lineTo(this.position.x+this.points[1].x, this.position.y+this.points[1].y);
    ctx.lineTo(this.position.x+this.points[2].x, this.position.y+this.points[2].y);
    ctx.closePath();
    //ctx.fillStyle = this.color;
    ctx.fill();
  }
}

var simplex = new SimplexNoise()

class Emmitter
{
    constructor(x,y)
    {
        this.forces = [], this.particles = [];
        let nParticles = 250;
        this.p = 0;
        this.particles = []
        this.position = new V2(x,y)
        for (var i = 0; i < nParticles; i++) {
            this.particles.push(new Particle(Math.random()*width, Math.random()*height));
            this.particles[i].velocity.y = 0.1;
          }
    }
    drawParticles(ctx)
    {
        for (var i = 0; i < nParticles; i++) {
            this.particles[i].update();
            this.particles[i].follow(this.forces);
            this.particles[i].draw(ctx);
        }
    }
    launchParticle()
    {
        
        this.particles[this.p].position.reset(this.x, this.y);
        this.particles[this.p].velocity.reset(-1+ Math.random()*2, -1+Math.random()*2);
        this.particles[this.p].color = `hsl(${Math.floor(this.x/width*256)},40%,${60+Math.random()*20}%)`;
        this.particles[this.p].alpha = 1;
        this.p++;
        if (this.p === nParticles) this.p= 0;
    }
    initForces(){
        var i = 0;
        for (var x = 0; x < width; x+=20) {
          for (var y = 0; y < height; y+=20) {
            if (!this.forces[i]) this.forces[i] = new V2();
            i++;
          }
        }
        
        if (i < forces.length) {
          this.forces.splice(i+1);
        }
      }
      
      updateForces(t){
        var i = 0;
        var xOff = 0, yOff = 0;
        for (var x = 0; x < width; x+=20) {
          xOff += 0.1;
          for (var y = 0; y < height; y+=20) {
            yOff += 0.1;
            let a = simplex.noise3D(xOff, yOff, t*0.00005) * Math.PI * 4;
            if (this.forces[i]) this.forces[i].reset(Math.cos(a)*0.1, Math.sin(a)*0.1);
            i++;
          }
        }
      }
    update(newy,t,ctx)
    {
        this.position.y = newy
        this.launchParticle();
        this.launchParticle();
        this.updateForces(t);
        this.drawParticles(ctx);
    }

      
}


