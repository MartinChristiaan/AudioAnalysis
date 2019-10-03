import {sound,t_onset} from './data.js'

export function select_visible_input_idx(t_cur,t_min,t_max)
{
    var duration = sound.duration()
    var visible_idx= []

    for (let i = 0; i < t_onset.length; i++) {
    
        const time = t_onset[i];
        
        if (time > t_min && time < t_max) {
            visible_idx.push(i)       
          
        }
    
    }
    return visible_idx
}