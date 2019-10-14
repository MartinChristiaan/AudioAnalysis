
module.exports = {
    


    PlaySong:function(src,start,volume) {
        sound =new Howl({
            src: [src]
          });
        sound.seek(start)
        sound.play()
        sound.volume(volume)
        duration = () => sound.duration()
        let getTime = () =>
        {
            let newTimeInSong = sound.seek()
            if (typeof newTimeInSong == 'number') {return newTimeInSong}            
            return 0
        }
        let song = {GetCurrentTime : getTime,Duration : duration}

        return song
    }

}
