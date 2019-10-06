// load instantly or use menun for selection
// python song streaming


var decayFactor = 1
var drag = 1
class TrailParticle
{
    constructor(x,y,vy)
    {

        this.vy = vy
        this.vx = // random
        this.x = x
        this.y = y
        this.alpha = 1 // random
        this.size = 1 //random ...
        

    }
    update(dt)
    {
        this.y = vy * dt 
        this.vy -= vy * drag
        this.alpha -= decayFactor
    }
    draw()
    {
        // draw decaying circle at my position
    }

}

var particleSpawnRate = 1

class NoteParticle
{
    constructor(idx )
    {   
        this.t_onset = 22 // load from analyis  
        this.alive = true
        this.idx = idx
        this.TrailParticles = []
    }
    getposition()
    {

    }
    
    update(sound,dt)
    {
        this.TrailParticles.push(new TrailParticle())
        this.TrailParticles.forEach(particle => {
            particle.update(dt)
        });
        // remove dead particles
        // get position
        // draw circle at position
        // spawn particle

        // if below t_min, die
    }
    draw()
    {



    }

}



