export class Onset implements timedValue
{
    time:number
    frequency:number
    isBuildup:boolean
    energy:number
}

export interface timedValue {
    time: number;
}

export class SongAnalysisData
{
    energies : number [];
    similarity : number [];
    onsets : Onset [];    
    buildupOnsets: number[];
    buildupEnergies: number [];
    maxFreq:number = 11
    dt  =1
    constructor(t_onset,f_onset,e_onset,e,similarity,buildupOnsets,buildupEnergies,duration)
    {   this.dt = duration / e.length
        this.onsets = Array.from({length: f_onset.length}, (_, id) =>  
        {
            let onset = {
                time:t_onset[id],
                frequency:f_onset[id],
                energy :e_onset[id],
                isBuildup :buildupOnsets.includes(id)
                    } 
            return onset
        })
        this.similarity = similarity
        this.energies = e 


    }
        
}

