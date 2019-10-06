const margin = 0.05
class HitDetection
{   
    constructor(song,scoremanager)
    {
        this.note_states = new Array(t_onset.length).fill(0);
        this.pressed = new Array(max_freq).fill(0);
        this.keycodes = ["a","s","j","k"]//.,"d","f","g","h","j","k","l","m","n"]
        
        var level_thresholds = [0,300,800,1200]
        this.song = song
        document.addEventListener('keydown', function(event) {

            var key = event.key;
            if (keycodes.includes(key))
            {
                this.pressed[this.keycodes.indexOf(key)] = 5
            }
        });
        this.scoremanager = scoremanager
    }
    detectHits()
    {
        visible_idx.forEach(idx => {
        var t_min = t_onset[idx] - margin
        var t_max = t_onset[idx] + margin

        if (note_states[idx] == 0) { // waiting = 0
            
            if (t_cur > t_min && t_cur < t_max ) {
             
                if (this.pressed[parseInt(song.f_onset[idx])] > 0) { // right button hit
                    this.note_states[idx] = 1                // hit
                    this.scoremanager.hit()//+=pressed[parseInt(f_onset[idx])]
                    //pressed[parseInt(f_onset[idx])] = 0                    
                }
            }
            else if(t_cur > t_max) //no longer hittable
            {

                note_states[idx] = 2 // miss
                this.scoremanager.falseNegative() //score-=0.3*score
            }
        }

    });

    for (let idx = 0; idx < pressed.length; idx++) {
        
        if (pressed[idx]>0) {
            pressed[idx]--;
            if(pressed[idx] == 0)
            {
                this.scoremanager.falsePositive()
                
            }    
        }
    }
    }
    
}


