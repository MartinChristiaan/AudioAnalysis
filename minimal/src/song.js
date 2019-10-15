

function waitUntilSongStarts(sound,onSongStarted) {
    if (sound.duration()>0){
        onSongStarted(sound)
    }
    else
    { 
        console.log(sound.duration())
        setTimeout(() => waitUntilSongStarts(sound,onSongStarted),100)
    }
}


module.exports = {
    
    LoadSong:function(source,onSongStarted)
    {
        var sound = new Howl({
            src: ['../music/' + source.slice(0,source.length-4) + ".mp3"]
        });
      
        sound.volume(1)
        sound.play()
        sound.seek(0)
        waitUntilSongStarts(sound,onSongStarted)    
    }
    
    



}
