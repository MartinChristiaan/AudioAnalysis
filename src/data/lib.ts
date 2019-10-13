export class SongData
{
    f_onset: number [];
    e: number [];
    t_onset: number[];
    name : string;
    buildupOnsets: number[];
    constructor(f_onset : number [],t_onset: number [],e: number [],builupOnsets : number [], name : string)
    {
        this.f_onset = f_onset
        this.t_onset = t_onset
        this.e = e
        this.name = name
        this.buildupOnsets = builupOnsets
    }
}
