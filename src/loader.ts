import { Song } from "./song";

function loadFile(filePath: string): string {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status == 200) {
        result = xmlhttp.responseText;
    }
    return result;
}

function convertToNumberArray(line: string) {
    return line.split(',').map((x) => parseFloat(x))
}
export function loadSongData() {
    var availableSongs = loadFile("../data/available.txt").split(/\r?\n/); // splits per line
    var chosenSong = availableSongs[Math.floor(Math.random() * availableSongs.length)]//
    var data = loadFile("../data/songs/" + chosenSong).split(/\r?\n/).map(convertToNumberArray)

    const songdata = {
        t_onset: data[0],
        f_onset: data[1],
        e: data[2],
        buildupOnsets:data[3],
        name: chosenSong.slice(0, chosenSong.length - 4) + ".mp3"
    };

    return songdata //random song
}