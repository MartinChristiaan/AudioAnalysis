import {Howl, Howler} from 'howler';
import {SongData} from './loader'
import { dt, windowTimes } from './config';
import { TimeWindow } from './TimeWindow';


export class SongPlayer
{

    sound: Howl;
    duration: number = 300;
    buildupEnergies: number[];
    currentTimeInSong:number

    constructor(source,start = 0,volume = 1)
    {
        this.sound =new Howl({
            src: ['../music/' + source]
          });
        this.sound.volume(volume)
        this.sound.play()
        this.sound.seek(start)
        this.duration = this.sound.duration()
    }
    updateTime()
    {
        
        let newTimeInSong = this.currentTimeInSong
        try {newTimeInSong = this.sound.seek() as number} catch (error) {}
        this.currentTimeInSong = newTimeInSong
       
    }
}