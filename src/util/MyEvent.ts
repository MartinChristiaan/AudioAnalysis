//var song = selectSong(3)
//var player = new SongPlayer(song,30)
export class MyEvent<T> {
    listeners: ((value: T) => void)[] = [];
    constructor() {
    }
    fire(value: T) {
        this.listeners.forEach(x => x(value));
    }
    subscribe(callback: (value: T) => void) {
        this.listeners.push(callback);
    }
}
