import {t_onset,f_onset,max_freq} from './data.js'
var note_states = new Array(t_onset.length).fill(0);
var pressed = new Array(max_freq).fill(0);
var keycodes = ["a","s","j","k"]//.,"d","f","g","h","j","k","l","m","n"]
const margin = 0.05



export var score = 0
var level_thresholds = [0,300,800,1200]

export function getSpeed()// continous
{
    for (let idx = 0; idx < level_thresholds.length; idx++) {
       if (score > level_thresholds[idx])
       {
            if (idx < level_thresholds.length-1) {
                return idx + (score - level_thresholds[idx])/(level_thresholds[idx + 1] - level_thresholds[idx])    
            }
            else
            {
                return idx
            }
       }        
    }
    return 0
}

// miss = 2



export function updateState(visible_idx,t_cur)
{   

    visible_idx.forEach(idx => {
        var t_min = t_onset[idx] - margin
        var t_max = t_onset[idx] + margin

        if (note_states[idx] == 0) { // waiting = 0
            
            if (t_cur > t_min && t_cur < t_max ) {
             
                if (pressed[parseInt(f_onset[idx])] > 0) { // right button hit
                    note_states[idx] = 1                // hit
                    score+=pressed[parseInt(f_onset[idx])]
                    //pressed[parseInt(f_onset[idx])] = 0                    
                }
            }
            else if(t_cur > t_max) //no longer hittable
            {

                note_states[idx] = 2 // miss
                score-=0.3*score
            }
        }
        else if(note_states[idx] == 1){ // hit = 1
            // nothing
        }
        else
        {
            // nothing
        }

    });

    for (let idx = 0; idx < pressed.length; idx++) {
        
        if (pressed[idx]>0) {
            pressed[idx]--;
            if(pressed[idx] == 0)
            {
                //score-=2
            }    
        }
    }

    return note_states

}

export function get_pressed()
{
    return pressed    
}

document.addEventListener('keydown', function(event) {

    var key = event.key;
    if (keycodes.includes(key))
    {
        console.log(key)
    
        pressed[keycodes.indexOf(key)] = 5
    }
});