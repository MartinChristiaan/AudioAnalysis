import { Howl, Howler } from 'howler';
import { MyEvent } from './util/MyEvent';


function waitUntilSongStarts(sound:Howl,onSongStarted:MyEvent<Howl>) {
    if (sound.duration()>0){
        
        onSongStarted.fire(sound)
    }
    else
    { 
        console.log(sound.duration())
     setTimeout(() => waitUntilSongStarts(sound,onSongStarted),100)
    }
}


export function loadSong(source:string,onSongStarted:MyEvent<Howl>)
{
    var sound = new Howl({
        src: ['../music/' + source.slice(0,source.length-4) + ".mp3"]
    });
  
    sound.volume(1)
    sound.play()
    sound.seek(0)
    waitUntilSongStarts(sound,onSongStarted)

}

