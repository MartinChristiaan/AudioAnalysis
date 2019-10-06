import {songs, SongData} from './data/lib';
import { Song } from './song';
import { ScoreManager } from './scoreManager';
import { HitDetection } from './hitDetection';
import { NoteDrawer } from './noteDrawer';
// canvas setup
var canvas = document.querySelector('canvas')
var ctx = canvas.getContext('2d')
canvas.width = innerWidth
canvas.height = innerHeight
// custom setup
console.log(songs)
var song = new Song(songs[Math.floor(Math.random() * songs.length)]) //random song
var scoreManager = new ScoreManager()
var hitDetection = new HitDetection(song,scoreManager)
var noteDrawer = new NoteDrawer(song,ctx)

function main()
{
    ctx.clearRect(0, 0, innerWidth, innerHeight); // clear canvas
    var speed = scoreManager.getSpeed()
    song.update(speed)
    hitDetection.detectHits()
    noteDrawer.update(hitDetection.noteStates,speed)
    window.requestAnimationFrame(main);
}


main()
